# Unattended run, 31 August – 1 September 2026

Branch `phase0-deterministic-core`. Nothing on `master`, nothing deployed.

## What was asked

Implement stage 0 and stage 1 as far as possible, unattended, making
assumptions rather than waiting.

## Where it got to

**Stage 0: complete and accepted.**
**Stage 1: the rules are ported and passing; the Unity bridge is not built.**

```
determinism guard: 16 files clean
tests: 22 pass, 0 fail
stage 0 acceptance: PASS   (V8, SpiderMonkey, JavaScriptCore, Node)
```

## The finding that matters most

The spike was meant to ask whether hand-built fixed point holds. It does. But
the second half of it produced something better than a yes.

Measured across 120,000 inputs per function, hashing exact bit patterns:

| | Node 24 | V8 15.4 | SpiderMonkey | JavaScriptCore |
|---|---|---|---|---|
| `sqrt` | agree | agree | agree | agree |
| `sin` `cos` `tan` | ✗ | ✗ | ✗ | ✗ |
| `atan2` `exp` `log` `pow` `cbrt` `hypot` | ✗ | ✗ | ✗ | ✗ |

`sqrt` is the one exception, because IEEE-754 requires it to be correctly
rounded and every engine takes it from the hardware. Everything else differs.

**Node 24 and the V8 15.4 shell disagree** — two builds of the same engine.
Cross-browser divergence was the expected hazard. Cross-*version* divergence
is worse: a player who updates Chrome could fail to replay their own earlier
transcript, and no amount of testing on three engines would catch it. This is
what turns the fixed-point core from cautious into necessary.

**Followed up, and it has already happened.** Across four Node releases
spanning V8 10.2 to 13.6:

| | V8 10.2 | V8 11.3 | V8 12.4 | V8 13.6 |
|---|---|---|---|---|
| core, 36,000 ticks | `5d65d265…` | `5d65d265…` | `5d65d265…` | `5d65d265…` |
| `Math.pow` digest | `0150334f` | `0150334f` | `0150334f` | **`a01870cd`** |

V8 changed `Math.pow` between 12.4 and 13.6. The core is bit-identical across
all four, because it calls none of them. `tools/run-versions.sh` keeps it
true, and `test/specified.test.js` enumerates every operation the core is
allowed to touch with the clause of the specification that pins it.

Plain float arithmetic is fine — two million iterations of a chaotic
integration using only `+ - * /` are bit-identical everywhere. So WASM's
advantage is real and narrow: it compiles its own libm in.

**And across CPUs, on one V8 version.** x86-64 in a container against arm64
native, V8 13.6 both:

| | x86-64 | arm64 |
|---|---|---|
| core, 36,000 ticks | `5d65d265…` | `5d65d265…` |
| `sin` `cos` `tan` `atan2` `exp` `log` `pow` | ✗ | ✗ |
| `sqrt` `cbrt` `hypot` | agree | agree |

The same browser build gives different answers on Intel and on Apple silicon.
The full acceptance also passes inside the x86-64 container: guard clean, 25
tests, all five vectors.

**And on a big-endian machine.** s390x, emulated, Node's own build:

```
arm64 (LE)   5d65d2659dc802491073d35bc06586b5b96b93f89c9897308eea306aa6e96af1
x64   (LE)   5d65d2659dc802491073d35bc06586b5b96b93f89c9897308eea306aa6e96af1
s390x (BE)   5d65d2659dc802491073d35bc06586b5b96b93f89c9897308eea306aa6e96af1
```

That one matters more than it looks. Hashing the raw bytes of an Int32Array
inherits the host's byte order, and x86-64 and arm64 are both little-endian -
so every architecture test passed while the assumption went unexamined. s390x
is the only way to tell a correct fix from a correctly written one.

That closes the half of the criterion that was open. Three scripts now hold
it: `run-engines.sh`, `run-versions.sh`, `run-arch.sh`, plus a GitHub Actions
workflow that runs all of it natively on both architectures and fails if the
two do not produce the same corpus hash.

## Throughput

**3120× realtime** with 96 units, against the 15–30× this project expected and
~60× assumed for a native core. Two orders of magnitude of headroom, which is
what spec §34's player cap should now be derived from rather than guessed at.

## What is in the branch

```
packages/core/
  src/      fixed, rng, trig, tables (committed), sha256, state, sim
  src/rules/  terrain, noise, frontline, vehicle, army, score, gate, cargo
  tools/    gen-tables, hash-core, check-determinism, bundle, replay,
            make-vectors, run-engines.sh
  test/     poison, rules, vectors, bundle, harness
  dist/     blwp-core.js — one file, verified equal to the modules
test-vectors/  five golden logs with their state hashes
```

## Assumptions made without asking

1. **Unity's `Mathf.PerlinNoise` is replaced by integer value noise.** Unity's
   is its own implementation and is not stable across Unity versions, let
   alone engines. The terrain will not look identical to today's build; it
   will look like the same kind of landscape.
2. **The vehicle is derived from Bullet's `btRaycastVehicle`,** not ported
   from PhysX — which is closed, and whose Unity wrapper is read-only
   licensed. Same family, different numbers. **The handling is a starting
   point and needs a human at the wheel**; that was always stage 1's largest
   uncertainty and it still is.
3. **Rule modules export globally unique names.** Flat concatenation for the
   browser bundle means one scope, and the bundler now refuses a collision
   rather than shipping a program that differs from the modules.
4. `sqrt` is banned along with the rest of `Math`, despite measuring
   identical. A whitelist with one hole in it is a whitelist somebody widens.

## What is NOT done

- **The Unity bridge.** M1 needs Unity to render *from* the core instead of
  running PhysX. The core is bundled and ready; the `.jslib`, the C# component
  and the input path are not written, and could not be verified here anyway.
- **Driving feel.** Deliberately untouched. It needs judgement, repeatedly.

## Bugs worth remembering

**`length2` counted its own scale twice** — it divided by 256 before squaring
and then applied the *fixed-point* square root, so it returned about 256× too
much. The speed cap fired on the first tick and the vehicle covered five
metres in fifty seconds.

**The vehicle constants were written as forces and used as accelerations.**
`DRIVE = 7200` is 0.11 m/s². The truck reached walking pace after fifteen
seconds and could not leave its own apron — which then made three rule tests
fail for reasons that had nothing to do with the rules. Units are now stated
in the source.

**Three test fixtures were wrong, not the rules.** A truck braking from 15 m/s
coasts seven metres further and is paid for that ground, correctly. A truck
driven straight through a battle for two and a half minutes is destroyed long
before its block closes, correctly. Throttle against brake cancels with the
brake winning, correctly. Each time the temptation was to change the rule.

## Stage 2 — done

`packages/protocol`: canonical encoding, tagged hashing, census, sortition,
payout, contracts. Six vector files under `test-vectors/protocol/`, each
carrying what it demonstrates and the rule behind it rather than a reference
to this code — the stage-2 criterion is that a second implementation could be
written from them alone.

The payout reproduces specification §18A.6 to the millisatoshi: pool
2,500,000 msat, 75 qualifiers, 19 paying ranks, `sum(payouts)` equal to
`sum(activated stakes)`.

**Three places where the obvious version is wrong**, each with its reason in
the source because each looks right:

- Census entries sort by `(txid, vout)`, not by `H(pubkey)`. A pubkey can be
  ground until its hash lands where the operator wants; a txid cannot be
  chosen after funding.
- An odd Merkle level **promotes** rather than duplicates. Duplicating is
  CVE-2012-2459: two different leaf sets share a root.
- Selection weight is **linear**. Under square root, four bonds at 1× total
  weight 4 against one at 4× with weight 2 — splitting *doubles* the chances,
  the opposite of the anti-whale intent.

Rank weights are `3^(i-1) * 4^(K-i)` — the geometric curve with r = 3/4
multiplied through so it is an exact integer. Written as `0.75^(i-1)` it
would put float rounding between two nodes' payout tables.

**A portability bug the tests could not find.** `TextEncoder` and
`TextDecoder` are Web APIs, not ECMAScript, so the package failed outright in
all three engine shells. Replaced with a UTF-8 codec the package owns. The
better reason to keep it is strictness: `TextEncoder` silently writes U+FFFD
for an unpaired surrogate, and two implementations disagreeing about whether
a substitution happened is a fork. The codec also refuses overlong forms,
encoded surrogates and out-of-range code points.

`round_id` and the payout table now agree across V8, SpiderMonkey,
JavaScriptCore and Node.

## Suggested next session

1. The Unity bridge, and with it M1 — the first thing that can actually be
   driven.
2. Then the driving feel, with you at the wheel. Everything else is ready for
   it.
