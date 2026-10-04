// LOCAL REPLAY, BALANCE ONLY: the scratch core (courier damage x factor), the waypoint driver of pt/drive.mjs, practice 0.
import * as sim from './src/sim.js';
const ONE = 65536;
const [factorsArg = '1', seedsArg = '8', practiceArg = '0', routeArg = '120,-10;185,0'] = process.argv.slice(2);
const LOADS = { one: [987, 0], auto: [16352, 32] };
const wps = routeArg.split(';').map((w) => w.split(',').map(Number));
function drive(seed, factor, load) {
  sim.setBalance({ courierScale: Math.round(factor * ONE) });
  const st = sim.init(seed);
  sim.submitLoad(st, ...LOADS[load]);
  let w = 0, stuck = null, rev = 0, minHp = 100;
  for (let t = 0; t < 10800; t++) {
    const s = st.i32;
    const x = s[5] / ONE, z = s[6] / ONE, h = s[7], state = s[23], hp = s[11] / ONE;
    minHp = Math.min(minHp, hp);
    if (state !== 0) return { state, tick: t, x, z, hp };
    let [tx, tz] = wps[w];
    if (Math.hypot(tx - x, tz - z) < 8 && w < wps.length - 1) [tx, tz] = wps[++w];
    const want = Math.atan2(tx - x, tz - z) / (2 * Math.PI) * 65536;
    const err = ((want - h) % 65536 + 65536 + 32768) % 65536 - 32768;
    if (!stuck || Math.hypot(stuck[0] - x, stuck[1] - z) > 2) stuck = [x, z, t];
    else if (t - stuck[2] > 150 && !rev) rev = t;
    let thr = ONE, steer = Math.max(-ONE, Math.min(ONE, Math.round(err / 3000 * ONE)));
    if (rev) { thr = -ONE; steer = -steer; if (t - rev > 90) { rev = 0; stuck = null; } }
    sim.step(st, thr, steer, 0, 0, Number(practiceArg) ? ONE : 0);
  }
  return { state: 'timeout', tick: 10800, x: st.i32[5] / ONE, z: st.i32[6] / ONE };
}
const NAME = { 1: 'DELIVERED', 2: 'WRECKED', 3: 'MISSED' };
const seeds = Array.from({ length: Number(seedsArg) }, (_, i) => (0x9e3779b9 * (i + 1)) | 0);
for (const f of factorsArg.split(',').map(Number)) {
  for (const load of ['one', 'auto']) {
    const rs = seeds.map((sd) => drive(sd, f, load));
    const d = rs.filter((r) => r.state === 1).length;
    const wx = rs.filter((r) => r.state === 2).map((r) => r.x.toFixed(0));
    const dt = rs.filter((r) => r.state === 1).map((r) => r.tick);
    console.log(`factor ${f.toFixed(3)} ${load.padEnd(4)}: delivered ${d}/${rs.length}` + (wx.length ? `  wrecked at x ${wx.join(',')}` : '') + (dt.length ? `  ticks ${Math.min(...dt)}..${Math.max(...dt)}` : '') + (rs.some((r) => r.state === 3 || r.state === 'timeout') ? `  missed ${rs.filter((r) => r.state === 3 || r.state === 'timeout').length}` : ''));
  }
}
