// MF 18 - ONE ERROR STATE, CAUSED IN THE BROWSER ONLY (DevTools request interception on the page's own requests; no seat,
// no bond, no round touched), then the page driven as a player would and watched for what it shows.
//   node mf18.mjs <case> [roundUrl]
//   cases: unreachable-lobby | unreachable-join | chain-disagree | claim-expired | committee-pending
import { writeFileSync } from 'node:fs';
const [CASE, ARG = ''] = process.argv.slice(2);
const D = '/tmp/claude-1000/-tmp-btc-phase0/01b12b8a-6417-45b8-819a-08b59d36c93d/scratchpad/pt';
const ver = await (await fetch('http://127.0.0.1:9381/json/version')).json();
const conn = async (url) => { const ws = new WebSocket(url); await new Promise((r) => (ws.onopen = r)); let n = 0; const p = new Map(); const ev = [];
  ws.onmessage = (e) => { const d = JSON.parse(e.data); if (d.id && p.has(d.id)) { p.get(d.id)(d); p.delete(d.id); } else if (d.method) ev.forEach((f) => f(d)); };
  return { call: (m, params = {}) => new Promise((r) => { const i = ++n; p.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params })); }), on: (f) => ev.push(f) }; };
const b = await conn(ver.webSocketDebuggerUrl);
const t = await b.call('Target.createTarget', { url: 'about:blank', newWindow: true });
const tid = t.result.targetId; writeFileSync(`${D}/target.txt`, tid);
const pg = await conn(`ws://127.0.0.1:9381/devtools/page/${tid}`);
await pg.call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
await pg.call('Emulation.setFocusEmulationEnabled', { enabled: true });
await pg.call('Runtime.enable');
const logs = []; const t0 = Date.now(); const at = () => ((Date.now() - t0) / 1000).toFixed(1);
pg.on((d) => { if (d.method === 'Runtime.consoleAPICalled') { const s = d.params.args.map((a) => a.value ?? a.description ?? '').join(' '); if (/\[blwp\]|error|refus|fail/i.test(s) && !/FMOD|\[chart\]|\[voice\]|spawnmark|\[ghost\]/.test(s)) logs.push(`+${at()} ${s.slice(0, 260)}`); } });
const ev = async (x) => (await pg.call('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: x })).result.result?.value;
const click = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await pg.call('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1, buttons: type === 'mousePressed' ? 1 : 0 }); };
const shot = async (name) => { const s = await pg.call('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${D}/${name}.png`, Buffer.from(s.result.data, 'base64')); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// THE FAULT
let rule = () => null; let hits = 0;
const NODE = /trycloudflare\.com|beelink\.tail1723e2\.ts\.net\/guardian-\d/;
pg.on(async (d) => {
  if (d.method !== 'Fetch.requestPaused') return;
  if (d.params.responseStatusCode !== undefined) return;
  const r = d.params; const act = rule(r.request.url, r);
  if (!act) return pg.call('Fetch.continueRequest', { requestId: r.requestId });
  hits++;
  if (act.fail) return pg.call('Fetch.failRequest', { requestId: r.requestId, errorReason: 'ConnectionRefused' });
  if (act.body !== undefined) return pg.call('Fetch.fulfillRequest', { requestId: r.requestId, responseCode: act.code || 200, responseHeaders: [{ name: 'content-type', value: act.type || 'application/json' }, { name: 'access-control-allow-origin', value: '*' }], body: Buffer.from(act.body).toString('base64') });
});
const intercept = async (patterns) => pg.call('Fetch.enable', { patterns: patterns.map((u) => ({ urlPattern: u, requestStage: 'Request' })) });
const watch = async (label, secs) => {
  const seen = [];
  for (let i = 0; i < secs * 2; i++) {
    const s = await ev(`(() => { const j = window.BLWP_JOIN; const vis = [...document.querySelectorAll('div,span,p')].filter(e => e.offsetParent && e.children.length === 0 && /refus|not joined|cannot|error|unreachable|disagree|pending|failed|no node|did not|could not|not reach|expired|closed/i.test(e.textContent)).map(e => e.textContent.trim().slice(0, 200));
      return JSON.stringify({ join: j && { state: j.state, why: String(j.why || '').slice(0, 220), stage: j.stage }, vis: [...new Set(vis)].slice(0, 4) }); })()`);
    if (s && s !== seen[seen.length - 1]) { seen.push(s); console.log(`+${at()} ${s}`); }
    const o = s ? JSON.parse(s) : {};
    if (o.join && /refused|error|failed/.test(o.join.state || '')) break;
    await sleep(500);
  }
  await shot(`mf18-${label}`);
  for (const w of [3, 10]) { await sleep(w === 3 ? 3000 : 7000); await shot(`mf18-${label}-after${w}s`); console.log(`+${at()} after ${w}s`, await ev(`JSON.stringify({ join: window.BLWP_JOIN && { state: BLWP_JOIN.state, why: String(BLWP_JOIN.why||'').slice(0,120) }, lobby: !!(window.BLWP_UNITY_LOBBY && BLWP_UNITY_LOBBY.showing) })`)); }
};
const LOBBY = 'https://btc-logistics-core.pages.dev/';
if (CASE === 'unreachable-lobby') {
  rule = (u) => (NODE.test(u) ? { fail: true } : null);
  await intercept(['*trycloudflare.com*', '*beelink.tail1723e2.ts.net/guardian-*']);
  await pg.call('Page.navigate', { url: LOBBY });
  await sleep(25000); await shot('mf18-unreachable-lobby');
  console.log('lobby', await ev(`JSON.stringify({ rows: (window.ARENA_LOBBY_ROWS || []).length, lobby: window.BLWP_UNITY_LOBBY && { showing: window.BLWP_UNITY_LOBBY.showing }, text: [...document.querySelectorAll('div')].filter(e => e.offsetParent && e.children.length === 0 && e.textContent.trim()).map(e => e.textContent.trim().slice(0, 140)).slice(0, 12) })`));
}
if (CASE === 'unreachable-join' || CASE === 'chain-disagree') {
  await pg.call('Page.navigate', { url: LOBBY });
  await sleep(22000);
  // the FREE row, joinable (no money)
  for (let i = 0; i < 20; i++) { const f = await ev(`JSON.stringify((window.ARENA_LOBBY_ROWS||[]).filter(x=>x.free&&x.joinable).map(x=>String(x.id).slice(0,8)))`); if (f && f !== '[]') break; await sleep(5000); }
  await click(640, 419); await sleep(1000); await shot(`mf18-${CASE}-0-free-selected`);
  if (CASE === 'unreachable-join') rule = (u) => (NODE.test(u) ? { fail: true } : null);
  // ONE SOURCE'S HEADERS ALTERED: the real answer of the first host asked, its last header's nonce byte flipped (Response stage)
  if (CASE === 'chain-disagree') {
    let first = null;
    pg.on(async (d) => {
      if (d.method !== 'Fetch.requestPaused' || d.params.responseStatusCode === undefined) return;
      const r = d.params; const host = new URL(r.request.url).host; first = first || host;
      if (host !== first) return pg.call('Fetch.continueRequest', { requestId: r.requestId });
      const got = await pg.call('Fetch.getResponseBody', { requestId: r.requestId });
      const buf = Buffer.from(got.result.body, got.result.base64Encoded ? 'base64' : 'utf8');
      if (buf.length >= 80) buf[buf.length - 1] ^= 0x5a;
      hits++; console.log(`+${at()} altered ${host} /headers (${buf.length} bytes)`);
      return pg.call('Fetch.fulfillRequest', { requestId: r.requestId, responseCode: 200, responseHeaders: [{ name: 'content-type', value: 'application/octet-stream' }, { name: 'access-control-allow-origin', value: '*' }], body: buf.toString('base64') });
    });
  }
  if (CASE === 'unreachable-join') await intercept(['*trycloudflare.com*', '*beelink.tail1723e2.ts.net/guardian-*']);
  else await pg.call('Fetch.enable', { patterns: [{ urlPattern: '*/headers', requestStage: 'Response' }] });
  console.log(`+${at()} PLAY`); await click(487, 614);
  await watch(CASE, 60);
}
if (CASE === 'claim-expired') {
  // ONE PENDING NOTE FOR AN ENTRY THAT DOES NOT EXIST (round and entry ff..), and the seats' /standing for it answered as a
  // 50 sat payout whose window closes 15 s after the note goes in - so the line is seen open, then past its close.
  // Nothing real is touched: the note is removed at the end, and no seat is asked about a real entry.
  const RID = 'ff'.repeat(32), EID = 'fe'.repeat(32); let closeMs = 0;
  rule = (u) => (u.includes('/standing?entry=' + EID) ? { body: JSON.stringify({ kind: 'payout', pendingMsat: '50000', windowCloseMs: String(closeMs), provisional: true, state: 'PROVISIONALLY_FINAL' }) } : null);
  await intercept(['*/standing?entry=*']);
  await pg.call('Page.navigate', { url: LOBBY });
  await sleep(20000);
  closeMs = Date.now() + 15000;
  const nodes = [1, 2, 3, 4, 5, 6, 7].map((i) => `https://beelink.tail1723e2.ts.net/guardian-${i}`);
  await ev(`localStorage.setItem('arena.pending.${RID}.${EID}', ${JSON.stringify(JSON.stringify({ roundIdHex: RID, entryIdHex: EID, nodes }))}); 1`);
  console.log(`+${at()} note in, window closes ${new Date(closeMs).toISOString().slice(11, 19)}`);
  let last = '';
  for (let i = 0; i < 90; i++) {
    const s = await ev(`JSON.stringify({ pending: window.ARENA_PENDING_SATS, when: (document.getElementById('arena-bal-pending-when')||{}).textContent, chip: (document.getElementById('arena-lobby-pending')||{}).textContent, title: ((document.getElementById('arena-lobby-pending')||{}).parentNode||{}).title })`);
    if (s !== last) { last = s; console.log(`+${at()} ${s}`); }
    if (i === 8) await shot('mf18-claim-open');
    if (i === 30) { await ev(`document.getElementById('arena-console-go') && document.getElementById('arena-console-go').click(); 1`); await sleep(1200); await shot('mf18-claim-expired-console'); console.log('panel', JSON.stringify(await ev(`(document.getElementById('arena-wallet')||document.body).innerText.slice(0,600)`))); }
    await sleep(1000);
  }
  await shot('mf18-claim-expired-75s');
  await ev(`localStorage.removeItem('arena.pending.${RID}.${EID}'); 1`);
  console.log('note removed', await ev(`Object.keys(localStorage).filter(k => k.includes('${EID}')).length`));
}
if (CASE === 'committee-pending') {
  // THE ROUND LINK THE LOBBY ITSELF BUILDS for a round whose committee is not drawn yet (ARG = free | paid)
  await pg.call('Page.navigate', { url: LOBBY }); await sleep(22000);
  const [kind, pid] = ARG.split(':');
  const join = await ev(`(() => { const r = (window.ARENA_LOBBY_ROWS||[]).find(x => !!x.free === ${kind === 'free'}); const s = r && window.ARENA_ROW_SEARCH.get(r.id); return s ? BLWPCLIENT.lobbyJoinSearch(s, '${pid}') : null; })()`);
  console.log('link', join && join.slice(0, 400));
  if (!join) { console.log('no row of that kind to take the search from'); process.exit(1); }
  const pick = [{ join }];
  await pg.call('Page.navigate', { url: LOBBY.replace(/\/$/, '') + '/' + pick[0].join + '&play=1' });
  await sleep(1500); console.log(`+${at()} PLAY`); await click(487, 614); await watch(CASE, 45);
}
if (CASE === 'budget' || CASE === 'budget-wait') {
  // PAID PLAY WITH A 0 SAT PLAYER WALLET: no fault injected, the wallet is simply empty
  await pg.call('Page.navigate', { url: LOBBY }); await sleep(22000);
  console.log('wallet', await ev(`JSON.stringify(window.ARENA_WALLET_BALANCE || null)`));
  await click(640, 459); await sleep(1000); await shot('mf18-budget-0-paid-selected');
  console.log(`+${at()} PLAY`); await click(487, 614);
  let last = '';
  for (let i = 0; i < 40; i++) {
    const s = await ev(`JSON.stringify({ join: window.BLWP_JOIN && { state: BLWP_JOIN.state, why: String(BLWP_JOIN.why||'').slice(0,160), stage: BLWP_JOIN.stage }, deposit: (document.getElementById('arena-deposit')||{}).innerText?.slice(0, 300) })`);
    if (s !== last) { last = s; console.log(`+${at()} ${s}`); }
    if (/Deposit/.test(s) && !/closed/.test(last.closedYet || '')) { await shot('mf18-budget-1-deposit'); break; }
    await sleep(500);
  }
  if (CASE === 'budget-wait') {
    // NEITHER PAID NOR CLOSED: watched past the round's entry close
    const closeIn = await ev(`(() => { const r = (window.ARENA_LOBBY_ROWS||[]).find(x => x.id === (window.BLWP_JOIN||{}).round); return r ? Number(r.entryCloseMs || (r.contract && r.contract.entryClose) || 0) - Date.now() : null; })()`);
    console.log('entry closes in ms', closeIn);
    for (let i = 0; i < 300; i++) { await sleep(1000); const s = await ev(`JSON.stringify({ join: window.BLWP_JOIN && { state: BLWP_JOIN.state, why: String(BLWP_JOIN.why||'').slice(0,200), stage: BLWP_JOIN.stage }, depositUp: !!((document.getElementById('arena-deposit')||{}).innerText||'').trim() })`); if (s !== last) { last = s; console.log(`+${at()} ${s}`); await shot('mf18-budget-wait-' + i); } if (i === Math.round(closeIn / 1000) + 30 || i === 299) { await shot('mf18-budget-wait-at' + i); console.log(`+${at()} shot at ${i}s: ${s}`); } if (i === Math.round(closeIn / 1000) + 30 || i === 299) { await shot('mf18-budget-wait-at' + i); console.log(`+${at()} shot at ${i}s: ${s}`); } if (/refused/.test(s) && i > 5) { await sleep(3000); await shot('mf18-budget-wait-end'); break; } }
    console.log('intercepted', hits); await b.call('Target.closeTarget', { targetId: tid }); process.exit(0);
  }
  // CLOSE IT, as a player who will not deposit
  console.log('close', await ev(`(() => { const b = [...document.querySelectorAll('#arena-deposit button')].find(x => /✕|close|cancel/i.test(x.textContent)); if (!b) return [...document.querySelectorAll('#arena-deposit button')].map(x => x.textContent).join('|'); b.click(); return 'clicked ' + b.textContent; })()`));
  for (let i = 0; i < 30; i++) { await sleep(1000); const s = await ev(`JSON.stringify({ join: window.BLWP_JOIN && { state: BLWP_JOIN.state, why: String(BLWP_JOIN.why||'').slice(0,160) } })`); if (s !== last) { last = s; console.log(`+${at()} ${s}`); } }
  await shot('mf18-budget-2-closed');
}
console.log('intercepted', hits); console.log(logs.slice(-14).join('\n'));
await b.call('Target.closeTarget', { targetId: tid });
process.exit(0);
