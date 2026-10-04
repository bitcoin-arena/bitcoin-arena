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
  card: !!window.BLWP_CARD_UP, bay: !!(window.BLWP_HUD_CORNER && BLWP_HUD_CORNER.floor < BLWP_HUD_CORNER.h), run: (() => { try { return unityInstance.Module.blwp.st.i32[23]; } catch { return null; } })(),
  result: window.BLWP_RESULT && { round: String(BLWP_RESULT.roundHex || '').slice(0, 8), hold: BLWP_RESULT.hold } })`;
const until = async (name, capS, pred) => {
  const t = Date.now(); let last = '';
  for (;;) { const s = await ev(STATE); const o = JSON.parse(s || '{}'); if (s !== last) { last = s; appendFileSync(LOG, `+${at()}   state ${s}\n`); }
    if (pred(o)) { log(`${name}: ${((Date.now() - t) / 1000).toFixed(1)} s`); return o; }
    if (Date.now() - t > capS * 1000) { log(`HANG at "${name}": nothing in ${capS} s - ${s}`); await shot(`hang-${name.replace(/\W+/g, '-')}`); return null; } await sleep(500); } };

import { execFileSync } from 'node:child_process';
// THE FIRST LIVE LATE JOIN (T3 b3d7c369, from 2026-10-04 08:00Z): the PAID row picked 10-25 s after its round started,
// PLAY, the deposit request paid from LND A (one round's 100 sat stake - no bond), then the run as a player plays it.
const paidRow = async () => JSON.parse(await ev(`JSON.stringify((window.BLWP_LOBBY_ROWS||[]).filter(r => !r.free).map(r => ({ id: r.id, start: Number(r.startTimeMs || (r.contract && r.contract.startTimeMs) || 0), close: Number(r.entryCloseMs || (r.contract && r.contract.entryCloseMs) || 0), joinable: r.joinable, phase: r.phase })))`) || '[]');
log('fresh profile, live page ' + (process.env.URL || 'https://btc-logistics-core.pages.dev/'));
await pg.call('Page.navigate', { url: process.env.URL || 'https://btc-logistics-core.pages.dev/' });
await until('page -> lobby', 120, (o) => o.lobby);
await sleep(5000);
let pick = null;
for (let i = 0; i < 900 && !pick; i++) {
  const rows = await paidRow(); const now = Date.now();
  const r = rows.find((x) => x.start && x.close - x.start >= 40000 && now - x.start >= 10000 && now - x.start <= 25000);
  if (r) pick = r; else { if (i % 20 === 0) log('paid rows ' + JSON.stringify(rows.map((x) => ({ id: x.id.slice(0, 8), startIn: Math.round((x.start - now) / 1000), closeIn: Math.round((x.close - now) / 1000), j: x.joinable, p: x.phase })))); await sleep(1000); }
}
if (!pick) { log('no running paid round to join late'); process.exit(1); }
log(`picked ${pick.id.slice(0, 8)}: started ${((Date.now() - pick.start) / 1000).toFixed(1)} s ago, entry closes in ${((pick.close - Date.now()) / 1000).toFixed(1)} s`);
await click(640, 459); await sleep(500); await shot('lj-lobby');
const tPlay = Date.now(); log('PAID + PLAY'); await click(487, 614);
let inv = null;
for (let i = 0; i < 60 && !inv; i++) { const t = await ev(`(document.getElementById('blwp-deposit')||{}).innerText || ''`); const m = /lntb[0-9a-z]{80,}/.exec(t || ''); if (m) inv = m[0]; else await sleep(500); }
if (inv) {
  log(`deposit request ${((Date.now() - tPlay) / 1000).toFixed(1)} s after PLAY; paying from LND A`); await shot('lj-deposit');
  try { const out = execFileSync('/mnt/bitcoin/lnd-linux-amd64-v0.21.3-beta/lncli', ['--lnddir=/mnt/bitcoin/lnd-testnet4', '--rpcserver=127.0.0.1:11009', '--network=testnet4', 'payinvoice', '--force', '--json', inv], { timeout: 90000 }).toString();
    const j = JSON.parse(out.slice(out.indexOf('{'))); log(`paid: ${j.status} ${j.value_sat} sat fee ${j.fee_sat} at +${((Date.now() - tPlay) / 1000).toFixed(1)} s`); }
  catch (e) { log('payment failed: ' + String(e.stdout || e.message).slice(0, 200)); }
} else log('no deposit request (wallet already funded?)');
const bay = await until('PLAY -> cargo bay (late)', 240, (o) => o.bay || (o.join && o.join.state === 'refused'));
const j0 = JSON.parse(await ev(STATE)); log('join ' + JSON.stringify(j0.join));
if (bay && bay.bay) {
  log(`in the round ${((Date.now() - pick.start) / 1000).toFixed(1)} s after its start`);
  await sleep(1500); await shot('lj-bay');
  await click(305, 675); await sleep(1200); log('AUTO'); await click(659, 675); log('ROLL OUT');
  const drv = spawn(process.execPath, [`${D}/drive.mjs`, '9381', '120,-10;185,0', '150'], { stdio: 'ignore' });
  await until('drive -> run named', 200, (o) => o.card || (o.run !== 0 && o.run !== null && !o.bay)); drv.kill();
  await sleep(2000); await shot('lj-end');
  await until('run end -> result card lets go', 300, (o) => o.result && o.result.hold === false); await shot('lj-result');
  const entry = await ev(`String((window.BLWP_RESULT||{}).entryHex||'')`);
  for (const seat of [31221, 31231, 31241]) { try { const r = await (await fetch(`http://127.0.0.1:${seat}/api/round-result?round=${pick.id}`)).json(); const me = (r.players || []).find((p) => p.entry === entry); log(`seat ${seat}: ${JSON.stringify(me || r).slice(0, 300)}`); } catch (e) { log(`seat ${seat}: ${e.message}`); } }
}
log('end'); process.exit(0);
