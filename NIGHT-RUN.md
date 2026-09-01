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

Plain float arithmetic is fine — two million iterations of a chaotic
integration using only `+ - * /` are bit-identical everywhere. So WASM's
advantage is real and narrow: it compiles its own libm in.

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

- **The second architecture.** The acceptance asks for four engines × two
  architectures. This machine is arm64 only. x86-64 remains unproven.
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

## Suggested next session

1. The Unity bridge, and with it M1 — the first thing that can actually be
   driven.
2. Then the driving feel, with you at the wheel. Everything else is ready for
   it.
