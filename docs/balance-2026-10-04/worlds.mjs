// THE REAL WORLDS OF TONIGHT'S PAID ROUNDS: seed word (entry + the round's randomness), the recorded transcript, and the
// tick the player rolled out (first non-zero throttle). Written to worlds.json for real.mjs.
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';
import { decodeEntryContract } from '/tmp/btc-phase0/packages/arena-protocol/src/contracts.js';
import { seedWordForEntry } from '/tmp/btc-phase0/packages/arena-protocol/src/seed.js';
const db = new DatabaseSync('/home/daniel/blwp-testnet4/node-1.db', { readOnly: true });
const prefixes = ['ED48DC73', 'AEEF9F2E', 'F5037AF7', '3B16E292', 'A987D4E7', 'D9956F24', '52650809', '555342F8', '572ADCF6', '2B687E57', 'EB33434C', '9E45455E'];
const out = [];
for (const p of prefixes) {
  const e = db.prepare('select entry_id, round_id, contract from entries where hex(round_id) like ?').get(p + '%');
  if (!e) { console.log(p, 'no entry'); continue; }
  const rid = Buffer.from(e.round_id).toString('hex'), eid = Buffer.from(e.entry_id).toString('hex');
  const rnd = new Uint8Array(await (await fetch(`http://127.0.0.1:31221/randomness?round=${rid}`)).arrayBuffer());
  const entry = decodeEntryContract(new Uint8Array(e.contract));
  const seed = seedWordForEntry(entry, rnd.length === 32 ? rnd : rnd.subarray(0, 32));
  const t = await (await fetch(`http://127.0.0.1:31221/replay/transcript?round=${rid}&entry=${eid}`)).json();
  const roll = t.ticks.findIndex((w) => (w[0] | 0) !== 0);
  out.push({ round: rid.slice(0, 8), seed, rndLen: rnd.length, ticks: t.ticks.length, roll, tapes: t.tapes, samples: t.samples, loads: t.loads, transcript: t.ticks });
  console.log(p, 'seed', seed, 'rnd bytes', rnd.length, 'ticks', t.ticks.length, 'roll-out tick', roll, 'loads', JSON.stringify(t.loads), 'tapes', t.tapes.length, 'samples', t.samples.length);
}
writeFileSync(new URL('./worlds.json', import.meta.url), JSON.stringify(out));
