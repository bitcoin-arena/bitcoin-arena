#!/usr/bin/env node
// NO OWNER'S NAME, NO TICKET NUMBERS IN THE REPOSITORY'S COMMENTS AND DOCS (2026-10-19). Rewrites only comments (JavaScript through the
// acorn parser, C# and shell/Python by a scanner that skips strings, HTML comments, CSS comments) and Markdown/text documents; code
// and strings stay byte for byte. Left out: files whose bytes are hashed into game ids (the game plugins, Tick Tock's core sources and
// built cores), every game client and test plugin (their bytes are in manifests), built bundles, vendored code.
//     ACORN=<path to acorn.mjs> node tools/scrub-names.mjs [--check]
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const { parse } = await import(process.env.ACORN);
const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const check = process.argv.includes('--check');
const EXCLUDE = /(^|\/)node_modules\/|\/dist\/|^packages\/[^/]+\/plugin\/|^packages\/.*\/(plugins?|client)\/|^packages\/nextblock\/(src|frozen|config)\/|WebGLTemplates\/.*\.js$|^daniel-screens\/|^tools\/scrub-names\.mjs$/;   // the tool's own rules name what they remove

// every file the known-good list pins (the page's money scripts, each game's assets) keeps its bytes: its hash is checked by name
const PINNED = (() => { try { const d = JSON.parse(readFileSync(join(ROOT, 'packages/arena-client/known-good-clients.json'), 'utf8'));
  return new Set([...Object.keys(d.pinned || {}), ...Object.values(d.games || {}).flatMap((g) => Object.keys(g.pinned || {}))]); } catch { return new Set(); } })();
const isPinned = (f) => /WebGLTemplates\//.test(f) && PINNED.has(f.split('/').pop());
const HASHY = new Set(['.toml', '.yml', '.yaml', '.service', '.example', '.ps1', '_headers', '_redirects', 'arena-node-setup', 'arena-node-app']);
// patches keep their ticket markers (build-wasm.sh checks for "kanban #196" in the patched source): only the name goes, on added lines
const nameOnly = (t) => t.replace(/\bRULED,?\s+Daniel\s+(?=\d{4}-\d{2}-\d{2})/g, 'RULED ').replace(/\bDaniel(?:'s)?\s+(?=\d{4}-\d{2}-\d{2})/g, '')
  .replace(/\bDaniel's\b/g, "the owner's").replace(/\bDaniel\b/g, 'the owner');
// JSON: the doc site's data and the pin list's description - string values only
const JSON_SCRUBBED = /^(src\/website\/docs\/.*\.json|packages\/arena-client\/known-good-clients\.json|packages\/[^/]+\/package\.json)$/;

// THE TEXT RULES, applied to comment or document text only. A removed reference leaves a mark (\u0001); only marked spots are tidied,
// so a comment's own "vault()" or "a, b" stays as it was.
const M = '\u0001';
// kind 'c' a comment or document, 's' a string: in a string a bare name is test data ('Daniel', "\tDaniel\t") and becomes "Alice"
const NAME = (tail) => new RegExp(`(?:(?<=\\\\[tnr])|(?<![A-Za-z0-9_]))Daniel${tail}(?![A-Za-z0-9_])`, 'g');
function scrubText(t, kind = 'c') {
  let s = t;
  s = s.replace(/\bRULED,?\s+Daniel\s+(?=\d{4}-\d{2}-\d{2})/g, 'RULED ');
  s = s.replace(/\bDaniel(?:'s)?\s+(?=\d{4}-\d{2}-\d{2})/g, '');
  s = s.replace(NAME("(?:'|\\\\')s"), (m) => (m.includes("\\'") ? "the owner\\'s" : "the owner's")).replace(/\bDANIEL'S\b/g, "THE OWNER'S");
  s = s.replace(NAME(''), kind === 's' ? 'Alice' : 'the owner').replace(/\bDANIEL\b/g, 'THE OWNER');
  // ticket references: "kanban #471", "kanban #504, #506-#517", "kanban #471 slice 5 part 2", "card #326", bare "#405"
  s = s.replace(/\b[Kk]anban\s+#\d+(?:\s*(?:,|\/|\+|and|&)\s*#\d+(?:-#?\d+)?|-#?\d+)*(?:\s+(?:slice|part|step|item|items|M)\s*[\w.]+)*/g, M);
  s = s.replace(/\b([Cc]ard|[Tt]icket|[Tt]ask)(s?)\s+#\d+(?:\s*(?:,|\/|\+|and|&)\s*#\d+|-#?\d+)*/g, '$1$2');   // "the card #326 waits" -> "the card waits"
  // a bare "#405" - not a colour ("color: #333", "fill #000")
  s = s.replace(/(^|[\s(\[,;*])#(\d{2,4})(?:-#?\d{2,4})?(?![0-9A-Za-z])/g, (m, pre, n, off, all) =>
    (n === '000' || /(colou?r|background|border|fill|stroke|:)\s*$/i.test(all.slice(Math.max(0, off - 16), off + pre.length)) ? m : `${pre}${M}`));
  if (!s.includes(M)) return s;
  // tidy only around the marks
  for (let i = 0; i < 4; i++) {
    s = s.replace(new RegExp(`[ \\t]*\\(\\s*${M}[\\s,;${M}]*\\)`, 'g'), '')          // "(kanban #4)" and "(kanban #4, #5)" go whole, with the space before
      .replace(new RegExp(`[ \\t]*\\[\\s*${M}[\\s,;${M}]*\\]`, 'g'), '')
      .replace(new RegExp(`\\(\\s*${M}\\s*[,;:]\\s*`, 'g'), '(')                   // "(kanban #4, the owner ...)" -> "(the owner ...)"
      .replace(new RegExp(`\\s*[,;]\\s*${M}\\s*\\)`, 'g'), ')')                    // "(a, kanban #4)" -> "(a)"
      .replace(new RegExp(`[,;]\\s*${M}(?=\\s*[,;])`, 'g'), M)                         // "a, #4, b" -> "a, b"
      .replace(new RegExp(`([ \\t])${M}[ \\t]+`, 'g'), '$1')                            // "word #4 word" -> "word word"
      .replace(new RegExp(`[ \\t]+${M}(?=[.,;:)\\]])`, 'g'), '');                      // "word #4." -> "word."
  }
  return s.replace(new RegExp(`${M}[ \\t]*[,;:]?[ \\t]*`, 'g'), '').replace(new RegExp(M, 'g'), '');
}

// string literal and template ranges (inside the quotes) of a parsed program
function stringRanges(ast) {
  const out = [];
  const walk = (n) => {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'Literal' && typeof n.value === 'string') out.push([n.start + 1, n.end - 1, 's']);
    if (n.type === 'TemplateElement') out.push([n.start, n.end, 's']);
    for (const k of Object.keys(n)) { const v = n[k]; if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object' && typeof v.type === 'string') walk(v); }
  };
  walk(ast); return out;
}
// comment ranges [start, end) in a JavaScript source - and, with `strings`, its string and template ranges too; null when it does not parse
function jsComments(code, { strings = false } = {}) {
  const out = [];
  for (const sourceType of ['module', 'script']) {
    try {
      out.length = 0;
      const ast = parse(code.replace(/^#!.*/, (m) => ' '.repeat(m.length)), { ecmaVersion: 'latest', sourceType, allowHashBang: true, allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true, onComment: (block, text, start, end) => out.push([start, end]) });
      return strings ? [...out, ...stringRanges(ast)].sort((x, y) => x[0] - y[0]) : out;
    } catch { /* try the other source type */ }
  }
  return null;
}
// the protocol's own strings stay as they are (rule texts can be signed or hashed)
const STRINGS_KEPT = /^packages\/arena-protocol\/src\//;
// C#: a scanner that steps over strings ("..", @"..", $"..", '.') and collects // and /* */ comments
function csComments(code) {
  const out = []; let i = 0;
  while (i < code.length) {
    const c = code[i], d = code[i + 1];
    if (c === '/' && d === '/') { const e = code.indexOf('\n', i); const end = e < 0 ? code.length : e; out.push([i, end]); i = end; continue; }
    if (c === '/' && d === '*') { const e = code.indexOf('*/', i + 2); const end = e < 0 ? code.length : e + 2; out.push([i, end]); i = end; continue; }
    if ((c === '@' || c === '$') && (d === '"' || ((d === '@' || d === '$') && code[i + 2] === '"'))) {
      const verbatim = c === '@' || d === '@'; i = code.indexOf('"', i) + 1;
      while (i < code.length) { if (code[i] === '"') { if (verbatim && code[i + 1] === '"') { i += 2; continue; } i++; break; } if (!verbatim && code[i] === '\\') i++; i++; }
      continue;
    }
    if (c === '"' || c === "'") { i++; while (i < code.length && code[i] !== c && code[i] !== '\n') { if (code[i] === '\\') i++; i++; } i++; continue; }
    i++;
  }
  return out;
}
// shell / Python: a line's comment from the first # outside quotes that starts a word (not $#, ${#..}, #! on line 1)
function hashComments(code) {
  const out = []; let pos = 0;
  for (const line of code.split('\n')) {
    let q = null;
    for (let k = 0; k < line.length; k++) {
      const ch = line[k];
      if (q) { if (ch === '\\' && q === '"') { k++; continue; } if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; continue; }
      if (ch === '#' && (k === 0 || /\s/.test(line[k - 1])) && !(pos === 0 && line[k + 1] === '!')) { out.push([pos + k, pos + line.length]); break; }
    }
    pos += line.length + 1;
  }
  return out;
}
// HTML: <!-- -->, <style> /* */, and each inline <script>'s comments by the parser
function htmlComments(code) {
  const out = [];
  for (const m of code.matchAll(/<!--[\s\S]*?-->/g)) out.push([m.index, m.index + m[0].length]);
  for (const m of code.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const base = m.index + m[0].indexOf(m[1]);
    for (const c of m[1].matchAll(/\/\*[\s\S]*?\*\//g)) out.push([base + c.index, base + c.index + c[0].length]);
  }
  let unparsed = 0;
  for (const m of code.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const base = m.index + m[0].indexOf(m[1]);
    const r = jsComments(m[1].replace(/\{\{\{[^}]*\}\}\}/g, (x) => '0'.padEnd(x.length, ' ')));
    if (!r) { unparsed++; continue; }
    for (const [a, b] of r) out.push([base + a, base + b]);
  }
  return { ranges: out.sort((x, y) => x[0] - y[0]), unparsed };
}

// --verify [base]: every file changed since base (default HEAD), its comments removed, is the same as at base (code and strings untouched)
function rangesOf(f, code) {
  const ext = extname(f).toLowerCase();
  if (ext === '.html') return htmlComments(code).ranges;
  if (ext === '.cs' || ext === '.rs') return csComments(code);
  if (ext === '.sh' || ext === '.py' || HASHY.has(ext) || HASHY.has(f.split('/').pop())) return hashComments(code);
  if (ext === '.nsi') return [...code.matchAll(/(^|\n)[ \t]*[;#][^\n]*/g)].map((m) => [m.index + m[1].length, m.index + m[0].length]);
  if (ext === '.svg') return [...code.matchAll(/<!--[\s\S]*?-->/g)].map((m) => [m.index, m.index + m[0].length]);
  if (ext === '.css') return [...code.matchAll(/\/\*[\s\S]*?\*\//g)].map((m) => [m.index, m.index + m[0].length]);
  return jsComments(code, { strings: !STRINGS_KEPT.test(f) });   // a string outside the protocol may change too
}
if (process.argv.includes('--verify')) {
  const BASE = process.argv[process.argv.indexOf('--verify') + 1] || 'HEAD';
  const changedFiles = execFileSync('git', ['-C', ROOT, 'diff', '--name-only', '--diff-filter=M', BASE], { encoding: 'utf8' }).split('\n').filter((f) => /\.(cs|rs|sh|py|html|css|m?js|cjs|jslib|toml|ya?ml|service|example|ps1|nsi|svg)$|(^|\/)_(headers|redirects)$/.test(f));
  const bare = (f, code) => { const r = rangesOf(f, code); if (!r) return null; let o = '', at = 0; for (const [a, b] of r) { if (a < at) continue; o += code.slice(at, a); at = b; } return o + code.slice(at); };
  let same = 0; const off = [];
  for (const f of changedFiles) {
    const a = bare(f, execFileSync('git', ['-C', ROOT, 'show', `${BASE}:${f}`], { encoding: 'utf8', maxBuffer: 1 << 28 }));
    const b = bare(f, readFileSync(join(ROOT, f), 'utf8'));
    if (a !== null && a === b) same++; else off.push(f);
  }
  console.log(`changed code files: ${changedFiles.length}; same without comments: ${same}; differ: ${off.length}`); for (const f of off.slice(0, 20)) console.log('  DIFFERS', f);
  process.exit(off.length ? 1 : 0);
}
const files = execFileSync('git', ['-C', ROOT, 'ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
let changed = 0, untouchedNames = 0; const skipped = [];
for (const f of files) {
  if (EXCLUDE.test(f) || isPinned(f) || /\/brand\/[^/]+\.svg$|(^|\/)nextblock-(icon|wordmark)\.svg$|-icon\.svg$/.test(f)) continue;   // a game's icon and wordmark: pinned game assets
  const ext = extname(f).toLowerCase();
  if (!['.js', '.mjs', '.cjs', '.jslib', '.cs', '.rs', '.sh', '.py', '.html', '.md', '.txt', '.css', '.nsi', '.svg', '.patch', '.json'].includes(ext) && !HASHY.has(ext) && !HASHY.has(f.split('/').pop())) continue;
  if (ext === '.json' && !JSON_SCRUBBED.test(f)) continue;
  let code; try { code = readFileSync(join(ROOT, f), 'utf8'); } catch { continue; }
  if (!/Daniel|DANIEL|#\d{2,4}|[Kk]anban/.test(code)) continue;
  let out;
  if (ext === '.md' || ext === '.txt') out = scrubText(code);
  else if (ext === '.patch') out = code.split('\n').map((l) => ((l.startsWith('+') && !l.startsWith('+++')) || l.startsWith('#') ? nameOnly(l) : l)).join('\n');   // added lines and the patch's own # header
  else if (ext === '.json') out = code.replace(/"(?:[^"\\\n]|\\.)*"/g, (str) => scrubText(str));
  else {
    let ranges;
    if (ext === '.html') { const h = htmlComments(code); ranges = h.ranges; if (h.unparsed) skipped.push(`${f}: ${h.unparsed} script block(s) not parsed`); }
    else if (ext === '.cs' || ext === '.rs') ranges = csComments(code);   // Rust: the same C-like scanner (a lifetime only hides a comment, never shows code)
    else if (ext === '.sh' || ext === '.py') ranges = hashComments(code);
    else if (HASHY.has(ext) || HASHY.has(f.split('/').pop())) ranges = hashComments(code);
    else if (ext === '.nsi') ranges = [...code.matchAll(/(^|\n)[ \t]*[;#][^\n]*/g)].map((m) => [m.index + m[1].length, m.index + m[0].length]);
    else if (ext === '.svg') ranges = [...code.matchAll(/<!--[\s\S]*?-->/g)].map((m) => [m.index, m.index + m[0].length]);
    else if (ext === '.css') ranges = [...code.matchAll(/\/\*[\s\S]*?\*\//g)].map((m) => [m.index, m.index + m[0].length]);
    else { ranges = jsComments(code, { strings: !STRINGS_KEPT.test(f) }); if (!ranges) { skipped.push(`${f}: does not parse`); continue; } }
    out = ''; let at = 0;
    for (const [a, b, kind] of ranges) { if (a < at) continue; out += code.slice(at, a) + scrubText(code.slice(a, b), kind || 'c'); at = b; }
    out += code.slice(at);
  }
  if (out !== code) { changed++; if (!check) writeFileSync(join(ROOT, f), out); }
  if (/\bDaniel\b/.test(out)) untouchedNames++;
}
console.log(`${check ? 'would change' : 'changed'} ${changed} file(s); ${untouchedNames} file(s) still name Daniel outside comments; ${skipped.length} skipped`);
for (const s of skipped) console.log('  skipped:', s);
