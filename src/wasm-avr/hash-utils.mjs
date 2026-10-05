import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';

/**
 * SHA-256 hex digest of a file on disk.
 * @param {string} filePath
 * @returns {Promise<string>}
 */
export async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    createReadStream(filePath)
      .on('data', (chunk) => hash.update(chunk))
      .on('error', reject)
      .on('end', () => resolve(hash.digest('hex')));
  });
}

/**
 * SHA-256 hex digest of a UTF-8 string or Buffer.
 * @param {string | Buffer} content
 * @returns {string}
 */
export function hashContent(content) {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Aggregate bundle hash from sorted `path:sha256` lines.
 * @param {Record<string, { sha256: string }>} files
 * @returns {string} hex digest (no prefix)
 */
export function hashAggregate(files) {
  const lines = Object.keys(files)
    .sort()
    .map((path) => `${path}:${files[path].sha256}`);
  return hashContent(lines.join('\n'));
}

/** @param {string} hex */
export function formatSha256(hex) {
  return `sha256:${hex}`;
}

/** @param {string} value */
export function parseSha256(value) {
  if (!value) {
    return '';
  }
  return value.startsWith('sha256:') ? value.slice(7) : value;
}

/**
 * @param {string} filePath
 * @returns {Promise<{ sha256: string, size: number }>}
 */
export async function hashFileEntry(filePath) {
  const [sha256, stat] = await Promise.all([
    hashFile(filePath),
    readFile(filePath).then((buffer) => buffer.byteLength),
  ]);
  return { sha256, size: stat };
}
