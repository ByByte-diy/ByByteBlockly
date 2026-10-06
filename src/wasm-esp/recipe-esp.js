// recipe-esp.js — shared ESP32 on-device compiler recipe (Xtensa).
// Browser pipeline and Node verify harness use the same argv shaping.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EspRecipe = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function normalize(p) {
    const abs = p.startsWith('/');
    const parts = [];
    for (const seg of p.split('/')) {
      if (seg === '' || seg === '.') continue;
      if (seg === '..') {
        if (parts.length && parts[parts.length - 1] !== '..') parts.pop();
        else if (!abs) parts.push('..');
      } else parts.push(seg);
    }
    return (abs ? '/' : '') + parts.join('/');
  }

  function preprocessIno(src) {
    const proto = [];
    const re =
      /^[ \t]*((?:[A-Za-z_][\w:<>,&*\s]*?)\b[A-Za-z_]\w*[ \t]*\([^;{}]*\))[ \t]*\{/gm;
    let m;
    while ((m = re.exec(src)) !== null) {
      const sig = m[1].replace(/\s+/g, ' ').trim();
      if (/\b(if|for|while|switch|else|return|do|sizeof)\s*\($/.test(sig)) continue;
      if (/^(setup|loop)\b/.test(sig) || /\b(setup|loop)\s*\(/.test(sig)) continue;
      proto.push(`${sig};`);
    }
    return (
      '#include <Arduino.h>\n' +
      (proto.length ? `${proto.join('\n')}\n` : '') +
      '#line 1 "sketch.ino"\n' +
      `${src}\n`
    );
  }

  function cc1Argv(template, isystemDirs, sketchVfs, sOutVfs, sketchSrcOrig) {
    const skipNext = new Set();
    const body = [];
    for (let i = 0; i < template.length; i++) {
      const arg = template[i];
      if (
        arg === '-MMD' ||
        arg === '-MQ' ||
        arg === '-dumpdir' ||
        arg === '-dumpbase' ||
        arg === '-dumpbase-ext'
      ) {
        skipNext.add(i + 1);
        continue;
      }
      if (skipNext.has(i)) continue;
      if (arg.endsWith('.d') && arg.includes('.ino.cpp')) continue;
      if (arg === sketchSrcOrig) {
        body.push(sketchVfs);
        continue;
      }
      body.push(arg);
    }

    const oi = body.indexOf('-o');
    if (oi >= 0) body[oi + 1] = sOutVfs;

    const isys = [];
    for (const dir of isystemDirs) {
      isys.push('-isystem', dir);
    }

    const withoutQuiet = body.filter((x) => x !== '-quiet' && x !== '-fno-use-cxa-atexit');
    return ['-quiet', '-fno-use-cxa-atexit', ...isys, ...withoutQuiet];
  }

  const asArgv = (asFlags, objVfs, sVfs) => [...asFlags, '-o', objVfs, sVfs];

  function ldArgv(template, outElfVfs) {
    const norm = (a) => {
      if (a.startsWith('/')) return normalize(a);
      if (a.startsWith('-L/')) return `-L${normalize(a.slice(2))}`;
      if (a.startsWith('--script=/')) return `--script=${normalize(a.slice('--script='.length))}`;
      return a;
    };
    const argv = template.map(norm);
    const oi = argv.indexOf('-o');
    if (oi >= 0) argv[oi + 1] = outElfVfs;
    return argv;
  }

  return { normalize, preprocessIno, cc1Argv, asArgv, ldArgv };
});
