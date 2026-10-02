// Build dist/tui.js from src/tui.tsx + src/quotes.ts using the canonical
// @opentui/solid transform (babel-preset-solid, universal generate).
//
// Why not tsc/esbuild --jsx=automatic with jsxImportSource @opentui/solid:
//   @opentui/solid's "./jsx-runtime" export is types-only (jsx-runtime.d.ts,
//   no runtime JS), so a react-jsx emit would import a non-existent runtime.
//   Additionally @opentui/solid's main entry statically imports @opentui/core,
//   which imports "bun:ffi" — unloadable under plain node (CI smoke test).
//
// So: transform JSX with babel-preset-solid, then rewrite the static
// @opentui/solid imports into a dynamic import inside tui(). The module then
// loads under plain node (smoke test passes; tui() is not called) and
// resolves @opentui/solid at runtime under OpenCode/bun.

import { transformAsync } from '@babel/core';
import solidPreset from 'babel-preset-solid';
import tsPreset from '@babel/preset-typescript';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const babelOpts = (filename, presets) => ({
  filename,
  configFile: false,
  babelrc: false,
  presets,
});

// 1. Transform quotes.ts (plain TS, no JSX).
const quotesSrc = readFileSync(join(root, 'src/quotes.ts'), 'utf8');
const quotesOut = await transformAsync(quotesSrc, babelOpts('src/quotes.ts', [[tsPreset]]));
if (!quotesOut?.code) throw new Error('babel failed on src/quotes.ts');
// Strip the `export ` prefix so we can splice the declaration into tui.js.
const quotesBody = quotesOut.code.replace(/^export\s+/m, '');
if (!/^const QUOTES\b/m.test(quotesBody)) {
  throw new Error('unexpected quotes transform output (missing const QUOTES)');
}

// 2. Transform src/tui.tsx with the canonical opentui solid pipeline.
const tuiSrc = readFileSync(join(root, 'src/tui.tsx'), 'utf8');
const tuiOut = await transformAsync(
  tuiSrc,
  babelOpts('src/tui.tsx', [
    [solidPreset, { moduleName: '@opentui/solid', generate: 'universal' }],
    [tsPreset],
  ]),
);
if (!tuiOut?.code) throw new Error('babel failed on src/tui.tsx');
let code = tuiOut.code;

// 3. Collect + remove static imports from "@opentui/solid".
//    Babel emits: import { orig as local } from "@opentui/solid";
const solidBindings = [];
code = code.replace(
  /^import\s*\{([^}]+)\}\s*from\s*["']@opentui\/solid["'];?[ \t]*\r?\n?/gm,
  (_m, names) => {
    for (const part of names.split(',')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const [orig, local] = trimmed.split(/\s+as\s+/).map(s => s.trim());
      solidBindings.push(`${orig}: ${local}`);
    }
    return '';
  },
);
if (solidBindings.length === 0) {
  throw new Error('no @opentui/solid imports found in transformed tui output');
}

// 4. Replace `import { QUOTES } from './quotes'` with the inlined declaration.
code = code.replace(
  /^import\s*\{\s*QUOTES\s*\}\s*from\s*['"]\.\/quotes['"];?[ \t]*\r?\n?/m,
  quotesBody.trimEnd() + '\n',
);
if (/from\s*['"]\.\/quotes['"]/.test(code)) {
  throw new Error('quotes import was not replaced');
}

// 5. Inject the dynamic import at the top of the tui() body.
const tuiMarker = 'tui: async api => {';
if (!code.includes(tuiMarker)) {
  throw new Error('could not find tui() marker in transformed output');
}
const dynamicImport =
  `const { ${solidBindings.join(', ')} } = await import("@opentui/solid");`;
code = code.replace(tuiMarker, `${tuiMarker}\n      ${dynamicImport}`);

// 6. Write dist/tui.js.
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/tui.js'), code, 'utf8');
console.log('built dist/tui.js');
