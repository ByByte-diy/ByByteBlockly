import { describe, it, expect } from 'vitest';
import { writeFile, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { hashContent, hashAggregate, hashFile, formatSha256 } from '../hash-utils.mjs';

describe('hash-utils', () => {
  it('hashContent is stable', () => {
    expect(hashContent('hello')).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });

  it('hashAggregate sorts paths', () => {
    const aggregate = hashAggregate({
      'b.txt': { sha256: 'bbb' },
      'a.txt': { sha256: 'aaa' },
    });
    expect(aggregate).toBe(hashContent('a.txt:aaa\nb.txt:bbb'));
    expect(formatSha256(aggregate)).toBe(`sha256:${aggregate}`);
  });

  it('hashFile reads disk', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'bybyte-hash-'));
    try {
      const filePath = join(dir, 'sample.bin');
      await writeFile(filePath, Buffer.from([1, 2, 3]));
      const digest = await hashFile(filePath);
      expect(digest).toHaveLength(64);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
