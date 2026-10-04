// REAL WORLDS: the round's seed and its recorded inputs up to ROLL OUT (the load's tick), then OUR load and the waypoint
// driver to the drop-off, practice 0, courier damage x factor. `validate` replays a transcript whole at factor 1.
import * as sim from './src/sim.js';
import { readFileSync } from 'node:fs';
const ONE = 65536;
const worlds = JSON.parse(readFileSync(new URL('./worlds.json', import.meta.url)));
const [mode = 'run', factorsArg = '1', routeArg = '120,-10;185,0'] = process.argv.slice(2);
const at = (rows) => new Map(rows.map(([i, ...v]) => [i, v]));
function world(wd) {
  const st = sim.init(wd.seed, { runTicks: 4920 });
  return { st, tapes: at(wd.tapes), samples: at(wd.samples), loads: at(wd.loads) };
}
function feed(w, t) {
  if (w.tapes.has(t)) sim.submitTape(w.st, w.tapes.get(t));
  if (w.samples.has(t)) sim.submitSample(w.st, w.samples.get(t)[0]);
}
if (mode === 'validate') {
  sim.setBalance({ courierScale: ONE });
  for (const wd of worlds) {
    const w = world(wd);
    for (let t = 0; t < wd.transcript.length; t++) {
      feed(w, t);
      if (w.loads.has(t)) sim.submitLoad(w.st, ...w.loads.get(t));
      const x = wd.transcript[t].words || wd.transcript[t]; sim.step(w.st, x[0], x[1], x[2], x[3], x[4]);
    }
    console.log(wd.round, 'replayed', wd.transcript.length, 'ticks: state', w.st.i32[23], 'hp', (w.st.i32[11] / ONE).toFixed(1));
  }
  process.exit(0);
}
const LOADS = { one: [987, 0], auto: null };   // auto = the round's own recorded AUTO load
const wps = routeArg.split(';').map((p) => p.split(',').map(Number));
function drive(wd, factor, load) {
  sim.setBalance({ courierScale: Math.round(factor * ONE), contactKills: process.env.CONTACT !== '0', armour: process.env.ARMOUR ? Math.round(Number(process.env.ARMOUR) * ONE) : undefined });
  const w = world(wd);
  const L = wd.loads[0][0];
  for (let t = 0; t < L; t++) { feed(w, t); const x = wd.transcript[t].words || wd.transcript[t]; sim.step(w.st, x[0], x[1], x[2], x[3], 0); }
  sim.submitLoad(w.st, ...(LOADS[load] || wd.loads[0].slice(1)));
  let wi = 0, stuck = null, rev = 0;
  for (let t = L; t < 10800; t++) {
    feed(w, t);
    const s = w.st.i32, x = s[5] / ONE, z = s[6] / ONE, h = s[7], state = s[23];
    if (state !== 0) return { state, tick: t, x, z, hpBefore: w.prevHp, impact: s[12] };
    w.prevHp = s[11] / ONE;
    let [tx, tz] = wps[wi];
    if (Math.hypot(tx - x, tz - z) < 8 && wi < wps.length - 1) [tx, tz] = wps[++wi];
    const want = Math.atan2(tx - x, tz - z) / (2 * Math.PI) * 65536;
    const err = ((want - h) % 65536 + 65536 + 32768) % 65536 - 32768;
    if (!stuck || Math.hypot(stuck[0] - x, stuck[1] - z) > 2) stuck = [x, z, t];
    else if (t - stuck[2] > 150 && !rev) rev = t;
    let thr = ONE, steer = Math.max(-ONE, Math.min(ONE, Math.round(err / 3000 * ONE)));
    if (rev) { thr = -ONE; steer = -steer; if (t - rev > 90) { rev = 0; stuck = null; } }
    sim.step(w.st, thr, steer, 0, 0, 0);
  }
  return { state: 'timeout', x: w.st.i32[5] / ONE };
}
for (const f of factorsArg.split(',').map(Number)) {
  for (const load of ['one', 'auto']) {
    const rs = worlds.map((wd) => drive(wd, f, load));
    const d = rs.filter((r) => r.state === 1).length;
    console.log(`factor ${f.toFixed(3)} ${load.padEnd(4)}: delivered ${String(d).padStart(2)}/${rs.length}` +
      `  wrecked at x [${rs.filter((r) => r.state === 2).map((r) => r.x.toFixed(0)).join(',')}]` +
      `  hp the tick before [${rs.filter((r) => r.state === 2).map((r) => r.hpBefore.toFixed(0)).join(',')}]` +
      (rs.some((r) => r.state !== 1 && r.state !== 2) ? `  other ${rs.filter((r) => r.state !== 1 && r.state !== 2).map((r) => r.state).join(',')}` : ''));
  }
}
