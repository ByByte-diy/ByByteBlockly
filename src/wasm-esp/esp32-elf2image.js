/**
 * Minimal ESP32 elf2image port (esptool ESP32FirmwareImage.save).
 * Converts a linked sketch.elf into an esptool-flashable app .bin (~KB, not raw objcopy span).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Esp32Elf2Image = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ESP_IMAGE_MAGIC = 0xe9;
  const ESP_CHECKSUM_MAGIC = 0xef;
  const SEG_HEADER_LEN = 8;
  const IROM_ALIGN = 65536;
  const BOOTLOADER_FLASH_OFFSET = 0x1000;
  const IROM_MAP_START = 0x400d0000;
  const IROM_MAP_END = 0x40400000;
  const DROM_MAP_START = 0x3f400000;
  const DROM_MAP_END = 0x3f800000;
  const IMAGE_CHIP_ID = 0;
  const WP_PIN_DISABLED = 0xee;

  /** @typedef {{ addr: number, data: Uint8Array, name?: string }} ElfSegment */

  function isFlashAddr(addr) {
    return (
      (addr >= IROM_MAP_START && addr < IROM_MAP_END) ||
      (addr >= DROM_MAP_START && addr < DROM_MAP_END)
    );
  }

  function checksum(data, sum = ESP_CHECKSUM_MAGIC) {
    for (let i = 0; i < data.length; i++) sum ^= data[i];
    return sum;
  }

  function readElf32Segments(elfBytes) {
    const buf = elfBytes instanceof Uint8Array ? elfBytes : new Uint8Array(elfBytes);
    if (buf.length < 52) throw new Error('Invalid ELF: too small');
    if (buf[0] !== 0x7f || buf[1] !== 0x45 || buf[2] !== 0x4c || buf[3] !== 0x46) {
      throw new Error('Invalid ELF magic');
    }
    if (buf[4] !== 1 || buf[5] !== 1) throw new Error('Expected 32-bit little-endian ELF');
    const read16 = (o) => buf[o] | (buf[o + 1] << 8);
    const read32 = (o) => buf[o] | (buf[o + 1] << 8) | (buf[o + 2] << 16) | (buf[o + 3] << 24);
    const entrypoint = read32(0x18);
    const e_phoff = read32(0x1c);
    const e_phentsize = read16(0x2a);
    const e_phnum = read16(0x2c);

    /** @type {ElfSegment[]} */
    const segments = [];
    for (let i = 0; i < e_phnum; i++) {
      const o = e_phoff + i * e_phentsize;
      const type = read32(o);
      if (type !== 1) continue; // PT_LOAD
      const offset = read32(o + 4);
      const vaddr = read32(o + 8);
      const filesz = read32(o + 0x10);
      if (filesz === 0) continue;
      if (offset + filesz > buf.length) {
        throw new Error(`ELF segment @ ${vaddr.toString(16)} exceeds file size`);
      }
      segments.push({
        addr: vaddr,
        data: buf.slice(offset, offset + filesz),
      });
    }

    if (!segments.length) throw new Error('ELF has no loadable segments');
    segments.sort((a, b) => a.addr - b.addr);
    return { entrypoint, segments };
  }

  function cloneSegment(segment) {
    return { addr: segment.addr, data: new Uint8Array(segment.data), name: segment.name };
  }

  function splitSegment(segment, splitLen) {
    if (splitLen > segment.data.length) {
      throw new Error(`Cannot split ${splitLen} B from ${segment.data.length} B segment`);
    }
    const head = {
      addr: segment.addr,
      data: segment.data.slice(0, splitLen),
      name: segment.name,
    };
    segment.data = segment.data.slice(splitLen);
    segment.addr += splitLen;
    return head;
  }

  function padToWord(data) {
    const rem = data.length & 3;
    if (!rem) return data;
    const padded = new Uint8Array(data.length + (4 - rem));
    padded.set(data);
    return padded;
  }

  function saveSegment(parts, segment, sum, segmentName) {
    const data = padToWord(segment.data);
    if (data.length >= 0x1000000) {
      throw new Error(`Segment length ${data.length} exceeds 16 MB limit`);
    }
    const header = new Uint8Array(8);
    new DataView(header.buffer).setUint32(0, segment.addr, true);
    new DataView(header.buffer).setUint32(4, data.length, true);
    parts.push(header, data);
    return checksum(data, sum);
  }

  function saveFlashSegment(parts, segment, sum) {
    let data = segment.data;
    const endPos = currentSize(parts) + data.length + SEG_HEADER_LEN;
    const remainder = endPos % IROM_ALIGN;
    if (remainder > 0 && remainder < 0x24) {
      const pad = 0x24 - remainder;
      const padded = new Uint8Array(data.length + pad);
      padded.set(data);
      data = padded;
    }
    return saveSegment(parts, { addr: segment.addr, data, name: segment.name }, sum, segment.name);
  }

  function currentSize(parts) {
    return parts.reduce((n, p) => n + p.length, 0);
  }

  function concatParts(parts) {
    const total = currentSize(parts);
    const out = new Uint8Array(total);
    let off = 0;
    for (const p of parts) {
      out.set(p, off);
      off += p.length;
    }
    return out;
  }

  /**
   * @param {Uint8Array|ArrayBuffer} elfBytes
   * @param {{ flashMode?: number, flashSizeFreq?: number, appendDigest?: boolean }} [options]
   * @returns {Uint8Array}
   */
  function esp32ElfToAppBin(elfBytes, options = {}) {
    const flashMode = options.flashMode ?? 0; // QIO
    const flashSizeFreq = options.flashSizeFreq ?? 0; // 1MB @ 40MHz (image metadata only)
    const appendDigest = options.appendDigest ?? true;

    const { entrypoint, segments: rawSegments } = readElf32Segments(elfBytes);
    const segments = rawSegments.map(cloneSegment);

    const flashSegments = segments.filter((s) => isFlashAddr(s.addr)).sort((a, b) => a.addr - b.addr);
    const ramSegments = segments.filter((s) => !isFlashAddr(s.addr)).sort((a, b) => a.addr - b.addr);

    if (!flashSegments.length) {
      throw new Error('ELF has no flash-mapped segments for ESP32 app image');
    }

    /** @type {Uint8Array[]} */
    const parts = [];
    let totalSegments = 0;
    let sum = ESP_CHECKSUM_MAGIC;

    // Common header — segment count patched later.
    const commonHeader = new Uint8Array(8);
    const commonView = new DataView(commonHeader.buffer);
    commonView.setUint8(0, ESP_IMAGE_MAGIC);
    commonView.setUint8(1, 0);
    commonView.setUint8(2, flashMode);
    commonView.setUint8(3, flashSizeFreq);
    commonView.setUint32(4, entrypoint, true);
    parts.push(commonHeader);

    // Extended header (ESP32 v1) — "<BBBBHBHH" + 4xB + B
    const ext = new Uint8Array(16);
    const extView = new DataView(ext.buffer);
    ext[0] = WP_PIN_DISABLED;
    extView.setUint16(4, IMAGE_CHIP_ID, true);
    ext[6] = 0;
    extView.setUint16(7, 0, true);
    extView.setUint16(9, 65535, true);
    ext[15] = appendDigest ? 1 : 0;
    parts.push(ext);

    const flashQueue = flashSegments.map(cloneSegment);
    const ramQueue = ramSegments.map(cloneSegment);

    function alignmentPaddingNeeded(segmentAddr) {
      const pos = currentSize(parts);
      const alignPast = (segmentAddr % IROM_ALIGN) - SEG_HEADER_LEN;
      let padLen = (IROM_ALIGN - (pos % IROM_ALIGN)) + alignPast;
      if (padLen === 0 || padLen === IROM_ALIGN) return 0;
      padLen -= SEG_HEADER_LEN;
      if (padLen < 0) padLen += IROM_ALIGN;
      return padLen;
    }

    while (flashQueue.length > 0) {
      const segment = flashQueue[0];
      const padLen = alignmentPaddingNeeded(segment.addr);
      if (padLen > 0) {
        let padSegment;
        if (ramQueue.length > 0 && padLen > SEG_HEADER_LEN && ramQueue[0].data.length > 0) {
          const take = Math.min(padLen, ramQueue[0].data.length);
          padSegment = splitSegment(ramQueue[0], take);
          if (ramQueue[0].data.length === 0) ramQueue.shift();
        } else {
          padSegment = { addr: 0, data: new Uint8Array(padLen) };
        }
        sum = saveSegment(parts, padSegment, sum, 'padding');
        totalSegments += 1;
      } else {
        const pos = currentSize(parts);
        if ((pos + SEG_HEADER_LEN) % IROM_ALIGN !== segment.addr % IROM_ALIGN) {
          throw new Error(
            `Flash segment alignment mismatch @ ${segment.addr.toString(16)} (pos=${pos})`,
          );
        }
        sum = saveFlashSegment(parts, segment, sum);
        flashQueue.shift();
        totalSegments += 1;
      }
    }

    for (const segment of ramQueue) {
      if (segment.data.length === 0) continue;
      sum = saveSegment(parts, segment, sum, segment.name);
      totalSegments += 1;
    }

    // Pad so checksum byte ends on a 16-byte boundary (esptool append_checksum).
    let bodySize = currentSize(parts);
    const padForChecksum = (16 - ((bodySize + 1) % 16)) % 16;
    if (padForChecksum > 0) {
      parts.push(new Uint8Array(padForChecksum));
      bodySize += padForChecksum;
    }
    const withChecksum = new Uint8Array(bodySize + 1);
    withChecksum.set(concatParts(parts));
    withChecksum[bodySize] = sum;

    // Patch segment count in header.
    withChecksum[1] = totalSegments;

    return withChecksum;
  }

  /**
   * Async variant — appends SHA-256 digest like esptool elf2image.
   * @param {Uint8Array|ArrayBuffer} elfBytes
   * @param {{ flashMode?: number, flashSizeFreq?: number, appendDigest?: boolean }} [options]
   * @returns {Promise<Uint8Array>}
   */
  async function esp32ElfToAppBinAsync(elfBytes, options = {}) {
    const appendDigest = options.appendDigest ?? true;
    const base = esp32ElfToAppBin(elfBytes, options);
    if (!appendDigest) return base;

    const digestSource = base;
    let digestBytes;
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
      const hash = await crypto.subtle.digest('SHA-256', digestSource);
      digestBytes = new Uint8Array(hash);
    } else {
      const { createHash } = await import('node:crypto');
      digestBytes = createHash('sha256').update(digestSource).digest();
    }
    const out = new Uint8Array(digestSource.length + digestBytes.length);
    out.set(digestSource);
    out.set(digestBytes, digestSource.length);
    return out;
  }

  return { esp32ElfToAppBin, esp32ElfToAppBinAsync, readElf32Segments, isFlashAddr };
});
