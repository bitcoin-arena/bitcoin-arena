// MF 19 - THE UNATTENDED FREE-ROUND FLOW on the live page, as a player clicks it, no coaching: a fresh profile, the
// page, FREE + PLAY, AUTO + ROLL OUT, a drive (real arrow keys, drive.mjs), the result, then PLAY again into the next
// free round - every stage timed against a cap, a shot at each, and the page's own state logged. A stage past its cap
// is recorded as a hang, and the flow stops there.   node mf19.mjs [prefix]
import { writeFileSync, appendFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
const PRE = process.argv[2] || 'mf19';
const D = '/tmp/claude-1000/-tmp-btc-phase0/01b12b8a-6417-45b8-819a-08b59d36c93d/scratchpad/pt';
const LOG = `${D}/${PRE}.log`; writeFileSync(LOG, '');
const ver = await (await fetch('http://127.0.0.1:9381/json/version')).json();
const conn = async (url) => { const ws = new WebSocket(url); await new Promise((r) => (ws.onopen = r)); let n = 0; const p = new Map(); const ev = [];
  ws.onmessage = (e) => { const d = JSON.parse(e.data); if (d.id && p.has(d.id)) { p.get(d.id)(d); p.delete(d.id); } else if (d.method) ev.forEach((f) => f(d)); };
  return { call: (m, params = {}) => new Promise((r) => { const i = ++n; p.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params })); }), on: (f) => ev.push(f) }; };
const b = await conn(ver.webSocketDebuggerUrl);
for (const t of (await b.call('Target.getTargets')).result.targetInfos) if (t.type === 'page') await b.call('Target.closeTarget', { targetId: t.targetId });
const tid = (await b.call('Target.createTarget', { url: 'about:blank' })).result.targetId; writeFileSync(`${D}/target.txt`, tid);
const pg = await conn(`ws://127.0.0.1:9381/devtools/page/${tid}`);
await pg.call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
await pg.call('Emulation.setFocusEmulationEnabled', { enabled: true });
await pg.call('Runtime.enable');
const T0 = Date.now(); const at = () => ((Date.now() - T0) / 1000).toFixed(1);
const log = (s) => { const l = `+${at()} ${s}`; console.log(l); appendFileSync(LOG, l + '\n'); };
pg.on((d) => { if (d.method === 'Runtime.consoleAPICalled') { const s = d.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
  if (/\[blwp\]/.test(s) && /core [0-9a-f]{8} for|join|refus|run|result|round|lobby|roll|load|next|error|fail|ended|signed|card/i.test(s) && !/\[chart\]|warm:|donation|join step/.test(s)) appendFileSync(LOG, `+${at()}   page: ${s.slice(0, 220)}\n`);
  if (d.params.type === 'error') appendFileSync(LOG, `+${at()}   page error: ${s.slice(0, 220)}\n`); } });
const ev = async (x) => (await pg.call('Runtime.evaluate', { returnByValue: true, expression: x })).result.result?.value;
const click = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await pg.call('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1, buttons: type === 'mousePressed' ? 1 : 0 }); };
const shot = async (name) => { const s = await pg.call('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${D}/${PRE}-${name}.png`, Buffer.from(s.result.data, 'base64')); log(`shot ${PRE}-${name}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const STATE = `JSON.stringify({ lobby: !!(window.BLWP_UNITY_LOBBY && BLWP_UNITY_LOBBY.showing), join: window.BLWP_JOIN && { state: BLWP_JOIN.state, why: String(BLWP_JOIN.why || '').slice(0, 160), round: String(BLWP_JOIN.round || '').slice(0, 8), free: BLWP_JOIN.free },
  card: !!window.ARENA_CARD_UP, bay: !!(window.BLWP_HUD_CORNER && BLWP_HUD_CORNER.floor < BLWP_HUD_CORNER.h), run: (() => { try { return unityInstance.Module.blwp.st.i32[23]; } catch { return null; } })(),
  result: window.BLWP_RESULT && { round: String(BLWP_RESULT.roundHex || '').slice(0, 8), hold: BLWP_RESULT.hold } })`;
const until = async (name, capS, pred) => {
  const t = Date.now(); let last = '';
  for (;;) { const s = await ev(STATE); const o = JSON.parse(s || '{}'); if (s !== last) { last = s; appendFileSync(LOG, `+${at()}   state ${s}\n`); }
    if (pred(o)) { log(`${name}: ${((Date.now() - t) / 1000).toFixed(1)} s`); return o; }
    if (Date.now() - t > capS * 1000) { log(`HANG at "${name}": nothing in ${capS} s - ${s}`); await shot(`hang-${name.replace(/\W+/g, '-')}`); return null; } await sleep(500); } };
const pickFreeAndPlay = async (tag) => {
  for (let i = 0; i < 60; i++) { if (await ev(`(window.ARENA_LOBBY_ROWS||[]).some(x => x.free && x.joinable)`)) break; await sleep(3000); }
  await click(640, 419); await sleep(700); await shot(`${tag}-lobby`); log(`${tag}: FREE + PLAY`); await click(487, 614);
};
const run = async (tag) => {
  const bay = await until(`${tag}: PLAY -> cargo bay`, 240, (o) => o.bay); if (!bay) return false;
  await sleep(1500); await shot(`${tag}-bay`);
  await click(305, 675); await sleep(1200); await shot(`${tag}-auto`); log(`${tag}: AUTO`);
  await click(659, 675); log(`${tag}: ROLL OUT`);
  const live = await until(`${tag}: ROLL OUT -> driving`, 60, (o) => !o.bay); if (!live) return false;
  const drv = spawn(process.execPath, [`${D}/drive.mjs`, '9381', '120,-10;185,0', '150'], { stdio: 'ignore' });
  const ended = await until(`${tag}: drive -> run named`, 200, (o) => o.card || (o.run !== 0 && o.run !== null && !o.bay));
  drv.kill(); if (!ended) return false;
  await sleep(2000); await shot(`${tag}-end`);
  const signed = await until(`${tag}: run end -> result card lets go`, 240, (o) => o.result && o.result.hold === false); await shot(`${tag}-result`);
  const back = await until(`${tag}: result -> lobby`, 120, (o) => o.lobby); await shot(`${tag}-back`);
  return !!back;
};
log('fresh profile, page https://btc-logistics-core.pages.dev/');
await pg.call('Page.navigate', { url: process.env.URL || 'https://btc-logistics-core.pages.dev/' });
const lobby = await until('page -> lobby', 120, (o) => o.lobby);
if (lobby) {
  log('build ' + await ev(`(document.getElementById('sub')||{}).textContent || ''`));
  await sleep(4000); await pickFreeAndPlay('r1');
  if (await run('r1') && !process.env.ONE) { await sleep(3000); await pickFreeAndPlay('r2'); await run('r2'); }
}
log('end'); process.exit(0);
