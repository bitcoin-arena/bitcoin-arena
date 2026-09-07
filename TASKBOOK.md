# Task book

Measurements, comments, done tests, letter notes.
Not the status board. Status lives in PRIORITIES.md.

Date convention: when a number is measured, write it here with the commit.

M1.a16 2026-09-07 playable hunt. Heat-zero recordings unchanged. Full-heat
factors were 1.4 / 2.5 / 0.6 (tanks noticed at 81.6 m on an 85 m half-map).
Now 0.3 / 0.5 / 0.3: notice 44.2 m, outrank 1.5x, shell x1.3. Parked at
z=-70 lasts the 90 s cap; at the line a full load 14.7 s vs empty 16.7 s.
Rail courier, full heat. First pass 40+40: seam 32.5% / rim 72.5%. Then 300:
seam 44/150 = 29.3%. Tuned HEAT_SHELL 0.3 → 0.22. Confirm 300: seam 55/150
= 36.7% delivered, rim 105/150 = 70%. Target 30-40% committed: hit.
Spectate HUD: DriveHud returns after the price+percent when SpectatorCamera.Active.

Score far from the front (Daniel 12:13): frontWeight quadratic, 0 at 40 m
off the seam. 150+150 rail full heat: seam mean 629 (543-758), rim mean 4
(0-16). Golden vectors regenerated with the rule.

THE TWELVE RED TESTS, ONE LINE EACH. Named at f103f71, counted again at
5c81a7a and again at 747dcaf - the same twelve, in suites that have grown
since: PlayMode 213 / 189 green / 11 red / 13 skipped, EditMode 161 / 157
green / 1 red / 3 skipped. Not one is on the deploy path: eleven reach for
the C# army that (e) does not build, and the twelfth needs a graphics device
this machine has not got. None can go green here, and none may be loosened.

    EditMode   1 of 161 red
      CombatFxTests.RifleFireProducesAFlashAndATracer
        builds `new Army(3)` and steps the RETIRED C# army for 20 s. Its
        sibling TankFireProducesABlast has the same shape and passes, so it
        is the C# rifle path, not the harness. Depends on: reviving the C#
        army, which is forbidden.

    PlayMode  11 of 213 red, 13 skipped
      VehicleTests.BothArmiesAreOnTheFieldAndOnTheGround   "keine Armeen"
      VehicleTests.ArmourBlocksTheTruck                    null armour
      VehicleTests.TheTruckCanDriveOnAfterHittingTheArmy   null armour
      VehicleTests.UnitsDoNotShoveEachOtherWithPhysics     "kein Panzerrumpf"
      VehicleTests.ArmiesFightNearTheSeamRatherThanWanderingOff
                                        NRE at VehicleTests.cs:442, field.Army
      FeatureTests.DamageIsFeltInTheDriving
                                        NRE at FeatureTests.cs:168, field.Army
      TruckHealthTests.CrashingIntoArmourWritesItOff       no armour to hit
      VisibilityTests.ArmiesAreActuallyDrawn               "keine Armee"
      ImportedModelTests.SoldiersStandOnTheGroundAndAreAnimated   0 soldiers
      ImportedModelTests.TanksStandOnTheGroundRatherThanInIt      0 hulls
        All ten: they read `Battlefield.Army`, which (e) does not build, does
        not step and does not draw, and there is no core in the Editor to put
        in its place - `BlwpCore` is stubbed outside UNITY_WEBGL. Depends on:
        the same forbidden revival.
      VisibilityTests.RoadsAreActuallyDrawn
        `RenderTexture.Create failed` under -batchmode -nographics. Tried:
        without -nographics Unity does not start, "Error opening default X
        display", and there is no Xvfb here. Depends on: a graphics device.
        The claim itself is photographed in every browser run.

    Rotating twelfth, one of THREE - and since 2026-09-07 10:50 sometimes TWO
    of them in one run, which the earlier note said never happened. Measured
    over four full runs that afternoon: two, two, none, one:
      PostOfficeTests.TheGogglesAnimate
      RampReadyTests.TheRealTransactionsReplaceTheStandInsWhileNothingIsLoaded
      ScoreTests.IdlingEarnsNothingEvenOnTheSeam        (new 2026-09-07)
        item 1's load flake; which one appears changes between runs of the
        same tree. All three are green when run alone - measured today:
        `ScoreTests;PostOfficeTests` on their own, 15 of 15 green. Depends on:
        the suite's own load, not on any code here. The load went up twice
        today: WheelSeatingTests added four more worlds to build, and a8 added
        a fourth WebSocket to every PlayMode world.

Everything for M2 and beyond is further down, under "The milestones", and
none of it should be started while item 2 is open. M2 needs stage 3
(`blwp-node`) before it can begin at all, and starting a lobby on top of
a simulation that still disagrees with the game is work built on sand.

**Governance code is tested to 100%, and it is the only thing here that
is.** Everything to do with voting, consensus and forks - proposals, the
tally, thresholds, turnout, schedules, bond re-affirmation, the fork
certificate chain - must have full branch coverage before it ships, with
the adversarial cases written as tests and not as comments.

The reason it is singled out: **a governance bug cannot be fixed by
shipping a fix.** A wrong tally that activates a config is not a crash you
patch and redeploy - the network has already moved, the change is live,
and the mechanism you would use to undo it is the one that just proved it
does not work. Every other bug in this repo costs a session. A miscounted
threshold costs the network. Details in M3.1B.

The rule that has cost the most time here, written down so it is not
learned a fourth time: **when a number does not move across several
attempts, stop forming hypotheses and print what the code is actually
holding.** The whitepaper sat at exactly 22% through four changes; one
Debug.Log showed Fit had been given a 9.4 x 12.2 plate while the test
measured 73.8 x 52.3, because the streamed building swaps the mesh under
a node that keeps its name. Four rounds of guessing, one line to see it.

---

## 1. Clear the red tests  -  M1  -  DONE

165 green, one known flake left (`TheGogglesAnimate`, which passes alone
and depends on a network fetch inside a two-second animation window).

Both failures were mine and neither was where I first looked. Dumping
what was on the wall settled it in one run: the band was fully populated
with English ages and correct heights - the test was reading the caption
STRIP, which I had deliberately blanked when the number moved onto the
face of the block. The claim it makes is unchanged; only the place the
number is written moved, so the test now reads the face.

The other was the streamed building swapping meshes under nodes that keep
their names, so any plate size read at wiring time can describe something
that no longer exists. Every display is re-fitted against the mesh that
is there now.

## 2. The army into the core  -  M1  -  DONE

The last thing standing between here and M1.

The core RECEIVES the army today: Unity simulates it and sends x, z and
kind every tick, which is why danger, collision and score are correct.
M1 asks for enemies that come FROM the core.

`PhysxReferenceTests` is the pattern and `ArmyReferenceTests` is the
recording: test/vectors/csharp-army.json.

  a. Movement and squads - DONE. Armour closes at 6.8 m/s, infantry at
     2.6, armour arriving first, both within a third of a metre of the
     recording at five seconds. Units hold a squad post rather than
     wandering; free wandering spread them from 57 m to 87 m of standard
     deviation where the C# army holds 36-45, and two armies that drift
     apart sideways simply stop meeting.

  b. Firing and death - DONE. The gap that looked like a firing fault was
     the reference: the C# army REPLACES its dead. Measured, both sides,
     same seed, replacement switched off (`passes` in csharp-army.json) -
     the C# army collapses exactly as the core does. See "What the
     reference was actually saying" below.

  c. Retreat - IN. Back off inside 24 m, fall right back when overrun by
     14 (Army.OverrunDepth), held to |x| < 88.

  d. Reinforcement - DONE. Replacement was not a garnish on the army; it
     is what holds the front up. Without it the first exchange decided
     the round and the survivors stood still for the remaining sixty
     seconds; with it both armies are still fighting at t=90 on every
     seed. Numbers under "Reinforcement, and what it cost the golden
     vectors" below.
     Gunships and bombs - DONE. Sorties, gunships, ballistic bombs and
     the blast are in `rules/air.js`, and the core's air war replays
     from the seed, which the C# one cannot. Fifteen of the recording's
     seventeen published quantities overlap; the two that do not are
     both the GROUND line's doing and are named under "The air arm"
     below.
  e. Delete the C# army; Unity renders from core state only - DONE.
     The C# army is not built, not stepped and not drawn. Position,
     damage, enemies and delivery all come FROM the core, each with a named
     reader, and the picture was proved in a browser rather than argued.
     What is left over is presentation and has its own lines: item 7
     (CombatFx and the combat audio) and (r) the turret.

     ITEM 7, THE COMBAT HALF - DONE. `CombatFx` was never dead: measured in
     the player build it ticks every frame with `army=null` and drew
     `pieces=0` for a whole drive, while `GameAudio` was asked for
     `combat=0` sounds. All five things it drew - `Shot`, `Fired`,
     `Killed`, `Destroyed`, `Bombed` - hung on a C# army that is never
     built.

     The core raises no events either, and does not have to. Each of the
     five is a transition in the buffer Unity already polls, and the core
     steps once per Unity frame so none is missed:

       a tank fired      `U_TARGET`, the armour's reload counter, rises -
                         it only counts down otherwise
       a rifleman fired  `U_COOLDOWN` rises to 150 or more; the reload band
                         is 150-269 and the "looked, found nobody" band is
                         24-65, so a look draws no flash
       somebody hit      `U_HP` fell while still alive
       somebody died     `U_STATE` went 1 to 0
       a bomb went off   `B_STATE` went 1 to 0

     Nothing here decides anything: no roll, no damage, no range test that
     costs anyone. The tracer's end is picked by re-running `pickTarget` /
     `pickRifleTarget`'s own rule - nearest enemy of the same arm inside
     46 m and 26 m - on the core's own state, and a slot that changed
     alive-state this frame is skipped so a spawn's staggered reload cannot
     read as a shot.

     Measured in the player build, one drive, before against after:

       pieces drawn      0 for the whole drive   ->  peak 65 at once
       shots seen        -                       ->  160
       hits seen         -                       ->  48
       deaths seen       -                       ->  16
       combat sounds     0                       ->  233

     AND THE ENGINE NOTE. It read `_body.linearVelocity`, which is 0 for
     good while the core drives a kinematic body - measured `kinematic=True,
     linearVelocity=0.00` at speed, so the revs followed the throttle alone.
     It reads `BlwpCore.TruckSpeed` now: at the fastest sample
     `coreSpeed=23.54, physxSpeed=0.00, rpm=1.00`, and at the end
     `coreSpeed=2.77, rpm=0.11`.

     AND THE ROTORS, which were the last thing item 7 names.
     `GameAudio.Rotors` had NO caller anywhere: the gunships crossed the
     field from core state with their rotors turning, in silence. It wants
     the nearest one each frame or nothing, so `PlaceAircraft` - already
     walking the living helicopters - now measures them against the truck's
     own position and hands over the nearest. Measured in the player build:
     176 calls where there had been none, 134 of them carrying a
     helicopter, and the rotor track reaching 0.240 while one is up against
     0.002 when the sky is clear. The combat sounds and the drawn pieces
     did not fall back - 143 and a peak of 58.

     AND THE TWO PATHS WERE LAID SIDE BY SIDE, effect by effect, rather
     than trusted. `Bind` and the core-driven poll did NOT draw the same
     thing - the new one was quietly smaller in three places:

       tank shot     Bind: flash 1.6, tracer 0.3/0.16, Blast(impact, 4.5)
                     was:  flash 0.9, tracer 0.14/0.06, no blast at all
       corpse        Bind: Body at Ground + 0.9 when there is no body model
                     was:  Body at Ground, a proxy box sunk into the floor
       bomb          Bind: flipbook, else 9 fireballs; then smoke, 22 sparks
                           and debris, and a shockwave
                     was:  flipbook, else ONE fireball, and nothing after it

     Fixed by giving each effect ONE copy and two callers -
     `DrawRifleShot`, `DrawTankShot`, `DrawCorpse`, `DrawBombBurst` - so the
     retired army's events and the core's transitions cannot drift apart
     again. Two callers copying one effect is how they drifted in the first
     place.

     ITEM 7 IS DONE. Player build, one drive, before against after: pieces
     drawn 0 -> peak 65, shots 0 -> 160, hits 48, deaths 16, combat sounds
     0 -> 233, rotor calls 0 -> 176, and the engine note off
     `coreSpeed 23.54` where PhysX read 0.00. Core 54/54, guard 19 files
     clean, EditMode 124/123/1, PlayMode 175/154/11/10 - the twelve reds
     all still listed with their reason and dependency, none loosened.
     NOT DEPLOYABLE, and the reason has changed: it is no longer that
     nothing is drawn or heard, it is that the suites are not green.
     Nothing goes to btc-logistics-war.pages.dev.

     What was left over has no combat in it and is on lines (t) to (w),
     not carried here.

     `CombatFxTests.RifleFireProducesAFlashAndATracer` stays red for its
     own reason and it is not this one: it drives the RETIRED C# army
     through `Bind` with `Populate(0, 20)`, and that path raises no `Shot`.
     It tests the engine this letter did not revive.

     BOTH ENGINES COMPARED AGAIN AFTER THE CUTOVER, because the last one
     predates `Separate`, the x-chase, the crash rule, condition-to-driving
     and the layout fix - and that fix mattered most: `S_PRACTICE` had been
     aliasing `O_UNITS`, i.e. the x of the first unit. Eight seeds, air
     pinned through `O_AIR`, against `passes.core-size-reinforce`:

       t          armour x-spread          recording   inside?
       15s        [25.1, 48.6] mean 34.5      39.0       yes
       30s        [26.4, 44.5] mean 38.0      38.9       yes
       60s        [33.9, 51.1] mean 40.0      38.8       yes
       90s        [34.2, 48.5] mean 42.9      34.8       yes

       t          enemies within 46 m        recording   inside?   alive
       15s        [3.55, 7.27] mean 5.06       3.91       yes      19-24 / 22
       30s        [1.10, 3.05] mean 1.99       2.84       yes      19-21 / 19
       60s        [0.50, 3.24] mean 1.64       2.70       yes      19-21 / 20
       90s        [1.24, 2.20] mean 1.74       1.70       yes      18-21 / 20

     Churn holds too: lost/arrived 57/52 against 59/55. A single-seed run
     with the air ON read 29.7 and 26.7 for the early x-spread and looked
     like a divergence; it was not a pair, which is the same trap this item
     has set all along.

     TWO MORE HOLES, FOUND BY PLAYING A SECOND ROUND. Everything above is
     about one round. A session has more than one, and the second one was
     broken in two separate ways - neither visible to any suite, both
     measured in a browser.

     1. THE CORE NEVER STARTED A SECOND ROUND. `outcome` latches: once a
        run leaves RUN_LIVE nothing brings it back, and only `init` does.
        `BlwpCore.Init` ran once, in `Start`. All three endings - delivered,
        written off, block missed - go through `TruckController.Respawn`,
        which calls `teleport`, and `teleport` moves the truck and clears
        its momentum and touches no score word. Round two against a fresh
        `init(0x5eed1234)`, same words, read out of the browser:

          S_STATE      0    ->  1          Armee lebend  96 -> 91
          S_EXPOSURE   0    ->  214.5      Armee tot      0 ->  5
          S_ELAPSED    0    ->  0.020      Nachschub  [0,0] -> [89640, 48144]
          S_BESTX   -100.4  ->  114.1      Luft       [0,0] -> [581454, 525784]
          S_DELIVERED  0    ->  1050       T_X     -100.400 -> -100.337
          S_PRACTICE   0    ->  1          tick        0    -> 1440

        Twelve of thirty words. `S_STATE` alone withholds damage, danger,
        delivery and score, all of which are gated on RUN_LIVE - so round
        two was unplayable and looked normal. Fixed by `restart` IN THE
        CORE, reached at roll-out (`LoadoutPanel.Confirm`) because the score
        card is read out of the core after a run ends. The uploaded relief
        and solids are round SETUP and are carried across. After the fix,
        round two at tick 40 is word-identical to a local `init(seed)`
        stepped 40 idle ticks - all four RNG words and both sortie clocks
        included.

     2. THE GATE BANKED A LEVEL, NOT AN EDGE. `RunState == RUN_DELIVERED`
        stays true after the arrival, so `DeliveryGate` re-banked the same
        run on the first frame the bed held anything. Instrumented: AUTO
        took 8 parcels, fill 0.86, loaded True - and the next frame showed
        0 parcels, NOTHING LOADED, the truck back in the bay and the camera
        flying the arrival again. The player could load but never roll out,
        so the reset in (1) could not be reached at all. The gate now banks
        the transition into delivered and waits for the core to be live.

     ROUND TWO, MEASURED AFTER BOTH FIXES. Live fire, `?practice=0`:
     starts at tick 16, x -100.40, z 10.20 - the core's own START, not a
     leftover pose - S_STATE 0, condition 100.0, danger 0.0, 96 alive and
     96 drawn. Drives to x -18.4, danger 68.7, condition 100.0 -> 0.0,
     S_STATE 2. Drawn equals alive at every sample of both rounds. Unity's
     own debug overlay in round two reads `core DRIVING · tick 640 ·
     speed 3.2 m/s · pos -16.0, 4.1 · practice off`, and the card shows
     BANKED 1,050 from one delivery rather than a loop.

     AND THE LAST C# VETO IS GONE. `TruckHealth.WriteOff` returned early on
     `IsInvulnerable`, so C# could refuse a write-off the core had already
     made. Measured twice with the same injection - run 0 -> 2 and `T_HP`
     100 -> 0 forced in the core, nothing else touched:

       before   road: WASTED, truck burning     apron, bay open: intact, run continues
       after    road: WASTED, truck burning     apron, bay open: WASTED, truck burning

     Removing it needed the same lesson the delivery gate had just learned:
     RUN_WRECKED latches, and `IsDestroyed` is the BURN TIMER rather than
     the condition, so a level read would have exploded the truck again
     every time the respawn cleared the timer. `ApplySnapshot` now applies
     the core's verdict once per write-off and clears on the core going
     live, which happens only in `restart`.

     Two more PhysX-era lines went with it: the respawn handed the body back
     to PhysX (`isKinematic = false`) although the core drives and writes the
     transform, so after the first write-off the truck was a dynamic body
     being teleported sixty times a second for the rest of the session.

     Driven, not injected: standing in the fire took the truck 100.0 -> 57.6
     and stalled - the men shooting it get shot themselves - so the
     condition was shortened to 8 and the CORE's own fire finished it:
     8.0 -> 0.5 -> 0.0, S_STATE 2 at tick 672, x -46.8, WASTED on screen.
     The round after it started clean at tick 8, x -100.40, S_STATE 0,
     condition 100.0, and ran to a delivery. Three live-fire rounds in one
     session: delivered at 83.0 / 87.9 / 93.4 condition, drawn equal to
     alive in all 173 samples, three resets.

     The three tests that pinned the veto were re-pointed, not loosened.
     What they were named for - choosing freight is not a way to die - is
     asserted in `packages/core` now, where damage lives.

     THE BODY AFTER A WRECK, MEASURED RATHER THAN INFERRED. The round after
     a write-off running to a delivery does not answer it: the core writes
     the transform every frame, so a body PhysX had taken back would sag and
     jitter between writes rather than drive away, and the debug overlay
     prints `BlwpCore.TruckPosition`, so it agrees with the core by
     construction. So the TRANSFORM was printed beside the core's own x in
     the same frame, with the flag:

       vor dem Wrack, ganze Runde     groesster Abstand 0.000 m   kinematic True
       waehrend des Brennens          -16.933 / -15.486 / -9.127 / -6.955,
                                      Transform gleich auf 3 Stellen, kinematic True
       nach dem Respawn               -100.400 -> -100.400        kinematic True
       Runde danach, ganze Runde      groesster Abstand 0.000 m   kinematic True

     Height at matched core x, before against after: 0.529 / 0.497 / 0.015 /
     0.057 m - the two large ones are sampled 1.1 m and 1.7 m apart in x on
     a slope and the residual tracks that gap, so it is ground rather than
     sag. No PhysX leak.

     TWO MORE READERS OF THE SAME SHAPE, CLOSED.

     `DeliveryGate` read `health.IsDestroyed` as a LEVEL in front of the
     core's verdict, so a C# flag could swallow a delivery the core had
     made. It could not fire in sequence - a burning truck carries no
     freight - but it is the shape this letter has now removed three times.
     It has moved into the fallback, where there is no core to ask.

     `RUN_MISSED` had no reader at all. `Bootstrap` wired
     `clock.BlockClosed` straight to `MissTheBlock`, so the third outcome
     was a Unity stopwatch. The two clocks do not measure the same thing:
     the core counts 9000 ticks from ROLL-OUT, `BlockClock` closes on wall
     time for everybody at once, so a run starting ten seconds before the
     block closes has missed it in C# and has 140 s left in the core.
     Measured: with the core's own clock wound to 8900 and the core left to
     decide, S_STATE went to 3 at exactly S_ELAPSED 9000, the card read
     BLOCK MINED WITHOUT YOU and the bed was thrown away - while the Unity
     block clock still showed 2:17 left. The next round then ran to a
     delivery. The decision is read; `MissTheBlock` was not rebuilt.

     Worth writing down while measuring it: the core is stepped once per
     Unity FRAME. In this headless browser that is about twelve ticks a
     second, so BLOCK_TICKS - "150 s at 60 Hz" - was twelve minutes of wall
     clock here. Determinism is unharmed, the tick stream is the input
     stream, but a round's LENGTH IN SECONDS depends on the frame rate of
     the machine playing it. Not this letter's to fix; listed.

     2e IS CLOSED. The C# army is dead, the picture and the enemies come
     from the core, and every one of M1's four quantities has a named core
     reader with no C# gate in front of it: position `CoreDrivenTruck`,
     damage and the write-off `TruckHealth.ApplySnapshot`, enemies
     `ArmyRenderer` over `Layout.UNITS`, delivery and the missed block
     `DeliveryGate` on the core's own run state. Deployable is still NO,
     because nothing draws or sounds a shot - that is item 7.

     BOTH ENGINES COMPARED AGAIN ON THE CLOSING TREE, because everything
     above is one round and the last army comparison predates `restart`,
     the delivery edge, the write-off and the missed block. `rules/` and
     `test-vectors/` are untouched since then and the golden vectors are
     green, so the stepping is byte-identical to the recording's core - but
     that is a reading, so it was measured. `measure-army.js` now has a real
     `--airoff` (the sortie clocks pinned through `O_AIR`, the way the state
     actually holds them) instead of only being able to load a pre-air core
     and call the difference "the air". Eight seeds, seam0:

       t          Panzer-x-Streuung        Aufz.   drin?
       15s        [25.5, 39.9] Ø 32.3       39.0    ja
       30s        [31.6, 42.1] Ø 38.1       38.9    ja
       60s        [29.2, 52.7] Ø 42.1       38.8    ja
       90s        [33.9, 49.6] Ø 40.0       34.8    ja

       t          Feinde in 46 m           Aufz.   drin?   lebend Core / Aufz.
       15s        [3.89, 6.67] Ø 4.74       3.91    ja      [18, 23] / 22
       30s        [1.70, 4.00] Ø 2.60       2.84    ja      [19, 21] / 19
       60s        [1.58, 4.10] Ø 2.48       2.70    ja      [19, 21] / 20
       90s        [1.58, 3.11] Ø 2.46       1.70    ja      [18, 21] / 20

     Churn at t=90: lost [57, 62] mean 59.1, arrived [51, 57] mean 54.6
     against the recording's 59/55 - both inside. Score, separately: 7 of 7
     routes identical, 58342 of 58344 combinations agree, worst gap 1 point.

     AND A SWEEP OF THE PLAYER PATH: no `new Army(` anywhere, `Army.Update`
     has no caller, the C# army is never built.

     THREE PRESENTATION READERS ARE FED BY A DEAD PHYSX VALUE. Not outcomes,
     so not 2e, but a measured consequence of the cutover and not to be left
     silent: the truck's body is kinematic in every sample, so
     `_rb.linearVelocity` is 0 for good, and

       GameAudio.cs:91    revs follow `_body.linearVelocity` - the engine note
                          now rises with the throttle alone, never with road
                          speed
       GameAudio.cs:105   the skid needs `truck.Slip`, which is 0
       ChaseCamera.cs:296 FIXED - the camera's lead was
                          `targetBody.linearVelocity`, so it always took the
                          "below walking pace" branch and never led the
                          truck. Now `BlwpCore.Velocity`. See (u).
       DriveHud.cs:1082   FIXED - the diagnostics panel printed Tempo and
                          Drift off the same body. Now the core. See (v).
                          The MAIN readout was always fine, it reads
                          `BlwpCore.TruckSpeed`

     The core already publishes what all four want: `BlwpCore.TruckSpeed`.
     One-line source swaps, and they belong with item 7, which owns the
     sound and the effects.

     NEW ITEM, NOT PART OF 2e - THE CARGO NEVER REACHES THE CORE. Found
     while answering whether `RunScore` filters a core quantity. It does
     not: `Exposure` and `Projected` read the core unconditionally. But the
     breakdown card does not add up, and the reason is worse than the card.
     One delivery, read both sides:

       card   load 0.86  x  danger 1.00  x  speed 1.50  x  1000   SCORE +1,050
       core   E 1.001                      T 3900/817 ticks clamped = 1.500

     Danger and the time factor agree. But 0.86 x 1.00 x 1.50 x 1000 is
     1290, and the score banked is 1050 - which is 0.70 x 1.00 x 1.50 x
     1000. `S_CARGO` and `T_CARGO` are written once, in `sim.js:248/250`,
     to 45875 - 0.7 of a bed - and NOTHING ever writes them again. There is
     no cargo call in the jslib or in `BlwpCore`. So what the player loads
     reaches neither the score (`sim.js:1056`) nor the danger
     (`sim.js:1045`): every run is priced as a 70% bed, and the card prints
     the C# bed fill beside a number that ignored it.

     This is a MISSING HOST-TO-CORE INPUT, not a veto - which is why it is
     not 2e - but it changes what a run pays, so it is not cosmetic either.
     Both halves are needed: a call that hands the bed to the core, and the
     card then reading the core's cargo rather than `bay.Fill`. Also
     related: the time factor agreed only because both sides were sitting
     on the 1.5 clamp; a run slower than 65 s would be needed to tell them
     apart, and that has not been measured.

     ALSO LISTED WHILE MEASURING: the core is stepped once per Unity frame,
     so a round's length in SECONDS follows the frame rate. Twelve ticks a
     second in a headless browser made BLOCK_TICKS - "150 s at 60 Hz" -
     twelve minutes of wall clock. Determinism is untouched, the tick
     stream is the input stream, but the clock the player feels is not the
     clock the rule was written against.

     WHO OWNS THE SCREEN, read off the player path and not off a test:
     the picture is C#. `ArmyRenderer` holds a `public Army army` and walks
     `army.Armour` and its soldier lists; it names `BlwpCore` nowhere.
     `BlwpCore.UnitAt(i)` exists and has NO caller - the only readers of
     `BlwpCore.State` are `CoreDrivenTruck` for the truck's transform and
     `DriveHud` for a diagnostics panel. And `Battlefield.Update` calls
     `Army.Update(dt)` unconditionally whenever `Army != null`, with no
     gate on whether the core is driving.

     So two armies run and neither can see the other. Since `c6cc689` took
     `UploadArmour` out, the C# army feeds the core nothing at all: the
     player watches an army that decides no outcome, while the truck is
     shot at and blocked by an army nobody draws. The cutover is therefore
     RENDERER PLUS OFF-SWITCH - point `ArmyRenderer` at core state and stop
     stepping `Army` - and not a rules port.

     WHAT IS STILL MISSING FROM THE DRAWN ARMY, each with its own number
     and split by whether it moves an outcome:
       - `Army.Wrecks` / `AvoidWrecks` - OUTCOME, and large. 54 tank
         wrecks in ninety seconds, with 4.67 living units per tick standing
         within 3 m of one. Every one of those would be pushed out.
       - The halt and pace per man - OUTCOME, and this corrects an earlier
         reading of mine that called them texture. Infantry z-spread,
         core against the recording: 1.04 / 1.04 / 33.41 / 25.36 against
         4.33 / 11.66 / 14.22 / 20.55 at 15 / 30 / 60 / 90 s. The core
         marches in lockstep for the first half-minute and over-spreads
         later. Spread decides who is inside a 16 m blast.
       - Facing - RENDER. Nothing in the core reads a heading for an
         outcome, though it is in the state hash and so is protocol.
       - The apron protection - NOTHING. A truck parked in the bay takes
         zero damage over thirty seconds on three seeds; the army never
         reaches it. `IsInvulnerable` guards against something the core
         does not do.
     Left alone as instructed: the army reading `T_HP`, and the Heat
     scaling.

     CARRIES A FINDING FROM (j) - CLOSED. Truck health had two owners; it
     has one now, the core, since `d7a3002`.

     THE CUTOVER, IN NAMED STEPS. Not started; this is the plan.

       1. The mirror must be able to describe a unit. `UNITS` (96) lives in
          `sim.js` and `ARMOUR_MASK` (3) is private there, and
          `BlwpLayout.cs` is generated from `state.js` - so neither
          reaches C#. A drawer would iterate `MAX_UNITS` 256 and hand-copy
          the kind rule, which is the drift the generator exists to
          prevent. Move both into `state.js`, regenerate the mirror, and
          add accessors beside `UnitPosition`/`UnitHealth`: `UnitSide`,
          `UnitAlive` (`U_STATE != 0`), `UnitIsArmour` (`(i & ARMOUR_MASK)
          == 0`), `UnitHeading` (`U_HEADING` is mirrored already). Facing
          is bound here because the hash already carries it.
       2. DONE, with 3, because they cannot be separated without a broken
          build. `Battlefield.Update` no longer feeds Flow, Courier or Heat
          and no longer calls `Army.Update`; `Battlefield.LaunchSorties` is
          gone with it, the core running its own on the same schedule.
          `Bootstrap` builds and populates no army, binds none to CombatFx,
          and hangs no audio off its events. `Battlefield.Army` is still
          DECLARED and never assigned - removing it means re-sourcing
          fourteen test methods across four files, which is its own step -
          and nothing in the product reads it.
       3. DONE. `ArmyRenderer` has no `army` field. Units come from
          `UnitPosition`, `UnitSide`, `UnitAlive`, `UnitIsArmour` and
          `UnitHeading` over `Layout.UNITS`; gunships from `HeliAlive`,
          `HeliSide`, `HeliDir`, `HeliPosition`; bombs from `BombAlive`,
          `BombPosition`, `BombVelocity`. `DriveHud`'s counts read the core
          too. NOT BUILT, and named rather than discovered later: the
          turret follows the hull, helicopter yaw and bank are derived from
          `H_DIR` in the renderer, a man is one size and always walking -
          height and the halt are (q) - and the bob comes off the tick.

          THE PRICE, in reds. PlayMode 176 / 151 / 15 / 10, up from four
          reds, and none of them softened:
            no core in the editor, so nothing is drawn to look at -
              ImportedModelTests.SoldiersStandOnTheGroundAndAreAnimated,
              ImportedModelTests.TanksStandOnTheGroundRatherThanInIt,
              VisibilityTests.ArmiesAreActuallyDrawn,
              VehicleTests.BothArmiesAreOnTheFieldAndOnTheGround,
              VehicleTests.ArmiesFightNearTheSeamRatherThanWanderingOff,
              VehicleTests.ArmourBlocksTheTruck,
              VehicleTests.TheTruckCanDriveOnAfterHittingTheArmy,
              VehicleTests.UnitsDoNotShoveEachOtherWithPhysics
            `field.Army` is null - RESOLVED. Three were re-sourced and are
              green: `TheTruckIsProtectedOnTheApron` needed no army to say a
              protected truck refuses to be written off - AND THAT SENTENCE
              IS NOW WRONG. The refusal WAS the veto. The test is
              `TheApronDoesNotOverruleTheCore` and asserts the opposite: a
              write-off the core has made is shown, apron or not. The two
              FeatureTests keep the half of their claim that still has a
              subject, the BAY's own heat. The army half is core gap 5.
              `TheArmiesLeaveAWreckAlone` is REMOVED - it asserted the C#
              army stops shooting a burning van and the core has no such
              rule, so there was nothing to move it to. Core gap 3.
            already listed - DamageIsFeltInTheDriving,
              CrashingIntoArmourWritesItOff, RoadsAreActuallyDrawn
          Two new tests are green: the player path runs no C# army, and the
          drawer has no `Army` field to read from. Both assert WIRING; the
          picture is a browser run against a WebGL build and nothing else.
       4. `CombatFx.army` at :22 is NOT this brief. It lives on `Fired`,
          `Shot`, `Killed` and `Destroyed`, which the core raises nowhere,
          so the cutover leaves it without a source. That is item 7's
          point and it is the PRICE of this step, stated rather than
          hidden: no muzzle flashes, no tracers, no corpses until the core
          reports its shots.
       5. VERIFIED AFTER THE CUTOVER, because it would have been expensive
          to find out later: the three reference recorders still run and
          still reproduce the stored recordings to the digit -
          `MeasureTheArmy`, `MeasureTheInfantry`, `MeasureTheGunships`,
          3 of 3 green, and every field that existed before came back
          unchanged in all 19 `core-size-reinforce` rows and all 18 courier
          rows. They build their own `Army`, so `Bootstrap` no longer doing
          it costs them nothing. The tape is reachable and what the C#
          army DOES is untouched; only who builds, ticks and draws it
          changed.

          `Army.cs` is NOT deleted here. It stops being built and stops
          being ticked in the player scene, and survives as the reference
          recorders' subject - every C# number the project will ever want
          has to be on tape before the file goes.
       6. Tests, counted separately. New: a PlayMode test that the player
          path does not tick the C# army, and one that the drawer places a
          transform where the core says a unit is. The second can only
          assert the WIRING - PlayMode has no core - so the picture itself
          is a WebGL check and nothing else.
       7. Done, in a sentence a player can see: the tanks and men on
          screen are the ones that shoot the truck, and driving into a
          tank you can see stops you.
       9. THE OWNERSHIP AUDIT, and it found two C# owners left. Both are
          closed.

          DELIVERY was decided twice. The core has
          `arrived(x, z) => x >= GATE_X && |z| <= HALF_MOUTH` and sets
          `RUN_DELIVERED`, and `DeliveryGate` ran the same test again in C#
          off the truck's transform. `RUN_DELIVERED` had NO reader at all -
          only `RunState == 2` was ever looked at, for the wreck. The gate
          now takes the core's verdict when a core is answering and keeps
          its geometry only for the editor, where `BlwpCore` is stubbed.
          Proved in the browser: with the truck at x = -96.9 m, 211 m short
          of the gate, setting `S_STATE` to 1 in the core's buffer and
          nothing else banked the run - "DELIVERED 5,926 sat to the
          miners", 1 run.

          THE DANGER was computed twice. `RunScore.Exposure` already read
          the core, but `Rate` - the meter on screen - called `RateNow`,
          which walks `army.Armour` and `army.Infantry`; with no C# army
          left it fell through to a geometry fallback, so the player was
          shown a different danger from the one the round settles on. The
          core integrates `exposure += rate * gained`, so the rate is read
          back as exposure gained per metre of new ground rather than
          recomputed.

          Clean after the audit: no `Army.Update` anywhere, no `new Army(`
          in the product, no `RunOver`/`ClearPath` caller, no
          `Rigidbody.linearVelocity` deciding anything, and `Projected`
          already on the core.

       8. DONE - THE BROWSER RAN, AND IT FOUND THE THING NO EDITOR TEST
          COULD. `BlwpCore._state` was sized `O_UNITS + MAX_UNITS *
          U_WORDS` = 2073, which is exactly `O_ARMY`: the buffer ended
          where the replacement clocks, the air and the squads begin, 108
          words short of the core's 2181. `Init`'s own guard caught the
          mismatch and refused, so `Available` was FALSE in every browser
          build ever made - the truck fell back to PhysX and nothing of M1
          ran on a screen. `BlwpBridgeTests.TheStateBufferIsTheSizeThe
          LayoutImplies` was green throughout because it asserted the same
          wrong formula; it asserts `Layout.WORDS` now, which is what its
          own name says.

          THE PICTURE, proved by a count and not by pixels. Three
          screenshot comparisons proved nothing: running, 500 ms of
          ordinary motion moved 53019 pixels against the 42094 that killing
          every unit moved, and freezing the core still left 44042 moving,
          because rotors, HUD and camera do not stop. The scene animates
          more than the army does. So `ArmyRenderer` says what it drew, and
          the browser console carries it:

            core alive 96 -> 0 (killed in the core's own buffer from the
            page, simulation frozen first so replacement cannot refill)
            renderer   "drew 96 units from the core" -> "drew 0 units"

          And the screenshots agree once the game is actually STARTED: the
          first pair showed the title screen, because nobody had pressed
          PLAY - the count was still right, `Submit` runs behind the
          splash, but a caption claiming an army was wrong. Played, loaded
          and driven out: red and green tanks with infantry behind them,
          then the same spot with the field empty.

          PLAYMODE 175 / 154 / 11 / 10, EDITMODE 124 / 123 / 1, Core 52/52,
          guard 19 files clean, stage 0 PASS. The eleven:
            no core in the editor, so nothing is drawn to look at (8) -
              ImportedModelTests.SoldiersStandOnTheGroundAndAreAnimated,
              ImportedModelTests.TanksStandOnTheGroundRatherThanInIt,
              VisibilityTests.ArmiesAreActuallyDrawn, and the five
              VehicleTests, which also WRITE to the army and so cannot be
              re-sourced at all
            already listed (2) - DamageIsFeltInTheDriving,
              CrashingIntoArmourWritesItOff
            a graphics device (1) - RoadsAreActuallyDrawn


     STEP 0 DONE - the bridge, measured rather than read.
     `tools/measure-bridge.js` prints all of it.

     Three uploads run in `CoreDrivenTruck.Update()`, and only one of them
     is per-tick host input. `UploadGround` returns early unless
     `terrain.Revision` moved; `UploadSolids` returns unless a second has
     passed AND the box count changed. `UploadArmour` is guarded by
     nothing: every frame, straight out of `field.Army`. And `setUnits`
     has NO caller anywhere - not Unity, not the tools, not the tests - so
     the host branch of the score's danger at `sim.js:881` is dead code
     today and the score already reads the core's own army. That is one of
     the three worries in "What (e) actually has to move" answered: it is
     not a preference to remove, it is a setter to delete.

     The collision is worse than that entry says, and this is the finding.
     It is not that `resolveArmour` PREFERS the host's tanks - it is that
     the core has no armour of its own to give it. Nothing inside `step()`
     ever writes `st.armour`; only `setArmour` and `setUnits` do, and
     neither is called in a headless round. Measured over all six golden
     vectors, `st.armour.n` is 0 at every tick of every one. The core
     simulates twenty-four tanks and the truck can drive through all of
     them.

     And the round really is not replayable today, which was an argument
     and is now a number. Feeding one host tank at the truck's own
     position from t=600 of `straight`:

       no host                      hash 32e819e7...  ends x = +130.0
       host tank on the truck       hash 7d961a75...  ends x = -130.0

     So (e)'s collision work is an ADDITION, not a deletion: `st.armour`
     has to be built inside `step()` from the core's own armour, and only
     then can `setArmour` go. Doing it the other way round removes a
     collision the game currently has.

     STEP 1 - the truck's two owners. Half measurable here, and the half
     that is not is the important half.

     What IS established. The two are not merely separate, they are on
     different SCALES: `TruckHealth.Damage` takes `amount / armour` with
     `armour = 1.5` (`TruckHealth.cs:121`), and the core takes the shell's
     full amount off `T_HP` with no divisor at all (`sim.js:829`). Same
     maxHealth of 100, same hits, and the core spends them half again as
     fast - which is why its truck dies at t=15-20 s in the courier pass.
     And `BlwpCore.TruckHealth` (`BlwpCore.cs:239`) really does have no
     consumer: grepped, the only references in the whole project are the
     two lines of the measurement below. The core's health is a ghost, as
     this entry said.

     What is NOT measurable in this loop, and it is a fact about the
     project rather than about the truck: THERE IS NO CORE IN THE EDITOR.
     `BlwpCore` compiles every call to a stub unless
     `UNITY_WEBGL && !UNITY_EDITOR`, so in the editor, in PlayMode tests
     and in a standalone build `Available` is false and `_state` stays
     zeroed. The measurement was written, run, and came back
     `core=0.00 game=100.00 tick=0` at every one of 120 samples with the
     truck never leaving x = -100.4. Its own guard caught that, which is
     what the guard is for.

     Two consequences worth having in writing. The two owners cannot be
     shown to disagree anywhere but in a browser, so `MeasureTheTwoTruck
     Healths` is `[Explicit]` and waits for a WebGL run. And every PlayMode
     figure this file quotes as a guard - 174/164/2/8 included - is a
     measurement of the C# path, NOT of the core: it can prove the game
     still works, and it can never prove the core does. The core's own
     guard is the 47 node tests and the golden vectors, which is the split
     the class doc calls deliberate.

     STEP 2 DONE - what `RunOver` and `ClearPath` are worth, sized before
     the file that holds them is deleted. `MeasureRunOverAndClearPath`,
     PlayMode, `[Explicit]`. It runs on the C# path deliberately: these are
     C#-only rules and the editor has no core anyway.

     Driving AT the infantry for a round: 18 men run down, the corridor
     holding up to 13 men and 0.92 on average, and never more than ONE man
     inside the 3.6 m kill radius at a sample. `RunOver` is worth about 18
     men - a tenth of the 180 on the map - to a player who aims at them.

     CORRECTED IN STEP 2 OF THE PORT: this entry went on to say that
     `ClearPath` "is what keeps that number as low as 18", easing thirteen
     men out of the corridor. It eases nobody out of anything. Its
     corridor branch never runs - the only call is
     `YieldTo(u, 0f, 0.9f, false, 1.6f)`, `stepsAside` false and `rate`
     zero - so `halfWidth` 7.5 and `ahead` 26 are dead parameters in the
     game they sit in. Why at most one man was ever inside 3.6 m is
     unexplained by that rule and stays unexplained here.

     It took three runs to get a number, and the two failures are the same
     failure this project keeps finding. The first drove with
     `externalThrottle` alone and never moved - `useExternalInput` has to
     be set or the control path ignores it - and reported a tidy zero. The
     second drove the full width of the map at 20 m/s with `corridor` at
     ZERO the whole way, because straight ahead from the bay is z ~ 10 and
     the infantry are not there. Both are null results from a test that
     could not have fired, and neither is evidence that the rule is
     cheap. The measurement now steers at the nearest living rifleman,
     which is the upper bound a port has to cover.

     WHAT THIS MEANS FOR (e). Neither rule can simply go. `RunOver` is a
     tenth of the infantry a round on a route that seeks them; `ClearPath`
     is load-bearing for `RunOver`'s own size and for not leaving a man
     standing in the cab. Both are outcomes the player produces, so both
     have to exist in the core before `Army.cs` goes - which, with the
     collision from step 0, makes THREE core additions that must land
     before the deletion: `st.armour` built in `step()`, run-over, and
     path-clearing.

     THE AUDIT FOUND ONE, AND IT WAS MY OWN DAMAGE. `Army.Update` opens
     with `Separate(Armour[i], Armour[j])` over every pair, before
     anything moves, holding 8.5 m between friends and 7.5 m between
     enemies. The core had no such rule - `Separate` appeared in it only
     in comments explaining that the infantry has none - and nothing
     recorded it, because in C# it is true by construction and a recording
     of a constant is not worth taking.

     It was tolerable until e5dabe8 gave an engaged tank its enemy's x to
     close on. That is what C# does, but C# does it WITH the separation;
     two tanks closing on the same enemy converge on bitwise the same x,
     and with nothing to push them apart they end up occupying one point.
     Found by looking at an actual pair: units 52 and 68, both alive, both
     Bear, x identical to the last bit and 0.018 m apart in z.

       8 seeds, sampled every second        too close  nearest median  closest ever  bitwise x
       before the chase (6398783)              2.16%         3.61 m        0.00 m       0.03%
       chase, no Separate (d1e84ec)            7.25%         0.03 m        0.00 m      10.51%
       chase + Separate (now)                  4.18%         8.22 m        7.46 m       2.01%
       C#, by construction                     0.00%       >= 7.50 m     >= 7.50 m         n/a

     The number that matters is the last-but-one: the closest two tanks in
     eight rounds went from ON TOP OF EACH OTHER to 7.46 m, four
     centimetres inside the 7.5 m the rule allows. The "too close" column
     rising from 2.16% to 4.18% is not a regression and should not be read
     as one: before the chase the armour was spread on a ladder and rarely
     near anything, and now it is packed at about 8 m, so many pairs sit
     just under 8.5 m while NONE overlaps. The bitwise-x residual is the
     same story - the separation runs at the top of a tick and the chase
     re-aligns x at the bottom of it, which is exactly C#'s own ordering.

     Ported with its own units, not with a leftover number: `push` is
     `(min - d) / 2`, a distance, halved with `>> 1` which is exact in
     Q16.16; the normal is dimensionless; and C#'s `d2 <= 1e-4f` is a
     separation of 0.01 m, which is 655. Nothing was scaled to make a
     column match. It is called at the top of the army's step because that
     is where `Army.Update` calls it - a separation applied afterwards
     would resolve last tick's overlap against this tick's positions.
     Alive is `U_STATE` rather than `U_HP`, which is what `reinforce`
     counts and what the crowding scan skips on; C# never has to ask,
     since it removes its dead from `Armour` before this runs.

     The army balance is unmoved: at t = 90 s inRange 2.00 against the
     reference's 1.70, xspread 37.4 against 34.8, alive 19 against 20.
     Vectors regenerated and `dist/` with them, core 47/47, guard 19 files
     clean, node vs bundle-node identical, stage 0 PASS. PlayMode is NOT
     re-run for this and that is deliberate: it only ever exercised the C#
     path, `BlwpCore` is stubbed outside WebGL, and this round moved core
     JS, the vectors and `dist/` - none of which PlayMode can see.

     STEP 3 - the port order, and it is dictated by the measurements
     rather than by taste. Each step is a rule change, so each moves the
     golden vectors and `dist/` with them, and each is its own commit.

       0. DONE ALREADY, because the chase had made it urgent: `Separate`.
          It is listed here so the order reads correctly for anyone
          following it - tank-on-tank spacing had to land before anything
          else touched armour positions.
       1. DONE. `st.armour` inside `step()`, and the host chain out with
          it. `fillArmour` runs at the TOP of the step, before the vehicle
          moves, so it reads the positions the army finished last tick
          with - deliberately the same one-frame staleness Unity had, and
          the thing `resolveArmour`'s own comment relies on. Measured:
          `st.armour.n` was 0 at every tick of every golden vector and is
          now 17-24 in all six. Removed with it, and NO C# FILE WAS
          DELETED - three members were: `setArmour` and `setUnits` from
          `sim.js`, the `setArmour` line from `bundle.js`, `BlwpSetArmour`
          from `blwp.jslib`, `SetArmour` from `BlwpCore.cs`, and
          `UploadArmour` plus its buffer from `CoreDrivenTruck.cs`. The
          dead host branch of the score's danger went too; `setUnits` had
          had no caller anywhere for some time.

          Four core tests moved with it and none was weakened.
          `clearTheField` empties the slots but `reinforce` refills them
          within seconds, which was harmless until the core's own armour
          became solid - so the three fixtures that are about the VEHICLE
          or the SCORE now hold the field clear every tick instead of
          clearing it once. And `armour blocks the truck and infantry does
          not` used to get its obstacle by handing a position list in from
          outside; it now places a real core unit and pins it, which is
          also what finally makes its infantry half a real case instead of
          the note it carried - "infantry is never uploaded, so an empty
          armour list IS the infantry case", which asserted nothing about
          infantry at all.

          Core 47/47, guard 19 files clean, node vs bundle-node identical,
          stage 0 PASS, vectors and `dist/` regenerated. PlayMode 176 /
          163 / 3 / 10 - the two Visibility reds are item 7's baseline and
          `HeatRaisesTheExposureRate` was green on its second run, which is
          item 7's rule. The totals moved from 174/8 because this letter
          added two `[Explicit]` measurements.

       1b. WAS `st.armour` inside `step()`. Today it is 0 at every tick of
          every vector and the truck drives through twenty-four of its own
          tanks. FIRST because it is the only one the game currently gets
          from Unity - porting it is restoring a behaviour, and the two
          after it are new. `setArmour` and `setUnits` go with it, and
          `UploadArmour` with them; that is the per-tick host input gone
          and the round replayable, which is the sentence M1 exists for.
       2. DONE. Path-clearing, and it is a smaller rule than this list
          thought. `ClearPath` looks like a corridor rule and is not: its
          anticipatory branch is never called, so what it does is push a
          rifleman back out to 1.6 m if he is inside it, and nothing else.
          The corridor was NOT ported - porting a branch the old game never
          executes would move an envelope for no reason anybody could
          defend later.

          Measured, 8 seeds, truck driven AT the nearest living rifleman
          for 90 s each - straight ahead is z ~ 10 and meets nobody, which
          is how step 2's first PlayMode run got a tidy zero:

                                    before        after      C# recording
            penetration, total      1773.3 m      0.000 m       0.000 m
            deepest single          1.590 m       0.000 m       0.000 m
            man-ticks over 2 cm     3253          0             0

          The core and the C# game now agree exactly on the quantity this
          rule owns, and they agree at zero. The depth is the honest
          measure and a count is not: the push lands a man ON the 1.6 m
          boundary and fixed point rounds him a hair inside it, so "men
          within 1.6 m" only fell 3340 to 2770 and would have read as a
          rule that half works.

          Placed after the whole army step, which is where `Battlefield`
          calls it - `Army.Update` at :105, `RunOver` at :144, `ClearPath`
          at :153. Run-over goes immediately above it in step 3; clearing
          first would move the men out of the wheels before the wheels
          were asked who was under them. Infantry only, as in C#, and for
          C#'s own reason: `resolveArmour` already pushes the TRUCK out of
          the tanks, and two systems arguing over one overlap have no
          radius that satisfies both. The radius is derived, not typed -
          16 ONE over 10 - and no PhysX quantity is read: the truck's own
          position is the only input, never `linearVelocity`, which is
          permanently zero on a kinematic body and is the trap that made
          run-over silent once already.

          Only `handbrake` moved of the six vectors, which is the only one
          that ends among infantry. `st.armour.n` stays 15-24, so the
          truck still does not drive through its own tanks.

          A WRECK CLEARS NOBODY - the hole this step was closed on, and it
          was found by reading the C# call site for the ordering question
          rather than by a test. `Battlefield` wraps the whole block in
          `if (courier != null && (health == null || !health.IsDestroyed))`,
          so once the truck is written off C# stops BOTH running men down
          and pushing them out. The first port had no such guard and went
          on shoving riflemen out of a hulk the game considers gone.

          The core's quantity for "written off" is `T_HP`, and NOT
          `S_STATE`: the state word is recomputed in the score section,
          after this, so here it still holds last tick's value and would
          let a wreck clear for one more tick. `T_HP` is current at this
          point because the courier damage has already come off it. It is
          not `TruckHealth` and not its `armour` divisor - that is the
          two-owner question, and it is NOT decided here. Run-over goes
          inside the same brace when it is ported, because it shares this
          `if` in the game rather than merely sitting next to it.

          Measured on the same 8 seeds and the same 90 s drive, split into
          the two layers the guard makes:

            truck ALIVE          ticks   penetration   deepest  over 2 cm
              unguarded          16409     0.011 m     0.000 m      0
              guarded            16409     0.011 m     0.000 m      0

            truck WRITTEN OFF    ticks   penetration   deepest  over 2 cm
              unguarded          26791     0.013 m     0.000 m      0
              guarded            26791   976.721 m     1.579 m   1794

          The living layer did not move a millimetre - 1773.3 -> 0.000 has
          not fallen back. The wrecked layer is the guard DOING its work,
          and the number is reported the right way up: with the guard in,
          men stand inside the hulk, because that is what C# does. All
          26791 of those ticks are `S_STATE = 2`, so the run is over
          throughout and no score, delivery or outcome depends on any of
          it. The truck was written off on 8 of 8 seeds in this scenario,
          which drives AT the infantry and is the harshest one this file
          has.

          NAMED, NOT DECIDED: C# never shows that hulk because
          `WastedSequence` respawns the truck; the core has no round-end
          handling for the wreck at all, so its truck sits where it died
          for the rest of the round with men pushed into it. That belongs
          to step 4 with the two owners of the truck's condition and is not
          being touched here.

          Counted separately, all three measured on this tree: Core 47/47,
          guard 19 files clean, node vs bundle-node identical, stage 0
          PASS. EditMode 124/123/1. PlayMode 176/164/2/10.

          The 3.6 m peak from the step 2 sizing is a SAMPLING ARTEFACT of
          my own instrument and 0% of the open M1 gap - no investigation.
          18 men fell in about 18 s at 10-14 m/s; a man is inside 3.6 m for
          about 2*3.6/12 = 0.6 s, so the expected number inside at any
          instant is 1/s * 0.6 s = 0.6 and a peak of 1 over 120 half-second
          samples is exactly right. The kills happen between samples.
       3. DONE, inside the same brace as the clearing and above it, which
          is Battlefield's order. The number it was to be accepted against
          - 18 men a round - cannot be reproduced in the core, and that is
          measured rather than worked around by loosening anything.

          THE SPEED SOURCE FIRST, because that is where this rule has been
          silenced before. `Battlefield.cs:141` still reads
          `body.linearVelocity` as its fallback when the core is not
          driving, and the comment above it records the cost: the truck's
          body is kinematic, its linearVelocity is permanently zero, so
          run-over read a stationary truck and the wheels went through men
          standing in the road. The core has no fallback and must not grow
          one. It uses the magnitude of its own velocity,
          `length2(T_VX, T_VZ)` - exactly what C# consumes, since
          `BlwpCore.Velocity` IS (T_VX, T_VZ) and `Battlefield` takes
          `.magnitude` of it. Deliberately NOT `T_WHEEL`: that is the
          vehicle's SIGNED forward speed, so a truck reversing at 5 m/s
          would read -5, sit under the 2.5 m/s threshold and ride over
          nobody. The unit test pins that with -12 m/s.

          THE DRIVEN NUMBER IS ZERO. Two automatic routes, 8 seeds, 90 s,
          truck kept alive by `practice` - which withholds damage, changes
          nothing else, and is an input in the transcript:

            chasing the nearest rifleman   a man inside 3.6 m on 757 ticks
                                           of 43200, truck at 2.5+ m/s on
                                           NONE; closest 1.60 m at 1.87 m/s
            ploughing at the centroid      inside 3.6 m on 98 ticks, again
                                           none at 2.5+; closest 2.48 m at
                                           0.02 m/s, while the truck holds
                                           17.89 m/s median elsewhere

          Chasing is self-defeating: the bearing error grows as the truck
          closes, it turns harder, and hard steering scrubs the speed away.
          Ploughing keeps the speed and is stopped by ARMOUR before it
          reaches the infantry - a consequence of port step 1, since before
          it the truck drove through its own tanks. Neither the 2.5 m/s nor
          the 3.6 m was touched to manufacture a kill.

          THAT LAST SENTENCE WAS AN INFERENCE WHEN IT WAS FIRST WRITTEN,
          and checking it produced a wrong refutation before it produced a
          proof. The check measured tank-to-truck-CENTRE distance and found
          6.04-10.16 m at every one of the 98 encounters, which reads as
          "armour was nowhere near" - but `resolveArmour` tests the truck's
          TWO BODY CIRCLES, at +2.0 m and -1.8 m along the nose, not its
          centre. Measured against the circles the rule actually uses, on
          the episode all 98 ticks come from:

            tick 4826   v 12.71   nearest tank 4.69 m from a circle   free
            tick 4827   v 12.74                4.45 m                 free
            tick 4828   v  2.17                4.24 m             CONTACT
            tick 4829   v  1.96                4.24 m             CONTACT

          Contact is 4.27 m. The truck is doing 12.74 m/s one tick and
          2.17 m/s the next, at the moment a tank enters its front circle.
          Armour is what stops it, the claim stands, and it now stands on a
          measurement instead of on a plausible reading. It was the fifth
          time in this letter that measuring a different quantity than the
          rule uses produced a confident wrong answer.

          AND A FINDING THAT FELL OUT OF IT, worth keeping: at tick 4828
          `T_WHEEL` still read 12.78 while the velocity words already read
          2.17. `resolveArmour` and `resolveSolids` correct `v.vx`/`v.vz`
          and do NOT touch `v.speed`, so the wheel word carries the speed
          the truck had BEFORE it hit something. Nothing in the simulation
          reads it - it feeds the steering lock and the host's HUD - but it
          is why choosing `length2(T_VX, T_VZ)` for run-over is right on
          measured grounds and not only on the grounds that C# reads the
          same pair: `T_WHEEL` would have ridden a man down with a truck
          that had just been stopped dead by a tank.

          The rule is proved by a unit test instead of a drive - `a truck
          at speed rides a rifleman down, and a crawling one does not` -
          which kills at 12 m/s, kills at -12 m/s, and spares at 2.4 m/s
          and at 0.

          FOUND ON THE WAY, and it cost two wrong reads: a unit is clamped
          to |x| < FrontX - 4 = 88 on its first tick, and the truck starts
          in the bay at x = -100.4. A man placed beside the truck THERE is
          snapped 12 m away before any rule sees him; the first version of
          the unit test reported a survivor for that reason and not because
          the rule was wrong.

          The C# side is NOT a like-for-like pair and is not offered as
          one: `MeasureRunOverAndClearPath` gave runDown 18 on one PlayMode
          run and 4 on another, hand-steered in a scene whose timing is not
          the core's. Same establishment, different run.

          Step 2 has not fallen back: living layer 0.000 m penetration,
          0 man-ticks over 2 cm, `st.armour.n` 16-24. The wrecked layer is
          untouched because run-over sits inside the same `if (T_HP > 0)`.

          Counted separately: Core 48/48, guard 19 files clean, node vs
          bundle-node identical, stage 0 PASS. EditMode 124/123/1.
          PlayMode 176/164/2/10.
       4. IN PROGRESS. The choice is made and the CORE HALF IS DONE; the
          Unity half runs into a wall this letter already measured.

          THE LINE: the core divides, because the reduction was never in
          it. Read first, not assumed - `CourierHit?.Invoke(Rand(5f, 11f))`
          carries the RAW shell, `TruckHealth.Damage`'s own summary says
          "Amount is before armour", and `armour = 1.5` is tooltipped
          "Incoming damage is divided by this. The van is soft but not
          paper." A deliberate dimensionless toughness knob, not a units
          confusion and not the leftover of a formula. The core applied
          that raw amount to the same maxHealth of 100 and did not divide,
          so its truck was half again as soft as the shipped one.

          Measured on ONE hit sequence, parked at (0, 0), hit points held
          so the column does not saturate. THESE ARE THE CORRECTED ROWS:
          the first pair published for this step said 24.9/14.5/16.1 and
          33.5/21.0/23.7, and both were taken with the air ON, because the
          helper pinned `st.heliClock` and the sortie clocks are state
          words at `O_AIR`. With the clocks actually pinned:

            seed        dead WITHOUT the divisor   dead WITH it
            20260901            18.4 s                34.3 s
            20268820            14.5 s                17.5 s
            20276739            15.2 s                19.8 s

          Both columns are the same hit sequence: the divisor is in the
          code, so the points taken are already reduced, and the undivided
          truck spends its 100 when that reduced total reaches 66.67.
          In `measure-courier.js`, which lets the truck die, the parked
          truck goes from 24.4 s to 47.5 s: more than the factor, because a
          truck that lives longer keeps clearing and riding down men and so
          changes the fight around it.

          The (j)-era reference of 13.9 s is NOT the number any more and is
          not quoted as one: the same tool reads 24.4 s today, because
          courier fire, separation, clearing and run-over have all landed
          since it was taken.

          A divisor on the HIT and not a bigger pool, because that is the
          rule's shape: C# applies `/armour` to every `Damage()` call it
          makes, the crash path included.

          NOTED, NOT DONE: the core has no crash damage at all. `T_HP` is
          written at spawn and reduced by courier fire, and by nothing
          else, while `TruckHealth.OnCollisionEnter` writes the truck off
          above `crashSpeed`. That is another missing simulation rule for
          the list beside wrecks, the halt and pace.

          THE WALL ON THE UNITY HALF, and it is the fact step 1 measured:
          there is no core in the editor. `BlwpCore` is stubbed unless
          `UNITY_WEBGL && !UNITY_EDITOR`, so if `TruckHealth` becomes a
          display of `T_HP`/`S_STATE` then in PlayMode it displays zero and
          the eight tests that hurt the truck have nothing to hurt. They
          assert game-side consequences - `Fraction < 1`, `IsDestroyed`,
          and that a wreck stops being a Courier target - and every one of
          them injects damage with `Field.Army.CourierHit.Invoke(...)`.

          There are exactly two ways through and they are not equivalent:
          move those eight subjects into the core suite, where damage
          actually lives and can be tested; or leave `TruckHealth` a
          settable value that the core writes and a test can also write,
          which is a second owner in all but name and is the thing this
          step exists to remove. The first deletes eight PlayMode tests and
          is not reversible by a revert of one commit, so it is not being
          done on my own judgement.

          THE UNITY HALF IS DONE. One pool, and it is the core's.
          `TruckHealth.Damage` is gone with its `amount / armour`, and with
          it `Bootstrap.cs:194` - the C# army no longer hurts the truck.
          `Health` and `IsDestroyed` come from `ApplySnapshot`, which
          `TruckHealth.Update` fills every frame from `BlwpCore.TruckHealth`
          and `RunState` whenever a core is answering. Where none is - the
          editor, PlayMode, a standalone build - nothing is read and a test
          calls `ApplySnapshot` itself, which stubs the view's INPUT rather
          than giving the view a second pool.

          `OnCollisionEnter` is deleted. The file's own comment already said
          it could not fire, the truck's body being kinematic with the core
          writing its transform - and it was the last place a PhysX
          quantity decided condition, costing a crash from
          `collision.relativeVelocity`. Nothing on the health path reads a
          PhysX value now; the one `linearVelocity` left is a WRITE that
          stops a wreck moving.

          `maxHealth` and `armour` stay as fields: the view needs a full
          scale to draw a fraction against, and the core's divisor is
          written against the same 1.5. Neither works out what a hit costs.

          Two PlayMode tests migrated first and were only then deleted -
          `IncomingFireCostsCondition` and `EnoughFireWrecksIt` are now
          `incoming fire costs the truck condition` and `enough fire writes
          the truck off` in the core suite, on the three seeds, with the air
          pinned through `O_AIR`. Two more assert a protected truck refuses
          to be WRITTEN OFF and no longer need a damage API to say it.

          TWO NEW REDS, both caused by removing the second simulation and
          neither loosened:
            FeatureTests.DamageIsFeltInTheDriving - depends on the core
              gap "T_HP does not reach the driving" below.
            TruckHealthTests.CrashingIntoArmourWritesItOff - depends on the
              core gap "no crash damage" below.

          Counts: Core 50/50, guard 19 files clean. EditMode 124/123/1.
          PlayMode 174/160/4/10 - the two above plus item 7's two
          Visibility reds.

     THE WORK LIST FOR 2e. Eight C# rules the core does not have. Short
     lines on purpose; the measurements live in the commits.

       1. Crash damage - DONE. `TruckHealth` wrote the truck off above
          `crashSpeed = 4` and charged `rammed * 6` below it, inside a
          `Damage` that divided by the armour. The quantity was always a
          speed - `TakeImpact` is `T_IMPACT / ONE`, set from the truck's
          velocity along the contact normal - so the six is points per
          metre per second and there was no units fault to copy. Now in
          `sim.js`, priced from this tick's impact, withheld by `practice`.
          Guarded by `crashing into armour costs condition, and hard enough
          writes it off`.
       2. `T_HP` does not reach the driving - BUILT, MEASURED, AND HELD
          BACK on a protocol conflict. `TruckController` scales the
          throttle by `Lerp(1, 0.55, hurt)` above `hurt > 0.02` and adds a
          steering pull of `pull * hurt * 0.35`. It reads `condition`, and
          the block below it reads `_rb.linearVelocity` - which is zero on
          the kinematic body the core drives, so that rule was ALREADY
          DEAD where the core is in charge. Porting it into the client
          would have been copying a PhysX-era corpse; it belongs in
          `vehicleStep`.

          Worth having: over three seeds the truck is under 98 hit points
          for 91.4% of the ticks of a full-throttle run and 90.5% of a
          parked one, mean `hurt` 0.205 and 0.847 - so the rule is most of
          a round, not a corner.

          Written and then reverted, because it breaks `a practice run and
          a live run field the same army, word for word`. Nothing in the
          army reads the practice flag and the DRAW ORDER stays identical,
          which is what the vectors' own note claims - but a shielded truck
          keeps its condition, drives differently, and so clears and rides
          down different men. The army diverges through the truck's
          POSITION. That is faithful to the old game and stronger than the
          spec sentence, and the test is a protocol test, so it is not
          being rewritten on my judgement. The call is whether that test
          means "nothing in the army reads the flag" or bit-equality.

          Measured while it was in: full throttle, 60 s, three seeds. With
          the pull left uncorrected the truck ends at 26.9 / -96.4 / -130.0
          instead of 130.0 / 130.0 / 130.0 - a constant bias of about a
          tenth of full lock that an unattended driver rides into a circle.
          With a driver holding the heading, all three still cross to
          130.0: the throttle cut costs time, not the crossing.
       3. The army never reads `T_HP`. A burning truck stays a courier
          target; C# clears `Army.Courier` on a write-off.
       4. The apron does not protect. The core has no radius in which fire
          is withheld, and `IsInvulnerable` is no longer a second one:
          C# refusing a write-off the core had made was a veto over an M1
          outcome and is gone. WHICH MAKES THIS GAP REACHABLE, and the old
          reading of it - "zero damage in the bay over thirty seconds on
          three seeds" - NO LONGER HOLDS. Re-measured after `Separate`, the
          x-chase and the crash rule: parked at START with live fire, seed
          5eed1234 and abcdef01 stay at 100.0, but seed 13572468 starts
          losing condition at tick 812 and ends thirty seconds at 96.2,
          impact 0.00 - gunfire, not a crash. So on some seeds a rifleman
          does reach the apron. Practice still shields completely: full
          throttle across the whole field, three seeds, 100.0 each, and
          `packages/core` now holds that as a test. An apron rule belongs
          in `sim.js` and is not invented here.
       5. Cargo does not raise the damage. C# scales a courier hit by
          `(1 + Heat * 0.6)`. NOT to be touched until its share of the C#
          damage is measured - every recording has Heat at zero.
       6. `Army.Wrecks` / `AvoidWrecks`. A destroyed tank leaves a hulk
          units are pushed out of. Also the missing `impact * 3f` branch
          for hitting one.
       7. The halt. `restFor` / `nextRest` and the gait wave, so a man
          stops now and then and no two are in step.
       8. Pace and height per man.
       9. STATE-LAYOUT DEFECT - FIXED. `T_IMPACT` and `S_EXPOSURE` were
          the same word: `O_TRUCK` is 5 with fields running 0..12 while the
          block was declared as twelve, so both landed on word 17 and every
          contact that beat the exposure so far overwrote the run's score
          with a collision speed. The offsets are DERIVED from the block
          sizes now, and `no two blocks share a word` walks them - which
          immediately found a second one, `S_PRACTICE` as field 6 of a
          six-word score block. Truck 5-17, score 18-24, units from 25.
          `BlwpLayout.cs` is generated from `state.js`, so both mirrors
          moved together, and nine hand-typed copies of the offsets in the
          test file are imports now.

          After: `T_IMPACT` reads 0.00 where nothing was hit and
          `S_EXPOSURE` reads 205.0 / 187.8 / 179.1 - exactly what used to
          be read out of word 17 and reported as an impact of 178-201 m/s.
          The score against the old game is unmoved: 7 of 7 routes
          identical, 58342 of 58344 swept.

          CORRECTED WITH IT, and it was mine: the previous entry said
          clamping the impact changed nothing across "18.5 / 28.4 / 24.3
          crash points". Those are not crash points. `T_IMPACT` is 0 at
          every tick of those runs - a truck driving straight out of the
          bay never gets a CLOSING contact - so the crash rule never fired
          and the A/B compared two runs in which it could not. The points
          are gunfire. The rule's guard is the unit test, which does fire.

          It is what the 178-201 m/s reading was: exposure, which climbs
          steadily, not an impact, which cannot exceed the truck's own
          speed. The crash rule is NOT affected - it prices the local
          `v.impact` and never the word - and that was measured rather than
          argued: clamping the impact to `|v|` changes the damage by
          nothing at all, 18.5 / 28.4 / 24.3 points in sixty seconds either
          way, with no write-off in either. The inflated word carries 0 of
          those 18.5-28.4 crash points.

          NOT PATCHED HERE. The fix is to give the truck its thirteenth
          word, which moves `O_SCORE`, `O_UNITS` and everything after it -
          every golden vector, `dist/`, and the `BlwpCore.Layout` mirror on
          the Unity side. That is a protocol change and it wants its own
          go.

     RED, EACH WITH ITS DEPENDENCY:
       DamageIsFeltInTheDriving          -> the rule is in the core now;
         red because PlayMode has no core to read condition from
       CrashingIntoArmourWritesItOff     -> its assertion now lives in the
         core suite and is green there; the PlayMode case cannot pass while
         `BlwpCore` is stubbed outside WebGL, so nothing applies condition
         in the editor. Migrate-then-delete when that is authorised.
       RifleFireProducesAFlashAndATracer -> item 7, CombatFx
       ArmiesAreActuallyDrawn, RoadsAreActuallyDrawn -> a graphics device;
         `RenderTexture.Create failed` under `-nographics`
       TheGogglesAnimate, and
       RampReadyTests.TheRealTransactionsReplaceTheStandInsWhileNothingIsLoaded
                                         -> item 1's load flake. One of the
         two appears under load and the other does not, and which one it is
         changes between runs of the SAME tree: two runs back to back gave
         twelve failures each, the twelfth being RampReady in the first and
         the Goggles in the second. Each passes in isolation. The stable
         eleven are the ones above.

       4b. WAS: The truck's health, and it needs a DECISION rather than a port.
          The two owners are on different scales: the game divides by
          `armour` 1.5 and the core does not divide at all. One of them is
          wrong and this file does not get to pick silently. Whichever
          way it goes, `T_HP` becomes the only copy and `TruckHealth`
          reads it, `Bootstrap.cs:194` stops feeding `Damage` from
          `CourierHit`, and `BlwpCore.TruckHealth` gets its first
          consumer.
       5. Only then the deletion: `Army.cs`, the `Bootstrap` wiring, the
          reference recorders.

     WHAT DIES WITH `Army.cs`, LISTED AND NOT ONLY COUNTED. All 51 tests
     in `EditMode/ArmyTests.cs`, grouped by what they hold, against what
     the core has today. 38 of them test a rule the core already carries
     and are safe to lose with the file; 13 test something it does not.

       COVERED (38)
         1,2      hulls push apart, symmetrically      `separatePair`
         3,4,5    overrun and the fall-back line       OVERRUN_DEPTH/FALL_BACK
         6,8      advance to the line, stay on the map hold + the |x| clamp
         9        destroyed armour leaves the field    U_STATE 0
         10-18    both sides present, replacement,
                  cadence, establishment, pressure,
                  no annihilation, recovery            `reinforce`, `sideOf`
         19-23    riflemen kill, the front holds,
                  nobody dies out of range             the rifle rule
         24-27    driving through kills, crawling
                  does not, only those under the
                  wheels, armour is not run over       `runOver`, ported now
         28,29    nobody steps aside; deep overlap
                  is still undone                      `clearOfTruck`
         40,41    men clump into squads; squads drift  anchors + `driftSquads`
         42-48    gunships enter, stand off, fly
                  above ground, drop, blast radius,
                  damage by distance, leave            the air arm

       NOT COVERED (13), and each is work that must land BEFORE the file
       goes, because after it no C# quantity can be recorded again:

         34-37  `Army.Wrecks` and `AvoidWrecks` (`Army.cs:109`, called at
                `:332`). A destroyed tank leaves a hulk at x, z, radius and
                units are pushed out of it. THE CORE HAS NO SUCH RULE AT
                ALL - `Wrecks` appears in it nowhere. This is a
                simulation rule: it moves units, so it moves outcomes.
                4 tests.
         7,30-33 facing. C# turns a hull into its line of advance
                (`LerpAngle` towards `Atan2(mvx, mvz)`), turns a falling-
                back man round rather than reversing, and points a dug-in
                man at the enemy. The core has ONE line for all of it:
                `u.heading = add(u.heading, wobble)`, a random walk. Mostly
                a render quantity - nothing in the core reads heading for
                an outcome - but it IS in the state hash, so it is
                protocol either way. 5 tests.
         49,50  the halt. `StepInfantry` carries `restFor`/`nextRest` and a
                gait wave, so a man stops now and then and no two are in
                step. The core has zero occurrences of any of it, so its
                infantry advances at an unbroken rate. Simulation: a man
                who stops is somewhere else. 2 tests.
         38,39  per-man size and pace (`height`, `pace`). Pace is
                simulation, height is render. 2 tests.

       And 51 (`AHaltedManDoesNotPlayTheWalkingAnimation`) is pure render
       and belongs with CombatFx in item 7.

     AND THE OTHER SIX FILES, LISTED TOO. This entry said "99 tests that
     touch `.Army` while being about something else" - that is the FILE
     totals and it overstates it badly. Counted by test body rather than by
     file, only 22 tests touch `Army` at all, and every one of them hangs
     on exactly one of four dependencies. None of them dies; all of them
     need re-sourcing, and none can be re-sourced before its dependency.

       READ THE CORE'S UNITS INSTEAD OF `field.Army` (6). Needs no new
       rule - `BlwpCore.State` and `UnitHealth(i)` already expose them.
         VehicleTests: BothArmiesAreOnTheFieldAndOnTheGround,
           ArmiesFightNearTheSeamRatherThanWanderingOff, ArmourBlocksTheTruck,
           UnitsDoNotShoveEachOtherWithPhysics,
           TheTruckCanDriveOnAfterHittingTheArmy
         VisibilityTests: ArmiesAreActuallyDrawn
       Two of those now describe the CORE's rule rather than PhysX's, since
       port step 1 made its tanks solid, and `UnitsDoNotShoveEachOtherWith
       Physics` becomes trivially true once no PhysX army exists.

       COMBATFX SOURCED FROM THE CORE (3). Item 7's own point, and one of
       these is the standing EditMode red.
         CombatFxTests: RifleFireProducesAFlashAndATracer,
           TankFireProducesABlast, EffectsRetireInsteadOfPilingUp

       THE TRUCK'S DAMAGE OWNER, i.e. step 4's decision (8). Every one of
       these hurts the truck with `Field.Army.CourierHit.Invoke(...)`,
       which is precisely the wiring step 4 has to cut.
         TruckHealthTests: MeasureRunOverAndClearPath,
           TheTruckIsProtectedOnTheApron, IncomingFireCostsCondition,
           EnoughFireWrecksIt, TheArmiesLeaveAWreckAlone
         FeatureTests: ValuableFreightMakesTheTruckATarget,
           AnEmptyTruckIsLeftAlone, DamageIsFeltInTheDriving

       A HOME FOR THREE CONSTANTS (5). `Army.AirCorridorX`, `Army.FrontX`
       and `Army.HalfDepth` are read as plain numbers; the core has its own
       and they have to be pointed at it.
         BlwpBridgeTests: TheCorridorStopsShortOfBothDepots,
           AGunshipNeverLeavesTheCorridor, EveryUnitArrivesAtTheEdgeOfThe
           Field, EachSideArrivesOnItsOwnSide, AndThenTheyWalkToTheFront

     So no test in these six is "not on the critical path" and none is
     safe to drop: 22 need work, gated on four things, three of which are
     already named elsewhere in this letter.

     WHAT THE DELETION COSTS, counted. `EditMode/ArmyTests.cs` is 51 tests
     that are about nothing but `Army` and go with it; the two reference
     recorders and the gunship one are 3 more. That is 54 gone outright.
     Six further files hold 99 tests that touch `.Army` while being about
     something else - VehicleTests 18, CombatFxTests 24, BlwpBridgeTests
     28, TruckHealthTests 15, FeatureTests 12, VisibilityTests 2 - and
     those need auditing one by one, not deleting.

     AND THE PART WITH NO ROUTE YET, named rather than discovered later:
     after step 5 there is no way to record a C# quantity again, and there
     is also no way to run the core in the editor - `BlwpCore` is stubbed
     outside WebGL. So from step 5 on, PlayMode can only test a game whose
     outcomes come from a core it cannot see, and the core's only guard is
     the node suite and the vectors. Every C# number this project will
     ever want must be recorded BEFORE step 5. Steps 0-2 took the three
     that were named; whether that is all of them is not established, and
     that question belongs before step 1 of the port, not after.

  q. The infantry's halt and pace per man - DONE. Pace landed; the halt
     and the gait wave are parked, and why is below. Every rifleman walked at exactly `RIFLE_WALK`, 2.6 m/s,
     so a squad that set off together arrived together. `pace` is now his
     own: a dimensionless 0.82-1.18 factor on that speed, as
     `Army.cs:278`'s `Rand(0.82f, 1.18f)` is a factor on the C#'s 3.4 m/s.

     FROM THE INDEX, NOT FROM THE STREAM. `standoff` and `squadOffsetZ` are
     already derived from a hash of the index, and a spawn draw is protocol
     - inserting one shifts every draw after it for every unit of every
     round. The hash costs nothing and shifts nothing. It takes a second
     round of mixing rather than a third window of the first, because bits
     20..29 and 8..17 are spoken for and an overlapping window would tie a
     man's speed to where he stands, which the C#'s independent draws do
     not. Over the 72 rifle slots: 0.825 to 1.171, mean 0.9812, sd 0.1035
     against C#'s 1.0000 and 0.1039. The mean is 1.5 sigma low on a
     72-sample draw and is left alone rather than tuned.

     Infantry z-spread, eight seeds, air pinned, seam0, both sides:

       t        before            after            recording   inside?
       15s      [0.90, 1.20]      [3.60, 4.50]     4.3 / 4.4   NO -> yes
       30s      [3.00, 17.40]     [2.80, 17.30]   11.7 / 13.7  yes
       60s      [10.00, 21.50]    [6.60, 21.30]   13.6 / 14.2  yes
       90s      [4.70, 21.20]     [5.90, 21.50]    6.7 / 20.6  yes

     Worked out beforehand from the C# ranges, `pace` alone should carry
     about 3.75 m of the recorded 4.3 with the halt worth 1.5 and the gait
     wave, over ten cycles in fifteen seconds, none: the mark came out at
     4.13. And 2e's envelope holds - armour x-spread, density and alive
     inside at all four marks, churn lost [52, 62] arrived [47, 57] against
     59/55.

     Checked wider than the envelope, same conditions: against
     `csharp-infantry.json` the nearest opposing pair, the men in rifle
     range and the rifle kills all overlap the recording at 15, 30, 60 and
     90 s, and so do the armour's mean z and z-spread. Twenty comparisons,
     twenty overlaps.

     THE HALT'S SHARE WAS NOT ZERO, AND THIS CORRECTS WHAT STOOD HERE. It
     is zero on the four SPREAD marks above. It is not zero on the
     infantry's MEAN POSITION, and that is now item (s) with its number and
     its price. The gait wave stays parked beside it, with no number of its
     own: over ten cycles in fifteen seconds it averages out and moves no
     mark.

     Suites at the close: Core 54/54, guard 19 files clean, EditMode
     124/123/1, PlayMode 175/154/11/10.


  p. `Army.Wrecks` / `AvoidWrecks` in the core - CLOSED FOR M1, NOTHING TO
     PORT. Its share of the measured gap is zero, and that is a code fact
     rather than a sample: `Wrecks` is written in exactly two places, both
     in `CombatFx.cs`, and `ArmyReferenceTests` names neither `CombatFx`
     nor `Wrecks` once - so `AvoidWrecks` returned on its first line at
     every tick of every recorded pass. Porting it would push armour
     x-spread, density, alive and churn OUT of an envelope they sit inside,
     to chase a difference the recording cannot show. Same call as the halt
     in (q), for the same reason.

     AND Y IS COMPLETE, not partial. `shooters`, `perTarget`, `worst` and
     the x-bands had never been compared, and the recording's own
     `perTarget` and `worst` were not even printed. At eight seeds three
     sat just outside - `perTarget` 1.67 against [1.86, 5.00] and `worst` 3
     against [4, 8] at t=30, the `<31` band 25% against [0, 21] at t=90. At
     sixteen seeds all three are inside: [1.60, 5.00], [3, 8], [0, 53]. And
     `worst` was outside at eight seeds BEFORE `pace` too, measured against
     a worktree at 817aeb3, so none of it is a rule effect. The recording is
     a single realisation and eight seeds is too narrow for the noisiest
     quantities - one tank is five per cent of a band. Everything else
     holds at eight.

     WHAT SURVIVES IS A LIVE-GAME RULE, on its own line rather than dying
     with the letter, and it depends on ITEM 7: nothing draws a wreck
     today, and a core that pushes units around hulls the player cannot see
     is effect without picture - the fault already holding the deploy.

     Its reach, for when it is taken up as a rule of the live game rather
     than as a distance to the recording: 55-60 hulls in ninety seconds,
     and 9.0-14.6% (mean 12.5%) of living unit-ticks standing inside one.
     C#'s reaches are 7.4 m for armour and 4.8 m for infantry against a
     4.2 m hull that lives 25 s - not the 3 m an earlier note used.

     The hull impact belongs with it and is the half that costs something.
     `TruckHealth.OnCollisionEnter`, deleted in `d7a3002`, charged a
     `BurntOutHull` `relativeVelocity.magnitude * 3f` and never a
     write-off, against `* 6f` with one for a live tank; the literal
     `impact * 3f` never existed in any .cs file. Driven, eight seeds: 3 to
     15 contacts a run, 11.6 to 141.0 points against a 100-point truck - an
     upper bound, because a hull that deflects is not a hull driven
     through. A truck cost, not an army gap.

  r. The tank's turret - DONE, AND IT STAYED OUT OF THE CORE. `StepArmour`
     traverses `turretYaw` in world space, and after the cutover the barrel
     was glued to the hull.

     NO COMBAT SHARE, PICTURE ONLY, and that is a code fact: `turretYaw` has
     one writer (`Army.cs:601`) and NO reader anywhere in the simulation. A
     shot is `Random01() < 0.55f` and the target is chosen by distance and
     heat, so the barrel's angle decides nothing. No recording carries a
     turret either - zero matches for "turret" or "yaw" in all three vector
     files. Its share of the 78 comparisons is 0, by construction.

     So it did NOT get a state word. That would have been `U_WORDS` 8 -> 9
     with every offset after it, every golden vector, `BlwpLayout.cs` and
     the C# buffer - the same wall (s) hit at 1 of 78, for 0 of 78 here.
     Unread state does not belong in a hashed core. The renderer derives the
     aim from state the core already publishes and smooths it locally, the
     same class as the infantry's bob off `BlwpCore.Tick` and the running
     gear. Nothing is written back and nothing is hashed.

     ONE SUBSTITUTION, named rather than hidden, AND MEASURED AGAINST THE
     C# RULE RATHER THAN ASSERTED. Engaged is C#'s rule exactly - the
     nearest enemy TANK inside 46 m, which is what `NearestEnemy` walks.
     Not engaged, C# sweeps about a point on the frontline, and the
     renderer has no frontline: the seam is derived inside the core from
     the price tape each tick and is not a state word.

     The first version swept about the hull's own heading, and comparing it
     with C#'s own centre showed that was wrong - only the not-engaged
     tanks, 21 to 48 of them across eight seeds and four marks:

       centre against C#'s      hull heading      nearest enemy
       t=15                     mean 83, max 162  mean 24, max 79
       t=30                     mean 77, max 172  mean 24, max 74
       t=60                     mean 77, max 176  mean 27, max 81
       t=90                     mean 84, max 172  mean 22, max 74

     A tank not in contact is manoeuvring, and where its hull points is not
     where the enemy line is. So the sweep centres on the direction to the
     nearest enemy tank at any distance. The WIDTH was right either way -
     C# 12.6 to 13.9 degrees mean against 11.9 to 12.5 - so only the centre
     moved.

     The angle between barrel and hull, same derivation on core state,
     eight seeds, air pinned, seam0. It was 0.0 at every mark by
     construction while the barrel was glued:

       t          mean        largest     tanks with a target inside 46 m
       15s        87.3 deg    179.0       18.3 of 20.9
       30s        87.9 deg    178.7       13.6 of 19.6
       60s        81.7 deg    179.8       14.1 of 20.0
       90s        83.4 deg    178.9       13.6 of 19.3

     Both draw paths carry it - the prefab's child turret (the hull's own
     rotation taken off the world aim, or the two would add) and the
     primitive pool. It does not touch item 7: flashes and audio are THAT a
     shot happens, this is where the barrel points.

  s. The infantryman's halt - DONE, and the last of the seventy-eight is in.
     `restFor` / `nextRest` at `Army.cs:658-666`: a man stops 0.4-1.8 s every
     3-11 s, about 13.6% of his time.

     NO LAYOUT WORD, NO DRAW. The list priced this at `U_WORDS` 8 -> 9 and
     that price was wrong. The halt is derived from a hash of (index, CYCLE)
     - the k-th interval and the k-th stop of one man - and the cycle a tick
     falls in is found by summing from zero, about eleven steps at ninety
     seconds. Drawing once per MAN instead, `tick % P < R`, was tried first
     and fails: it locks each man to one duty cycle for ever, so the spread
     never settles. Measured against the C# process itself:

       window     C#                        per man            per cycle
       15 s       12.09%, sd 4.79           14.67%, sd 7.20    11.84%, sd 4.75
       90 s       13.60%, sd 1.84           14.67%, sd 6.64    13.23%, sd 1.75

     C# is intent, not the draw order: its `Rand` calls happen mid-step,
     interleaved with the firing draws, so taking them from the stream would
     have moved every quantity in the army.

     AND `RIFLE_WALK` WAS AN EFFECTIVE SPEED. 2.6 m/s already had the halt
     baked into it, so the rule on top counted it twice: measured, 2.214 m/s
     against C#'s 2.409, and the infantry's mean z at t=15 overshot from
     1.3 m short to 3.3 m long. It is 2.788 now = 3.4 * 0.82 from
     `Army.cs:672` - the walk times the gait wave's own mean. The wave itself
     is not ported, and the reason is a BOUND rather than the "moves no mark"
     that stood here: it advances at 4.2 rad/s, so over any window its
     integral is 0.82 * T plus at most 2 * 0.18 / 4.2 = 0.0857 s-equivalents,
     which is 0.29 m of travel however long the window - against the 1.80 m
     width of the envelope it would have to move. The 0.82 in the wave and the one
     opening `Rand(0.82f, 1.18f)` are two different numbers that happen to be
     equal; folding the wrong one counts `pace` twice, and 3.4 raw was
     measured at 2.895 m/s with the mark 7-9 m through. Effective now
     2.374 against 2.409.

     THE RESULT, thirty-two seeds, air pinned, seam0: 78 of 78. The mark this
     item exists for came in - infantry mean z at t=15, [40.40, 42.20]
     against the recording's 41.40, from [38.40, 40.10] - and nothing else
     left. At sixteen seeds two quantities looked like regressions,
     `worst` at t=30 and the 46 m density at t=90; both are inside at
     thirty-two, which is the same sample width that fooled this file once
     before.

     And the OTHER recording was re-read, because the halt changes when men
     meet and `csharp-army.json` does not measure that: against
     `csharp-infantry.json`, the nearest opposing pair, the men in rifle
     range and the rifle kills all still overlap at 15, 30, 60 and 90 s.
     Twelve comparisons, twelve overlaps.

     Golden vectors and `dist/` regenerated together. Core 54/54, guard 19
     files clean, EditMode 124/123/1, PlayMode 175/154/11/10.

  x. A tank drove sideways - DONE. The rule is the player's: a tank may
     only drive the way its hull points.

     `u.heading += Rand(-32, 32)` every tick was a random walk that knew
     nothing about where the unit was going, and `ArmyRenderer` draws the
     hull from it. Sixteen seeds: the angle between a tank's travel and its
     drawn hull averaged 90.5 degrees and was past 90 for half the samples.
     Half the tanks on screen were sliding sideways or driving backwards.

     C#'s own answer - turn the hull into the line of advance, `Army.cs:
     587-590` - is not enough here. It works there because `StepArmour`
     moves on one goal vector; this core steers x and z on separate
     controllers on purpose, because coupling them was measured and
     reverted, so travel jitters and a chasing hull still sat 45.7 degrees
     off. The constraint therefore sits on the VELOCITY: the controllers say
     how far, the heading says which way, the step is taken along the
     heading at C#'s own turn rate and above C#'s own 0.4 m/s floor, written
     as a distance against a distance. The 2-D coupling stays out.

     The draw is kept and thrown away - it is the first draw of a unit's
     tick and that order is protocol. The rifleman is not a vehicle and is
     not constrained: he faces the way he walks, `Army.cs:692-694`.

     Measured: travel against hull 90.5 -> 0.3 degrees for tanks nobody
     could shove that tick. Against the recording at forty-eight seeds,
     78 of 78 before and after.

     Residual, and it is not work: the browser figure is 12.7 degrees mean,
     3.6 median, taken on the drawn transform in a WebGL build. It is an
     upper bound - it carries the collision shoves and the opening frames,
     where a hull has just been spawned - and node already separates the
     drive at 0.3 degrees. No further instrumentation.

  y. Tanks and soldiers pursue a real goal - DONE. M1. Each unit has a
     job and walks toward it: close on the front, hold the line, engage a
     foe, fall back if overrun. Measured per axis, eight seeds, 90 s -
     97.44% of unit-ticks step toward their named job, infantry at 100.0
     on both axes. No random walk, no milling, no parking lot.

     A tank now drives where its hull points at EVERY speed. The
     projection sat inside the turn floor, so under 0.4 m/s a tank
     travelled along its raw controller output instead: hull against the
     step actually taken was 88.50 degrees below the floor and is 0.08.
     See y-6.

     Gunships fly their own side of the front, their nose follows their
     travel (23.60 -> 2.91 degrees off, y-3) and their bombs take a living
     clump near the front instead of a clock (y-5).

     Core against the recording, all three envelopes, freshly measured:
     68/72 with the air off, 67/72 with it on, 29/29 in the air table.
     What is still outside is named in y-4 with its miss and its cause,
     and what is left of the goal-following residual - 2.56% of ticks, of
     which give-ground is 1.35 - is named below. Neither is new work.

  z. Liquidation bombers / fallout - DONE, all six steps: the submitter
     with its protocol trace, the strike, the crater, the paths around it,
     the irradiation, and the picture.

     STEP 2, THE STRIKE. One accepted liquidation arms exactly one strike,
     in the tick it is consumed, at the densest knot of living units within
     40 m of the front at their own x. Both sides count: a liquidation is
     the market hitting the battlefield, not a side's weapon. Index order,
     ties to the lower index; with nobody alive near the line it falls on
     the front at x = 0, which is a place and not a draw.

     Deliberately NOT the gunship's `aimPoint`: that searches around where
     a falling bomb is already going, because the aircraft's inherited
     `vx` has decided the landing x. A strike has no aircraft, so the whole
     field is open and the only question is where the fighting is.

     Measured, 32 seeds:

       one liquidation            1 strike, load 3.00 M as submitted
       next tick, none submitted  armed 0, serial unchanged
       distance to the front      mean 9.2 m, p95 16.5, max 26.8 (band 40)
       living units within 16 m   24.8 at the strike, 8.6 anywhere else
                                  on the same front - a factor of 2.9
       load against size          1, 10 and 1000 M carried through 1:1
       size 0                     refused, no strike, serial 0
       replay                     same digest, same impact point
       two in one frame           load 9.00 M, liquidation serial 2,
                                  strike serial 1

     NOT IN THAT STEP: the strike does no damage. `WORDS` 2184 -> 2189.

     STEP 3, THE CRATER. Its own list of eight, NOT written into
     `st.ground.h`: the host re-uploads the whole relief whenever
     `terrain.Revision` moves, which would erase it, and a crater that has
     replaced the relief can never expire. `restart` carries the list and
     ages it, which is why the lifetime is counted in ROUNDS.

     One reader of the surface now. Three sampled `st.ground` on their own
     - the slope under the truck, the resolution against solids, the air's
     `groundAt` - and three readers of one quantity is how two of them end
     up disagreeing. `gradeAlong` takes a sampler instead of the grid.

     A cube root in `fixed.js`, Newton, with its own table test. A crater
     follows the cube root of the energy, which is also what makes the rule
     usable: three decades of load become a factor of ten and not 31.6.
     Both ends are quantities the core already names - `BOMB_RADIUS` 16 m
     at one million, the 40 m front band at a thousand.

     DEPTH IS MEASURED, NOT CHOSEN. The geologist's ratio is 0.4 of the
     radius, and at 0.4 the truck is TRAPPED: from the centre at full
     throttle it never leaves a 100 M or a 1000 M crater in forty seconds,
     and crawls out of the smallest in 36.2 s. The steepest wall is exactly
     2 * D/R; driven up a constant slope the truck holds 0.45 and slides
     back at 0.50. D/R is set at 0.15 - a wall of 0.30, the steepest where
     it still keeps more than a third of its 24.3 m/s flat speed.

       load     R        D       rounds   escape from the centre
          1 M   16.00 m  2.40 m    10
         10 M   19.08 m  2.86 m    11     7.0 s
        100 M   25.71 m  3.86 m    14     8.0 s
       1000 M   40.00 m  6.00 m    20    10.2 s
       5000 M   40.00 m  6.00 m    20     clamped, as designed

     Measured: crater centre against the impact 0.00 m in x and z; the bowl
     `d(r) = D (1 - (r/R)^2)` reproduced at 20 radii to 2.9e-4 m, D at the
     centre and 0 at the rim; steepest wall 0.297; replay gives the same
     digest AND the same crater list; the digest moves, so a replay cannot
     miss one; a 1000 M crater is gone after exactly 20 `restart`s.
     Envelopes unmoved: 68/72 air off, 67/72 air on, 29/29 air.

     THE PRICE, named and unpaid until step 6: six C# readers still ask
     Unity's terrain rather than the core - `ArmyRenderer:970`,
     `CombatFx:226`, `RoadNetwork:48/172/173`, `DeliveryGate:126` - and
     `CoreDrivenTruck:405` places the truck itself that way. None of them
     knows about a core crater, so the drawn truck hovers over its own hole
     by up to the crater depth, 6.00 m at the deepest. Step 6 pays it.

     Still not in that step: damage, paths, irradiation, drawing.
     `WORDS` 2189 -> 2229.

     STEP 5, THE FALLOUT. The contract is one sentence - the truck driving
     through is irradiated, health drops, it can die - and it names no
     radius, no rate and no duration. C# names none either: there is no
     crater, no fallout and no irradiation anywhere in it. So both ends are
     measured against what the core already carries. NO LAYOUT WORD: the
     area is the crater's own radius and the rate is recovered from the
     stored radius, so it rides the same normalised load as R, D and the
     lifetime. One rule, four consequences.

     Anchors, both from quantities already in the core, both measured:
     crossing a 1 M crater costs 9.9 health, inside the courier hit's own
     `Rand(5, 11)`; crossing a 1000 M crater costs exactly the truck's 100
     and kills it. The falloff is the bowl's own `1 - (r/R)^2` - the
     fallout lies where the ground was thrown out of.

       load   R        crossing cost   standing at the centre
          1 M 16.0 m    9.9            dead in 22.6 s
         10 M 19.1 m   12.0
        100 M 25.7 m   33.8
       1000 M 40.0 m  100.0, lethal    dead in 3.6 s

     One tick at the rim and half a metre outside it: 0.0000 both. Half a
     metre inside: 0.0116. At the centre 0.4666 against the 28/60 = 0.4667
     the constant states. Withheld by `practice`, like every other hit on
     the truck; NOT divided by `TRUCK_ARMOUR`, because 1.5 is plating
     against a shell and the word here is irradiated.

     A seventh vector, `fallout`, carries it: four craters and a truck that
     drives into one alive, 4.9 s inside and 77.9 health lost to it. The
     `liquidation` vector could not - its truck never meets a hole, and its
     digest is unchanged by this step, which is how the gap was found.

     Envelopes unmoved: 68/72 air off, 67/72 air on, 29/29 air.

     STEP 6, THE PICTURE. Two things asked for and two given: a warning
     while the truck is in the bowl, and the atom on the crater. Both read
     the CORE - `CraterCount`, `CraterAt`, `Irradiated` - and `Irradiated`
     is a distance against the core's own radius, the same test the core
     makes before it applies a dose. Nothing here computes damage and no
     second bowl is drawn. `DrawFallout` is built on `DrawWaypoint`'s
     shape: same camera lookup, same `WorldToScreenPoint`, same `Shadowed`.

     Measured in the running WebGL build, the truck moved by the core's own
     `teleport`, the warning read back out of the running HUD:

       at the centre         warning ON    0.00 m
       half the radius       warning ON   20.00 m
       0.5 m inside the rim  warning ON   39.50 m
       0.5 m outside         warning OFF  40.50 m
       20 m outside          warning OFF  60.00 m
       back at the centre    warning ON    0.00 m

     R is 40.00, so it switches at the rim and nowhere else - the picture's
     analogue of step 5's 0.0116 against 0.0000.

     THE SYMBOL IS DRAWN, NOT TYPED. `U+2622` was typed first and the
     build's font has not got it: the warning came up reading IRRADIATED
     with nothing either side and the crater carried the missing-glyph box.
     Three blades and a hub off the same 1x1 texture the rest of the HUD
     uses, and photographed.

     No core changed in this step, so vectors, guard and envelopes are
     untouched by it. The 6.00 m hover from step 3 stands and misplaces
     nothing here: the mark is drawn at the crater's own world position and
     the warning is a position test, neither of which reads the terrain.

     AND THE ARM HAD NO CALLER, which the close-out question found and the
     six steps did not. `BlwpCore.Liquidation` was written in step 1 and
     nothing ever called it: `MarketFeed.OnLiquidation` still had no
     subscriber, so in the player build no liquidation ever reached the
     core and the whole arm was built, measured and unreachable.

     `Bootstrap` subscribes it now, and carries the simulation clock the
     contract asks for. Both numbers are the feed's own rather than
     invented: `MarketFeed` drops a liquidation at `Age > 90f`, so ninety
     seconds is what that feed calls a while ago, and it is both the
     silence that starts the clock and the interval it ticks at. The size
     is drawn over the span the core's crater rule is defined on, one
     million to a thousand million. It goes through the SAME
     `BlwpCore.Liquidation` the live feed does, which is why a simulated
     strike and a real one cannot look different - the core is handed one
     input and cannot tell which sent it. `Bootstrap.Simulated` says which,
     for the HUD's mark, and nothing else reads it.

     Proved in the running build without anything injected: liquidation
     serial 0, strike 0 and craters 0 at 30, 60 and 95 seconds, then 1, 1
     and 1 at about 130. Photographed with the truck in the hole: the
     warning, both trefoils, the atom on the crater, and under it
     "SIM - no liquidation on the feed".

     STEP 4, THE PATHS. `Army.AvoidWrecks` (`Army.cs:533-552`) already has
     the rule and it is not the wrecks: a radial push of `(r + size) - d`,
     3.2 m for a tank and 0.6 m for a man. Plain metres, no PhysX, no nav
     mesh, no terrain height, so it ports as it stands with its own two
     sizes. The wrecks stay out; what is taken is the shape.

     A push after the step, the same class as the map edge beside it and
     as `resolveSolids` for the truck. The TRUCK is not in it - it drives
     through the bowl, which step 3 measured it can.

       inside the crater radius, 8 seeds, 90 s   before      after
         infantry                                22.63%      113 of
                                                             2,662,217
                                                             = 0.0042%
         armour                                  15.31%      78 of
                                                             775,015
                                                             = 0.0101%
         nearest approach to the centre          0.03 m      17.80 m
                                                 0.08 m      18.96 m

     The 191 remaining ticks sit at 32-39 m against R = 40 - the rim, not
     the bowl. `separatePair` runs after the push and is a candidate, not
     a cause; under a hundredth of a per mille, not chased.

     The dead-centre guard is C#'s own and does what C#'s does - it returns,
     to keep the divide off a zero. It briefly carried a push of mine so a
     unit standing exactly on the centre could not be left in the bowl;
     measured, that never happens - 0 of 345,600 unit-ticks - because the
     push runs after the step and a step is 0.04 to 0.11 m, always past the
     hundredth of a metre. A rule C# has not got, guarding a case that
     cannot arise, so it is gone rather than kept as decoration.

     AND THE RING HOLDS THE TRUCK, which is measured behaviour and not a
     regression to be voted away. Escape from the centre at full throttle,
     no steering:

       load     before step 4   after
        10 M      7.0 s          3.7 s    faster: the bowl is empty now
       100 M      8.0 s          4.5 s
      1000 M     10.2 s          trapped at 180 s

     The cause is measured, not guessed: with only the infantry pushed out
     the truck leaves all three (7.0 / 21.8 / 10.2 s), so it is the ring of
     twenty-four tanks. A straight-driving truck does not get through it.
     The step 3 assertion is NOT relaxed and gets no steering; an escape
     with steering, if it is ever wanted, is its own named step with its
     own measurement.

     Envelopes unmoved: 68/72 air off, 67/72 air on, 29/29 air. (x)
     untouched: hull against the step taken 0.00 deg above the turn floor,
     0.08 below. Only the `liquidation` vector's digest moved - the other
     six carry no liquidation, so no crater, so the push never runs, which
     is itself the check that it acts only where it should.

     THERE IS NOTHING TO PORT. `MarketFeed.cs:15` opens
     `!forceOrder@arr` and `:125-144` builds a `Liquidation` from
     `q * ap`, but `OnLiquidation` has ZERO subscribers and the only
     consumer of the list is `DriveHud.cs:1093`, a debug line that counts
     them. C# has no liquidation bomber, so there is no recording to
     measure against and C# is not the intent here - the rule is the
     player's. And the core never saw the market at all: `sim.js:124`
     builds its price tape from a fixed hash and does not even use the
     argument it is handed.

     A liquidation happens on an exchange, so it enters as an INPUT and is
     carried in the state, where the digest covers it and a replay is
     closed. `submitLiquidation(st, size)` queues it; `step` is untouched
     and consumes the queue first thing in the tick, before anything
     moves, drawing no random number - the order is protocol. Three words
     appended after the squads, so no offset in front of them moves:
     pending, last consumed, and a serial that counts every acceptance so
     a replay which dropped one cannot match.

     Size is in MILLIONS of USD, Q16.16. Dollars in Q16.16 overflow a
     signed word at $32,768; millions reach $32 billion at a resolution of
     $15.26.

     Exercised in the running WebGL build, both submitters:

       submit 2.5      pending 2.5, serial 1
       after the tick  pending 0, last 2.5
       sim clock, 2.5  last 2.5, serial 2     same size, same result
       1.0 then 7.0    pending 7, serial 4    larger wins, both counted
       size 0          refused, state unchanged

     The live feed and the simulation clock are two callers of one
     function, so they cannot drift: the core sees one input, not two
     sources. `WORDS` 2181 -> 2184, so every golden vector's digest is
     rewritten - unavoidable for state a replay must carry - and a seventh
     vector, `liquidation`, carries the queue itself as `[tick, size]`
     pairs.

  z-old. Liquidation bombers / fallout, the rest of the letter. Live Binance
     futures liquidations (`!forceOrder@arr`) scramble a bomber with an
     atomic load. Liquidations are rare, so there is a **simulation
     toggle** that fires them on a clock when the feed is quiet, same
     visuals, marked as sim in the HUD.

     Tactical, not random: the strike picks a place that matters near
     the front (a cluster, a choke, the truck's line). Size of the
     liquidation = size of the crater / fallout. Terrain is reshaped
     and the crater stays **10-20 rounds**. Units path around it while
     it lasts.

     The truck driving through is irradiated: health drops, it can die.
     On-screen warning plus the atom symbol. Not a gunship sortie — a
     different air arm. Do not mix the two.

  PRESENTATION READING A DEAD PHYSX VALUE. Four lines, none of them M1 and
  none of them item 7, because there is no combat in any of them. Named with
  their reason rather than carried under a closed item.

  t. The tyres had no source - DONE. `GameAudio` read `truck.Slip`, which is
     `|InverseTransformDirection(_rb.linearVelocity).x|`, and the body is
     kinematic while the core drives: measured in the player build, 0.00 at
     speed, so the tyres were wired and silent.

     THE CORE ALREADY WORKS IT OUT. `rules/vehicle.js:147-152` decomposes the
     velocity into the chassis frame to spend the friction circle on it -
     `rx = fz, rz = neg(fx)`, `across = vx*rx + vz*rz` - and then throws the
     number away. So this is not a quantity the core does not hold, which is
     what this entry used to say; it is one it holds and does not publish.
     No word was spent on it: `T_VX`, `T_VZ` and `T_HEADING` are published
     already, and `BlwpCore.TruckSlip` reads the file's own projection off
     them. The axes are the file's, not a sketch - right is (cos h, -sin h),
     and having it backwards would report a corner as a straight line.

     Measured in the player build, full throttle, before against after:

       straight   core-slip 0.000        tyres 0.000
       corner     core-slip 0.664-1.723  tyres 0.015-0.079
       PhysX slip 0.000 in both, which is what it was worth all along.

     Silent when it should be, heard when it should be. One source, not two
     formulas side by side; the editor keeps PhysX because there is no core
     there.

     AND THE READER WAS CHECKED AGAINST THE CORE'S OWN ARITHMETIC, not just
     against the tyres. C# projects with `Mathf.Sin`/`Cos` where the core
     uses its integer tables, so the two can differ: driven at full lock,
     largest slip 10.453 m/s, the largest gap between them is 2.67e-4 m/s -
     0.0026% of it. That is table-against-float and it is presentation, not
     simulation. Not measured separately: the handbrake, which reaches the
     same number through a lower `GRIP_HAND` and so follows from the
     mechanism rather than from its own run.
  u. `ChaseCamera` never leads - DONE. `ChaseCamera.cs:296` now reads
     `BlwpCore.Velocity` when a core answers and keeps `linearVelocity`
     for the Editor, where there is no core. One assignment; the formula,
     the 6 m/s threshold, `yawDamp`, `distanceAtSpeed`, `heightAtSpeed`
     and `topSpeed` are untouched.

     THE LINE ABOVE, WHICH SAID `BlwpCore.TruckSpeed`, WAS WRONG, and the
     reason is worth keeping. `TruckSpeed` reads `T_WHEEL`, which despite
     its name holds `total` from `rules/vehicle.js:222` - the resultant
     BEFORE the 34 m/s cap is spent on it, while `T_VX`/`T_VZ` are
     written after. The two part company exactly where the cap bites: 12
     ticks in 2400 on a hard drive, by up to 5.101 m/s. It is also a
     scalar, and the branch it was meant to feed is an `Atan2`, which
     needs a direction. `linearVelocity` was the planar body velocity;
     that is `T_VX`/`T_VZ`, and `BlwpCore.Velocity` already published it.
     No new reader, no layout word.

     One vector fed FIVE things, not the one the entry named: `speed01`
     (reach and rise), the `Atan2` branch, the cornering load behind the
     lean, and the lens. All five read a truck standing still.

     Measured in the player build, headless Chromium, both numbers on the
     SAME drive - the old source is logged beside the new one, so this is
     one run and not a pair of runs:

                        stand      straight, full     corner, full
       |v| camera       0.000      7.014-16.028       3.669-19.326  m/s
       |v| old PhysX    0.000      0.000              0.000         m/s
       Atan2 branch     0/2        7/7                5/9
       old branch       0/2        0/7                0/9
       reach            9.000      9.928-11.121       9.486-11.558  m
       old reach        9.000      9.000              9.000         m
       rise             4.200      4.571-5.049        4.394-5.223   m
       old rise         4.200      4.200              4.200         m

     So: at rest the two agree, which is the control. Driving, the camera
     takes the Atan2 branch every sample and the old source takes it in
     none; reach grows by up to 2.56 m and rise by up to 1.02 m, and the
     old ones do not move at all. PhysX is no longer the source.

     Not measured separately: the lean and the lens, which read the same
     vector through `speed01` and `Dot(v, forward)` and so follow from the
     same swap rather than from their own run.

     WHERE THE BRANCH POINTS, which the run above did not check. That the
     Atan2 branch is taken says nothing about the direction it produces:
     if the core's axes ran the other way from Unity's, the camera would
     take the branch and sit in FRONT of the truck. Measured, same build:

       straight, 8 samples above 6 m/s
         `wanted` 90.00, nose 90.00, core heading 90.00; delta 0.00 deg
         in every sample. No flip, no offset.

       corner, 6 samples above 6 m/s - `wanted` against the CORE heading,
       beside `asin(slip / |v|)`, the drift angle worked out from (t)'s
       quantity and never fed to the camera:

         wanted   core heading   apart    asin(slip/|v|)
          90.10       90.53       0.43        0.43
         104.79      111.25       6.46        6.46
         135.42      143.77       8.35        8.35
         169.22      177.81       8.59        8.59
         202.88      211.25       8.37        8.36
         236.02      244.30       8.28        8.28

       Largest disagreement 0.01 deg. The camera looks down the direction
       of TRAVEL, off by exactly the angle the truck is sliding - which is
       what the file's own header says it is for, and it is (t)'s slip
       arriving independently in (u)'s reading.

     One thing the same table exposes, and it is not the camera: the nose
     read off `target.eulerAngles.y` trails `BlwpCore.TruckHeading` by up
     to 0.63 deg in a hard corner - the transform is one frame behind the
     core that wrote it. That is render lag, not a camera defect, and it
     is why `wanted` had to be compared against the core heading rather
     than against the transform.

     Not testable in a suite: there is no core in the Editor
     (`BlwpCore` is stubbed unless `UNITY_WEBGL && !UNITY_EDITOR`), so a
     PlayMode test could only assert the `linearVelocity` fallback - the
     branch that is NOT the fix. The proof is the browser run above.
  v. `DriveHud`'s diagnostics panel - DONE. `DriveHud.cs:1082-1084` reads
     the core when a core answers and keeps the PhysX properties for the
     Editor, where there is no core. Tempo is `BlwpCore.TruckSpeed * 3.6f`
     - the SAME quantity as the main readout at `:299`, so the screen
     carries one speed and not two. Drift is `BlwpCore.TruckSlip`, the
     chassis-frame projection from (t); no second formula.

     What the panel was showing. Measured in the player build, headless
     Chromium, F1 panel open, the same probe before and after:

                        stand      straight, full    corner, full
       BEFORE
         HUD Tempo      0.00       0.00              0.00          km/h
         core x 3.6     0.00       26.77-55.41       1.91-68.16    km/h
         HUD Drift      0.000      0.000             0.000         m/s
         TruckSlip      0.000      0.000             0.039-2.645   m/s
       AFTER
         HUD Tempo      0.00       26.77-49.57       0.34-27.64    km/h
         core x 3.6     0.00       26.77-49.57       0.34-27.64    km/h
         HUD Drift      0.000      0.000-6.985       0.043-0.609   m/s
         TruckSlip      0.000      0.000-6.985       0.043-0.609   m/s

     After the swap the HUD figure equals the core figure in every sample
     of every phase - it is now the same read, not an agreement. The two
     drives are not the same drive (the truck is shot at), which is why
     the ranges differ between the halves; the pairing that carries the
     claim is HUD against core WITHIN each run.

     Share of the gap, one line: the panel showed 0 of 68.16 km/h and 0 of
     2.645 m/s - all of the speed and all of the drift, on a HUD the
     player can open with F1. Display, not a combat outcome.

     Named, not hidden: Tempo inherits the `T_WHEEL` residual from (u) -
     `TruckSpeed` is the resultant before the 34 m/s cap. It shows in the
     after-run's corner: `TruckSpeed` averages 3.373 m/s against a body
     3.364 m/s, low sample 0.094 against 0.043. Not corrected here; that
     would be a second speed on the screen and it would drag `:299` in.

     Not zero callers after all, which I had predicted: `SpeedKmh` and
     `Slip` each keep exactly ONE caller - the Editor fallback in this
     same panel. They stay.

     THE AXIS, which the swap above did not check. Both formulas are
     called "sideways"; that does not make them the same side. PhysX
     returns 0, so the two cannot be compared at runtime - but the OLD C#
     expression can be run on the CORE's velocity vector, which puts
     Unity's float transform maths against the core's integer tables on
     the same input. Measured, player build:

                        straight, full        corner, full
       core TruckSlip   0.0000                0.0802-0.7517  m/s
       C# transform     0.0000-0.1025         0.0829-0.7333  m/s
         apart          up to 0.10247         up to 0.05868
       C# yaw only      0.0000-0.0004         0.0810-0.7505  m/s
         apart          up to 0.00039         up to 0.00953
       chassis pitch    0.00-11.99 deg        11.34-13.18 deg
       chassis roll     -2.11-0.15 deg        3.32-4.13 deg

     So the old formula was never a 2-D lateral speed. `transform.
     InverseTransformDirection` uses the FULL rotation, and the renderer
     pitches and rolls the chassis to the ground - up to 13 degrees here.
     That tilt leaks into the local x axis and reported 0.1025 m/s of
     drift on a straight road where the truck was sliding exactly none.
     Strip the tilt and take yaw alone, which is what a 2-D simulation
     means by sideways, and Unity's floats agree with the core's integer
     projection to 0.00953 m/s worst, 0.0025 mean - the residual being the
     transform's heading lag from (u) (96.41 against the core's 96.57).

     C# was intent, and the intent was the lateral speed. The tilt term
     was a leftover of drawing the truck on a hill, and it is not
     reproduced.

  y-7. The front line was a price chart, not a line - FIXED.
     `rules/frontline.js` lays the tape across the map at one sample every
     4.13 m and took it raw, so the "front" ran +29.1, +2.6, +37.6, +5.8,
     +28.1, -8.6, +8.8, -40.5, -28.4 at 22 m steps. A man walking nine
     metres sideways saw his goal move sixty, and nobody ever arrived.

     THE WIDTH IS DERIVED. A rifleman closes in z at 3.4 m/s and moves in x
     at 2.4 m/s (`Army.cs:681`), so a slope above 3.4/2.4 = 1.42 m per m
     outruns him. Raw: mean 6.00, p99 14.21, 88% of the map over the limit.
     Box-averaged over N tape samples, five tapes:

         N     mean   p99    max   over limit   amplitude
          1    6.00  14.21  14.35     88.0%     +-56.7 m
          9    0.93   2.66   2.80     22.9%     +-38.5 m
         13    0.56   1.80   1.93      3.7%     +-42.7 m
         21    0.42   1.20   1.27      0.0%     +-39.5 m

     21 is the first width where p99 AND max are both under 1.42 and no
     part of the map is above it. The normalisation keeps the RAW window's
     range on purpose: against the smoothed range the curve re-expands to
     full scale and 9.9% of the map is still over the limit at N=21.

     C# has no filter. This is the core declining to copy a fault, not a
     term lost in the port: a quantity used as a FRONT LINE cannot have 4 m
     resolution and 60 m steps.

     AND THE RULER WAS WRONG TOO. `sim.js:805` handed EVERY unit one seam,
     taken at the TRUCK's x, so the whole battlefield lay on a flat line
     whose height the player carried around with him - +27.3 m with the
     truck at its spawn. `Army.cs:557` takes `FrontlineAt(v.x)` per tank
     and `:651` per man. Now `unitSeam` does.

     Arrival, measured against the front at each unit's own x, target 8 m
     for infantry (`Rand(4,12)` + `Rand(-5,5)`, identical in both engines)
     and 9 m for armour:

                        before        after
       infantry -    +5.2 sd 28.2   -10.7 sd  9.5   arrived
       armour   -   -22.6 sd 30.9   -22.0 sd 18.3
       infantry +   +36.5 sd 16.1   +32.8 sd 25.4   see (y-1)
       armour   +   +27.1 sd 35.6   +23.7 sd 20.4   see (y-1)

     THE 78 DO NOT MOVE. In the recording's own condition - the seam pinned
     at 0, which is how the C# reference was taken - `measure-army.js
     20260901 --seam0` prints output that is BYTE-IDENTICAL before and
     after: zero lines differ. With a flat tape the window's span is zero,
     so the filter cannot change anything and the per-unit seam equals the
     truck's. Core 54/54 and the guard 19 files clean after the golden
     vectors and `dist/blwp-core.js` were regenerated together.

     AND THE DRAWER WAS LEFT LYING, which the first pass missed. Smoothing
     the line the units stand on while `TerritoryMap.cs:102` still painted
     the raw one puts the picture 22.04 m from the men on average and
     49.14 m at worst - at x=68 the core had the front at -8.3 m and the
     drawing at -57.4. Five C# call sites read it and four go through one
     funnel, `Battlefield.FrontlineZ`: TerritoryMap:102, RunScore:268,
     DriveHud:1115 and RoadNetwork:74.

     Fixed by ASKING the core, not by copying the filter into C# - a second
     copy of a rule is how two numbers drift. `sim.js` exports `frontAt`,
     `blwp.jslib` carries `BlwpFrontlineZ`, `BlwpCore.FrontlineZ(x)` reads
     it, and `Battlefield.FrontlineZ` takes it when a core answers and
     keeps `PriceHistory` for the Editor, where there is no core.

     Proved on the running build, read out of the live page through the
     same `frontAt` the bridge calls:

       x     -88   -66   -44   -22     0    22    44    66    88
       raw  +29.1  +2.6 +37.6  +5.8 +28.1  -8.6  +8.8 -40.5 -28.4
       now   -3.6  +2.3  +4.7  +3.6  -0.9  -8.9 -20.4  -9.6  +2.6

     Photographed: the territory boundary is one smooth line with an army
     on each side of it.

     Two things measured here and deliberately NOT folded into it: (y-1)
     and (y-2) below.

  y-3. The gunship's nose was pinned, not flown - FIXED, and it was the
     DRAWER, not the path. `ArmyRenderer.cs:454` set the yaw from `H_DIR`,
     which is the way the machine is crossing and is one number for the
     whole sortie, while its z chases `seam(x) +- (26 + sin(t*0.6)*9)`.
     Measured in the core over 150 s, seed 20260901: the drawn nose was
     19.4 deg off the true travel on average, 37.0 at p95 and 55.9 at
     worst - it crabbed. The z rate itself (mean 7.56 m/s, max 29.5) sits
     inside C#'s own clamp of 32.0, so the PATH was already faithful.

     Derived now the way `Army.cs:443-451` derives it - nose to the Atan2
     of the step, eased at 3 per second, bank proportional to the turn,
     clamped at 0.8 rad and eased at 3.5. Nothing in the simulation reads
     either, so they cost no layout word.

     Measured again in the running WebGL build, 60 samples:

                       mean    p95    max
       old nose       23.60  40.01  52.20 deg off travel
       new nose        2.91  13.84  29.07 deg off travel
       bank           -3.48  42.79  44.47 deg

     The residual is the easing, which is C#'s own, and the bank tops out
     at C#'s own clamp of 0.8 rad = 45.8 deg.

  y-4. The envelope reads 68/72 air off and 67/72 air on - EVERY LINE
     NAMED WITH ITS MISS AND ITS CAUSE. No rule gap among them, so no code
     changed. Seeds 1..32, pinned; pass `core-size-reinforce`, which is the
     only pass at the core's own establishment.

     AIR OFF, four lines. The miss beside the width of the core's own range
     across the 32 seeds:

       t=15 bull inf z        1.22 m of a 0.81 m range
       t=15 bear inf z        0.10 m of a 0.75 m range
       t=15 bear inf sd       0.47 m of a 0.70 m range
       t=30 density perTarget 0.33   of a 2.00   range

     Every one of those four quantities is INSIDE at every OTHER mark:
     the three infantry figures overlap at t=30, 60 and 90; perTarget
     overlaps at 15, 60 and 90. None is a standing difference.

     The three t=15 lines are one thing: the approach. At t=15 the core's
     range across seeds is the tightest in the whole table - 0.70 to
     0.81 m, because every seed walks in the same way - so a sub-metre
     systematic offset reads OUTSIDE where the same quantity later sits
     inside a 20 m range. 1.22 m against the 77.5 m the men have walked
     is 1.6%. The recording's own two same-establishment passes agree to
     the digit at t=15 (-40.16, 41.44, 4.44), so the target is solid and
     the offset is real - it is simply 1.6% of an approach, and it is
     gone by t=30.

     AIR ON, the same three plus two more, both `bear`, both t=90:

       t=90 bear inf z        core [12.36, 45.69]  rec 11.00
       t=90 bear inf sd       core [ 9.04, 28.51]  rec  6.65

     There were four here. `t=60 bear armour sd` and `t=60 bear inf z`
     came back inside when y-6 stopped tanks sliding below the turn floor,
     which is why the air-on count reads 67/72 and not the 65/72 this
     entry first carried.

     These are the air's own doing and they are not comparable in the
     direction they point: the recording was taken with NO AIR, so a core
     flying sorties is not being judged against its own condition. That is
     the dependency - they can only be settled by a C# recording made with
     the air on, which does not exist.

     Not dug into, by decision: nothing here is a rule gap, and the
     remaining goal-following residual is 2.56% of unit-ticks, of which
     the give-ground job is 1.35 points. See (y).

  y-5. The bomb takes a target instead of a clock - DONE.
     `Army.Release` drops on a timer and throws across the seam at a random
     10-22 m/s: it aims at nothing, and the core had copied that. C# is
     intent, and a gunship that flies over an army and lets go on a clock
     is not the intent.

     What is free and what is not, read from the flight rather than
     assumed: `vx` is inherited from the aircraft and nothing steers the
     bomb afterwards, so the landing x is settled the moment it leaves the
     rack. Only z can be aimed. So the search runs where the bomb is
     ALREADY going - around `x + vx * sqrt(2h/g)` - and takes the densest
     clump of living enemies within one blast radius of it and inside 40 m
     of `front(x)`. Index order, because a different order is a different
     battle. The 10-22 m/s band stays: a clump beyond its reach is
     undershot, not teleported to - aiming a bomb, not building a new one.
     The RNG draw stays drawn whether or not the aimed branch uses it,
     because the sequence of draws is the protocol. No layout word.

     AIR ENVELOPE 29/29, which is the measure that covers this:

                              before        after        recording
       bombsOwnGround         10 - 12       3 - 6        5 - 11
       bombsEnemyGround       12 - 17      17 - 18      14 - 17
       menPerEffectiveBomb  1.86 - 7.09  2.69 - 5.53  3.67 - 4.75
       dudShare                     -    0.48 - 0.62  0.50 - 0.58

     ONE ARMY QUANTITY MOVED OUT, and it stays out rather than being
     tuned away:

       t=60 bear inf z   before core [12.92, 43.52]  rec 14.34  OVERLAPS
                          after core [16.61, 58.23]  rec 14.34  OUTSIDE

     so 66/72 -> 65/72 with the air ON, seeds 1..32. The cause is named
     and it is not a defect of the aim: the recording was taken with NO
     AIR, so a core flying sorties is not being judged against its own
     condition there. Under `--airoff`, the recording's own condition, no
     bomb flies at all and the verdict is unchanged at 68/72 before and
     after - byte-identical output. A recording without air cannot referee
     an aimed bomb, and the envelope that can, does: 29/29.

     Golden vectors, `dist/blwp-core.js` and the template copy regenerated
     together. Twelve core reds preceded that and all twelve had ONE cause,
     measured rather than assumed: a bisect over 3600 ticks found NO
     divergence between bundle and modules, so the six "bundle matches
     modules" reds were failing on their last line - `assert.equal(
     bundled.hash(b), entry.final)` - against a recorded final hash, the
     same stale transcript as the six `vector:` reds.

  y-6. A tank slid sideways below the turn floor - FIXED. (x) says a tank
     drives only where its hull points. Both the heading update AND the
     projection onto it sat inside `if (far > TURN_FLOOR)`, so under
     0.4 m/s the tank kept `dx, dz` - the raw output of two separate
     controllers - and travelled along that instead.

       hull against the step actually taken   before   after
         below the floor                      88.50    0.08 deg
         above the floor                       0.00    0.00 deg

     The floor is C#'s own (`Army.cs:456`, step above `dt * 0.4`) but in
     C# it gates only the HEADING, because C# has no velocity constraint
     to gate - its step is always along its goal vector. Gating the core's
     projection with it put a guard on a rule it was never written for.
     The heading still stops updating below the floor, where the direction
     of a 6 mm step is noise.

     IT CLOSED THREE ENVELOPE LINES rather than costing any:

       army air on   65/72 -> 67/72   (t=60 bear armour sd and bear inf z)
       air           28/29 -> 29/29   (armourDestroyedByShell, [51, 59]
                                       against [43, 52])
       army air off  68/72 unchanged

     armourDestroyedByShell was the line y-2 left outside as a consequence;
     it is back inside and y-2's note stands as the record of why it left.

     NOT SHIPPED, measured and dropped: making the z controller
     proportional like the x one. The z branch is bang-bang - `dz` takes
     exactly two magnitudes and changes sign in 57.2% of ticks - and C#
     moves along one goal vector proportionally, so it looked like the
     cause of the whirl. It is not: with z proportional the hull's angular
     error is 30.2 degrees against 29.8, and the turn rate 63.3 deg/s
     against 60.7. A rule change that moves nothing measurable is not
     shipped.

     WHAT THE TURN RATE ACTUALLY IS, so it stops being read as a defect:
     `TURN_RATE` closes 3.61% of the error a tick, which is 2.21 per
     second - C#'s own 2.2. The hull's angular error is 29.8 degrees mean,
     and 29.8 x 2.21 = 66 deg/s, which is the measured mean. The error is
     LAG, not jitter: the direction it chases moves 1.9 degrees a tick and
     the goal itself moves 0.029 m a tick. Lowering it further means
     turning faster than C# or coupling the axes again, and both are
     already decided against.

  y-1. "The + wing never arrives" - WITHDRAWN. It was my measurement, not
     the core. Two faults in the instrument, both found by measuring again
     rather than by arguing:

       - I compared each unit's z against a FIXED standoff of 8 m from the
         front. The standoff is `Rand(4, 12) + Rand(-5, 5)` - 3 to 17 m,
         drawn per man and identical in both engines - so a man standing
         exactly on his own goal could read as 9 m adrift.
       - I took the MEAN of a whole wing. One wing's offsets are negative,
         so |mean| readings were never comparable between them.

     Measured against each unit's OWN goal, seeds 1..32, t=60, both wings:

                              +  wing        -  wing
       infantry still walking  544 (33.4%)   506 (31.1%)
       median age               16.7 s        15.5 s
       median distance to go   +33.6 m       -32.5 m
       armour still walking     79 (4.8%)     91 (5.6%)
       median distance to go   +13.0 m       -12.5 m

     Same magnitude, opposite sign. The wings are symmetric.

     WHAT THE NON-ARRIVERS ACTUALLY ARE, which is the question that was
     asked: 63% of them are simply still walking, median 16.7 seconds old
     with 33.6 m to go. They are replacements. Reinforcements enter at the
     map edge - the core spawns at +-(79 - Rand(0,3)) and `Army.cs:17`
     has `HalfDepth = 79f` with the same draw, so the walk is C#'s own -
     and the recording does the same thing: 37 lost and 33 arrived by t=60
     in its own pass. 13.7% are stopped by the halt (s) put in. 13.8% of
     armour is held by `abstand` or `feind`, both C# jobs. 0.1% step away
     from their goal and 0.2% are stalled.

     And in the recording's own condition - seam pinned at 0, air off,
     seeds 1..32 - all EIGHTEEN t=60 quantities overlap, both wings:
     bull inf z [-27.87, -7.93] against -13.55, bear inf z [8.51, 22.35]
     against 14.34, bull armour z [-30.96, -13.32] against -18.09, bear
     armour z [12.08, 35.17] against 22.13.

     Two things I also claimed and withdraw: the losses (85 against 69)
     are not the cause, because both wings show the same marching share;
     and the front does NOT sit off centre in play - averaged over the map
     it is at +1.04 m in all 32 seeds, so the two approaches differ by
     2.1 m, 3%, 0.9 seconds. Neither can carry a 32 m residual.

     ONE ASYMMETRY IS REAL AND IS NOT EXPLAINED: the + wing has 118 men
     stopped by the halt at t=60 against the - wing's 54, 2.2 times as
     many, on the same seeds. It is 7.2% against 3.3% of the wing. No
     cause is claimed. It is small beside the marching share and it does
     not move the envelope, so it is listed rather than chased.

  y-2. The front's depth scale was 8% short - DONE, and the figure this
     entry used to carry was stale. It said 7.4% and 11.03 m at the edge;
     that was measured BEFORE the smoothing landed. On the tree as it
     stands the core's amplitude is 39.3 m against C#'s 61.2 - 35.8%
     shallower, 49.18 m apart at worst.

     THE GAP SPLITS IN TWO, and only one half is an error:

       constant   3.1 m   14%   a wrong port value - fixed here
       tape jag  18.8 m   86%   filtered on purpose - stays out

     `PriceHistory.FrontlineZ:128` returns `(n - 0.5) * worldDepth * 0.72`
     with `n` in [0, 1], so +-0.36 of the FULL depth. `MempoolTerrain` has
     width 260 and depth 170, exactly twice the core's HALF_X 130 and
     HALF_Z 85, so that is 0.72 of the HALF depth. The core had 0.6667 -
     the same quantity in the same units, eight per cent short. 43690 ->
     47186. Amplitude 39.3 -> 42.4 m, the predicted 3.1 m to the digit.

     The other 18.8 m is the jag, and it stays out. A man saw his goal
     move sixty metres for nine of sideways walk and 88% of the map was
     above his closing rate; a front he cannot close on is not a front,
     whatever its amplitude.

     ITS SHARE OF WHAT IS STILL FAILING IN (y) IS ZERO, measured rather
     than assumed: with the C# constant in a copy, the pinned verdict is
     68/72 air off and 65/72 air on - identical to the digit, same lines,
     same ranges. Both verdicts run under `--seam0`, where the tape is
     flat, `span` is zero, and the function returns 0 before it reaches
     the scale. The recording cannot referee front depth because it was
     taken with the front at 0. This was fixed because the number was
     wrong, not because a test asked.

     ONE QUANTITY LEFT THE AIR TABLE AS A CONSEQUENCE, and it is listed
     rather than tuned away:

       armourDestroyedByShell   before core [51, 57]  rec [43, 52]  OVERLAPS
                                 after core [53, 60]  rec [43, 52]  OUTSIDE

     so 29/29 -> 28/29, missing by one - AND IT IS BACK INSIDE SINCE y-6,
     at [51, 59] against [43, 52]. What is below stands as the record of
     why it left, not as an open line. The cause: a deeper front brings
     the two lines into the 46 m gun more often, so shells kill more
     armour. It was already at the edge - the old overlap was 51-52 alone.
     It is a GROUND figure carried in the air table as a control; it
     measures neither the bomb nor the front, and it stays on (y) as a
     consequence with its numbers rather than blocking the fix that a
     wrong constant needed.

  v-1. `Raeder n/4` and `Pos` in the same panel - MEASURED, NOT TOUCHED.
     Both were in the probe above; neither is in (v), and neither is (w).

       `Pos` is ALREADY the core. `rb.position` against
       `BlwpCore.TruckPosition` agreed to the printed two decimals in all
       six phases of both runs - stand (-100.40, 10.20), driving
       (-92.50..-51.26, -18.14..10.20). The transform is written from the
       core and the kinematic body follows it, so this line is correct as
       it stands. No work.

       `Raeder n/4` is ALIVE but wrong at rest. It counts
       `WheelCollider.isGrounded` over `truck.axles`, and the wheels still
       cast against the terrain: 0/4 standing still, 0-4 driving straight,
       2-4 through the corner, in both runs. A truck parked on the road
       reporting 0 of 4 wheels down is the defect; it is a PhysX raycast
       under a body the core is placing, so the fix is a real decision
       about what "grounded" means with no PhysX driving - not a swap.
       Left as its own item, with the numbers, rather than folded into a
       letter about Tempo and Drift.
  w. `Impact` takes its knock as `Vector2.zero` - NOT A DEFECT, LISTED SO
     THE ABSENCE IS ON THE RECORD. The core publishes no direction for a
     hit, and `Bind` drew no spark at zero knock either, so the two paths
     agree. It becomes work only if the core ever carries a knock.

  f. The infantry line, recorded - DONE.
     `test/vectors/csharp-infantry.json`, three passes in one Unity run.
     The two line passes reproduce `csharp-army.json` to the digit, which
     is what says it is the same run. Numbers under "The half that was
     never compared" below.
  g. A no-air control for `measure-army.js` - DONE. `--core=DIR`, and
     every line now says `air=on` or `air=off`. Measured both ways: the
     ground line was not hiding anything. Numbers below.
  h. The infantry line, corrected: rifle fire and the 24 m floor - DONE,
     and it needed a third thing nobody had measured: the standoff. See
     "What (h) moved, and what it did not" below.
  k. The squads: three a side at random x, not eight in shared columns -
     DONE. The air envelope is 17/17 for the first time. The line's own
     residual is named below and is (l).
  l. Why the core's riflemen kill half what the C#'s do - DONE as a
     DIAGNOSIS, with one term measured and left unattributed, and the
     reason it stays unattributed is a limit of the recording rather
     than a gap in the work. Causes ruled OUT by measurement or by
     reading C#, not by argument. Like for like, both air-on: 8-18 a round against 16-37.
     It is not the gun: air-off, the core's rifle kills land ON the
     recording (24-42 against 28-51). It is not the squad geometry: at
     t=0 every geometry quantity overlaps, both engines, four seeds. It
     is not the blast being more lethal - the lethality inside the radius
     is 1.000 in BOTH engines. It is not the line's depth: measured
     air-off against air-off, which the earlier reading was not, the core
     is inside the recording. And it is not knotting - a core bomb finds
     1.00-1.19x what a bomb anywhere else on the front that catches
     anybody finds, and its sizes are flatter than random.
     What is left is the 19 extra men a round the core's bombs cover,
     which is `menPerEffectiveBomb`, plus a residual of 2.6-3.9 rifle
     kills a round after the recording's own bomb-death exchange rate is
     applied. The slope bridge decided that neither needs a new Unity
     recorder pass.
     The squad-depth reading of the 19 men is RETRACTED and the
     correction is under "The 19 men" below: `riflePost` already carries
     the z offset (`RIFLE_SQUAD_Z`, per man -4.84..4.99, sd 2.851 against
     the C# draw's 2.887), and the 16.8 m that looked like a difference
     was a whole side including the men still walking in. In contact the
     core is 3.90-4.72 m against the 3.85 its own rule intends.
     What DID survive is core-only description, not a cause: a third of
     the bombs reach 2-4 squads and carry 54% of the covered men, and
     those bombs are friendlier (.482 against .367 over 201 and 332
     bombs). Also read and ruled out: the squad ANCHORS, constant for
     constant (count 3, init +-80, drift 0.12 rad/s at phase 2.4 rad and
     0.06 m a tick, clamp +-80); the release rule, constant for constant
     (vz = sign(front-z)*Rand(10,22), vx 30, gravity 9.8100, entry 19,
     standoff 26 weaving +-9 and height +-3); the counting definitions,
     word for word (`hit = infKilled>0 || armourKilled>0 || armourIn>0`);
     and `AvoidWrecks`, whose upper bound is ZERO because the recording
     ran with `Wrecks.Count == 0`.
     The discriminator that localises what is left: the core's bombs
     cover the recording's tanks (98 against 102, 0.96x) while covering
     28% more men (350 against 274, 1.28x), from FEWER detonations (137
     against 146) at the same effective count (68 against 68). The ground
     the bombs find is not busier; it is the infantry. Air-OFF the
     infantry density measures already sit on the recording (`meanNearest`
     20.8-40.2 against 20.87-42.3), so the difference is made by the air -
     and air-on the recording publishes no position, no spread and no
     headcount over time. The stock of unread infantry rules in `Army.cs`
     is exhausted.
     And it is not the flat approach, which was the one named rule
     difference the pass turned up: measured at the bombs, 90% of the men
     they take are taken where the line is already 8 m deep or more, and
     the two bombs that did land on a plank are 16 men of 350. Nor is it
     a phase of the round - per detonation the core kills 1.39x the
     recording early and 1.41x late, which is flat.
     The early-window rifle deficit that was named here as next -
     kills per shot 0.0199 against the roll's own 0.045 - is EXPLAINED and
     is a rule fault, not the gun: `length2` overflows past ~181.5 m and
     returns 0, and the rifleman's truck test (`sim.js:722`) has no axis
     rejection, so men on the approach burn a 2.5-4.5 s reload on a truck
     200 m away. Take those out and kills per foe shot is the roll in both
     windows. It is therefore NOT a candidate for the slope residual.
     EVERY PHANTOM FIGURE IN (l) AND IN THE SECTIONS BELOW IS THE STATE
     BEFORE (m) - the 0.0199, the 19-21% of early reload writes, the
     ladder from 0.0186 to 0.0435. (m) has since guarded both truck tests
     and the phantom share is 0.7% / 0.7%; the tools no longer reproduce
     those numbers, and they are kept because they are how the fault was
     found, not as a current reading. See "The 0.0199 was an
     integer overflow" below, and "The squads measured against Army.Spawn",
     "What a bomb is worth, taken apart", "The depth, air-off against
     air-off", "What a bomb finds, per detonation", "The slope", "Where
     the bombs land, and when" and "The rifle line divided by the
     meeting" below.
     CLOSED ON THIS: `menPerEffectiveBomb` is core 4.47-6.25 against the
     recording's 3.67-4.75. By this item's own standard - overlapping
     envelopes, not containment, because four seeds of a different army
     cannot reproduce four seeds of the C# one - that quantity OVERLAPS,
     and the tool prints it as OVERLAPS. The 19 men are the difference of
     the POOLED means (5.15 against 4.03), the core is above on all four
     seeds, and the armour control at 0.96x makes it a directed signal
     rather than scatter. It is recorded as a measured, unattributed
     residual and NOT as "close enough". Attributing it needs air-on
     positions, which only a new Unity recorder pass can publish, and
     that pass has now been declined three times.
  m. The `length2` overflow at the two truck tests - DONE. Both truck
     tests now reject on each axis BEFORE calling `length2`, so it no
     longer reads the truck as zero metres away past ~181.5 m. That is
     the guard `pickRifleTarget` (`army.js:320`), `pickTarget` (`:379`),
     `threatAt` (`:423`), the armour crowding scan (`sim.js:676`) and the
     solids scan (`solids.js:56-66`) already had, and the trap was
     written down at `army.js:417-421` all along.
     It was not only a wasted clock. Both branches fire and hit: a
     rifleman took a 2.5-4.5 s reload and a 0.045 roll at the truck
     (`sim.js:722`), a tank a 40-99 tick clock and the same roll
     (`army.js:273`), and the hits landed on `T_HP`. Damage is an M1
     quantity, so this was a wrong OUTCOME, not a cosmetic one.

     measured, before -> after
       phantom orphan share of reload writes   15.0% / 3.6% -> 0.7% / 0.7%
         (w0-w2 / w3+; what is left is the already-measured "the foe died
          in this tick" class, not an overflow)
       legitimate truck shots, the control      594 / 1512  -> 599 / 1503
       tank-ticks reading the truck inside 26 m
         when it is not                    5454 of 439684  -> 0
       truck damage over the six vectors                13  -> 5
       air-on rifle kills, 16 seeds                  O15.7  -> O16.9

     Suites, counted separately and in the foreground: core 47 tests, 47
     pass, 0 fail; determinism guard 19 files clean; Unity PlayMode 174
     total, 164 pass, 2 fail, 8 skipped; Unity EditMode 124 total, 123
     pass, 1 fail. Every failure is PRE-EXISTING and was measured rather
     than assumed - the same PlayMode suite on the unchanged tree gives
     163 pass / 3 fail: `ArmiesAreActuallyDrawn`, `RoadsAreActuallyDrawn`
     and `TheGogglesAnimate`, the last being the load-dependent flake item
     1 already documents. The change made nothing red; it happened to
     catch the flake green. EditMode's `RifleFireProducesAFlashAndATracer`
     is item 7.

     Golden vectors deliberately regenerated, because the fix moves the
     draw order: a man who used to take the truck branch drew two numbers
     and now draws one when nothing is in range. `dist/blwp-core.js` went
     with them or `bundle matches modules` stays red. No new state word.
     `sim.js:790` was NOT touched - that is (n).
  n. The scoring path vs the old game - DONE, both halves. The truck
     earns past +81 m, and the score equals the old game's to the
     integer on 7 of 7 routes and 58342 of 58344 swept inputs.

     (1) The overflow - DONE in `fix(score)`. `earning` / `fromStart` still goes through
     unguarded `length2` (named at `sim.js:790` when found; the call now
     sits at the score step that feeds `earning()`). Past ~181.5 m the
     sum of squares wraps and returns 0, so the truck reads as standing
     on its start for every x beyond about +81 m on a map that runs to
     +130 (furthest corner 249.3 m from the apron). The eastern third of
     the field is inside the fault. That is a BLWP outcome, not an army
     number. Host-`st.units` danger stays (e); it was not dragged in.

     IT IS NOT THE SAME GUARD (m) PUT ON THE TRUCK TESTS - it is its
     mirror, and this is the part to carry to the next `length2` found
     anywhere. The army's tests ask whether a point is INSIDE a radius,
     where a large axis RULES THE ANSWER OUT and may be rejected. This
     asks whether it is OUTSIDE one, where a large axis PROVES it and
     must be ACCEPTED. Copying (m)'s rejection unchanged would have kept
     the bug intact. The guard now lives in the rule, not the call site:
     `earning` takes the two components instead of a distance, because
     the distance is the thing that cannot be trusted, the way
     `pickRifleTarget`, `pickTarget`, `threatAt` and the solids scan each
     own theirs. It had no test coverage, so nothing was loosened.

     golden vectors, before -> after

                     overflow   ticks that     ground gained    final
                       ticks    should have    and never paid   exposure
                                earned
       straight      2867 -> 0    90 -> 0     33.53 -> 0.00 m  200.1 -> 214.8
       slalom        2847 -> 0    95 -> 0     33.37 -> 0.00 m  187.9 -> 201.9
       reverse       1221 -> 0    90 -> 0     33.53 -> 0.00 m  186.1 -> 195.3
       handbrake        0 -> 0     0 -> 0      0.00 -> 0.00 m    3.0 ->   3.0
       idle             0 -> 0     0 -> 0      0.00 -> 0.00 m    0.0 ->   0.0

     The ground it stopped paying for is the RUN-IN, from x = 80.4 to the
     eastern edge - where the danger is highest and what the exposure
     exists to price. Accrual ran from d = 24.9 m, where the truck leaves
     the apron, to d = 180.82 m, and stopped dead at the boundary. The
     score column does not move in these six because none carries cargo,
     so `scoreOf` is zero either way - which is exactly why half (2)
     below is a separate measurement and not a corollary of this one.

     The loss was permanent within a run: `fromStart` had one reader, but
     `S_BESTX` advances whether or not a tick earned (`sim.js:882`), so
     ground crossed during the overflow raised the high-water mark
     without ever being paid and could not be earned back.

     Two measurements of mine were wrong on the way and were caught by
     instrumenting rather than by argument. The first pass reported 43
     denied ticks and 16.05 m because it gated on `S_STATE === 1`;
     `RUN_LIVE` is 0 (`rules/gate.js:17`) and the state going to 1 at
     t = 13.73 s is the run ENDING. And I read the exposure as accruing
     after that transition, which would have made the loss total; it
     accrues before it.

     Air envelope still 29/29, infantry covered 1.12x, armour 1.01x. Core
     47/47, guard 19 files clean, PlayMode 174/164/2/8, EditMode
     124/123/1 - item 7's baseline. `SafeRouteScoresNearNothing`, which
     this file expected the work might move, was checked BY NAME and
     passes.

     (2) Exact old-game scores - DONE. Seven of seven routes identical,
     and 58342 of 58344 across the whole grid. `tools/measure-score.js`
     prints both columns; it is the tool, not a claim:

       route      E        ticks   C      x         old    core
       straight   214.787    824   0.700   130.0 m  1050   1050
       slalom     201.934    849   0.700   130.0 m  1050   1050
       handbrake    3.010   2852   0.700   -80.4 m    15     15
       reverse    195.294    824   0.700  -130.0 m  1050   1050
       idle         0.000   3600   0.700  -100.4 m     0      0
       practice   214.787    824   0.700   130.0 m  1050   1050
       past81m    204.778    735   0.700    81.2 m  1050   1050

     Three separate faults, each found by measuring and each shrinking
     the gap; none of them was a threshold:

       every step truncating                48.1% disagreed
       rounding only the last step           1.0%
       rounding each multiply and divide     0.5%
       carrying the 1000 from the first step 0.2%
       pairing the inputs                    0.003%

     1. THE ROUNDING MODE. `RunScore.cs:106` ends on `Mathf.RoundToInt`;
        `scoreOf` ended on `>> 16`, which throws the fraction away. Every
        truncation leans the same way, so they add rather than cancel and
        the core sat exactly one point low on half of all runs. `fixed.js`
        gained `mulRound`, `divRound`, `mulDivRound` and `toIntRound` for
        this. `mulFast`, `div` and `toInt` are NOT touched: truncation is
        correct for the simulation, where it is a rule applied identically
        on every engine, and wrong only where the number is REPORTED and
        some other implementation rounds it. The score is the only such
        number in the core so far.

     2. THE GRID. Collapsing E, T and C into one Q16.16 fraction of at
        most 1.0 before scaling by a thousand quantises the score to
        1000/65536 = 0.0153 points, and every surviving disagreement sat
        inside one such step of the .5 boundary - measured, not assumed.
        Carrying the thousand from the first step spends the headroom
        instead (no intermediate passes 1500 ONE, none passes 2^53) and
        the grid becomes 1/65536 of a point. `exposureFactor` and
        `timeFactor` remain as the readable statement of the rule and
        remain the tested ones, but `scoreOf` no longer forms either on
        its own. The time clamp moved onto the TICKS - T = 3900/ticks held
        to [0.25, 1.5] is exactly ticks held to [2600, 15600] - which says
        the identical thing without a factor, and gives an instant run its
        1.5 without a separate branch.

     3. THE PAIRING, and it was mine. The sweep fed the old formula the
        decimal 0.4 and the core the Q16.16 26214/65536, which are not the
        same cargo. That is the not-a-pair trap this item has now set
        seven times. Handed the numbers the core actually holds, the
        residual fell from 142 to 2.

     The two are one value: E = 171, ticks = 3600, C = 0.5 and the same
     figure again at ticks = 7200, C = 1. Both are 1000 * 171/190 *
     3900/3600 * 1/2 = 975/2 = 487.5 EXACTLY, checked as a rational, not
     as a float. A true half-point tie has no right answer available to
     fixed point; the core says 488. .NET's `Math.Round` under
     `Mathf.RoundToInt` breaks a tie to even, which is also 488, but the
     C# product is float32 and may not land exactly on the tie, so this
     is recorded as a tie and NOT claimed as agreement.

     One state word moved and it was the right one: index 21 =
     `O_SCORE + S_DELIVERED`, 1049 -> 1050, on straight/slalom/reverse/
     practice. `handbrake` and `idle` deliver nothing and did not move.
     Checked word by word against a pre-change copy of `src/` before the
     vectors were regenerated, so "only the score moved" is measured.
     The first attempt at that check compared `st.length`, which is
     `undefined` on a `{u8, i32}` state, so the loop never ran and
     reported "0 words differ" for every vector - a vacuous pass, caught
     because it contradicted the red hashes.

     Golden vectors regenerated on purpose (rule change) and `dist/
     blwp-core.js` with them. Core 47/47, guard 19 files clean, node vs
     bundle-node identical, stage 0 acceptance PASS; cross-version and
     cross-arch SKIPPED as always in this loop (one runtime, no docker).
     PlayMode `ScoreTests` 9/9 - the first run showed
     `HeatRaisesTheExposureRate` red and the second run of the identical
     tree was green, which is item 7's recorded flake and its rule.
  i. The reload stagger - DONE, and the reason given for it was wrong.
     The spawn drew a staggered reload and threw it away on the next
     line: `U_TARGET = nextBelow(rng, 180)` and then `U_TARGET = -1`. The
     word is shared - the armour's reload counter and the rifleman's
     squad - and the -1 cleared it before the infantry branch wrote the
     squad in. That branch overwrites it anyway, so the clear only ever
     cost the ARMOUR its stagger. `Army.cs:262` draws
     `reload = Rand(0f, 3f)` and `:604` counts it down every tick; the
     core's 0-179 ticks is the same 0-3 s. Before: -1 on every tank of
     every seed, one distinct value. After: 22-24 distinct values.

     THE FAILURE THE COMMENT NAMED DOES NOT HAPPEN. It says the clear
     lets every tank fire on its first tick in index order - "one army
     went from eleven to two while the other lost nobody". Measured air
     off, seam pinned, four seeds, before the fix:

       first armour shot      bull 7.80-7.88 s     bear 7.80-7.88 s
       free shots before the
         other side fired     bull 0-1             bear 0-2
       bullArmour - bearArmour, t=5..30
         core  [0,0,-1,-1,-3,-1] [0,0,0,-1,-5,-3] [0,0,0,-1,-1,0]
               [0,0,0,2,0,-1]
         REC   [0,0,0,-1,-1,-1]        (`core-size-reinforce`, the 12/36
                                        pass - `attrition` is 24/72 and
                                        is not a pair)

     Both sides open within a twentieth of a second of each other, the
     free-shot count runs to BEAR on one seed, and the asymmetry sits on
     the recording's. The rout the comment describes belongs to an army
     whose tanks all arrived together; they now arrive scattered and the
     stagger has expired before anyone has a target. The divergence was
     real, its price was about one shot.

     IT IS NOT BEHAVIOUR-NEUTRAL, though, and the reasoning that it would
     be was caught by the vectors going red rather than by argument. With
     the seam pinned the stagger changes nothing; in the vectors, with a
     moving seam and a driving truck, it does:

       end of vector      armour alive      truck hp
         straight           21 -> 20         92.00 -> 92.00
         slalom             20 -> 18         91.58 -> 91.58
         reverse            21 -> 19         88.14 -> 88.14
         idle               20 -> 19         22.46 ->  4.26
         practice           21 -> 20        100.00 -> 100.00

     The hashes would have moved even had behaviour been identical: a
     checkpoint covers the whole state buffer and `U_TARGET` is in it.

     Everything else holds: air envelope 29/29, infantry covered 1.12x
     and armour 1.01x, courier tank 100.00 / rifle 0.00, and (m)'s axis
     guard still at zero disagreements. Core 47 tests 47 pass 0 fail,
     guard 19 files clean, Unity PlayMode 174/164 pass/2 fail/8 skipped,
     EditMode 124/123 pass/1 fail - the three failures being item 7's
     recorded baseline.
  j. Courier fire: tanks, at 34 m - DONE, in two halves.
     The core did have tank courier fire; "none, ever" was the recording's
     ATTRIBUTION, since the recorder splits rifle from tank by the size of
     the hit and the core wrote only flat ones. What it had was a second
     gun bolted onto the tank - its own 40-99 tick clock, the rifle's
     0.045 roll, 26 m and one flat point. The C# has nothing of the sort:
     the courier is a TARGET CHOICE inside the tank's existing gun. So the
     parallel weapon was deleted rather than widened, and `army.js:273` no
     longer exists as a courier path at all.
     Both weapons now follow `Army.StepArmour` and `Army.StepInfantry`: a
     tank fires its own gun when engaged with an enemy inside 46 m and
     takes the truck instead only when it is inside `CourierRange` 34 and
     NEARER than that enemy, for `Rand(5, 11)`; a rifleman looks for a foe
     FIRST, fires at nothing when he has none, and takes the truck only
     when it is nearer than the man he picked, for `Rand(1.5, 3.5)`.

     measured, air off, truck parked at (0, 0), seed 20260901, 90 s

                                  before    after    recording
       tank shots at the truck       263      249    ~296 (163/0.55)
       tank hits                    11.8     ~137          163
       rifle shots at the truck      246       30    ~133 (6/0.045)
       rifle hits                    ~11     ~1.3            6
       damage dealt a round         23.0    ~1099       1285.6

     That closes about 1076 of the 1262.6 points that were missing - 85%.
     Damage is computed UNSATURATED because the core's truck holds 100
     points and `T_HP` floors at zero: it dies at t=13.9 s and the column
     goes blind after that, where the recorder accumulates past 100. Shots
     and hits do not saturate and are the acceptance.

     THE OBLIGATION FROM (m) IS KEPT and checked rather than assumed. The
     axis rejection moved with each weapon's reach - 34 m in the gun block
     (`sim.js:718`), 26 m in the rifle (`sim.js:790`) - and the tool
     evaluates it the way the rule does, in fixed point: over 689 gun
     shots, ZERO disagreements between the rule's reach and the true
     distance. Before (m) it was 5454 of 439684 tank-ticks reading the
     truck as inside 26 m when it was not.

     What is left is presence, and it is not this item's: see "The truck's
     neighbourhood" below.
  o. The truck's neighbourhood - CLOSED. There was no missing army: the
     recording pins its front through the parked truck and the core's tape
     puts it 28 m away, and pinned, the recording lands inside the core's
     envelope on damage and on presence alike. One real port bug and one
     real movement rule came out of the letter on the way, and the
     diagnosis was wrong four times before the pairing was.

     RETRACTED, TWICE, BOTH MINE.

     First: this entry once read "tanks within 34 m are 8 in the core
     against 17, 3-12 over the round; riflemen 13 against 27". The
     recording's column is right, the core's was never read - the tool
     prints 2 and 0. Checked on today's tool and rules, today's tool on
     ad93d7a's rules, and ad93d7a's tool on its own rules; all give 2 / 0.

     Second, and worse because it was acted on: 287ae29 said the gap was
     "the armour's standoff", with the armour a median 30-42 m behind its
     own line and 11% of it overrun. That was measured with
     `frontlineZ(tape, THE UNIT's x)`. `sim.js:635` samples the seam ONCE
     at the TRUCK's x and hands the one value to every unit. Against the
     line the simulation actually uses:

       overrun               0% of armour ticks, not 11%
       |z - its own hold|    median 0.1-1.0 m, p75 26-31 m
       past                  -5.1 to -14.1 m, every tank on its own side

     The armour holds its line to within a metre. It was never the fault.
     Three measurements of mine in this letter were not pairs - the wrong
     column, the wrong half-extents (92/92 for a 130 x 85 field), and the
     wrong seam - which is the same trap the whole item keeps setting.

     THE ONE REAL FAULT, and it is a port bug. `StepArmour` reads
     `goalZ = v.z - v.Dir * 6f` and then `speed *= 0.35f`: the six is a
     GOAL six metres back, the rate is the walk cut to a third. This core
     had `BACK_OFF = 6 * ONE` spent as `dz = BACK_OFF * side * dt` - the
     six read as a SPEED, six metres a second for as long as the crowding
     lasted, and squarely in z. Wrong unit and wrong component in one
     line.

     Fixed in the core's own terms rather than by copying the magnitude
     C# is left holding. C#'s backward rate is `0.35 * speed * 6/gl`, a
     leftover of steering at `foe.x` and at the seam as one vector, and
     that coupling was ported here once, measured, and reverted. So: a
     crowded tank's HOLD moves six metres further back, it walks there at
     a third of its speed, and it stops. Bounded, in metres, no coupling,
     and unlike a velocity it cannot accumulate over a round.

     Measured before and after, 24 seeds, same marks:

       tanks within 34 m      before          after
         t = 10 s             [5, 10] Ø 7.1   [5, 10] Ø 7.1
         t = 30 s             [0,  3] Ø 1.3   [0,  5] Ø 2.3
         t = 60 s             [1,  4] Ø 2.1   [0,  4] Ø 2.5
         t = 90 s             [0,  3] Ø 2.2   [0,  3] Ø 1.8
       |z - hold| at t = 90 s median 0.91     median 0.69

     It barely moves the neighbourhood, and that is reported rather than
     hidden: the crowded branch is only 10-11% of armour ticks and the
     hold was already being met. It is fixed because it is wrong, not
     because it moves a number.

     WHAT THE GAP ACTUALLY WAS. The recording's courier pass pins
     `FrontlineAt = _ => 0f` - a flat front running exactly through the
     parked truck. The core's front is the price tape, and under a truck
     at (0, 0) it sits at z = +28.1 m and runs from -41.6 to +28.1 across
     x, a 69.7 m spread, static all round. Tanks holding 5-14 m short of
     THAT line are 14-42 m from the truck by construction. `frontlineZ`
     returns 0 for a tape of zero span (`rules/frontline.js:32`), so a
     flat tape is C#'s `_ => 0f` exactly. Held flat, 24 seeds:

       t     tanks within 34 m   rec  in?   riflemen within 26 m  rec  in?
       10s   [10, 17] Ø 13.3       8   NO   [0,  0] Ø  0.0          0  YES
       30s   [ 2,  7] Ø  4.0       8   NO   [0, 51] Ø 15.8         21  YES
       60s   [ 3,  7] Ø  4.8      14   NO   [0, 41] Ø 14.8         18  YES
       90s   [ 2,  7] Ø  4.5      17   NO   [0, 29] Ø  9.4         27  YES

     The INFANTRY half is CLOSED: all four marks inside the envelope,
     including the 27 that was outside before. It was never 13 against 27
     and it was never a rule fault - it was a front measured in one place
     against a front pinned in another.

     THE ARMOUR HALF, done as its own attempt and not as a re-try.

     Localised first. With the front pinned the armour's z is held 5-14 m
     off zero, so "within 34 m" is very nearly "|x| < 31" and the question
     is entirely about x. The core puts armour on a LADDER of its own
     invention: eight fixed posts from -76 to +76, squad from
     `(index >> 3) & 7`. Only TWO of the eight are inside 31 m. Measured
     over 24 seeds at t = 90 s: 28% of tanks within 4 m of their post,
     35% within |x| < 31 against the recording's 71%. The SPREAD was
     already right - sd 45.7 against the C# army's 36-45 - and the SHAPE
     was wrong: flat where the recording's is peaked.

     C# is peaked because `goalX = engaged ? foe.x : v.x + sin(phase*3)*26`
     closes an engaged tank on its enemy's x. Its spawn is uniform
     (`Rand(-FrontX + 8, FrontX - 8)`) and the idle term is a bounded
     oscillation with no net drift, so the chase is the only thing that
     gathers it.

     Ported IN X ONLY, which is the whole difference from the version this
     core reverted. That one steered at `(foe.x, seam - Dir*9)` as one
     NORMALISED vector: normalising is what spent the depth, because the z
     component is then dragged along by the size of the x chase. Here x
     and z stay on their own controllers - z is still the hold, clamped at
     its own walk, and knows nothing about the foe. The ladder stays for a
     tank with nobody to close on; it is a place to wait, not to fight
     from.

     Measured over 24 seeds, front pinned, and BOTH of the failure modes
     that killed the reverted version are guarded, not just the number the
     change is meant to move:

       tanks within 34 m       before   after   rec  inside after?
         t = 10 s              13.3     13.8      8  YES  (was NO)
         t = 30 s               4.0      7.5      8  YES  (was NO)
         t = 60 s               4.8      8.0     14  no
         t = 90 s               4.5      7.9     17  no
       armour z spread t=90s   31.8     31.5          the depth is KEPT
       armour x spread t=90s   45.7     38.9          C# holds 36-45
       armour alive t=90s      19.8     19.1
       seeds with a side wiped  0/24     0/24

     The reverted version cost the z spread (9-12 down to 1.9-11.7) and
     two wiped seeds. Neither recurs: 31.8 -> 31.5 and 0 of 24. Two of the
     four armour marks are now inside the envelope where none was.

     REPORTED AGAINST MYSELF: the infantry half was called closed with all
     four marks inside, and this change moved one back out. Riflemen
     within 26 m at t = 90 s went from [0, 29] to [3, 22] against the
     recording's 27 - the MEAN moved towards it, 9.4 to 12.4, and the top
     of the band fell short of it. So the letter now stands at two of four
     armour marks inside and three of four infantry, where it was zero and
     four. That is a net gain and it is not a closure.

     THE INVENTED DENOMINATOR, retracted. This entry said the recording
     builds "to 17 of about 24 alive, 71%" against the core's "41%". The
     courier pass publishes inTank and NOTHING ELSE - no alive count, no
     death count - so both percentages were mine. The 24 came from
     `Populate(12, 36)`, which is the establishment at t = 0 and not the
     count at t = 90 s.

     The denominator is measurable after all, and it was already in the
     file: `Pass(sb, "core-size-reinforce", 12, 36, reinforce: true)` is
     the SAME establishment and the same replacement as the courier pass.
     Its reference row holds armour alive at 19-22, and lost/arrived at
     t = 90 s is 59/55. The core's own run gives a tick mean of 20.2 alive
     and lost/arrived 59/55 - identical. So the first of the two
     candidates is CLOSED: the core holds the right number of tanks and
     replaces them at the right rate. Nothing about the gap is
     establishment, reinforcement or attrition.

     It also makes the gap BIGGER than reported, not smaller: 17 of about
     20 living tanks stand within 34 m of the courier point, and the core
     puts 7.9 of 20.2 there.

     THE SECOND CANDIDATE, TESTED AND REJECTED - and the numbers are kept
     here so it is not tried again. A tank is unengaged 37.6% of the round
     (8 seeds, 87075 samples), and in 59% of those samples its ladder post
     lies FURTHER from the middle than the tank already stands, so the
     ladder looked like a restoring force undoing what the chase gathers.
     C#'s idle rule holds no absolute position at all -
     `goalX = v.x + Sin(phase*3)*26`, a zero-mean swing about wherever the
     tank is, which cannot drift and so is not the random walk the ladder
     was invented against. Ported faithfully, phase from the tick and an
     index offset standing in for `Rand(0, 6.283)`:

       tanks within 34 m     ladder + chase   swing + chase
         t = 10 s                    13.8             7.5
         t = 30 s                     7.5             4.1
         t = 60 s                     8.0             5.1
         t = 90 s                     7.9             4.3
       armour x spread             38.9            48.5   (C# holds 36-45)

     Worse on every mark and the spread leaves the C# band. The ladder is
     not only a restoring force, it is a BOUND: without it a tank that
     chased a foe outward and then lost contact simply stays out there,
     and the chase's excursions accumulate instead of being pulled back.
     Reverted, not committed.

     A THIRD CANDIDATE, ALSO REJECTED. The C# `Courier` is a point that
     cannot die, and a tank shooting AT it is not shooting at its enemy -
     so it is a fire sink, and armour standing in one stops killing armour
     standing in it. The core's truck holds 100 points and dies at
     t = 20.4 s, which is exactly where the two curves part. Held alive
     from outside the rules over 24 seeds, every mark came back bit for
     bit identical. The reason is in `sim.js`: `T_HP` is written at spawn,
     decremented by courier damage and read by the GATE, and by nothing in
     the army. A core tank goes on firing at a truck with no points left,
     so the sink is exactly as permanent here. Refuted, and I had waved it
     away once before on the grounds that `Courier` is absent from the
     movement code - true of movement, false of fire, and fire decides who
     is still standing there.

     WHERE THIS LETTER NOW STANDS, and it is a sharper place than it
     sounds. Against `passes.core-size-reinforce`, which is the reference
     at this exact establishment and replacement, the core matches on
     EVERY quantity that pass publishes:

       t = 90 s      core            reference
       inRange       2.00            1.70
       xSpread       35.8            34.8
       shooters      13              12
       tanksAlive    20              20
       lost/arrived  59/55           59/55

     The one measure that does not agree is `inTank`, and it is the only
     published quantity that is about a POSITION relative to a point
     rather than about shape. A standard deviation cannot tell the two
     apart: 17 of 20 tanks inside |x| < 31 with three stragglers at +-90
     gives sd 35, and so does a flat spread over +-60. Measured, the
     core's |x| at t = 90 s over 24 seeds is nearly flat -

       <10 16%   <20 21%   <31 18%   <45 12%   <60 18%   <80 11%   80+ 4%
       54% inside |x| < 31, mean -9.2, sd 39.4

     - against a recording that puts about 85% inside. The ladder is eight
     posts across +-76 m, and a flat spread over that range has sd 43.9 by
     construction. So the core reproduces the reference's SUMMARY
     STATISTIC without its cause, which is the same fault as reading a
     survivor count as an establishment, one level up.

     That is the whole of the remainder and it is not to be closed by
     moving the span or the post count until `inTank` comes out - that
     would be fitting the statistic a second time. It needs a mechanism
     that bounds the armour without spreading it, and the two obvious ones
     are already measured and rejected above: no bound at all (the swing)
     spreads worse, and the full 2-D chase takes the front's depth.

     TWO MORE SHAPES RULED OUT, so the next attempt does not start where
     the last three did. Single-link clustering on x at the gun's own 46 m
     puts the core's armour in 1.2 groups with the largest holding 96% of
     it: this is ONE battle that is too wide, not several battles. And
     replacement is not seeding the width - the core spawns a tank at
     `Rand(-88, +88)` where C# `Spawn` uses `Rand(-FrontX + 8, FrontX - 8)`
     = +-84, so the arrival is already the same.

     THE REFERENCE WAS EXTENDED AND IT OVERTURNED THE DIAGNOSIS ABOVE.
     `ArmyReferenceTests.cs` now publishes, for every pass, the armour's
     |x| in the same bands the core is measured in, and the courier pass
     publishes `tanksAlive` and `menAlive` beside `inTank` and `inRifle`.
     Both are counters over lists those loops already walk and neither
     draws a random number - which is the whole risk, since `Shot?.Invoke`
     and `CourierHit?.Invoke` build their arguments inside the `?.` and
     subscribing to them makes a different battle. Proved rather than
     asserted: both recorders were re-run and EVERY field that existed
     before came back identical, all 19 density rows and all 18 courier
     rows.

     What the bands say, core against reference, share within |x| < 31 at
     the marks the tool prints:

       t     30    40    50    60    75    90
       core  79%   30%   26%   26%   42%   50%
       REC   43%   37%   43%   55%   45%   55%

     The same range, oscillating, one core seed against one reference run.
     So "the core's x is flat where the recording's is peaked" is WRONG
     and is withdrawn. It came from putting the core's courier-pass shape
     beside a share read off `inTank` with a denominator I had invented.
     The core's armour shape matches the reference on the pass that
     actually publishes shape.

     THE DENOMINATOR, MEASURED AT LAST, and it moves the target rather
     than the core: the courier pass holds 20-23 tanks alive, and 17 of 23
     stand within 34 m at t = 90 s - 74%, not the 71% or 85% this entry
     has carried at different times. But its own plain-pass twin, the same
     establishment and replacement without a courier, sits at 43-55%. The
     recording's ARMY is not concentrated; its COURIER PASS is.

     BOTH OF THOSE SETTLED, and they close the letter.

     The solid truck does not push tanks. `resolveArmour` takes the TRUCK
     as its `v` and applies the whole accumulated push to it; the armour
     is never moved. It keeps the truck out of the tanks, not the tanks
     out of the truck.

     The diversion rate is already right. The core fires 535 gun shots a
     round and 63 of them at the truck; the recording lands 163 tank hits,
     which at the gun's 0.55 roll is about 296 shots. The ratio is 4.7,
     and the ratio of tanks in range is 12.6 to about 3, which is 4.2. Per
     tank standing there, the two divert alike. What differs is how many
     stand there - and that is a feedback loop, not a rule: presence feeds
     diversion, diversion spares the tanks that would have killed each
     other, and that feeds presence.

     WHICH BRANCH OF THAT LOOP A RUN LANDS ON IS DECIDED BY THE SEAM, and
     this comparison was never a pair. `World()` pins `FrontlineAt =
     _ => 0f`, so the recording's front runs through the parked truck. The
     core's is the price tape, which under a truck at (0, 0) puts it at
     z = +28.1 m. A truck 28 m off the line is a truck almost nothing can
     reach. That was caught for the PRESENCE columns several rounds ago
     and never applied to the DAMAGE ones - which are the 1285.6 this
     whole item has been about. Measured, 8 seeds, truck parked and held
     unsaturated the way the recorder accumulates past 100:

                                     damage over 90 s      tanks within 34 m
       core, seam at +28.1 m         [242, 396]  Ø 319.5   [2.0, 4.1]  Ø  3.0
       core, front pinned            [1012, 3357] Ø 2103.9 [8.1, 19.4] Ø 13.5
       recording                     1285.60               8-18, Ø 12.6

     Pinned, the recording falls INSIDE the core's envelope on both. The
     letter's premise - "half as many guns as the recording" - was an
     artefact of comparing an army holding a line at +28 m against one
     holding a line at 0.

     CORRECTED LATER, AND IT IS MINE: every row this letter captioned
     "air off" was measured with the air ON. The helper wrote
     `st.heliClock` and `st.sortieClock`, and neither is a key on the state
     - the sortie clocks are STATE WORDS at `O_AIR + AIR_BULL/AIR_BEAR`,
     which is how `measure-courier.js` has always done it. The scratch
     scripts copied the idea and not the mechanism, and
     `tools/measure-presence.js` shipped with the same fault.

     Re-measured with the clocks actually pinned, and with the truck's
     armour divisor now in the core, the numbers below change and the
     CONCLUSION DOES NOT:

       front pinned, 8 seeds, truck held unsaturated
         damage over 90 s     [157.3, 1562.2] mean  993.9   rec 1285.60  INSIDE
         tanks within 34 m    [4.2, 16.1]     mean   12.8   rec Ø 12.6   INSIDE
       front pinned, 24 seeds, riflemen within 26 m
         t = 30 / 60 / 90 s   [0,51] [3,41] [6,40]  rec 21 / 18 / 27  ALL INSIDE

     What was published before - damage mean 2103.9, and the riflemen
     outside at t = 90 s - carried bomb damage in a comparison against a
     recording whose pass is air "none", and predates the armour divisor.
     The mean is now BELOW the recording rather than above it. The letter's
     finding stands on the corrected figures; the old ones are struck.

     (o) CLOSED. Not by a rule change: by finding that the two were never
     being run on the same front. What the letter did leave behind is
     real and stays - the courier fire's ported `BACK_OFF` unit, the
     armour's x-chase, and a reference that now publishes the armour's |x|
     bands and the courier pass's denominators. And the core's pinned mean
     is 2104 against 1286, so it is ABOVE the recording rather than short;
     that is inside the band and is recorded here rather than smoothed.

  Order: f, g, h, k, l, m, j, i (all done), then n, o, then e (all done),
  then q, then p (both done), then r. The measurement set that order, not
  the letters: (q) was the whole remaining gap and (p)'s share of it is
  zero. (s), the halt, comes after (r): it explains 1 of 78 comparisons and
  costs a layout word, which is not the share that overtakes a queue.

### What the measurements say, and what they cost

Four attempts went at the wrong quantity before measuring settled it, and
the sequence is worth keeping because each step ruled something out:

  1. Assumed the units were clustering. Measured: they were DISPERSING to
     the map edges, with not one enemy in gun range after thirty seconds.
     The attrition that looked like a fast grind was no grind at all.
  2. Assumed too little contact. Measured: the C# army fights with 4.0-7.9
     enemies in range per tank against the core's 0.3-0.75 and STILL keeps
     three quarters of its armour. That ruled out contact and left
     lethality.
  3. Read the code where that pointed and found it in one line:
     `bool connects = Random01() < 0.55f` - forty-five per cent of shots
     miss, and the core took a hit off every shot. Invisible in the
     constants, because reload, damage and hit points all matched exactly.
  4. Assumed fire concentration. Measured: shooters per target is 2.0-2.2
     in the core against 1.6-3.1 in C# - fine. The difference was the
     TOTAL number of shooters, which is contact again, which is squads.
  5. Assumed the core was still too lethal, because the recording kept
     71-83% of its armour over a minute and the core kept a third.
     Measured the REFERENCE this time, not the core: the C# army loses
     125 tanks in ninety seconds and buys 115 replacements. It was never
     surviving. Nothing was wrong with firing or death.

The fifth is the one to remember: four rounds went at the core because
the reference was read as a survivor count when it was an establishment.
A measurement of the thing being copied is worth as much as a measurement
of the copy, and this file had never asked for one.

Two sign errors and one index collision cost a round each, and all three
had the same shape - a plausible model that produces no fight rather than
a wrong one:
  - the Bull army spawns at negative z, so its side is -1 while its Dir is
    +1; using side for the overrun test put the whole army on the
    fall-back line without a shot fired
  - sides were assigned by a coin toss per unit, giving sixteen tanks
    against eight, and in a lethal exchange an advantage compounds
  - squad = index % 8 collides with side = bit two: armour is every fourth
    index, so it fell into two squads, one per army, and the two lines
    stood at opposite ends of the field

### What the reference was actually saying

The question was whether the shooter count collapsing to zero by t=60 was
survivorship or drift. It was neither, and the measurement that settled
it also closed (b).

`tools/measure-army.js` counts losses per squad, logs every armour death
with the second and the x it fell on, and prints which squad columns each
side still holds. Run against seed 1 it said: the middle columns are
wiped, the survivors sit on the flanks, and from t=34 the nearest enemy
to any living tank is 49 to 154 m away against a 46 m gun. Nobody CAN
shoot. The board is not slow, it is over - largest movement by any living
tank after that is 0.15 m in a second.

That is a third reading, distinct from both survivorship and drift, and
it turned the question into: why does the C# army not do this? Four
things had to be fixed before the two could be compared at all:

  - the recording is 24 armour and 72 infantry A SIDE; the core fields 12
    and 36, because UNITS is 96 and every fourth index is a tank. The
    percentages were being compared across two differently sized armies.
  - the density series in the vector stopped at t=35. The claim "the C#
    army sustains 22-47 shooters at t=60" was measured against a
    reference that said nothing at t=60, and the vector had no shooter
    series at all.
  - the recording pins the seam at z=0. The core's seam is where the
    price tape puts it - +27.3 m - so bull started 105 m from the line
    and bear 51 m. An asymmetric fight compared against a symmetric one.
    `measure-army.js --seam0` pins it, which is what any comparison
    against the recording wants.
  - squads: C# gives them to INFANTRY ONLY (`Army.Spawn`, inside
    `if (!vehicle)`). C# tanks have no squad. The core gives squad posts
    to armour as well, and pairs the two sides into the same column, so
    an exchange ends with an isolated survivor holding a post.

With all four settled the answer is in one line of C#: `Army.Update` ends
with `RemoveAll(hp <= 0)` and then `Reinforce`. The C# army replaces its
dead - one tank a side every six seconds, faster the further behind it is
- and the comment on that cadence says it was added because a side sat at
0-1 tanks while the other held eleven. Which is the core's failure today,
exactly.

Measured, three passes in one Unity run (`ArmyReferenceTests`, all three
now in `csharp-army.json`):

    reinforce  24/72 a side, as it ships:  125 tanks LOST over ninety
               seconds, 115 replacements arrived, headcount 38-42 of 48
               throughout. The "71-83% surviving" was never survival.
    attrition  the same army, replacement off: 41 of 48 dead by t=40,
               nine left, shooters ZERO from t=40 to the end.
    core-size  12/36 a side, replacement off: 21 of 24 dead by t=50,
               five left, shooters zero from t=50.

Against the core at its own establishment, seam pinned, seed 20260901:
22 alive at t=15 (C# 22), 18 shooters at t=20 (C# 18), 9 alive at t=30
(C# 10), 8 alive at t=60 (C# 6 at t=50), contact lost from t=40 (C#
t=50). Firing and death agree. The constants agreed all along - reload
84-192 ticks against 1.4-3.2 s, 550/1000 against 0.55, damage 11-24
against hit points 60-99, which is C#'s 1.1-2.4 against 6-10 at the
ten-fold scale - and the remaining difference was a reference measured
under conditions the core was never given.

Cost of not measuring: the old note in this file, and the vector's own
comment, both concluded "too much lethality per shot, and that is where
to look next". Four constants would have been tuned to match an army that
was not surviving anything.

### The guard - CLEARED

`% SQUADS` became a mask written as `SQUADS - 1`, and the damage roll's
`/ 100 | 0` became `idiv`, a new helper in fixed.js for dividing plain
integers rather than Q16.16 values. Behaviour identical, and measured
rather than asserted: four seeds by ninety seconds, 339 lines of
positions, losses, shooter counts and death times, the same to the digit
before and after. `npm run guard`: 18 files clean.

### Reinforcement, and what it cost the golden vectors

(d)'s first part is in. The core replaces its dead the way C# does - the
clock only runs while a side is short, and `timer -= dt * deficit` brings
the next one faster the further behind it is.

Measured against `passes.core-size-reinforce`, the C# army at the core's
own establishment with replacement running, four seeds, seam pinned:

                          core (4 seeds)        recording
    armour alive t=30     19-20 of 24           19
    armour alive t=90     19-22 of 24           20
    shooters t=60         12-16                 14
    shooters t=90         13-17                 12
    lost / arrived        54-60 / 49-56         59 / 55
    contact lost          never, any seed       never

The shooter count is the line that matters. It was zero from t=34 to the
end of the round before this, on every seed.

**The golden vectors were regenerated deliberately.** All six diverged at
the first checkpoint, which is what `vectors.test.js` says must happen for
a rule change rather than be quietly accepted:

    straight   2bc86958... -> 7dce8ee6...
    slalom     9a8499be... -> d79d5034...
    handbrake  fb3502fc... -> 9a6ff1c3...
    reverse    ef05e257... -> 5fd481a3...
    idle       568ceef0... -> 869835d8...
    practice   beab4634... -> 75cef4a8...

The state grew by four words for the replacement clocks (`O_ARMY`,
appended after the units so every existing offset stayed put), but the
hashes would have moved without a single new word: the checkpoints cover
the whole buffer, all ninety-six unit positions included. `BlwpLayout.cs`
and `dist/blwp-core.js` are generated from the layout and were regenerated
with it - stale generated content has already cost this project two bugs
that looked like something else.

### The air arm, and the two numbers it does not reach

(d)'s second part is in. `src/rules/air.js` holds the sortie clocks, the
gunships, the ballistic bomb and the blast; `sim.js` runs them in C#'s own
order - the unit loop, then helicopters, then bombs, then replacements,
then the sortie clocks, which is `Army.Update` followed by
`Battlefield.LaunchSorties`.

Ported against `test/vectors/csharp-gunships.json` rather than against the
C# read out loud, and `tools/measure-air.js` prints the whole envelope
beside it. Four seeds, ninety seconds, seam pinned at zero, which is the
condition the recording was made under:

                             core (4 seeds)      recording
    sorties per round        10-12               11-12
    on-station share         0.72-0.90           0.69-0.93
    peak airborne            2                   2
    bombs per round          34-38               35-38
    off-field share          0.32-0.38           0.26-0.42
    furthest landing |x|     149.9-154.1         148.0-153.8
    first killing bomb       20.8-23.0 s         16.7-26.4 s
    infantry killed by bombs 71-100              60-76
    armour killed by bombs   10-16               9-12
    armour bomb share        0.16-0.27           0.15-0.22
    armour lost, air on      60-64               55-63
    armour lost, air off     53-61               54-60

Three behaviours the recording calls findings were COPIED, not corrected,
and each would have been a tempting one-line "fix":

  - the release gate is on where a bomb is LET GO, not where it lands. A
    bomb inherits 30 m/s along the gunship's track and falls from 19 m, so
    it is thrown sixty metres downrange and reaches |x| = 154 against a
    field that ends at 92. A third of every load hits nobody. Narrowing
    the gate would have deleted a third of the air war.
  - both sortie clocks start at zero, so two gunships launch on tick one
    and both are wasted - the armies are still at |z| = 79 and the
    gunships fly the seam between them.
  - `Detonate` has no hp check on its armour loop. Latent, measured 0/0 on
    all four seeds, and invisible in this core anyway: taking damage off a
    corpse leaves a corpse. Not guarded.

`Detonate` also has no `CourierHit`. A bomb cannot hurt the truck in the
C#, however squarely it lands, so the core does not invent it - pinned by
a test that plants a bomb on the cab.

**Two quantities do not reach the recording, and the air arm is not why.**
Friendly fire is 39-59% of a bomb's infantry victims against the
recording's 18-42%, and the dud share is 0.45-0.47 against 0.50-0.58.
Where the bombs LAND matches on every published figure, and the blast rule
is copied to the metre, so the difference is where the men STAND:

    the nearest pair of opposing riflemen in the core is 24.0 m apart,
    exactly, at every sample of every seed.

That is `BACK_OFF_RANGE` - army.js backs a unit off whenever an enemy
comes within 24 m, and applies it to riflemen as well as armour. The blast
radius is 16. **No bomb in this core can ever contain men from both
sides**, so which army a bomb kills is decided purely by which side of the
seam it fell on, and that comes out near an even split. The C# has no such
floor at all: `StepInfantry` walks a man to his standoff and leaves him
there, with no crowding rule and a rifle that reaches 26 m, so the two
lines interpenetrate. That is (c)'s line, not the air's, and it is left
alone here and pinned by a test.

The related second-order fact: the core's riflemen never shoot each other
either - rifle fire targets the courier only - so infantry deaths in the
core are bomb deaths and nothing else, where the recording has 16-37 a
round to rifles.

**The golden vectors were regenerated deliberately, a second time.** All
six diverged at the first checkpoint:

    straight   7dce8ee6... -> 34e5ff81...
    slalom     d79d5034... -> 7316919a...
    handbrake  9a6ff1c3... -> 4ae836b0...
    reverse    5fd481a3... -> b712aaf0...
    idle       869835d8... -> 869c5408...
    practice   75cef4a8... -> 6a012447...

The state grew by ninety-eight words - two sortie clocks, four gunship
slots and eight bomb racks, appended after the replacement clocks so every
existing offset stayed put (`O_ARMY` is still 2072; `WORDS` went 2076 ->
2174). The hashes would have moved without a new word regardless: the air
draws from the same stream the ground fight uses, so every unit after the
first sortie stands somewhere else. `BlwpLayout.cs` and
`dist/blwp-core.js` were regenerated with it.

Nothing is wired into `Battlefield.cs`, `Army.cs` or `ArmyRenderer` -
Unity keeps the live army until (e).

### The half that was never compared

(d) closed the air. Asking what item 2 still needs turned up something
older: **the infantry has never been laid beside the recording at all.**
72 of the 96 units a side are riflemen, and `csharp-army.json` carries
`n`, `z` and `spread` for them and nothing else - no death causes, no
nearest-enemy distance, no rifle fire. Every number that has been argued
over in this file is an ARMOUR number.

What the two engines do, measured (core: seed 20260901, `--seam0`;
recording: `passes.core-size-reinforce`):

                             core            recording
    armour alive t=90        10/12, 10/12    10/12, 10/12
    shooters t=20/40/60/90   23/13/17/14     20/15/14/12
    armour lost / arrived    60 / 56         59 / 55
    inRange t=60, xspread    2.80, 41.5      2.7, 38.8
    ----------------------------------------------------
    inf mean z t=30          -16.0 / +36.6   -11.6 / +14.7
    inf mean z t=60          -21.9 / +18.4   -13.6 / +14.3
    inf mean z t=90          -25.6 / +18.4   -17.9 / +11.0
    rifle deaths per round   0, by construction   16-37
    nearest opposing pair    24.0 m, exactly      not recorded

The armour agrees. The infantry stands 5 to 12 m further off the seam and
never fires a shot at another rifleman, and both come from the same two
lines of core:

  - `army.js` applies `BACK_OFF_RANGE` (24 m) to riflemen as well as
    armour. The C# has no crowding rule for infantry at all - `Separate`
    is called on `Armour` pairs only (`Army.cs:325`), and `StepInfantry`
    walks a man to his standoff and leaves him there. C# lines
    interpenetrate; the core's cannot come closer than 24 m.
  - the core's rifle fire targets the COURIER only. C#
    `Army.StepInfantry` picks `NearestEnemyInfantry` inside
    `RifleRange` 26 m, reloads 2.5-4.5 s, connects at
    `RifleHitChance` 0.045 for 1 hp, and only switches to the truck when
    the courier is inside a heat-weighted reach AND closer than that foe.
    The core fires at the truck whenever the truck is inside 26 m, and
    never at anybody else.

The second one is a TRUCK DAMAGE difference, not a decoration: it changes
how much rifle fire the player takes, in both directions, and truck
damage is M1's.

This is also where the air arm's two unreachable numbers come from, which
"The air arm" above had already traced to the ground line: the blast
radius is 16 and the floor is 24, so no bomb can contain men from both
sides. **The falsifiable prediction for (h):** removing the floor moves
the dud share from 0.45-0.47 up into the recording's 0.50-0.58 and the
bomb friendly-fire share from 39-59% down into its 18-42%, without one
line changing in `air.js`. If it does not, the floor was not the cause
and the air is.

**(f) is done, and the recording now says all of it.**
`test/vectors/csharp-infantry.json`, three passes, one Unity run, the same
flat seam-at-zero world and seed the army recording used:

                              C# recording      core
    nearest opposing pair     4.7 - 19.2 m      24.0, exactly, every sample
    same at 24/72             5.5 - 16.5 m      -
    mean nearest enemy        24.4 - 35.5 m     -
    riflemen with a foe <26m  18 - 50 of ~70    none can be
    rifle kills per round      28 at 12/36      0, by construction
    same at 24/72              90               0
    infantry alive            34 - 36 of 36     36, and only bombs take any

The two line passes reproduce `csharp-army.json`'s infantry columns to the
digit - `line` against `passes.core-size-reinforce` and `line-24-72`
against the top-level rows. That equality is the check that this is the
same run and not a second one that resembles it; without it the new
columns would be a fresh measurement of an unknown thing.

**A trap found while recording it, and it would have poisoned any future
reference.** Subscribing to an `Army` event can change the simulation:

    Shot?.Invoke(s, hit ? mark
                        : new Vector2(mark.x + Rand(-3f, 3f), ...));

The miss scatter is drawn INSIDE the argument, so `?.` skips two `Rand()`
calls when nobody listens and makes them when somebody does. The first
version of this recording carried a shot counter, and its rows walked away
from the stored ones from t=25 - which is exactly when the first shot is
fired. Dropping the counter put them back to the digit. `Killed` and
`Destroyed` are safe; `CourierHit` has the same shape as `Shot` and the
courier pass listens to it anyway, because a listener is the game's own
condition (`Bootstrap.cs:194`).

### What (h) moved, and what it did not

Three changes, all of them the same line, and the third was not in the
plan:

  - the 24 m crowding floor comes off the infantry. A tank is crowded
    only by another tank now, on both sides of the test, because
    `Army.NearestEnemy` walks the Armour list and nothing else.
  - rifleman on rifleman, from `Army.StepInfantry`: nearest enemy
    rifleman inside 26 m, reload 2.5-4.5 s, 4.5% to connect, one point
    off a man who has one. He carries ten in this core and a hit takes
    ten, and the spawn draw is C#'s own ternary - `hp = vehicle ?
    Rand(6,10) : 1` draws NOTHING for a rifleman. Before this every unit
    in the core spawned with a tank's hit points.
  - the standoff, which was found by measuring after the first two landed
    and watching the air numbers go the WRONG way. C# holds a man at
    `Rand(4,12) + Rand(-5,5)` off the seam - 1 m past it to 17 m short,
    piled up at 8. The core held him at a flat 0 to 8, mean 4: both lines
    four metres too far forward and half as deep, so they stood eight
    metres closer together than the recording's.

                          before (h)   after (h)    recording
    closest pair          24.0 exact   2.5 - 23.8   4.7 - 19.2
    rifle kills a round   0            19 - 34      28
    riflemen in range     none can be  3 - 57       18 - 50
    ------------------------------------------------------------
    dud share             0.45-0.47    0.38-0.46    0.50-0.58   OUT
    killed by bombs       71-100       65-98        60-76       now in
    friendly fire         39-46        34-49        11-29       OUT
    quantities overlapping   15/17        15/17

**The prediction in this file was wrong, and being wrong is what found
(k).** It said the floor alone would carry the dud share and the friendly
fire home. It did not: dud share moved the wrong way, and the residual
survived the standoff correction that fixed everything else. So the floor
was a cause and not the cause.

Armour did not regress, checked against a worktree at the commit before
(h) rather than from memory: shooters 4-23 before and 5-23 after over the
same four seeds, and armour lost/arrived 62/58 and 64/60 against the
recording's 59/55.

### The squads, and why a bomb here kills both sides

The residual has one measured cause, and it is not the air. Read off the
two sources rather than inferred:

    C#   Army.EnsureSquads: want = max(3, strength / 12), so THREE squads
         a side at 36 riflemen. Each anchor is Rand(-80, +80), drawn per
         side and independent of the other side's. Each man picks a squad
         at random and sits at anchor + Rand(-9, 9). DriftSquads walks
         every anchor by sin(Time*0.12 + i*2.4) * 3.6 * dt.

    core EIGHT squads, anchored on an even ladder from -76 to +76, and
         the anchor is a function of the squad index ALONE - so bull
         squad k and bear squad k stand at the same x, facing each other.
         Deliberate, from (a): unpaired squads made the two armies drift
         apart sideways and stop meeting.

Two consequences, and they are exactly the two numbers still outside:

  - **friendly fire.** Aligned columns mean a bomb that catches anybody
    catches men from both sides, so about half of what it kills is its
    own. Unaligned knots mean a bomb on enemy ground kills mostly
    enemies. Core 34-49 a round against the recording's 11-29.
  - **dud share.** Three knots of twelve leave most of a 160 m front
    empty, so a bomb thrown at random is likelier to hit nobody: the
    recording duds 50-58% of its bombs. Eight knots spread evenly cover
    the front, and the core duds 38-46%.

The fix is to give the infantry C#'s geometry - three squads a side,
anchors drawn at init and drifting, independent per side - and to leave
the armour's ladder alone, because C# tanks have no squad at all and the
core's ladder is what keeps its armies meeting. That is item (k). It adds
state words for the anchors, so it moves the vectors again.

### What (k) closed, and the one it left open

The infantry got `Army`'s own geometry: three anchors a side, drawn at
`Rand(-80, 80)` per side and independent of the other side's, walking by
`sin(Time * 0.12 + i * 2.4) * 3.6` a second and clamped. Armour keeps the
even ladder, because C# tanks have no squad at all and the ladder is what
stops the core's two armies drifting apart sideways.

The anchors are STATE, six words appended after the bombs. A clamped
integral is path-dependent - once an anchor has been held at the edge it
has lost the excursion - so no closed form in the tick can stand in for
it.

                       before (h)   after (h)   after (k)   recording
    dud share          0.45-0.47    0.38-0.46   0.48-0.54   0.50-0.58
    friendly fire      39-46        34-49       19-56       11-29
    killed by bombs    71-100       65-98       76-100      60-76
    quantities in      15/17        15/17       17/17

**Seventeen of seventeen.** The two the port has never reached - the ones
(d) traced to the ground line and left there, correctly - are in, and not
one line of `air.js` was touched to do it.

`csharp-infantry.json` now carries four seeds. The line turned out to be
seed-sensitive: three anchors a side drawn at random sometimes land far
apart, and then the two lines barely meet. A one-seed reference cannot
tell that from a fault, and this file has already paid four rounds once
for reading a reference as something it was not. Seed 20260901's rows are
unchanged by the recorder edit - asserted when the vector was rebuilt,
not assumed.

**And the residual, which is (l).** Like for like - both air-on, both at
12 armour and 36 infantry a side, the same four seeds:

    rifle kills a round      core 8 - 18     C# 16 - 37
    riflemen lost to bombs   core 76 - 100   C# 60 - 76

The core's riflemen kill about half what the C#'s do, and the core's air
kills about a third more of them than the C#'s does. The obvious reading
is that the two are the same fact - a line that is being rebuilt from the
edge all round is a line that is not in contact - and the obvious reading
is exactly what cost this file four rounds on the armour. It is a
question, not a diagnosis, and the first thing (l) does is measure which
way the causation runs: hold the bomb kills down and see whether the rifle
kills come up, or hold the contact up and see whether anything moves.

### The squads measured against Army.Spawn, and what that rules out

The standing story for (l) was a chain: denser men under the blast, so more
bomb dead, so more replacement churn, so less time in contact, so half the
rifle kills. Every link of it is a claim about GEOMETRY, and geometry is
measurable on both engines at once.

`tools/measure-squads.js`. The core is stepped; the C# side is REPLAYED -
`System.Random` seeded is a fully specified subtractive sequence and
`Army.Populate` draws from it in a fixed order, so the spawn can be
reproduced exactly. That is not taken on trust. The recording's t=0 row is
sampled BEFORE the first `Update`, so it is a pure function of the spawn,
and the replay is checked against it on every seed before one geometry
number is printed: n, mean z, spread, nearestPair, meanNearest,
inRifleRange, to the stored digit, on all four seeds AND on the 24/72 pass
with its six squads. Five for five. A seed that does not reproduce prints
REPLAY FAILED and reports no C# geometry.

What that buys: **t=0 is exact on both engines.** Both armies stand ON
their posts the tick they spawn - `unit.x = clamp(squads[squad] + offsetX)`
is the last line of `Spawn`, and the core does the same - so the whole x
geometry is formed up at t=0 and is measured, not modelled.

    at t=0, four seeds, seam pinned      core          recording
    men per knot                         7 - 17        4 - 19
    knot width (sd about its own mean)   3.3 - 6.1     4.2 - 6.7
    knot trail (mean x - anchor)         1.7 - 4.5     1.8 - 3.0
    nearest bull anchor to bear anchor   2.0 - 11.0    0.0 - 15.7
    front covered by a blast             0.70 - 0.97   0.72 - 0.98
    front a bomb duds on                 0.03 - 0.30   0.02 - 0.28
    front covering BOTH sides            0.24 - 0.44   0.18 - 0.61
    men within a blast of a random x     12.2 - 13.1   12.2 - 13.1

**Not one of them wanders.** The chain's first link is the density under
the blast, and it is 12.2-13.1 in both engines to the tenth. Over the round
the core's is 10.2-13.1 - LOWER, because its men are dead and awaiting
replacement, which is the opposite of what the chain needs. So (k) did not
leave a geometry fault behind, and (l) is not a squad-shape bug.

Three things the tool can say and one it cannot:

  - **The anchors are exact on both engines at every t**, not just at t=0.
    `DriftSquads` is a closed form in `Time` alone, clamped, and nothing
    else touches an anchor. Both engines merge a bull anchor with the bear
    anchor of the same index once both have been held at the same edge -
    the clamp eats the difference and it never comes back. That is C#'s
    own behaviour, reproduced, not a core fault.
  - **The line's depth is a real comparison over the round, UNDER THE
    RECORDING'S OWN CONDITION.** The recording carries mean z and a z spread
    at every sample, so it is the one shape number that can be laid engine to
    engine after t=0. This section first quoted it as `core 1.1-31.1 against
    the recording's 3.5-25.7` and called it the next thread. It was not a
    pair - the core was air-ON and `csharp-infantry.json`'s `setup.air` is
    `"none"` - and measured air-off against air-off it is not outside. See
    "The depth, air-off against air-off" below.
  - **The core's knots go lopsided over the round**: occupancy 1-21 where a
    knot nominally holds twelve, and a knot width that collapses to 0.0 -
    one man left on an anchor. Measured in the core only.
  - **What it cannot say is whether the C# does the same.** The recording
    holds no anchor, no squad and no offset after t=0, so the C# column
    over the round is marked PROJ - the drifted anchors carrying the spawn
    membership, nobody dying. PROJ's width is constant by construction and
    is therefore not evidence about the core's. It is a drift check and
    nothing more, and it is never quoted as the C#'s answer.

And the no-air control that settled (h) is **not available here**: the
squads landed in (k), which is after the air, so there is no build of this
core that has squads and no bombs. The pre-air worktree has no anchors to
measure.

**So is a fix needed in (l)? Not in the squad geometry - the numbers say
no.** Two candidates were left: the knot occupancy swing (1-21), which needs
a C# recorder pass to be a comparison rather than an observation, and the z
spread, which was thought to be a comparison already and outside. The second
was measured properly and is not outside; the first is answered below
without a recorder pass, by the concentration measurement. `Army.cs` is
still here - (e) has not deleted it - so the occupancy pass can still be
recorded, and the sections below say why it is not worth the round.

### What a bomb is worth, taken apart

The air's own number was still a product: `infantryPerEffectiveBomb`, core
4.47-6.25 against the recording's 3.67-4.75. A product cannot say which of
its factors moved, and the two candidates are opposites - either more men
stand under a bomb, or more of the men under it die.

Split, and both halves are measurable on both engines, because the
recording publishes `summary.infantry.insideRadius` per pass and not only
the ratio:

    perEffectiveBomb = menPerEffectiveBomb x lethalityInRadius

`tools/measure-air.js` writes the DISTANCE of every man under every
detonation now - what a bomb covers, band by band, and what it takes. No
rule was touched, no vector moved, no C# pass was recorded: the previous
version of the tool was run beside the new one on the same four seeds and
every line it printed before prints identically after.

    four seeds, seam pinned, air on      core            recording
    effective bombs                      16 - 18         16 - 18
    men under those bombs                76 - 100        60 - 76
    menPerEffectiveBomb                  4.47 - 6.25     3.67 - 4.75
    lethalityInRadius                    1.000           1.000
    perEffectiveBomb                     4.47 - 6.25     3.67 - 4.75

**The lethality is exactly one, in both engines, on every seed, and it is
not a fit.** The recording's `insideRadius` EQUALS its `killedByBombs` on
all four air-on passes (76/76, 60/60, 72/72, 66/66) and the core's does
too (84/84, 90/90, 100/100, 76/76), because both `Army.Detonate` and
`sim.js`'s `detonate` clear the circle rather than wounding across it. So
one factor is pinned at 1.000 and cannot carry anything: **the whole of
the air's excess is men covered.** The effective count is the same on both
engines - it is not that the core lands more bombs on people, it is that
the people it lands them on are more.

**Nothing is happening at the rim, either.** The ring is 14.67 m, which is
where the armour falloff (120 at the centre, `12 * (1 - d/16)` on the C#
scale) drops to the ten points a rifleman holds - so it is the armour
line's own counter-check, "could this bomb alone have killed him",
evaluated for infantry. It splits the circle into the disc a falloff rule
would take and the 16% of the area it would leave standing:

    share of the covered men outside 14.67 m   0.08 - 0.18
    the same share for men spread evenly       0.16
    men a bomb alone could not have killed     7 - 18 a round

Band by band the covered men track an even field to within the noise of
four seeds, so the core is not killing at a rim the recording cannot
reach, and a falloff rule would remove the same eighth from both. The band
shape is core-only - the recording holds no distances - and is marked so.

Two attribution checks came back clean, which matters because both were
ways the core's tally could have been inflated by the TOOL rather than by
the core:

  - **no double claims at all.** A body inside two circles in one tick
    would be counted twice; 0 on every seed, so `killedByBombs` is a
    headcount of distinct men. The recording's own `doubleFire.infantry`
    is 0 as well.
  - **`inf` never differs from `infIn` on a single blast.** The two are
    counted from different sets - everyone alive at the top of the tick
    inside the radius, and everyone who died anywhere and fell inside it -
    and they agree bomb for bomb.

**And one bound that is left open, deliberately.** 20-69% of the men a
bomb claims had an enemy rifleman inside 26 m at the top of that tick, and
from outside the core a rifle death and a bomb death in the same tick look
identical - the rifle fires in the unit loop, the bomb in the air phase
after it. That is a "could have", not a finding, and the arithmetic says
it is small: rifle kills are 8-18 over 5400 ticks and only 33-36 of those
ticks hold a detonation, so at most 0.12 of a man a round can be a rifle
kill wearing a bomb's name. It is not what halves the rifle line.

**So the causal chain is still open, and this is what it now has to
explain.** The core's air kills more because more men stand under a bomb,
not because its bombs are worse to stand under - and `measure-squads`
already said the men-per-blast at a random x is 12.2-13.1 on both engines
at t=0, and LOWER in the core over the round. The two facts only fit
together if the men under a bomb are gathered somewhere the x geometry
cannot see, which pointed at the line's depth. That thread is pulled in the
three sections below, and the depth turned out not to be the answer: quoted
like for like it is inside the recording's.

The air-off control, measured with `--sorties=off|grounded` rather than
quoted, because it is the column this whole item is read against:

    rifle kills a round, seam pinned   air off   air on   ratio
    core (squads), clocks pinned       24 - 42   8 - 18   0.43
    core (squads), gunships grounded   25 - 42   8 - 18   0.41
    C# recording                       28 - 51   16 - 37  0.66

    bomb kills a round                 air off   air on
    core                               0         76 - 100
    C# recording                       0         60 - 76

Air off, the core's rifle line IS the recording's. Air on, both lines fall
and the core's falls twice as far. (l) stays open on exactly that.

### The depth, air-off against air-off, and what the old pair was worth

`measure-squads.js` printed `z spread core 1.1-31.1  REC 3.5-25.7` and this
file quoted it twice as the one shape number still outside. **It was not a
pair.** `csharp-infantry.json`'s own `setup.air` is `"none"`: the C# line in
that column was never bombed, and the core's was - half its riflemen taken
by a blast and replaced from the edge over the round, and the spread of a
line is exactly the quantity that moves. Two different battles, and the one
number in the whole tool that the air can reach.

The tool now takes `--sorties=on|off|grounded` - the hold
`measure-infantry.js` already had, the sortie clocks pinned high from
outside the rules, no rule edited and nothing but the air's own state words
written - and the REC depth column is now CONDITIONED on the recording's own
setup block: `setup.air` must be `"none"` and `setup.seam` the pinned z=0
seam, or the column is withheld and the reason is printed in its place. Read
off the file rather than remembered in the tool, so that a re-record which
turns the air on cannot leave a stale pair standing.

Like for like - both air-off, seam pinned, the same four seeds, t >= 25:

    depth over the round               core             recording
    z spread                           1.0 - 24.1       3.5 - 25.7
    mean z, bull                       -21.2 to -7.6    -26.6 to -8.1
    mean z, bear                       10.1 - 25.1      10.4 - 31.4
    standoff, |mean z|                 7.6 - 25.1       8.1 - 31.4

Repeated with the gunships grounded instead of the clocks pinned - the other
hold, which pays the sortie's draws and takes only the bombs: z spread
1.0-24.3, standoff 7.6-29.8. The answer is not an artefact of which draws
were withheld.

**The deep half of the old finding was the air.** The core's line is never
deeper than the recording's by the envelope, and its per-seed maxima
(24.1, 21.8, 22.4, 18.3) sit against the recording's (20.9, 21.5, 23.1,
25.7) - two a little over, two under, which is four seeds. What survives is
the FLAT end, 1.0-1.1 against the recording's 3.5, and the per-sample rows
say exactly where it comes from:

    seed 20260901, air off, z spread of the bull line
    t =        0     5     10    15    20    25    30     35    45
    core       1.0   1.0   1.0   1.0   1.0   1.0   3.0    10.7  12.1
    C#         0.9   2.2   3.2   4.3   5.6   6.5   11.7   10.3  11.3

**The core's line marches as a plank.** From spawn to contact its spread is
its spawn spread to the tenth, because `RIFLE_WALK` is one constant for
every man. `Army.Populate` draws `pace = Rand(0.82, 1.18)` and
`nextRest = Rand(2, 9)` per man, so the C# line is 6.5 m deep by the time it
arrives. Once in contact the two track each other and stay tracking (10.7
against 10.3 at t=35, 12.1 against 11.3 at t=45, 17.0 against 19.7 at
t=50). The whole of the residual is the approach, it has a named cause in a
draw the core does not make, and nothing was changed for it here.

### What a bomb finds, per detonation

`menPerEffectiveBomb` is a mean - core 4.47-6.25 against the recording's
3.67-4.75 - and a mean cannot tell a uniformly denser line from a knotted
one. Those are the two readings of the same excess and they want opposite
fixes, so each detonation is now measured against its OWN counterfactual at
the tick it went off: the same bomb slid along x at its own z, and slid
along z at its own x. Empty ground is not a small bomb, so the control is
taken over the sweep points that catch ANYBODY - given a bomb that lands on
men at all, does this one land on more of them?

    air on, seam pinned, four seeds                CORE ONLY
    bombs that caught anybody                      10 - 11
      (of 16-18 effective, the rest being armour)
    men per such bomb, median / p90 / max          6-8 / 11-23 / 13-25
    top quartile's share of the covered men        0.33 - 0.49
      the same, for a bomb thrown anywhere on
      the field that catches anybody               0.48 - 0.59
    concentration in x, against a bomb at a
      random x at the same depth                   1.00 - 1.19
    concentration in z, against a bomb at a
      random z on the same x                       1.11 - 1.87
    covered men, sd in x / sd in z                 3.3-3.8 / 2.2-4.1

**The core's bombs are not landing on knots.** Along the front they find
what any bomb that catches anybody finds, to within a fifth, and their
spread of sizes is FLATTER than a bomb thrown at random (0.33-0.49 against
0.48-0.59) - the opposite of lumpy. Down the depth they find up to 1.9x,
which is the seam, where both lines' men are, and is what a bomb aimed at
the seam is meant to do. That also answers the knot-occupancy candidate (l)
was holding open: whether or not the core's knots go lopsided, its bombs are
not finding the lopsidedness.

Core only, and marked so in the tool: the recording holds no distances and
no positions, only `insideRadius` and a detonation count for the whole pass.
The comparison stays where it was, in DECOMPOSE, on the mean.

The band shape and the two attribution checks above were re-run beside the
previous version of the tool on the same four seeds: every line the old one
printed prints identically after, and the new tool adds `AIRCORE conc` rows
and nothing else. Same for `measure-infantry.js`, whose old output is an
exact prefix of the new, and for `measure-squads.js`, where the only lines
that moved are the depth block that was the point.

### The slope: what one bomb death costs the rifle line

The two open numbers are the core's rifle line (half the recording's) and
the core's bomb toll (a third more), and the standing question is whether
they are ONE fact or two. A man taken by a bomb stops shooting and is
replaced from the edge, so some of the rifle deficit is bought by the bomb
excess by arithmetic alone - and how much is not a matter of opinion,
because each engine publishes its own exchange rate:

    slope = (rifle kills air-off - rifle kills air-on) / bomb kills air-on

Both terms come from the same engine under its own two conditions, so the
slope needs nothing from the other engine. Of the MEANS, and only of the
means: the air draws off the same stream the ground fight uses, so air-off
seed X and air-on seed X are two battles and there is no seed-to-seed
pairing to be made. Every number is already recorded - the C# column is
`csharp-gunships.json`'s `noair` and `gunships` passes, the core's is the
two hold conditions.

                                       rifleOff  rifleOn  bombsOn  slope
    core (squads), clocks pinned         33.8      14.5     87.5   0.220
    core (squads), gunships grounded     35.0      14.5     87.5   0.234
    C# recording                         38.8      25.8     68.5   0.190

The gap this item is about, taken apart at the recording's own slope. The
terms are constructed to sum to it exactly:

    C# air-on 25.8 - core air-on 14.5 = 11.3 rifle kills a round, of which
      5.0   was already there AIR OFF (38.8 against 33.8)
      3.6   is the 19 extra men the core's bombs take, at 0.190
      2.6   is RESIDUAL - the core giving up more per bomb death
    with the gunships grounded instead of the clocks: 3.8 / 3.6 / 3.9.

**Three terms and none of them dominant, which is the finding.** The obvious
reading - one fact, the bombs - is a third of it. And the FIRST term is not
a fault at all: air-off, per seed, the core scores [42, 32, 37, 24] against
the recording's [28, 38, 51, 38]. It out-kills the recording on seed
20260901 and loses on the other three, the envelopes overlap (24-42 against
28-51), and the seed decides how well the two lines meet at all. That term
is four-seed scatter, not a deficit.

**So: is a Unity recorder pass worth it? No, and this is what decided it.**
The occupancy pass was the candidate, and the concentration measurement
above answers what it was wanted for without a round of Unity. What is left
is the 19 extra men a round the core's bombs take, which IS
`menPerEffectiveBomb` - already open, already outside, already measured
against a quantity the recording publishes - and a residual of 2.6-3.9 rifle
kills a round, about a tenth of the recording's air-on line, which both
engines' own exchange rates already bound. Neither needs a new recording.

And one number that looked like the churn story and is not. `Army.cs` is
still here, so it was checked rather than assumed: `replacementsArrived` in
`csharp-gunships.json` is **armour only** - `GunshipReferenceTests.cs:289`
computes it as `bullArmour + bearArmour + armourLost - ArmourPerSide * 2`.
Read against the core's total-slot arrivals it says 54-60 against 146-176
and the three-fold churn hypothesis looks proved. Read like for like it is
not there:

    replacements a round, air on       core         recording
    armour, by the recording's formula  56 - 62      54 - 60
    infantry, deaths - headcount lost   84 - 118     82 - 101

Ten per cent, not three-fold, and the infantry row is derived on both sides
from quantities both engines publish - killed by bombs, killed by rifle, and
the exit headcount - not from a counter only one of them has.

**(l) stays OPEN**, on one term and no longer on four: the core's bombs
cover 19 men a round more than the recording's, with the lethality pinned at
1.000, the men-per-blast in x equal at t=0 and lower over the round, the
depth inside the recording's, and the bombs demonstrably not landing on
knots. The flat approach (`RIFLE_WALK` one constant against C#'s per-man
`pace`) is the one named, measured rule difference the whole pass turned up,
and it was a candidate for that residual - **it has since been measured at
the bombs and is NOT the cause**, under the next heading. Nothing in
`army.js`, `air.js` or the spawn was touched to find any of this.

### Where the bombs land, and when: the plank is out

Two measurements against the one term (l) still has, both in
`measure-air.js`, both core-only where the recording cannot follow, and
neither needing a Unity pass.

**The gate: the line is not a plank where the bombs land.** The plank is an
air-OFF observation and the nineteen men is an air-ON quantity, so the
question was asked in the condition it belongs to - at the tick each
detonation goes off, how deep is the line it lands on? Living riflemen of
the covered side in z, which is `measure-squads`' own population, so the
plank's 1.0 and the recording's 6.5 are on this scale.

Measured at TWO WIDTHS, because side-wide cannot answer it alone: air on
the core replaces 84-118 riflemen a round from the edge, and a man walking
in is a living rifleman at whatever depth the walk has him at, so the air's
own churn can open a side-wide number without the fighting line ever
opening. That would rule the plank out by an artefact, which is the mistake
the depth pair already made once. LOCAL is the same sd over that side's men
within 30 m of the bomb in x - the piece of line a 16 m blast is standing
on.

    air on, seam pinned, four seeds, 43 bombs on infantry, 350 men
    share of the covered men taken while     side-wide   local
      the line was flatter than sd 3          0.00        0.05
      sd 4-8                                  0.08        0.05
      sd 8 and deeper                         0.92        0.90
    line sd at the first infantry-killing
      bomb, per seed                          9.0-10.6    1.0-16.4
    men the local window holds                n = 7-36, median 20

Ninety per cent of the men the core's bombs take are taken where the line
is already deeper than the C# line ever gets by contact, and both widths
say it, so the churn is not what carried the number. It is not dead as a
rule difference - two bombs did land on a local sd of 1.0 and took 8.0 men
each, above the core's own 4.47-6.25 - but that is 16 men of 350. **The
approach cannot be the cause of nineteen a round.**

**The window: the excess is flat in time.** `csharp-gunships.json` carries
an `air` array per pass - eighteen samples at five seconds, cumulative
detonations and bomb deaths - and the tool had only ever read `summary`. It
is the one cross-engine time series the air has. `insideRadius` and the dud
split are pass totals, so `menPerEffectiveBomb` itself cannot be sliced;
what pairs per window is kills per DETONATION, duds included, which with
lethality at 1.000 is men per bomb with the lethality divided out. It is
NOT the 4.47-6.25 against 3.67-4.75 pair, whose denominator is the
effective bombs only, and is not to be quoted as it. The denominators are
the same quantity on both sides: the recording's air-series `bombs` ends at
its own `summary.bombs.detonated` on all four seeds (38, 35, 36, 37).

    bomb deaths per detonation, air on, seam pinned, four seeds
                                per seed      pooled   w0-w2   w3+
    core                        2.30-2.86     2.55     2.68    3.63
    C# recording                1.71-2.00     1.88     1.93    2.58
    core, from its first kill   2.92-3.60     3.40
    C# from its first kill      2.31-2.53     2.42

Anchored on each engine's own first killing window as well as absolutely,
because the sortie clock is `UnityEngine.Random` in the C# and the army
stream in the core, so the two rounds are not in phase. The ratio is 1.39
early, 1.41 late, 1.40 from each engine's first kill, 1.36 over the whole
round. **Flat.** The excess is a constant multiplier on the standing line,
not a burst - the same answer the gate gives from the other side, since an
approach-shaped cause would be front-loaded and gone by w3.

The air-off control refuses both blocks rather than printing a false pair:
no air arm, nothing to gate, and the window WITHHELD in as many words.

### The rifle line divided by the meeting, and the shots behind it

`measure-infantry.js`, air off, and it is the other half of the same
question: the air-off envelopes overlap (24-42 against 28-51) and this file
called that four-seed scatter. `inRifleRange` is what says how well the two
lines met and BOTH engines publish it at every sample, so it can be divided
out - kills per man with an enemy in reach rather than kills - anchored on
each engine's own first man in range rather than on the clock.

    rifle kills per man in range, air off, seam pinned, four seeds
                              per seed      pooled   w0-w2   w3+
    core, clocks pinned       0.059-0.070   0.065    0.036   0.072
    core, gunships grounded   0.064-0.078   0.071    0.039   0.078
    C# recording (trap only)  0.053-0.091   0.074    0.087   0.071

Divided by the meeting, the core's line IS the recording's from w3 on and
is short only in the first three windows.

The instrument's own artefact was measured rather than argued: the
recording holds five-second samples and nothing between them, so its
exposure can only be the two end points averaged, and the core's line
arrives inside one window where the C#'s ramps over three. The core carries
both - `mean` over every tick, `trap` over the end points - and they come
out 0.065 against 0.064 pooled. Real, and small. Only trap against trap is
quoted as a pair.

**The shot ledger**, core only, because the recording holds deaths and not
trigger pulls. Kills cannot separate a clock from a roll - the hit chance
is a fixed 0.045 and a hit is fatal - but the clock word can: a man who
fires sets `RIFLE_RELOAD_TICKS`, a man who looked and found nobody sets
`RIFLE_LOOK_TICKS`, the bands do not meet, and nothing else writes
`U_COOLDOWN` except a spawn, which is a refilled slot and is skipped.

    air off, post-contact, pooled  shots  looks  shots/man  kills/shot
    clocks pinned                  3309   11196  1.600      0.0408
      w0-w2                         654    2897  1.792      0.0199
      w3+                          2655    8299  1.559      0.0460
    gunships grounded              3225   11636  1.632      0.0434

The men are not shooting less early - they shoot MORE per man in w0-w2 - so
the early deficit is not the clock. **It is in kills per shot: 0.0199
against the roll's own 0.045, and that is NEW, open and not yet explained.**
It is a candidate for the 2.6-3.9 residual under "The slope" and is the
next thing to measure in (l).

### The 0.0199 was an integer overflow, and it is a rule fault

The term (l) was left standing on - air off, kills per shot 0.0199 in w0-w2
against the roll's own fixed 0.045 - is explained, and it is not the gun,
not the clock and not the aim. It is `length2` overflowing in the rifle's
TRUCK test, and the codebase already had the trap written down:
`army.js:417-421` says a unit at the far end of a 260 m map "overflows the
sum of squares past 2^31 and comes back as a distance of zero - which reads
as a tank standing on the truck."

Measured, not argued: `length2` returns **0.00 m for any separation past
~181.5 m**. The rifleman's truck test at `sim.js:722` takes no axis
rejection before calling it, so a man far from the truck reads the truck as
standing on him, takes the courier branch, and burns a 2.5-4.5 s RELOAD
clock where a man with nothing in range should have set a 0.4-1.1 s LOOK.
He also rolls the 0.045 at a truck 200 m away.

That is an approach-shaped fault by construction. The armies spawn at
|z| = 75.6 and the truck sits parked at (-100.4, 10.2), so the far corner
starts 196 m out and crosses back under 181 m only as the line closes on
the seam - which is exactly w0-w2 against w3+.

    air off, seam pinned, anchored on each seed's first man-in-range
                        reload  truck br.  of those  foe     deaths  k/shot   k/foeShot
                        writes  (as coded) PHANTOM   shots           before   after
    4 seeds   w0-w2        429       107        82     322      14   0.0347   0.0435
              w3+         2906       156        97    2750     129   0.0453   0.0469
    48 seeds  w0-w2       5152      1491       897    3661     188   0.0412   0.0514
              w3+        33093      2753      1241   30340    1360   0.0431   0.0448

Take the phantom shots out of the denominator and kills per foe shot IS the
roll, in both windows, on both seed counts (z = -0.13, +0.48, +1.85, -0.15).
The early deficit is gone. 17.4% of the core's early rifle clocks were being
burned on a truck the man could not see; 3.7% of the late ones.

Every input was pinned before the cause was accepted, because the number had
already moved twice for instrument reasons:

  the roll        0.045041 over 20e6 draws on a fresh stream - nominal.
  the deaths      counted two independent ways, position-teleport and
                  conservation over the reinforce clock (one slot per side
                  per tick, `sim.js:406-409`). They agree to the unit:
                  188 / 1360 / 1548.
  the denominator counted two independent ways, the clock word written and
                  the men whose cooldown is 0 at the top of the tick, which
                  is the rule's own condition. They agree to the unit:
                  5152 = 5152 early, 33093 = 33093 late.

Two instrument faults were found and removed on the way, and both are real
but small beside the overflow: the ledger counted genuine truck-branch shots
as rifle shots, and it could not see a man who died and whose slot was
refilled in the same tick - `RIFLE_HP` is a constant 10, so a refill is
invisible to the `b.hp > a.hp` test every tool here uses. 43% of the early
deaths were invisible that way at four seeds.

**Not a PhysX or host value.** `sim.js:628` reads the truck from the core's
own words, `s[T + T_X]`. This is the core's own integer arithmetic, and the
same class of fault the collision and `threatAt` were already burned by.

**Two call sites are unguarded, and a third is unchecked.** The three target
scans are all safe - `pickRifleTarget` (`army.js:321`), `pickTarget`
(`army.js:380`) and `threatAt` (`army.js:425`) all reject on each axis
first, and so does the armour crowding scan at `sim.js:677`. What does not:

    sim.js:722    the rifleman's truck test   - measured above
    army.js:273   the TANK's truck test       - same shape, not measured here
    sim.js:790    the truck against its start - not looked at, not this item

**The ladder, one correction at a time, on the tool's own four seeds and in
BOTH air-off holds.** (1) is `measure-infantry.js`'s own rule - its death
test, every reload write in the denominator - and it lands on the 0.0199
this file had named. Each further column removes one thing that is not a
rifle shot at a rifleman:

    air off, seam pinned, 4 seeds     (1) tool  (2) +deaths  (3) -realTruck  (4) -PHANTOM   z vs .045
    clocks pinned   w0-w2               0.0186     0.0326        0.0347        0.0435        -0.13
                    w3+                 0.0437     0.0444        0.0453        0.0469        +0.48
    gunships grounded w0-w2             0.0162     0.0300        0.0318        0.0406        -0.38
                    w3+                 0.0471     0.0482        0.0492        0.0511        +1.52

    phantom share of the reload writes  w0-w2 19.1% / 20.6%   w3+ 3.3% / 3.6%

Both holds tell the same story and the choice of hold did not decide it. The
early column is not short of the roll once the phantoms are out; what looked
like a halved gun was a fifth of the approach's clocks spent on a truck
nobody could see.

**The audit of every `length2` call site in the core is finished.** Three of
the four target scans and both collision scans reject on each axis first -
`solids.js:56-66` carries the same trap written down a second time, from the
day the truck was ejected from scenery it was nowhere near. What is
unguarded:

    site            what it measures         measured here
    sim.js:722      rifleman -> truck        19-21% of early reload writes
    army.js:273     tank -> truck            5454 of 439684 live tank-ticks
                                             (1.2%) read the truck as inside
                                             26 m when it is not
    sim.js:790      truck -> its own START   reads 0 for any true distance
                                             past ~181 m

`sim.js:790` is the one that leaves the army entirely: `fromStart` feeds
`earning()`, so the truck reads as STANDING ON ITS START for every x beyond
about +81 m. The map runs to +130 and its furthest corner is 249.3 m from
the apron, so the eastern third of the field is inside the fault. That is a
scoring outcome, which is BLWP's own ground, and it is not (l)'s to fix.

**And one host value, found beside it and NOT touched.** `sim.js:795-800`
computes the score's danger from `st.units` - the units the HOST sends -
with its own comment saying the core's own units are read by nothing. The
rifle path this item measured is core-only end to end (`sim.js:628` reads
the truck from `s[T + T_X]`), but the score's danger term is not, and that
is exactly item (e)'s business. Named here so it is not lost; not started.

**NOT FIXED, deliberately.** The fix is a rule change in `sim.js`, it moves
the simulation, and it will move the golden vectors - so it is its own step
with its own agreement, not a rider on a measurement. Nothing in `army.js`,
`air.js`, `sim.js` or the spawn was touched to find any of this.

**What it costs (l), measured rather than asserted.** The fault is real and
it wrecked the INSTRUMENT - 19-21% of the early reload writes - but its cost
in actual rifle kills is small, because most phantoms fire while the man has
nothing to shoot at anyway. Only 37 of seed 20260901's 187 phantom shots had
an enemy inside 26 m at all. Following each phantom shooter through the
window his stolen clock covers, and counting only the ticks he sat locked
WITH a foe in reach:

    lost rifle kills a round      air off   air on
    20260901                        1.88     1.47
    20260902                        0.22     0.09
    20260903                        0.00     0.00   (this seed has no phantoms)
    20260904                        0.00     0.00
    mean of the four                0.52     0.39
    the loose bound, ignoring
      whether a foe was there       2.20     2.43

So it is worth about 0.4 rifle kills a round air-on, a seventh of the 2.6-3.9
residual under "The slope", and it is NOT that residual's cause. The seed
that loses most to it, 20260901, is also the seed on which the core
OUT-kills the recording air-off (42 against 28), which is the other way
round from a deficit. It does not touch the 19 extra men the core's bombs
cover, which remains (l)'s one open term.

Two things it does change. The phantom does not stop at contact - the last
one lands at t=87-90 s on every seed that has any - so it is not only an
approach effect, and any air-off baseline (l) is quoted against carries it.
And it is wildly seed-dependent: 0, 29, 51 and 168 phantoms on the four
seeds air-off. A four-seed envelope that straddles that is not measuring one
thing.

### The 19 men: the squads have no depth, so they interpenetrate

> **CORRECTION, and it takes the cause out of this section.** The claim below
> that the core has no squad depth is WRONG, and the number it rests on was
> not a pair. `army.js:41-58` already documents the C# rule and `army.js:137`
> and `142-143` already implement it: `scatter2 = (hash >>> 8) & 1023` is an
> independent slice of the same hash, and `RIFLE_SQUAD_Z` turns it into a
> per-man -5..+5 m offset added to the standoff, exactly as
> `goalZ = front - Dir * (standoff + squadOffsetZ)` (`Army.cs:652`) requires.
> Measured over the 72 rifle slots:
>
>     per-man squad z offset   core -4.84..4.99, sd 2.851   C# Rand(-5,5), sd 2.887
>     standoff + offset        core -0.34..15.69, sd 3.852  C# 4..12 + -5..5, sd 3.697
>     distinct values          69 of 72 slots
>
> The 16.8 m below was a whole SIDE's living riflemen including the
> replacements walking in from |z| = 79, which the C# has too and which the
> recording publishes nothing about. Restricted to men in contact (|z| < 30)
> the core's within-squad depth is 3.90-4.72 m against the 3.85 its own rule
> intends. A measured, walk-in-contaminated core number was set against a
> drawn C# constant - the same "not a pair" fault as the depth pair, the seed
> pairing and `replacementsArrived`, and this time it was mine.
>
> The re-lay counterfactual falls with it: compressing every man to
> `squadMeanZ +- 5` mostly DELETED the approach rather than reproducing C#
> geometry, so the -32.3 men and the "-13.2 opposite term" do not stand.
>
> **What survives**, being core-only arithmetic that never used the C# column:
> a third of the bombs reach 2-4 squads and carry 54% of the covered men;
> those bombs are friendlier (.482 against .367 over 201 and 332 bombs); and
> (C) is still no - 137 detonations against 146 at the same effective count,
> 68 against 68. What does NOT survive is why. **The 19 men are OPEN again.**
>
> One measured fact narrows where the cause can be. At 12 seeds and 130 bombs
> a bomb finds 7.40 men at its own point and 7.41 at a RANDOM x on the same
> depth: the bomb's position along the front is worth nothing. With the x
> geometry equal at t=0 and lower over the round, and knots ruled out, the
> whole term has to live in the DEPTH the bombs land at.
>
> **Three things were then measured off that, and the last one moves it.**
>
> **The several-squad reach is not walk-in contamination.** 48 seeds: of the
> 3946 men the core's bombs cover, **3946 are in contact** (|z| < 30) and not
> one is a replacement still marching in from |z| = 79. The bombs land at
> |z| median 6.3, p90 12.0, max 21.1 - at the seam, nowhere near the edge. The
> reach survives its own falsification.
>
> **The release rule is identical, constant for constant.** Read, not guessed:
> `vz = sign(front - z) * Rand(10,22)`, `vx = 30`, gravity 9.81
> (`BOMB_GRAVITY` 642908 / 65536 = 9.8100), entry height 19, standoff 26, and
> the gunship WEAVES on both axes - `26 + sin(t*0.6)*9` and `19 + sin(t*0.9)*3`
> in `Army.cs:481-484`, `WEAVE_Z`/`WEAVE_Y` 9 and 3 at rates 0.6 and 0.9 in
> `air.js:57-73`. There is no difference in where the bombs are let go or how
> they fly. `Where()` (`GunshipReferenceTests.cs:246`) only classifies the SIGN
> of the landing z, and on that the two agree.
>
> **The discriminator, on two fields the recording has always published and no
> check had ever used** - `summary.armour.insideRadius` and
> `summary.armour.bombsThatKilledArmour`. The same question asked of a
> different population standing on the same ground at the same moment:
>
>     four seeds, air on, seam pinned    core        recording   ratio
>     infantry inside the radius         350         274         1.28x
>     armour inside the radius            98         102         0.96x
>     bombs that killed armour            36          28
>     detonations                        137         146
>
> **The core's bombs cover the recording's number of TANKS - slightly fewer -
> while covering 28% more MEN, from FEWER detonations.** The ground the bombs
> find is not busier. Whatever the term is, it is in how the INFANTRY are
> arranged, and it is not the squad depth, not the squad x, not knots, not the
> approach and not the release. Both are now checked every run, under `TANKS`
> in `measure-air.js`.
>
> **The squad anchors have now been read and measured, and they are not it.**
> Rule against rule, both columns read from source and marked as such:
>
>     count       C# want = max(3, strength/12) = 3 at 36    core SQUADS_PER_SIDE = 3
>     init        C# Rand(-FrontX+12, FrontX-12), FrontX=92  core nextBelow(161)-80
>                 = continuous [-80, 80)                      = integer -80..80
>     drift       C# Sin(Time*0.12 + i*2.4) * 3.6 * dt        core angle 1252/60 per tick
>                                                             (0.12 rad/s), phase k*25032
>                                                             (2.4 rad), step 3932 (0.06 m)
>     clamp       C# +-(FrontX-12) = +-80                     core +-80
>     per side    independent draws, same drift both sides    same
>
> Every constant matches. Two differences and neither can carry the term: the
> core quantises the initial anchor to whole metres, which is nothing against a
> 16 m blast, and `nextBelow(161)-80` can return exactly +80 where
> `Rand(-80,80)` cannot - 1 in 161 a draw.
>
> `Rand` is `_rng.NextDouble()` (`Army.cs:181`), the seeded army stream and NOT
> `UnityEngine.Random`, so a C# anchor replay is possible if one is ever needed.
> It was not needed here.
>
> **The internal control, core-only and marked so**, because air-on there is no
> published position to pair with: the tanks, in the same run at the same
> ticks, which are already tied to the recording at 0.96x. 12 seeds, t >= 25,
> men in contact:
>
>     riflemen a side   n 23.2   x-sd 33.95 m   nearest neighbour in x 1.46 m
>     tanks a side      n  7.1   x-sd 44.78 m   nearest neighbour in x 15.73 m
>     ratio rifle/tank          x-sd 0.758      nearest neighbour 0.093
>
>     anchor gaps, same side     45.0 m mean (0.3-156.3), 40 expected for 3 on +-80
>     anchor gaps, side vs side  54.7 m mean, 18.2% of opposing pairs within 16 m
>
> Riflemen stand ten times closer together than tanks, which is what three 18 m
> columns against twelve freely placed hulls must produce, and the same
> arithmetic holds in the C# rule. Nothing here is anomalous. **The term did not
> move.**
>
> One thing the anchors DO hold, in both engines equally, printed rather than
> argued: the +-80 clamp is a RATCHET. The drift's integral has a 60 m range
> (3.6/0.12), so an anchor drawn near the edge is pinned, loses its headroom and
> is then dragged inward. On seed 20260901 the bear's first anchor is drawn at
> exactly +80.0 and is 49.1 m further in by t=45, while the bull's first anchor
> moves +10.9 over the same span. `Mathf.Clamp(list[i] + drift, ...)` does the
> same, so it is faithful - but it means anchor independence decays over a
> round in both engines, and any anchor statistic quoted at t=0 is not the one
> the bombs see.
>
> **`AvoidWrecks` is out, at the reading, for nothing.** It was the last
> air-coupled, infantry-only rule the core does not have: `Army.cs:332` calls
> `AvoidWrecks()` every Update and `Army.cs:533-552` pushes units out of a
> wreck's radius, infantry at size 0.6 and armour at 3.2. The core has no such
> rule - one grep for "wreck" in `packages/core/src/` returns a comment in
> `gate.js` about the gate, nothing in the army.
>
> But `Wrecks` is a PUBLIC list that `Army.cs` never adds to - four uses, no
> `Wrecks.Add` among them. It is filled from outside, by `CombatFx.cs:882`
> (radius 4.2, released to radius 0 at `CombatFx.cs:206` when the hull fades),
> which is the renderer's effects layer. **Neither recorder touches it**:
> `GunshipReferenceTests.cs` and `ArmyReferenceTests.cs` never mention
> `Wrecks`, and the only file that fills one is `ArmyTests.cs`, the unit test
> of `AvoidWrecks` itself.
>
> So the recording ran with `Wrecks.Count == 0` and `AvoidWrecks` returned on
> its first line. The upper bound on what it could move is ZERO, and the core's
> not having it is not a difference for the comparison this item is measured
> against. No measurement was needed and none was made.
>
> Worth carrying to (e) and not to (l): `CombatFx` - a RENDERER file - writes
> positions into the army the simulation then reads. That is a host value
> reaching into the simulation. It is harmless while the C# army IS the
> simulator; after (e) the core is, and nothing may feed it from `CombatFx`.
>
> So the 19 men remain OPEN with the anchors ruled out. What is left unread in
> the infantry's arrangement is small and named: C# gives each man a lifelong
> `drift = Rand(-1,1)` applied as `s.x += toward + s.drift * 0.7f * dt`
> (`Army.cs:681`) which the core does not have - but `toward` snaps him onto
> his post each tick, so the equilibrium offset is `drift * 0.7 / 60` <= 0.012 m
> and it cannot carry 19 men. It is recorded here as read, not as a candidate.
>
> **WHERE THIS ITEM NOW STANDS, and it is a limit rather than a gap.** Ruled
> out by measurement or by reading, each with its numbers above: the counting
> definitions, the release rule, the squad depth, the squad x, the anchors and
> their drift, knots, the approach, the bomb's x, the phase of the round, the
> detonation count, and the ground itself (armour covered 0.96x). The stock of
> unread infantry rules in `Army.cs` is exhausted.
>
> What remains is one measured, unattributed term: **the core's bombs cover 19
> more men a round**, air-on, with everything the recording publishes about
> those bombs agreeing. Air-OFF the infantry density measures already match the
> recording (`meanNearest` 20.8-40.2 against 20.87-42.3), so the difference is
> made by the air - and air-on the recording publishes no position, no spread
> and no headcount over time. There is nothing left to pair it against without
> a new Unity recorder pass that publishes positions air-on, which is the thing
> this item has twice decided not to spend.

The one term (l) was left standing on has a measured cause, and it is a named
rule difference that was read out of `Army.cs` rather than guessed.

**The denominator was checked first and it is not the fault.** The C#
recorder's effective test is `b.infKilled > 0 || b.armourKilled > 0 ||
b.armourIn > 0` (`GunshipReferenceTests.cs:273`), word for word the core's.
So is the numerator: `insideRadius` iterates the infantry, skips `hp <= 0`,
and takes `dx*dx + dz*dz <= r2` at the moment `Bombed` fires, before
`Detonate` removes anyone (`Army.cs:505-519`). Radius, both sides, infantry
against armour, the alive test - all the same. `Reinforce` is the same shape
too, deficit-scaled clock and one man per side per firing
(`Army.cs:347-377`), and `Spawn` puts a replacement on the same edge in z
that the core does. None of it is a counting mismatch.

**What is different is the squad's DEPTH.** `Army.Spawn` draws TWO offsets
per man - `squadOffsetX = Rand(-9,9)` and `squadOffsetZ = Rand(-5,5)`
(`Army.cs:274-276`) - and the man carries both for life. `riflePost`
(`army.js:306`) returns an X offset only. The core has no squad depth at all,
so a rifleman's z is wherever walking and retreat leave him.

Measured, air on, seam pinned, four seeds, t >= 25:

    within-SQUAD spread        core        the C# draw
    x, sd                      5.0 m       5.196 m   (Rand(-9,9))
    z, sd                      16.8 m      2.887 m   (Rand(-5,5))
    what a squad occupies      17 x 58 m   18 x 10 m

The x geometry is right to the second digit. Only z is loose, and it is loose
by six times. **This is why every earlier measurement missed it**: the plank
check read a whole SIDE's z-spread and found the core inside the recording's,
but a side can be 8 m deep because its three squads sit at different depths
while each squad is a razor line - or, as here, because the squads have
smeared into each other. The side's number cannot see the squad's.

A C# squad is 18 x 10 m, SMALLER than the 32 m a blast spans, so a bomb on
one takes that squad and stops. A core squad is 58 m deep, so squads overlap
and one blast reaches several:

    squads reached   bombs   men   men/bomb   share of the covered men
                1       28   160      5.71    0.46
                2       10    88      8.80    0.25
                3        3    54     18.00    0.15
                4        2    48     24.00    0.14

A third of the core's bombs reach more than one squad and they carry 54% of
all the men covered. The counterfactual is built from the core's OWN
single-squad mean, so nothing is imported from the other engine:

    men a round        core 87.5   capped at one squad 61.4   recording 68.5
    perEffectiveBomb   core 5.15   capped 3.61                recording 4.03

The cap removes 26.1 men a round where the excess is 19.0, so it OVERSHOOTS -
which is expected, because capping at exactly one squad is stricter than C#'s
own geometry allows (two C# squads sitting within 16 m share a bomb too). It
is an upper bound, not an estimate. **Interpenetration is more than sufficient
to carry the whole 19.**

It also fits every earlier finding rather than competing with them: the men
per blast at a random x is equal at t=0 and LOWER over the round (the same
men spread over more depth is a lower density anywhere you point), the bombs
are not on knots (a smear is not a lump), the x concentration is 1.00-1.19
(nothing) while the z concentration is 1.11-1.87 (the overlap), and the
friendly-fire SHARE is equal (.37 against .33) because both sides smear alike.

**The finding was then given three chances to break, and it survived two and
a half.**

**(C) more infantry-hitting detonations? NO**, on fields both engines publish:

    pooled, four seeds     core          recording
    detonated              137           146
    effective              68            68
    bombs on men           43            not published separately

The core detonates FEWER bombs and has exactly the same effective count. The
excess cannot be bomb events; it is men per bomb. ("Bombs on men" is core-only
- the recording publishes `effective`, which includes armour-only blasts, and
`bombsThatKilledArmour`, but no infantry-hitting count. Not invented for it.)

**(A)/(B) where the extra men sit:**

    a round            core   recording   the +19.0 splits
    men under bombs    87.5   68.5
      of them friendly 32.8   22.8        friendly  +10.0
      of them enemy    54.8   45.8        enemy     + 9.0
    friendly share     .374   .332        of the excess: .526

The excess is friendlier than either engine's average, which at four seeds
looked like it might break the finding - per seed the excess's friendly share
runs -0.5, .27, .96, .90. Widened to 48 seeds, core only, it is the finding:

    squads reached   bombs   men   men/bomb   friendly share
                1      332  1735     5.23      0.367
                2      152  1423     9.36      0.514
                3       43   681    15.84      0.430
                4        6   107    17.83      0.393
      one squad 0.367 (332 bombs)   several 0.482 (201 bombs)   REC 0.332

Bombs that reach several squads ARE friendlier, by a wide margin and on a
sample that can be read. The excess's friendly skew is the interpenetration,
not a second cause.

**The seam, and it is NOT the too-strict cap.** Capping at one squad removed
26.1 men where the excess is 19.0. The tight version holds the bombs, the
squads and each squad's mean z exactly where they are and only RE-LAYS each
man at `squadMeanZ + offset` over [-5,5], the way `Army.Spawn` draws
`squadOffsetZ`, deterministically off the slot index as `riflePost` already
does for x:

    a round        core 87.5   re-laid 55.3   recording 68.5
    perEffective   5.15        3.45           4.03

Re-laying removes 32.3 men a round - MORE than the 19.0 excess - and lands the
core 13.2 BELOW the recording. That was checked for being an artefact of
moving the men while leaving the bombs where they had been aimed, and it is
not: at 12 seeds and 130 bombs, the re-lay costs the real bomb point and a
random x at the same depth the SAME fraction (0.600 against 0.598). It is a
density change, and the bombs were never aimed at the men anyway - a random
point at the same depth finds 7.41 where the real bomb finds 7.40.

**So the within-squad depth over-explains the term, and a second term of about
13 men a round runs the other way and is not identified.** The honest bound on
this instrument: the re-lay is not the C# army, it is the core's army with its
squads compressed, holding the core's own squad means fixed. Whether the -13.2
is a real opposite term or an artefact of holding those means cannot be decided
without giving the core a squad depth and re-running - which is the rule change,
and is the next step rather than this one.

**Not fixed.** Giving a rifleman a squad depth is a rule change in the spawn
and in `riflePost`, it moves the golden vectors, and it is its own step.

    seed          core perEff   capped   recording perEff
    20260901         4.94        4.53        4.75
    20260902         5.00        2.22        3.75
    20260903         6.25        3.54        4.00
    20260904         4.47        3.79        3.67

### The balance: every published quantity, core against the recording

(l) closed on a decomposition, and a decomposition is only worth what its
comparison covers. The envelope advertised 17/17 - against a file that
publishes about thirty comparable quantities. That is not a pass mark, it is a
sample, and this item found `armour.insideRadius` (the discriminator that
localised the last term) sitting unused all along. So the file was enumerated
rather than remembered, and every remaining published field wired in. Thirteen
had never been compared.

**These are the numbers AFTER (j).** Air on, seam pinned, the recording's own
four seeds. Every right-hand column is a field `csharp-gunships.json`
publishes; none is derived for the comparison. Overlapping ranges, not
containment, which is this item's standard throughout.

    sortiesPerRound               [10, 12]            [11, 12]            OVERLAPS
    sortiesPerSide                [5, 6]              [5, 6]              OVERLAPS
    onStationShare                [0.67, 0.92]        [0.69, 0.93]        OVERLAPS
    peakAirborne                  [2, 2]              [2, 2]              OVERLAPS
    bombsPerRound                 [32, 40]            [35, 38]            OVERLAPS
    bombsPerSortie                [3.09, 3.33]        [3.00, 3.18]        OVERLAPS
    offFieldShare                 [0.32, 0.38]        [0.26, 0.42]        OVERLAPS
    dudShare                      [0.47, 0.63]        [0.50, 0.58]        OVERLAPS
    infantryKilledByBombs         [58, 109]           [60, 76]            OVERLAPS
    infantryFriendlyFire          [25, 52]            [11, 29]            OVERLAPS
    infantryPerEffectiveBomb      [3.05, 9.08]        [3.67, 4.75]        OVERLAPS
    armourDestroyedByBombs        [5, 17]             [9, 12]             OVERLAPS
    armourBombShare               [0.08, 0.27]        [0.15, 0.22]        OVERLAPS
    firstKillingBombAt            [18.3, 22.0]        [16.7, 26.4]        OVERLAPS
    maxAbsLandingX                [150.3, 153.1]      [148.0, 153.8]      OVERLAPS
    armourLostWithAir             [59, 64]            [55, 63]            OVERLAPS
    infantryAliveWithAir          [34, 36]            [32, 36]            OVERLAPS
    infantryInsideRadius          [58, 109]           [60, 76]            OVERLAPS
    armourInsideRadius            [19, 35]            [19, 32]            OVERLAPS
    bombsThatKilledArmour         [5, 10]             [5, 9]              OVERLAPS
    armourDestroyedByShell        [47, 58]            [43, 52]            OVERLAPS
    infantryKilledByRifle         [12, 33]            [16, 37]            OVERLAPS
    bombsOwnGround                [9, 12]             [5, 11]             OVERLAPS
    bombsEnemyGround              [9, 16]             [14, 17]            OVERLAPS
    bombsStillFlyingAtEnd         [0, 1]              [1, 1]              OVERLAPS
    bombsInAirSeconds             [47.4, 58.0]        [48.0, 61.4]        OVERLAPS
    infantryKilledByBombsPerSide  [22, 63]            [19, 47]            OVERLAPS
    doubleFireInfantry            [0, 0]              [0, 0]              OVERLAPS
    doubleFireArmour              [0, 0]              [0, 0]              OVERLAPS

**29/29 again after (j), which is the second time that row has moved.**
`infantryFriendlyFire` fell OUTSIDE after (m) at core [31, 66] against
rec [11, 29]; after (j) it is back inside. Over SIXTEEN seeds before and after
(m) it read [19, 70] mean 35.2 -> [12, 66] mean 32.1 - the mean FALLING and the
value rising on only 7 of 16 - so it was called resampling rather than a
regression, and this is that reading confirmed a second time. It stays the
weakest row in the envelope: the core sits high on it whatever the rules do,
and a 29/29 that turns on its edge is not a hard pass.

**(l)'s residual, restated in post-(j) numbers.** (l) stays CLOSED; only its
figures are brought current, because (j) moved the draw order again and every
one of them was measured on an earlier army:

    a round, four seeds        after (m)     after (j)     recording
    menPerEffectiveBomb        4.24 - 5.88   3.05 - 9.08   3.67 - 4.75
    men covered a round        81.5          76.8          68.5
    the excess this item names 13.0          8.3           -
    infantry covered / rec     1.19x         1.12x
    armour covered / rec       0.89x         1.01x

The term has shrunk twice without ever being worked on: 19.0 men a round before
(m), 13.0 after it, 8.3 after (j). Both times for the same reason - a rule
fault elsewhere was taking clocks and shots away from the ground fight, and
giving them back changed how many men stand under a bomb. The armour control
has walked to 1.01x, so the discriminator that localised (l) - more men, the
same tanks - now reads more men (1.12x) against tanks that match exactly. What
(l) says is what it said; the number is smaller and the control is tighter.

The band widened to [3.05, 9.08], which is four seeds of a livelier fight, not
a new finding. Anything read off it wants more seeds than the recording holds.

**Superseded, kept because it is how the work went.** The pre-(m) table read
29/29 with `infantryPerEffectiveBomb` at [4.47, 6.25], `infantryKilledByRifle`
at [8, 18] and the tank ratio at 1.28x / 0.96x - the unguarded core. The
post-(m) table read 28/29 with those at [4.24, 5.88], [18, 22] and
1.19x / 0.89x. No tool reproduces either now.

**One field is published and deliberately NOT compared, and the reason is the
discipline this item was built on.** `summary.doubleFire.ambiguousBombMatch`
looks like a pair for `measure-air.js`'s `ambiguous`. It is not. The recording
counts detonations it could not tie to exactly ONE bomb by comparing positions
(`GunshipReferenceTests.cs:120`) - a property of floating point and of how a
recorder identifies a bomb. The tool's `ambiguous` counts SLOTS REFILLED IN THE
TICK THEY DIED, which is what it prints it as. Two unrelated quantities sharing
a word. Paired once during this pass it read core [2, 3] against rec [0, 0] and
came out as the one OUTSIDE in thirty - a not-a-pair caught by the check rather
than by argument, and the fifth in this item after the depth pair, the seed
pairing, `replacementsArrived` and the squad depth. The core has no counterpart
at all: it identifies a bomb by its slot, never by matching a position. The
tool prints that under NOT COMPARED so it is not re-added.

Also corrected in the tool rather than only in this file: the SQUAD REACH block
printed the retracted claim that the core has no squad depth on every run. It
now carries the correction and stands as a core-only description with no cause
attached.

### The truck is shot by tanks, and the core does not know it

The courier pass parks a truck at x=0, z=0 and leaves it there for ninety
seconds. Cumulative, at the core's establishment:

                        C# recording        core
    tank hits             163                 not readable - see below
    tank damage          1271.7               -
    rifle hits              6                  every unit inside 26 m
    rifle damage           13.9                one flat point a hit
    tanks within 34 m     7 - 18 per sample
    riflemen within 26 m  0 - 36 per sample

**CORRECTION, measured under (j) step 1.** "none, ever" above was wrong, and
so was the same claim in `dfbfcaf`'s commit body. The core DOES have tank
courier fire: `army.js:272-287` is armour-only, is called from `stepUnit`
(`sim.js:682`) and its hit lands on `T_HP` through `r === 2` (`sim.js:758`).
What "none" described is the RECORDING'S ATTRIBUTION - the recorder splits
rifle from tank by the size of the hit (1.5-3.5 against 5-11) and the core
writes only flat ones, so no core hit can be read as a tank's. Split instead by
the clock that fired, air off, truck at (0, 0), seed 20260901, over 90 s:

    core                 shots at the truck   points landed
      tanks                     263               11.00
      riflemen                  246               12.00
      ambiguous ticks             -                0.00

So (j) is a parameter and structure rewrite, not a missing weapon. Five things
are wrong at once: range 26 instead of 34, the rifle's 0.045 roll instead of
the gun's 0.55, a private 40-99 tick clock instead of the gun's 1.4-3.2 s, no
"engaged and nearer than the foe" test, and one flat point instead of
Rand(5, 11). In the C# the courier is not a weapon at all - it is a TARGET
CHOICE inside the tank's existing gun, so the core's parallel weapon is to be
deleted rather than widened.

And a prediction written down BEFORE the rule changes, so the result is a
finding either way: the shot opportunity is already about right (263 against
the recording's implied 296 = 163 / 0.55), so roll and damage carry the whole
of the 11 against 1271.7. But the clock moves with the fix - the core's private
clock averages 1.16 s against the gun's 2.30 - and in the C# the foe and the
courier share ONE clock. The tank side should therefore land somewhere near
400-600 points, not 1271.7, with the remainder being the presence gap already
measured: tanks within 34 m run 3-12 in the core against 8-18 in the recording.

**99% of what the army does to the truck is tank fire**, from
`Army.StepArmour`: `CourierRange` is 34 m, not the rifle's 26, and a hit
takes `Rand(5f, 11f)`. The core has no courier fire from armour at all.
What it has instead is one flat point from ANY unit - tank or rifleman -
that has the truck inside 26 m, which is the rifle rule applied to
everybody.

The second half is the selection rule, and it is why riflemen score six
hits in ninety seconds from a truck parked in the middle of them: a man
fires at the courier only when he already has an enemy rifleman inside 26
m AND the truck is CLOSER than that man. In a line that interpenetrates
there is nearly always someone nearer. The core has no such test - it
shoots the truck whenever the truck is in range, and never at anybody
else.

Wrong source, wrong range, wrong size, and no selection rule. Truck damage
is what M1 is: this is item (j), and it lands before (i) because it is the
milestone's own quantity.

And a measurement defect (d) introduced, which is (g): `ArmyReferenceTests`
launches no sorties, and the core has no switch for turning its air off -
`measure-air.js` produces the no-air control by loading the core from a
git worktree taken before the air landed. So `measure-army.js` has, since
(d), been printing an air-ON core beside an air-OFF recording. The
reinforcement table above predates the air and is sound; anything measured
with that tool after it was not.

**(g) is done.** `measure-army.js` takes `--core=DIR` the way
`measure-air.js` does, and every line it prints now carries `air=on` or
`air=off` - a comparison that does not say which condition it was made
under is not a comparison. The control is the pre-air worktree:

    git worktree add /tmp/noair 98a8ee6      # the commit before air.js
    node tools/measure-army.js 20260901 --seam0 --quiet \
      --core=/tmp/noair/packages/core/src

Four seeds, seam pinned, laid out both ways:

                       core, air off   core, air on   recording (air off)
    armour lost        53 - 61         60 - 64        59
    replacements       51 - 57         56 - 60        55
    shooters t=90      14 - 18         12 - 14        12
    contact lost       never           never          never

The control lands on the recording and the air-on run sits just above it,
by about the six to ten tanks a round the bombs take - which is the same
gap the C# shows between its own air-on and air-off passes (60-64 against
53-61 in `csharp-gunships.json`). So the defect was a reporting fault and
not a hidden divergence: nothing measured under it has to be redone. It
would have become one the moment a number moved, and the tool would have
had no way to say which arm moved it.

### What (e) actually has to move, found by reading the bridge

(e) reads like a deletion. It is not: three outcomes still leave the core
today, and two of them have no core rule at all.

  - **Collision.** `CoreDrivenTruck.UploadArmour` pushes Unity's tank
    positions into the core every tick (`BlwpSetArmour` -> `setArmour`
    -> `st.armour`), and `resolveArmour` uses those. Per-tick host input
    that is not player input: **a node replaying the round has no Unity to
    supply it, so the round is not replayable today.** That is the sentence
    M1 exists to delete. `threatAt` has the same shape - `sim.js:681`
    prefers host units when they are present - and that path becomes dead
    code with `setArmour`.
  - **Truck damage, twice.** `Bootstrap.cs:194` wires
    `Field.Army.CourierHit += _truckHealth.Damage`, so the C# army hurts
    the truck; the core takes its own hits off `T_HP` (`sim.js:641`) and
    nothing reads it back. The core's health is the ghost. Alongside it
    `TruckHealth.OnCollisionEnter` still reads
    `collision.relativeVelocity` while line 169 already takes the core's
    `BlwpCore.TakeImpact()` - the PhysX-era pattern this project keeps
    paying for.
  - **Two rules that do not exist in the core.** `Army.RunOver` (driving
    over riflemen kills them, above 2.5 m/s) and `Army.ClearPath`
    (infantry pushed out of a deep overlap so nobody is left standing in
    the cab). Both are outcomes the player produces. After (e) they either
    vanish from the game or stay in C#, and both of those break the law.

### Found while doing (d), and NOT fixed in it

`sim.js`, in the spawn path:

    s[b + U_TARGET] = nextBelow(rng, 180);   // "Staggered reload"
    s[b + U_COOLDOWN] = nextBelow(rng, 120);
    s[b + U_TARGET] = -1;                    // undoes the line above

`U_TARGET` is the reload counter. The stagger is written and overwritten
one line later, so every tank can fire on its first tick of contact, in
index order - which is the exact failure the comment above it describes
as fixed ("one army went from eleven to two while the other lost
nobody"). C# staggers it: `reload = Rand(0f, 3f)`.

Left alone on purpose. The shared spawn path was extracted bit-identical,
including that line, so the reinforcement numbers above are one change and
not two. **It is item (i)**, and it moves the vectors again when it lands.

**DONE, and the diagnosis above is CORRECTED.** The line is gone and the
armour keeps its stagger. But "every tank can fire on its first tick of
contact, in index order" does not produce the rout this paragraph borrows
from: measured before the fix, both sides open within a twentieth of a
second of each other, the free-shot count runs 0-2 and to the BEAR side on
one seed, and the asymmetry sits on the recording's. That collapse belongs
to an earlier army whose tanks all arrived together. What the fix is worth
is about one shot at the seam - and, in the vectors where the seam moves,
one or two armour and a good deal of truck damage in `idle`. The numbers
are under (i) above.

Also newly red and caused by this work: `SafeRouteScoresNearNothing`
banks 0.077 where it wants 0.1. Squads concentrate the danger, so a run
down the seam meets less of it than it used to. Decide whether the score
reference or the army is the thing that moved - **in (e)**, against the
numbers that hold once the exposure is computed over the core's own units,
and not before. Nothing is deployed while it is red.

Found while doing the air half, and left alone: **`tools/bundle.js`
refuses duplicate EXPORTED names and does not look at private ones.** The
bundler concatenates every rule module into one scope, so two files
declaring the same private constant collide there. `air.js` did exactly
that - a private `GRAVITY` against the one in `vehicle.js` - and it threw,
because both are `const` and a redeclaration is a SyntaxError. `var` or
`function` would not throw; the bundle would quietly ship a different
program from the modules, and only `bundle.test.js` comparing hashes would
catch it. `terrain.js` and `cargo.js` already both declare `COLUMNS`, with
the values 128 and 2, and escape only because neither is reachable from
`sim.js`. The constant here was renamed `BOMB_GRAVITY`; widening the check
to every top-level declaration is three lines, and it is item 6.

## 3. Three post office buildings  -  M1  -  DONE, and it was the tests

Not a game fault. Bootstrap assembles a whole world as ROOT objects and
[UnitySetUp] runs before EVERY test, not once per fixture - and twelve
fixtures created worlds while two cleaned up. Dozens of complete games
were stacked on top of each other, all stepping at once, which is why an
instrumented count found fifteen block faces where the model has five.

That was the suite's intermittent failures, all of them:
FindFirstObjectByType picks an arbitrary copy, so a test could set up one
truck and measure another. TestWorld.TearDown now clears the scene
between tests, and the suite went from "one or two different failures per
run" to 166 green, twice in a row.

It also turned a flake into a finding: with one world instead of thirty,
the truck reversing out of a crowd of tanks moved 4.6 m where the test
wants 6, every time. The collision was summing an escape route from every
tank at once and wedging it. The correction is capped per tick now - 0.6
m, which has to stay above the distance a tick of travel covers at
24 m/s, or a fast approach pushes straight through.

## 4. Hover overlays  -  no milestone  -  DONE

Transaction details on the loading ramp, and the full figure behind each
bar on the miner's histogram. Polish: it makes the live chain data
readable, and it moves nothing towards a milestone. 0 of M1, and that was
the reason to check both halves before writing anything.

THE RAMP WAS ALREADY BUILT, and finding that out was the work.
`LoadoutPanel.Inspector` is called from `OnGUI`, `PackageYard.Hovered` is
set every frame by `PickAt`, and the card draws. Measured in the player
build rather than argued: two pointer positions gave two DIFFERENT
transactions - `e2aece3b...` at 0.68759532 BTC / $53,455.02 / 3,547 sat /
32.5 sat/vB / 109 vB, and `9a97465f...` at 0.45904635 BTC / $35,680.46 /
3,852 sat / 35.3 sat/vB - so the pick follows the pointer and the numbers
are real. Nothing was wired and nothing rebuilt. The card shows chain data
only; `danger` stays in the tile captions, out of it, because the core
scores with `S_CARGO` fixed at 0.70 and never sees the load.

THE BARS DID NOT HAVE THEIR FIGURE, though they were already holding it. A
bar carried its rate twice - as a log-compressed height and as a colour -
and the height cannot be read back: `log10(1 + rate)` mapped between the
tenth and ninetieth percentile of the twenty-four, then clamped. But
`LiveCurve` writes the real sat/vB into the field `_live` and `Bars` hands
that same array to `Paint`, so the number existed and was thrown away.

It is drawn now through the mechanism the board already uses - a TextMesh
per bar, parented to the screen, on the same `shiftSeconds` clock as the
height and the colour, from the same array. No overlay, no raycast, no
second source, no core. The unit is spelled out ONCE for the row rather
than twenty-four times, which is the panel's own rule read sensibly.

Measured, not authored: 24 labels for 24 bars, bar pitch 3.800 in screen
space, each figure 2.790 tall and 3.496 wide - 92% of the pitch, which is
where the size comes from - against the transaction rows' 3.8. Every bar
gets its number, so the fallback to labelling only the quarters was not
needed.

AND THE FIRST VERSION OVERLAPPED THE ROWS, which the first photograph did
not show and the arithmetic did. The scale is trimmed to the market, so the
tallest bars sit near `maxBar` whatever the mempool is doing: measured
`barTop -6.02` at `scaleY 0.816` against `maxBar 0.82`, and the lowest
transaction row's bottom edge at `-5.40`. A figure riding the bar top would
start at -5.62 and reach -2.83 - straight through that row. The figure now
rides its bar until the bar would push it into the rows and then stops,
with the ceiling taken from the row's own transform rather than from the
authored -6. Photographed after: "1.7 1.21 1.21 1.10 1.01 1.01 1.0 ... 0.90
0.80" clear of the rows.

Core 54/54 and guard 19 files clean, untouched. EditMode 124/123/1,
PlayMode 175/154/11/10, unchanged. Still not deployable, for the standing
reason: the suites are not green.

## 5. Prune the streamed bundles  -  no milestone  -  DONE

The claim here was "five post office bundles, 40.9 MB". Measured:
`unity-proto/ServerData/WebGL/` held SEVEN bundles, 10,399,842 bytes, one
per model, zero duplicates - and the folder is gitignored, so it was never
repo content. The state was clean; the MECHANISM was not.

`SetupAddressables.BuildContent` ran `BuildPlayerContent` with no clean, and
that build is incremental and names every bundle by a hash of its contents:
change a model and the new name is written beside the old one, which then
ships in every deploy. `BuildWebGL.CopyStreamedContent` already mirrors the
build OUTPUT - delete, then re-copy - but the source it copies from had no
such rule, and the source is what grows.

The run now empties the folder before it writes, with the path evaluated
from the profile so it cleans exactly where the build is about to write.
Measured after: "cleared 7 files (9.9 MB) before building", then seven
bundles and 10,399,842 bytes again - the same seven names, byte for byte,
so the guard costs a full rebuild and changes nothing that is served.

## 6. Bundler: the private name check  -  no milestone  -  small

`tools/bundle.js` refuses duplicate EXPORTED names and does not look at
private ones, and the bundle is one scope. Two `const`s of the same name
throw at bundle time, which is the loud case; two `var`s or two
`function`s would not, and the bundle would ship a different program from
the modules with only `bundle.test.js` hashing to catch it. Widen the
check to every top-level declaration. Written up under item 2.

## 7. The red and flaky Unity tests  -  no milestone  -  small

**SUPERSEDED, and it was a live contradiction against item 2.** This chapter
used to end its opening with "a shot is neither drawn nor heard... it is the
reason (e) is closed and the game is still not deployable". Item 2 says item 7
is closed. Item 2 is the truth, and it is the one with numbers behind it:
measured in the player build, one drive, before against after - pieces drawn
0 -> peak 65, shots 0 -> 160, hits 48, deaths 16, combat sounds 0 -> 233,
rotor calls 0 -> 176. Shots ARE drawn and ARE heard. `Bootstrap` still wires
the old `Fired`/`Shot`/`Destroyed`/`Killed`/`Bombed` events, which no longer
fire, but `CombatFx.PollCore` and `GameAudio` no longer depend on them.

So the deployability verdict stands but the REASON is not this one: the game
is not deployable because the suites are not green, and for no other listed
cause. That is what item 2 already says at "NOT DEPLOYABLE, and the reason has
changed".


Found while running the EditMode suite in batchmode to reach (l)'s
recorder, and NOT pulled into (l) or fixed there:

    CombatFxTests.RifleFireProducesAFlashAndATracer
      es wird geschossen, aber nichts ist zu sehen
      Expected: greater than 0
      But was:  0

The suite is 124 tests, 123 green, this one red. It is renderer work, not
army work: `CombatFx` draws the flash and the tracer off the army's
`Shot` event. Two reasons it is written down here rather than left in a
log.

It bears on (e). `CombatFx` is also the only thing that fills
`army.Wrecks` (`CombatFx.cs:882`, released at `:206`) - a RENDERER file
writing positions the simulation then reads. Harmless while the C# army
IS the simulator; after (e) the core is, and nothing may feed it from
`CombatFx`.

And it bears on the `Shot` event itself, which is a trap the recorder
work had to route around: `Army.cs:731` invokes it as
`Shot?.Invoke(s, hit ? mark : new Vector2(mark.x + Rand(-3,3), mark.y +
Rand(-3,3)))`. `?.Invoke` evaluates its arguments only when something is
subscribed, so attaching a listener draws two extra numbers per miss and
makes it a different battle. Same shape at `Army.cs:638` and `:737` for
`CourierHit`. Anything touching this test must not subscribe to `Shot`
during a recording.

NOT before (j). It is not on the M1 path.

**Two more PlayMode failures, pre-existing and measured rather than assumed.**
They were found while running the suites for (m) and are recorded here because
a red that lives only in a commit body is a red nobody owns:

    ArmiesAreActuallyDrawn      PlayMode, red on the unchanged tree
    RoadsAreActuallyDrawn       PlayMode, red on the unchanged tree

The baseline that proves they are not ours: the same PlayMode suite run on the
tree with no core change gives 174 total, 163 pass, 3 fail - those two plus the
flake below. Every run since, with (m)'s guard and both halves of (j), gives
174 / 164 / 2 - the same two and nothing new. Both are renderer work like the
rifle flash, and like it they wait for (e) rather than blocking M1.

**And two load-dependent flakes, which are not failures at all.**
`TheGogglesAnimate` item 1 already documents - it fails under load and passes
alone. `HeatRaisesTheExposureRate` behaved the same way and was written down
here so the next reader did not spend a turn on it: it came up red once during
(j), was reported as a regression caused by the rifle rule, and a second run of
the SAME tree and the SAME code passed it. Causation was inferred from a single
run of a suite already known to carry flakes. Anything red in PlayMode gets a
second run before it is called a regression.

**`HeatRaisesTheExposureRate` is no longer allowed to sit here as a flake, and
it is now instrumented rather than excused.** A flake is a thing nobody has
measured. The test drives the truck along the seam for 1.5 s of WALL time, one
iteration per frame, sampling `_score.Rate`, so the obvious suspicion was that
a loaded run gets fewer and larger steps. It prints `HEATRATE` now, and the
suspicion is wrong:

    run           hot     frames   mean delta
    alone         1.148     335      0.0045
    full suite    1.708     312      0.0048

Nearly the same frame count, and the peak is HIGHER under load, not lower.
Both are clear of the threshold of 1. It cannot be reproduced with the
instrument in place; the numbers are recorded so that a future red has
something to be compared against instead of being called a flake a third time.

**THE TWELVE REDS, EACH ONE NAMED, WITH TODAY'S FAILURE TEXT.** The
paragraph that used to stand here had the two Visibility reds' causes
swapped and out of date; both were re-read from the run of 01b074f rather
than repeated. Counts that go with this ledger, per suite:

    Core (node)   54 / 54          determinism guard 19 files clean
    EditMode     124 total, 123 pass,   1 fail,  0 skip
    PlayMode     175 total, 154 pass,  11 fail, 10 skip

TEN OF THE ELEVEN PLAYMODE REDS ARE ONE THING: they reach for the C# army,
which (e) deliberately does not build, does not step and does not draw. In
the Editor there is no core to put in its place - `BlwpCore` is stubbed
unless `UNITY_WEBGL && !UNITY_EDITOR` - so the quantity they assert on
exists in neither engine while the test runs. They cannot be made green in
the Editor without reviving the retired simulation, which is combat and
driving back in PhysX and is forbidden. None is on the deploy path: the
deploy path is the WebGL player build, where the core answers and the same
claims were measured in the browser.

  1  VehicleTests.BothArmiesAreOnTheFieldAndOnTheGround
       asserts both armies exist and stand on the terrain.
       "keine Armeen in der Szene / Expected: not null, But was: null".
  2  VehicleTests.ArmourBlocksTheTruck
       asserts a tank stops the truck. "Expected: not null, But was: null"
       - it looks up the armour through `Battlefield.Army`.
  3  VehicleTests.TheTruckCanDriveOnAfterHittingTheArmy
       asserts the truck is not trapped after a collision. Same null.
  4  VehicleTests.UnitsDoNotShoveEachOtherWithPhysics
       asserts units do not push each other through rigidbodies.
       "kein Panzerrumpf in der Szene".
  5  VehicleTests.ArmiesFightNearTheSeamRatherThanWanderingOff
       asserts over half the armour settles within 60 m of the front.
       NullReferenceException at VehicleTests.cs:442, `field.Army.Armour`.
  6  FeatureTests.DamageIsFeltInTheDriving
       asserts a courier hit lowers condition and the driving feels it.
       NullReferenceException at FeatureTests.cs:168,
       `_field.Army.CourierHit.Invoke(70f)`.
  7  TruckHealthTests.CrashingIntoArmourWritesItOff
       asserts driving flat out into the battlefield writes the truck off.
       "der Truck ist mit Vollgas ins Schlachtfeld gefahren und nicht
       zerstoert worden" - there is no armour in the scene to hit.
  8  VisibilityTests.ArmiesAreActuallyDrawn
       asserts the armies change more than 1% of the rendered image.
       "keine Armee / Expected: not null, But was: null" - it never
       reaches the render, so this is an army red and NOT the graphics
       red it was filed as here before.
  9  ImportedModelTests.SoldiersStandOnTheGroundAndAreAnimated
       "keine Soldaten gefunden / Expected: greater than 0, But was: 0".
 10  ImportedModelTests.TanksStandOnTheGroundRatherThanInIt
       "keine Panzerruempfe gefunden / Expected: greater than 0, But
       was: 0".

THE ELEVENTH PLAYMODE RED IS NOT THAT, and it is not ours either:

 11  VisibilityTests.RoadsAreActuallyDrawn
       "Unhandled log message: '[Error] RenderTexture.Create failed'".
       The test renders the scene twice through a `RenderTexture` and
       diffs the pixels. Under `-batchmode -nographics` there is no
       graphics device to create one. Not a code dependency: a device
       one. Tried rather than argued: the same test run WITHOUT
       `-nographics` does not reach the test at all - "Error opening
       default X display. You must have a valid X server running." This
       machine has no Xvfb either (`which Xvfb` finds nothing), so the
       suite cannot be run with graphics here at all. On the deploy path
       the claim is true and photographed - the road is under the truck
       in every browser screenshot taken for (t), (u) and (v).

THE ONE EDITMODE RED:

 12  CombatFxTests.RifleFireProducesAFlashAndATracer
       "es wird geschossen, aber nichts ist zu sehen / Expected: greater
       than 0, But was: 0". It builds `new Army(3)`, calls
       `Populate(0, 20)` and `Bind`, then steps the RETIRED C# army for
       20 s. Its sibling `TankFireProducesABlast` has the same shape and
       PASSES, so this is not the harness: it is the C# army's rifle path
       failing to raise `Shot`, in an engine the product no longer runs.
       Editor-only by construction, not on the deploy path.

So: eleven of the twelve are the retired C# engine, one is a missing
graphics device. Not one of the twelve asserts something the core does in
the browser, and not one was loosened, skipped or re-asserted to go green.

---

## 9. M1 liquidation picture  -  M1  -  OPEN

Daniel 2026-09-03/04: the whole front end for liquidations - bomb, crater,
radiation. Also in IMPLEMENTATION.md and multiplayer_p2p.md. PICTURE ONLY, the
core rules stay shut. Stand-in models until designed ones arrive.
HARD: after the bomb the truck drives *into* the hole, not over it.
Numbers live in the commits named below, not here.

OPEN
  a11 The strike's voice is built and has never been heard. A headless browser
      has no audio. MEASURED as far as a machine can take it, in the code and
      in the served player: the clip carries energy, the trigger is the core's
      strike serial one for one, the buffer leaves the audio engine, the four
      silent gates are open, and the strike has a source of its own so a shot
      inside its 4.5 s cannot bend its pitch. The last step is Daniel's ear.
  d   The mushroom cap is never seen from the driving camera. The column stays
      55 m and is not shortened to fit a frame; showing the cap is a camera
      decision, not a mesh number.
  e   `Bootstrap.cs:724` places the truck's FIRST spawn from Unity's relief.
      Once, before any crater exists. Harmless, listed so it is not
      rediscovered as a fault.
  a12 Bitget, Gate.io, MEXC, Kraken Futures, Hyperliquid. NOT STARTED. No
      documented public BTC liquidation stream is in hand for any of them, a
      private own-position channel is not a feed, and no URL will be guessed.
      Parked: the slot question is answered without them.
  a8  Coin-margined Binance: BTCUSD_PERP and two quarters on dstream. PROBED,
      PARKED - the stream pays nothing, and that is the only reason left.
      Host alive: btcusd_perp@bookTicker 4759 frames in 115 s, 20296 in ten
      minutes. dstream's !forceOrder@arr is the USDM tape and not the inverse
      book - three spellings, 56 frames each, first payload MARSCOINUSDT, and
      beside fstream 26 events against 26 all identical, so subscribing it
      would count every liquidation twice. The coin-margined forced orders paid
      0 in twenty minutes across the unrouted AND the /market path, with about
      36500 heartbeat frames beside them on the same sockets. The unit is NOT
      the open question: dapi/v1/exchangeInfo gives contractSize 100 and
      marginAsset BTC, so a fill is q * 100 dollars and not q * ap. Nothing
      built, nothing deployed.
  a13 Morning picture, 2026-09-05. OPEN. Daniel's iPhone. Screenshots in
      daniel-screens/. iOS silent until the same tap plays a sample. Camera:
      free look, then after a few seconds back to looking forward; steering
      keeps the road ahead. Mushroom is fading planes — replace with a real
      3D cloud. Liquidation on screen names venue + size at once. SIM toggle
      under PRACTICE, not Debug. Tanks heap and twitch at the front — spread
      along the line, still near it. Late-run truck and tanks sink under the
      ground; crater is a hole you drive into, road stays. Mining board: no
      numbers on the bars. Bitcoin whitepaper on the miner is too big for the
      frame. When the bomb lands, everything inside the crater is gone at
      once — no wrecks. Crater twice as deep on impact; it is too shallow now.
      Always open Daniel's screenshots, do not guess.
      iOS SOUND, MEASURED at 118e530 on the desktop player: Unity builds
      exactly ONE AudioContext, and the template now catches it at
      construction - 0 contexts before the loader, 1 after. The gesture
      handler fires inside pointerdown/mousedown (6 unlocks over the three
      start clicks, running=1 each) and the strike still plays afterwards
      (level 0.550, pitch 0.966). CORRECTION to what was said before: the
      jslib's own `WEBAudio` handle is NOT dead - it logged
      `WEBAudio=true ctx=running`. Only `Module.WEBAudio` was unreachable
      from the page. So the fault was never the handle, it was WHERE the
      unlock ran: `SplashScreen.Play` is an OnGUI callback, outside the
      gesture stack Safari requires. Desktop cannot prove Safari; the
      iPhone verdict is Daniel's.

DONE
  1   truck, units, roads, effects and the gate on the core surface  7202b15 a728036
  2   the crater IS the terrain, opened when the bomb lands          a728036
  3   stand-in bomber and bomb, then streamed models        a728036 ca771fc f393fde
  4   radiation on the ground, the HUD warning stays                 a728036
  5   post office and the map's edge barriers on the core surface    2cdd2c8
  a   the glow tints the ground instead of painting over it         38ff8d3
  a2  the bomber wears the submitter's side, the core has none      4929628
  a3  the tick latch mirrors the core's largest-wins rule           6ad9882
  a4  both skins load, are selectable, and are measured             b701484
  a5  a real liquidation flies the skin of the side it hit, and all three
      venue side mappings are checked against the price   b68091e 14275e2
  a6  the liquidation socket is watched and reopened on its own     fba827a
  a7  bybit and okx are in, binance routed to /market, all six of its BTC
      quote assets price in dollars, and three exchanges already fill all
      eight crater slots            b68091e 14275e2 d0b1510
  a9  the HUD names the exchanges and sums the tick                 b68091e
  a10 two liquidations in one frame are one crater, sized by the larger, and
      one skin on that side - forced in the core, the latch and the wire, and
      compared in the core's own units, because two orders inside one step of
      $15.26 tie there and the first of them stays
                                   39c4292 f092d68 00a287f 171d27e
  b   the blast is a column, not a 26 m fireball                    6ad9882
  c   the strike has a voice                                        6ad9882

---

## 9. M1 liquidation picture  -  M1  -  OPEN

Daniel 2026-09-03/04: the whole front end for liquidations - bomb, crater,
radiation. Also in IMPLEMENTATION.md and multiplayer_p2p.md. PICTURE ONLY, the
core rules stay shut. Stand-in models until designed ones arrive.
HARD: after the bomb the truck drives *into* the hole, not over it.
Numbers live in the commits named below, not here.

OPEN
  a11 The strike's voice is built and has never been heard. A headless browser
      has no audio. MEASURED as far as a machine can take it, in the code and
      in the served player: the clip carries energy, the trigger is the core's
      strike serial one for one, the buffer leaves the audio engine, the four
      silent gates are open, and the strike has a source of its own so a shot
      inside its 4.5 s cannot bend its pitch. The last step is Daniel's ear.
  d   The mushroom cap is never seen from the driving camera. The column stays
      55 m and is not shortened to fit a frame; showing the cap is a camera
      decision, not a mesh number.
  e   `Bootstrap.cs:724` places the truck's FIRST spawn from Unity's relief.
      Once, before any crater exists. Harmless, listed so it is not
      rediscovered as a fault.
  a12 Bitget, Gate.io, MEXC, Kraken Futures, Hyperliquid. NOT STARTED. No
      documented public BTC liquidation stream is in hand for any of them, a
      private own-position channel is not a feed, and no URL will be guessed.
      Parked: the slot question is answered without them.
  a8  Coin-margined Binance: BTCUSD_PERP and two quarters on dstream. PROBED,
      PARKED - the stream pays nothing, and that is the only reason left.
      Host alive: btcusd_perp@bookTicker 4759 frames in 115 s, 20296 in ten
      minutes. dstream's !forceOrder@arr is the USDM tape and not the inverse
      book - three spellings, 56 frames each, first payload MARSCOINUSDT, and
      beside fstream 26 events against 26 all identical, so subscribing it
      would count every liquidation twice. The coin-margined forced orders paid
      0 in twenty minutes across the unrouted AND the /market path, with about
      36500 heartbeat frames beside them on the same sockets. The unit is NOT
      the open question: dapi/v1/exchangeInfo gives contractSize 100 and
      marginAsset BTC, so a fill is q * 100 dollars and not q * ap. Nothing
      built, nothing deployed.
  a13 Morning picture, 2026-09-05. OPEN. Daniel's iPhone. Screenshots in
      daniel-screens/. iOS silent until the same tap plays a sample. Camera:
      free look, then after a few seconds back to looking forward; steering
      keeps the road ahead. Mushroom is fading planes — replace with a real
      3D cloud. Liquidation on screen names venue + size at once. SIM toggle
      under PRACTICE, not Debug. Tanks heap and twitch at the front — spread
      along the line, still near it. Late-run truck and tanks sink under the
      ground; crater is a hole you drive into, road stays. Mining board: no
      numbers on the bars. Bitcoin whitepaper on the miner is too big for the
      frame. When the bomb lands, everything inside the crater is gone at
      once — no wrecks. Crater twice as deep on impact; it is too shallow now.
      Always open Daniel's screenshots, do not guess.
      iOS SOUND, MEASURED at 118e530 on the desktop player: Unity builds
      exactly ONE AudioContext, and the template now catches it at
      construction - 0 contexts before the loader, 1 after. The gesture
      handler fires inside pointerdown/mousedown (6 unlocks over the three
      start clicks, running=1 each) and the strike still plays afterwards
      (level 0.550, pitch 0.966). CORRECTION to what was said before: the
      jslib's own `WEBAudio` handle is NOT dead - it logged
      `WEBAudio=true ctx=running`. Only `Module.WEBAudio` was unreachable
      from the page. So the fault was never the handle, it was WHERE the
      unlock ran: `SplashScreen.Play` is an OnGUI callback, outside the
      gesture stack Safari requires. Desktop cannot prove Safari; the
      iPhone verdict is Daniel's.

DONE
  1   truck, units, roads, effects and the gate on the core surface  7202b15 a728036
  2   the crater IS the terrain, opened when the bomb lands          a728036
  3   stand-in bomber and bomb, then streamed models        a728036 ca771fc f393fde
  4   radiation on the ground, the HUD warning stays                 a728036
  5   post office and the map's edge barriers on the core surface    2cdd2c8
  a   the glow tints the ground instead of painting over it         38ff8d3
  a2  the bomber wears the submitter's side, the core has none      4929628
  a3  the tick latch mirrors the core's largest-wins rule           6ad9882
  a4  both skins load, are selectable, and are measured             b701484
  a5  a real liquidation flies the skin of the side it hit, and all three
      venue side mappings are checked against the price   b68091e 14275e2
  a6  the liquidation socket is watched and reopened on its own     fba827a
  a7  bybit and okx are in, binance routed to /market, all six of its BTC
      quote assets price in dollars, and three exchanges already fill all
      eight crater slots            b68091e 14275e2 d0b1510
  a9  the HUD names the exchanges and sums the tick                 b68091e
  a10 two liquidations in one frame are one crater, sized by the larger, and
      one skin on that side - forced in the core, the latch and the wire, and
      compared in the core's own units, because two orders inside one step of
      $15.26 tie there and the first of them stays
                                   39c4292 f092d68 00a287f 171d27e
  b   the blast is a column, not a 26 m fireball                    6ad9882
  c   the strike has a voice                                        6ad9882

---

## 2026-09-05  the iOS sound fix on the daily host

Deployed from the player built at 106fb7f - Daniel's unlock (118e530) plus
the camera's own worst-case line. `btc-logistics-core.pages.dev` answers and
carries the gesture block; `btc-logistics-war.pages.dev` untouched.

  deployment            62fea1b5.btc-logistics-core.pages.dev
  build                 19.5 mb, no CS errors
  unlock block live     yes, `__blwpAudio` and `pointerdown` in the served page

Suites after the deploy, not before - the publish was ordered NOW and the
only change since the last green run was one Debug.Log:

  EditMode   136: 134 green, 2 red
    CombatFxTests.RifleFireProducesAFlashAndATracer   known, listed
    RunOverBodyTests.AThrownBodyIsHandedToThePhysicsEngine
      FLAKE: 0.831 against a bar of 1.0 in the full run, green on its own
      (5 of 5) straight afterwards. It measures a PhysX tumble and falls
      short under load. Named, not touched.
  PlayMode   180: 159 green, 11 red, 10 skipped - the ten Battlefield.Army
    reds and VisibilityTests.RoadsAreActuallyDrawn, unchanged.

## 2026-09-05  the iPhone was on silent, and Web Audio obeys that switch

Read off Daniel's photographs, not guessed. Safari shows its speaker icon in
the address bar - the system believes the tab is playing - and the status bar
carries the silent-mode bell, in the 07:46, 08:00, 08:07 and 09:14 shots
alike. iOS mutes Web Audio with the ring/silent switch unless the page owns a
media PLAYBACK session; an unlocked, running context is not enough.

Fix: a hidden <audio> carrying half a second of silence on a loop, started in
the same gesture handler as the context. Measured on the desktop player at
eabd236:

  contexts before the loader          0
  after load, no gesture              1, running
  gesture #1                          media=none  paused=false
  gesture #3..#6                      media=playing paused=false
  jslib handle                        WEBAudio=true page=true ctx=running
  strike after the gesture            level 0.550, impacts drawn

`paused=false` from the first gesture is the element actually playing;
`media=playing` appears once the play() promise resolves, which is why the
first two lines still read none.

A desktop has no ringer switch, so this run proves the element plays and the
session is claimed - it cannot prove the phone. That is the ear again.

Deployed: 254f8485.btc-logistics-core.pages.dev, daily host.

## 2026-09-05  the driving camera sits behind the nose again

Cause 1 of the camera letter: `c09f39b` put the camera behind
`Atan2(v.x, v.z)`, the core's velocity vector. In a corner that points where
the truck is SLIDING. Reach, rise and the lens still read that vector - they
want a speed - but the direction the camera settles behind is now the hull
heading, which also puts the position and the look-at target on one basis.

Same slalom both times, keyboard, headless player:

                     before (ccae4da)      after
  worst off-nose      8.7 deg              3.8 deg
  worst roll          5.2 deg              5.4 deg
  slip at the worst   5.8 deg              6.6 deg
  peak speed          15.4 m/s             16.7 m/s

The after run cornered HARDER - more slip, more speed - and still halved the
angle between where the camera looks and where the truck points. Roll is
unchanged because it is cause 2 and has not been touched: `leanDegrees` is
still 6 and still goes into the camera's Z rotation.

The signature of the old fault is in the before line: at 2.8 degrees of slip
the camera was 8.7 degrees off the nose. The error outlived the slip that
caused it, because `yawDamp` was chasing a vector that had already swung
back. Nothing like that appears after.

Note: this change was already on the daily host before it was measured - it
rode along in the build deployed for the ringer fix (254f8485).

## 2026-09-05  the horizon stops rolling in a corner

Cause 2 of the camera letter. Three numbers on the same corner, measured
fresh after the change rather than read off the earlier log:

  core truck bank        0.00 deg
  camera roll before     5.4 deg
  camera roll after      0.0 deg
  yaw off the nose       4.6 deg at 3.2 deg slip, 16.3 m/s

The core has no bank to follow. Driven on the real module at 13.3 m/s with a
yaw rate of 0.164 rad/s, the truck is thirteen integer words - x, z, heading,
vx, vz, angular velocity, hp, cargo, flags, wheel, throttle, steer, impact -
and not one is a roll, a pitch or a bank. So "the camera rolls with the core
pose" resolves to zero, and the 5.4 degrees were a renderer flourish:
`leanDegrees` 6 times the cornering load (yaw rate x forward speed). Not a
PhysX leftover - the yaw rate came off the target's heading and the speed off
`BlwpCore.Velocity` - but a flourish with no pose behind it all the same.

CameraFeelTests.TheCameraLeansIntoACorner asserted the opposite: lean > 1.2
degrees. It encoded the old decision, so it was inverted rather than
loosened, and renamed TheHorizonStaysLevelInACorner with a bound of 0.5
degrees. The measurement was 0.0000009 degrees, so half a degree is room for
arithmetic noise and nothing else. An impact may still roll the frame; that
decays in a third of a second and is not steering.

I had grepped for `leanDegrees` outside ChaseCamera.cs, found nothing, and
concluded the lean was unused elsewhere. The test asserts the EFFECT - the
camera's Z rotation - not the field name. The check was too narrow.

  EditMode  136: 135 green, 1 red - CombatFxTests.RifleFireProducesAFlash
                 AndATracer, known, retired C# army
  PlayMode  180: 159 green, 11 red, 10 skipped - the ten Battlefield.Army
                 reds and VisibilityTests.RoadsAreActuallyDrawn

Two flakes seen under load during this letter and green on their own
straight afterwards, neither touched:
  RunOverBodyTests.AThrownBodyIsHandedToThePhysicsEngine  0.831 vs 1.0, 5/5 green
  PostOfficeTests.TheGogglesAnimate                       0.0 vs 0.02, 11/11 green

## 2026-09-05  checkpoints: the object, the table, and what they narrow

M2.1 step 3, unsigned. Storage and the equivocation key; `session_signature`
and `CheckpointReceipt` are the next slice and no stub for them is here.

Bytes on the wire, measured from the encoder rather than budgeted:

  checkpoint on the wire    167 bytes
  spec budget (section 10)  about 150 bytes at 1 Hz
  over a 90 s round         15.0 kB per player

Over budget by 17 bytes, and every one is accounted for: type 1, version 2,
five 32-byte fields, tick 4. Nothing is variable-length, which is why the
read endpoint can hand back records back to back and a reader can cut them
apart without a framing rule.

What a checkpoint narrows, measured on the real core
(`packages/core/tools/measure-checkpoints.js`):

  round                     600 ticks, ten seconds
  checkpoint every          60 ticks
  input changed at          tick 307
  smallest change that      128 of 65536 on the steer, one tick
    reaches the state       (0.2% of full lock)
  first disagreeing mark    tick 360
  last agreeing mark        tick 300
  divergence located to     60 ticks
  without checkpoints       600 ticks, i.e. "somewhere in the round"

Ten times narrower, and the window is one second.

A finding worth keeping: a change of ONE unit of Q16.16 on the steer at a
single tick never reaches the state at all - the digest is identical. The
transcript is not fragile to arbitrarily small input noise; it took 128 units
before the state moved. That number is measured by the tool itself, not
assumed, so it will follow the vehicle rules if they change.

  core 67/67, determinism guard 19 clean
  protocol 59/59 (was 50), money guard 7 clean
  node 20/20 (was 13)

Unity untouched.

## 2026-09-05  the three holes in the unsigned checkpoint slice, closed

Found by checking rather than assuming, and all three closed on the same
letter as the slice they belong to.

1. TICKS COULD RUN BACKWARDS. Measured before the rule existed: a mark at
   tick 60 stored, then a mark at tick 30 naming the tick-60 mark as its
   parent was ALSO stored, and GET handed back [30, 60] - the chain claiming
   one order and the ticks another. That is the re-parenting defect
   `previousHash` exists to prevent, on the time axis. Now:

     tick 60                stored
     tick 30 onto tick 60   REFUSED: expected a tick after 60, got 30
     GET /checkpoints       167 bytes, 1 record, ticks [60]

   Fails closed: named refusal, nothing stored, the read still shows only the
   parent. Naming a parent the node does not hold was already refused - only
   the head can be named - so that half needed nothing new.

2. THE WIRE WAS UNTESTED. `Round.checkpoint` was covered; the TYPE_CHECKPOINT
   dispatch on /play and GET /checkpoints were not. One test now drives the
   seam end to end over a real socket and a real fetch: stored, repeat,
   equivocation (with the stored id crossing the wire in the message), the
   backwards tick, inputs the node never saw, and then the GET returning
   exactly the two that were accepted.

3. inputChainHash WAS DECORATION. Kept `previousHash` because a hash nobody
   compares can be re-parented, then left this one uncompared. It is checked
   now: the named batch must be one the node holds for that entry, or the
   genesis for a mark taken before any batch was sent.

   The exact head at the moment of arrival is NOT demanded, and that is a
   decision rather than an omission: a client may take a mark at tick 60 and
   send the batch covering 0..119 afterwards, which is a legitimate order
   over one socket. What this cannot check at all is that those inputs
   actually produce that state - that needs a replayer, and nothing in this
   package imports the core. Verification has its own stage.

   Three of the slice's own tests failed when the check landed, because they
   named an invented input chain. The tests were wrong, not the rule; they
   send a real batch now.

  core 67/67, determinism guard 19 clean
  protocol 59/59, money guard 7 clean
  node 25/25 (20 before this, 13 before the slice)

Known remainder, not fixed: a checkpoint is 167 bytes against section 10's
~150-byte budget. Every byte is accounted for, so the only way down is
dropping or shortening a field, which is a protocol change.

## 2026-09-05  the session key signs the mark, beside it rather than inside it

The signature slice of M2.1. The spec settled who signs and with which key;
the covered bytes and the placement were ambiguous and Daniel decided them.

  covered bytes    checkpointId, the tagged hash - not the raw encoding
  placement        beside the object, a 64-byte suffix on the wire
  key              sessionPubkey from the Entry Contract the node stores
  curve            ed25519, per IMPLEMENTATION.md's session-key note
  library          @noble/curves, in blwp-node only

Measured:

  checkpoint                     167 bytes
  signed mark on the wire        231 bytes
  GET /checkpoints record        231 bytes, verified over the read
  protocol runtime dependencies  {} - unchanged, no crypto entered it
  unsigned id after signing      identical, so previousHash never moves

Refusals, each by name and each with nothing stored:

  no signature at all       "a signed checkpoint is 231 bytes, got 167"
  a stranger's key          "the signature does not verify under the entry's
                             session key"
  any field changed after   the same refusal, checked field by field over
    signing                  tick, stateHash, inputChainHash, previousHash
  one bit of the signature  the same refusal

There is no shorter form that means "unsigned", so a mark cannot lose its
signature by accident - the length check refuses it before anything parses.
The signature is verified BEFORE the chain and tick rules, so a forged mark
never reaches a rule that could store it and the refusal names the signature
rather than whatever it collided with.

All of it also driven over the real socket and a real fetch in
server.test.js, not only in memory. Two marks accepted, six refused, and
GET /checkpoints returned 2 records of 231 bytes whose signatures still
verify after the round trip.

Two of the slice's own read-back tests went red when the suffix landed,
because they cut records at 167. The tests were wrong, not the wrapper.

  core 67/67, determinism guard 19 clean
  protocol 63/63 (59 before), money guard 7 clean
  node 31/31 (25 before)

Unity was not in this slice. Remainder, still listed and still not hunted:
167 bytes against section 10's ~150-byte budget, now 231 signed.

## 2026-09-05  the checkpoint receipt exists as an object; nothing issues one

The spec is thinner than a sitting here, so this stopped at the object plus
tests, as agreed, rather than inventing the rest.

WHAT THE TWO DOCUMENTS ACTUALLY SAY. Section 10, entire: "A checkpoint is
accepted when enough nodes receive it within the required window; nodes
timestamp receipt and return a signed CheckpointReceipt." The only field list
anywhere is IMPLEMENTATION.md:594 - RECEIPT { checkpoint_hash, received_at,
node_sig }. No struct, no reserved type, no reserved tag - unlike
EntryReceipt, which section 7 writes out in full.

THREE THINGS DECIDED, each following a precedent rather than invented:

  nodePubkey is carried    IMPLEMENTATION's wire line omits it because a live
                           socket knows its peer. Section 12 puts receipts[]
                           inside the round record, where nothing can ask who
                           signed. EntryReceipt carries node_pubkey for that
                           reason; this follows it, and its field order.
  signature beside         as decided for the checkpoint, so receiptId does
                           not move when the receipt is signed.
  type 0x0a, tag           BLWP/v1/CheckpointReceipt. The spec reserves
                           neither and an object cannot exist without them.

Measured:

  receipt on the wire       75 bytes
  signed receipt            139 bytes
  checkpoint, for contrast  167 / 231 signed

Refusals, each by name:

  wrong type            "not a checkpoint receipt: type 5"
  trailing bytes        "trailing bytes after the receipt"
  wrong record length   "a signed receipt is 139 bytes, got 75"
  wrong signature size  "a signature is 64 bytes, got 10"
  a float timestamp     "u64 needs a BigInt, got number"

And the properties that make it evidence rather than decoration: the signer,
the time and the mark are each part of the id, so a receipt cannot be moved
to another mark, re-dated, or attributed to another node; two nodes
receipting one checkpoint produce two distinct objects, which is what
"5 of 7 received it" has to be counted from.

WHAT IS MISSING, and it is the larger half: nothing ISSUES a receipt. A node
signs one with its own key, and this daemon has no key and no place to put
one - grep for a node identity in blwp-node/src finds nothing. The identity
comes from the bond advertisement, M2.1 step 5b. Until that exists the node
cannot sign, so there is no ingest, no store and no wire for receipts, and
none was faked.

  core 67/67, determinism guard 19 clean
  protocol 76/76 (63 before), money guard 7 clean
  node 31/31, unchanged - the node was not touched

No existing vector moved: the index gained a name and checkpoint.json is byte
for byte what it was. Unity untouched. The 167-vs-150 remainder stands and
was not hunted.

## 2026-09-05  the socket stops accepting a hundred megabytes

M2.1 bullet 5, first of its three parts. The other two - watching outbound
`bufferedAmount` and a resume point for a reconnecting client - were NOT
started: Daniel reordered mid-turn, M1 before M2, and item 8 is parked.

Measured sizes, which is where the cap comes from:

  batch header, 0 ticks      107 bytes
  per tick                    20
  per liquidation              8
  batch at 6 ticks (10 Hz)   227
  batch at 9000 ticks     180107   a whole round at the test contract
  largest DECODABLE batch 1835087   the encoder's own u16 vec ceilings
  signed checkpoint          231
  signed receipt             139

  ws default maxPayload  104857600
  now                      1835087   57x smaller

Two layers, both derived, neither a chosen number:

  transport  MAX_FRAME_BYTES is the longest message the protocol can encode
             at all. Longer is not a large protocol message, it is not one,
             so it can be refused without being parsed.
  per round  a batch may not carry more ticks than the round's `blockTicks`,
             read off the contract the node already stores. Refused by name:
             "a batch carries at most the round's 9000 ticks, got 9001", and
             the transcript stays at 0 ticks.

The cap is NOT tight and that is said rather than hidden: an honest client at
10 Hz sends 227 bytes. Tightening further needs a maximum ticks per batch,
which is a protocol-visible limit and a decision, not a measurement.

A hole found while testing it: a frame over the cap arrives as an ERROR
event, not a message, and an unhandled one takes the process down - sending
MAX_FRAME_BYTES + 1 threw `RangeError: Max payload size exceeded` out of the
receiver with nothing listening. `ws` has already closed with 1009 by then;
the daemon now survives it and names the connection.

  core 67/67, determinism guard 19 clean
  protocol 78/78 (76 before), money guard 7 clean
  node 33/33 (31 before)

Unity untouched.

## 2026-09-05  a tap no longer steals the drive view, and the look comes back

The second half of the camera letter, driven through `useExternalPointer` -
the same shape `TruckController` already uses - so it is measured in PlayMode
rather than through a browser once and never again.

THE TAP. Every touch outside a driving pad became a look the instant it
landed. A pointer now has to travel first, and the distance is derived, not
chosen: `dragYaw` is 220 degrees across a screen width, so one degree costs
`Screen.width / dragYaw` pixels and the threshold IS one degree of aim.

  dead zone at 640 px wide       2.909 px, one degree
  pixels per degree, asserted    2.909  (a 4-dead-zone drag gives 3.0 deg)
  a 2 px tap, before             0.69 deg of yaw stolen
                                 (2 / 2.909, from the measured ratio above -
                                  not from a run, and said so)
  a 2 px tap, after              0.000 deg

THE COMING BACK, measured on the pointer path:

  looked away                    54.0 deg
  held, no drift                 for the full 2.5 s hold
  back under 0.5 deg             3.07 s after the hold ended
  total from release             5.6 s

A HOLE THE TEST FOUND, and it would only have shown on a slow phone: when
the pointer crossed the dead zone the aim restarted from wherever the pointer
then WAS, so a drag that covered a quarter of the screen in one frame moved
the view by nothing at all. It now restarts from exactly one dead zone along
the travel, so the swallowed amount is one degree whatever the frame rate. A
finger moving a few pixels a frame would never have exposed it.

AND A TEST THAT PROVED NOTHING. The tap fixture wandered by 0.9 of the dead
zone, so setting the dead zone to zero made it a zero-movement tap and it
passed regardless. It uses two absolute pixels now, guarded by an assertion
that two pixels is inside the dead zone.

  EditMode  136: 135 green, 1 red - CombatFxTests.RifleFireProducesAFlash
                 AndATracer, known, retired C# army
  PlayMode  185: 164 green, 11 red, 10 skipped - the ten Battlefield.Army
                 reds and VisibilityTests.RoadsAreActuallyDrawn. Five new
                 tests, no new red.

RESIDUAL, not fixed and not hidden: 2.909 px is one degree at 640 wide and
about 4.2 px on Daniel's phone. A real thumb's slop on the way to a tap can
exceed that, and no measurement here can say by how much - only a thumb can.
If taps still steal the view on the phone, the multiple is the knob, and it
should move on evidence rather than on my taste.

Also unmeasured and worth naming: `Input.GetMouseButton(0)` follows the FIRST
touch, so a thumb held on a driving pad occupies the pointer and a second
finger cannot look around while driving. That is multi-touch input, a
different piece of work from this bullet, and it was not started.

## 2026-09-05  iOS audio is heard on the phone

Daniel confirmed it at 13:47: the strike is audible on the iPhone. That
closes the a13 bullet and settles a diagnosis no measurement here could
reach - a desktop has no ring/silent switch, so every number I could take
was consistent with both the working and the broken case.

Two things were needed and neither alone was enough:

  the unlock inside the gesture  `SplashScreen.Play` is an OnGUI callback in
                                 the frame loop, not the gesture's call
                                 stack, and Safari does not count it. The
                                 page captures Unity's AudioContext at
                                 construction and resumes it from a real
                                 pointerdown/touchend.
  a media playback session       an unlocked, running context is still muted
                                 by the ring/silent switch unless the tab
                                 owns one. A hidden <audio> looping half a
                                 second of silence, started in that same
                                 handler, claims it.

The second half was read off Daniel's own photographs - Safari's speaker
icon in the address bar beside the silent-mode bell in the status bar - and
not guessed.

A correction that belongs with it: I reported early on that Unity's
AudioContext was not under `WEBAudio` in this build and concluded the old
jslib could unlock nothing. Its own log line said `WEBAudio=true
ctx=running`. The handle was always live; only `Module.WEBAudio` was
unreachable from the page. The fault was never which handle - it was where
the unlock ran.

Code eabd236, deploy 254f8485.

## 2026-09-05  the drive camera, looked at on screen

The suite is not this test, so the player was run and photographed. Round
started, then a tap, then a real look, then the coming back.

  tap over 2.0 px             view unmoved at 0.000 deg
  drag begins after 27.0 px   dead zone 5.8 px of 1280
  released at                 49.5 deg
  back under 0.5 deg          4.00 s after release

On screen: after the tap the camera sits dead astern with the road centred
and the horizon level; the drag swings it round to the truck's quarter; after
release it is behind the truck again, level, road ahead. Photographs
look-1-after-tap.png, look-2-looking.png, look-4-returned.png.

The browser and PlayMode agree. PlayMode measured 3.07 s from 1.25 s after
release, so 4.32 s in total; the browser measured 4.00 s from release. The
difference is frame sampling - SwiftShader renders about twice a second, so
the 0.5 deg crossing is only noticed on the next frame.

The dead zone is 5.8 px at 1280 canvas pixels. On Daniel's phone the canvas
is CSS width times min(devicePixelRatio, 2), so roughly 1836 px and a dead
zone of about 8.3 device pixels, which is 4.2 CSS pixels.

The knob was NOT moved. A 2 px tap steals nothing on screen, and there is no
measured thumb here to move it from - only Daniel's tap can say whether a
real finger wanders further than 4.2 CSS pixels on the way to a button.

## 2026-09-05  the wheel was seated on a collider that describes something else

M1.a14, the depot wheels. Two hypotheses died on the numbers and the third
was arithmetic.

WHAT WAS RULED OUT, measured rather than argued:

  carried craters   `craters core 4, drawn 4` - no lag - while the tyre was
                    0.178 m buried. The reveal delay accounts for NONE of it.
  core vs terrain   0.000 at every sample, in every round, standing and
                    driving. The seating on SurfaceAt was never the fault.
  ribbon wear       0.000 on the lanes sampled; deck lift 0.300 applied.
  the spin          98 samples show the bury at 0.0 m/s. It is not motion.

WHAT IT WAS:

  seated radius (WheelCollider)   0.550 m
  the mesh's own reach            0.728 m
  difference                      0.178 m
  measured bury, standing         0.178 m

Exactly the difference. The wheel was placed one COLLIDER radius above the
ground while its mesh reaches further than that, so it stood in the road by
the excess. It varies between 0.523 and 0.728 with angle because the mesh's
bounds are not centred on the pivot - the wheel turns about a point that is
not its middle.

THE FIX, from the renderer instead of the collider: each wheel's own radius
and its own hub offset are taken at collect time from `Renderer.localBounds`,
and the MESH's centre is placed one MESH radius above the ground, the pivot
wherever that requires. The body rides on the mean of those radii. Nothing
about the truck's seating on `BlwpCore.SurfaceAt` changed, and no collider
number was tuned.

  standing bury, before   0.178 m
  standing bury, after    0.000 m   (bottom 7.415, ground 7.415)

STILL OPEN, and not claimed as fixed: while driving the world box still reads
0.12 to 0.21 m below the ground. I cannot tell from a player whether that is
the tyre truly cutting through or `Renderer.bounds` inflating around a mesh
that is not a body of revolution about its axle - the streamed model has
Read/Write disabled, so `mesh.vertices` returns nothing and the earlier
vertex scan proved exactly nothing. The way to settle it is to make that one
model readable and take the true lowest vertex; that is an import setting and
a decision, not a measurement I can take now.

  EditMode  136: 135 green, 1 red - CombatFxTests.RifleFireProducesAFlash
                 AndATracer, known
  PlayMode  185: 164 green, 11 red, 10 skipped - the known set, no new red

## 2026-09-05  the mushroom is the mesh, not three primitives

M1.a13. The GLB had been committed and nothing streamed it - it was an unused
file. It is now `model/mushroom` in the HighDetail group, fetched after the
bomber for the same reason (only wanted when a liquidation lands, and it is
the largest of these assets), and handed to the theatre.

Measured on a real liquidation, at the event:

  asked for       55 m, the height the column was built to
  drawn           32.5 x 55.0 x 32.4 m, five renderers
  at              the impact position, e.g. -43.4,-6.3
  old cap width   34 m, so the silhouette is the same size it was

Photographed: cloud3-settled.png shows a billowing cap on a stem standing at
the impact with the bomber flying out beside it. The first two attempts
photographed nothing useful and the reason is worth keeping - the harness
teleported the truck and took the frame in the same breath, and the chase
camera damps towards its target, so the shot was taken from where the camera
used to be. The size was never wrong; the shutter was early.

The primitives stay as the fallback for the seconds before the model has
streamed and for a build without it, and they say so in the log: "[cloud]
primitives ... no mesh streamed yet" against "[cloud] mushroom MESH".

WHAT CHANGED WITH IT, and it is a visible difference rather than a hidden
one: the primitives were driven white -> orange -> ash over the eight
seconds, and the mesh wears its own materials, so that colour clock no longer
applies. The timing does: full size in `Rise`, gone by `Gone`, the same
numbers as before.

  EditMode  136: 135 green, 1 red - CombatFxTests.RifleFireProducesAFlash
                 AndATracer, known
  PlayMode  185: 163 green, 12 red, 10 skipped

The twelfth red is RampReadyTests.TheRealTransactionsReplaceTheStandInsWhile
NothingIsLoaded: expected 2 captions on the ramp, got 10. It is intermittent
and network-dependent by construction - the test seeds `feed.Offers` with two
transactions while the LIVE mempool feed is running, so if the real feed
answers inside the test's window the yard shows its transactions instead.
Failed alone once, passed alone immediately after. Nothing in this change
touches the feed or the package yard. Named, not touched, and not called a
load flake any more now that it has failed in isolation.

## 2026-09-05  the mushroom cools on the mesh

The mesh wore one colour for its whole eight seconds - a fireball that never
went out. The primitives had cooled white through orange to ash, and that
curve is now one function, `Heat(t)`, driven onto the streamed renderers
through a property block so the streamed materials are never written to.

Measured at a real liquidation, at the impact:

  t = 0.3 s   body 0.74,0.64,0.48   glow 1.01,0.67,0.32
  t = 3.0 s   body 0.35,0.33,0.30   glow 0.08,0.07,0.07
  t = 5.7 s   body 0.34,0.32,0.30   glow 0.07,0.07,0.06

Photographed at the same three moments after the chase camera had settled:
heat-rise.png shows a white-hot billow with the bomber leaving, heat-ash.png
a dark grey remnant near the ground. The earlier false "too small" was an
early shutter, and this time the frames were taken after the camera had
caught up.

Size untouched, as instructed: still asked 55 m, drawn 32.5 x 55.0 x 32.4 m,
five renderers.

`_EMISSION` is enabled once on the instance's own materials when the cloud is
first dressed. Without the keyword a URP material ignores `_EmissionColor`
entirely - the same thing three identical cubes proved over the start bay
earlier in this build, where only the emissive one drew at all.

The primitive fallback is untouched and now shares the same `Heat`, so the
two cannot drift apart.

  EditMode  136: 135 green, 1 red - CombatFxTests.RifleFireProducesAFlash
                 AndATracer, known
  PlayMode  185: 164 green, 11 red, 10 skipped - the known set.
                 RampReadyTests passed this run, which confirms it is
                 intermittent rather than newly broken.

## 2026-09-05  the dust spreads along the ground again

WHAT THE ASSET ACTUALLY IS, read out of the GLB rather than guessed: six
nodes, five of them meshes, named `stem`, `cap`, `crown_billow`,
`dust_skirt` and `fireball_core`, with four materials `smoke_stem`,
`smoke_cap`, `dust_skirt`, `fireball_core`. The parts were always there. They
were simply not driven - the parent was scaled and all five moved on one
curve, which is why the cloud read as a blob and the ground dust vanished.

Each piece now moves on its own curve, the way the primitives did:

  the skirt   spreads outward while the column shrinks, and stays at the
              height the model put it
  the core    the fire dies before the smoke: it shrinks on exp(-1.1 t)
              rather than riding the whole cloud down
  the skirt's glow  a third of the cloud's, because dust is not flame

The ring, measured at a real liquidation:

  t = 0.3 s   25.3 x 25.1 m
  t = 1.7 s   48.9 x 48.7 m
  t = 3.1 s   50.7 x 50.4 m

50.7 m against the old primitive skirt's `CapWide * 1.5` = 51 m, so the shape
is the one that was there before rather than a new invention. A first cut
used a bigger constant and the ring measured 81.8 m - half again wider than
the cloud it belongs to - and it was brought back to the stated intent rather
than kept because it looked dramatic.

Unchanged, as instructed: asked 55 m, drawn 32.5 x 55.0 x 32.4 m, five
renderers, and the cooling curve reads the same numbers as before -
t=0.3 body 0.74,0.64,0.48 glow 1.01,0.67,0.32; t=3.1 body 0.35,0.33,0.30
glow 0.08,0.07,0.06.

The fallback proved itself in the wild during these runs: a liquidation at
27 s, before the model had streamed, logged "[cloud] primitives ... no mesh
streamed yet" and drew the old three shapes.

WHAT I DID NOT GET: a photograph that shows the spreading dust clearly. Four
attempts, and every frame either sat behind the HUD, arrived after the two
seconds the spread happens in, or caught the camera still easing after the
teleport. The ring is proven by measurement rather than by a picture, and
that is said here rather than dressed up.

  EditMode  136: 135 green, 1 red - CombatFxTests.RifleFireProducesAFlash
                 AndATracer, known
  PlayMode  185: 164 green, 11 red, 10 skipped - the known set. RampReady
                 passed; not touched.

## RETRACTED - the mushroom never shrank after the first strike

The section below is wrong and is kept so the mistake is on the record.

`Dress` is called once, under `if (_mushroom == null)`, so nothing was ever
re-scaling a mesh it had already scaled. What the launch line measured was
the transform at the instant of launch, and `Column` sets the scale on the
NEXT frame - so it was still carrying the previous cloud's fade floor,
`Mathf.Max(0.05f, f)`. 55 x 0.05 is 2.75, which is the "2.6 x 2.8 x 2.6 m" I
read as a broken cloud.

Measured on the whole model at the same point on the theatre clock:

    strike 1  t=1.7s  cloud 48.7 x 53.7 x 48.4 m
    strike 2  t=1.7s  cloud 49.0 x 53.7 x 48.7 m
    strike 3  t=1.8s  cloud 49.3 x 53.8 x 49.0 m

The same, within the growth curve's own drift. The skirt agreed all along -
49.2, 48.9 and 49.1 m on later strikes against the first's 48.7 - and I had
that in the log when I filed the bug.

The line now reports the modelled size measured once at dress time and
prints the scale the transform is carrying beside it rather than instead of
it: "32.5 x 55.0 x 32.4 m modelled, 5 renderer(s), growing from 5% of it".

## The original, wrong note - the mushroom shrinks after the first strike

Found while measuring the dust skirt, not fixed, not folded into a13.

Every round, the FIRST liquidation draws the streamed model at the size it
was asked for and every later one draws a toy:

    [cloud] mushroom MESH at  60.4,  5.6, asked for 55 m, drawn 32.5 x 55.0 x 32.4 m
    [cloud] mushroom MESH at -66.7,-36.5, asked for 55 m, drawn  3.2 x  3.4 x  3.2 m
    [cloud] mushroom MESH at  71.0, 21.6, asked for 55 m, drawn  2.6 x  2.8 x  2.6 m

55 / 3.2 is 17, and 32.5 / 1.9 is the same ratio the other way: `Dress`
scales on the longest side of what it measures, and on the second call it is
measuring a model it has already scaled, so it divides the size in again.
The first call is right because the model is still at its authored size.

Everything downstream reads correct - the skirt still logs 48.7 x 48.4 m at
t=1.7 s, because the part curves are driven from `_skirtRest` captured at
dress time - so this is only the parent's scale, and only from the second
strike of a round onward.


## M1.a13 - the dust from the camera the player actually uses

God view at 62 degrees was never the question; this is the chase camera, no
G pressed, cloud clock frozen for each pair so the skirt could be toggled
with nothing else in the picture moving.

TWO HARNESS FAULTS FIRST, because both produced numbers I nearly believed.

The first cut armed on one bomber warning and held the truck there. A later
bomb landed 115 m away, off camera, and the renderer reported `visible
False` with a rect 11671 px wide - the bounds were projecting behind the
lens. The truck now follows whichever bomb is falling and a strike more than
3 m from where it stands is skipped.

The second cut held the truck ON the impact. That puts the chase camera
INSIDE the mushroom: 9.4% of the frame changed when the skirt was toggled
and R/G went 0.832 to 0.961, which looks like a strong result and is only
the inside of a cloud filling the lens. The truck now stands 70 m off with
its nose on the blast, which is what a player sees when one lands near them.

WHAT IT LOOKS LIKE. Not a ring. From ground level a flat 50 m disc cannot
read as a ring - the geometry forbids it - and what it does read as is a low
dust bank spread along the horizon at the foot of the column, hiding the
tanks and wrecks that are plainly visible with the skirt off. That is dust
spreading on the ground, which is the thing this bullet asked for. The ring
shape itself is a god-view reading.

    frame        changed inside the skirt band   near-ground control
    t = 1.7 s              39.4%                        0.0%
    t = 3.2 s              48.5%                        0.0%

    t = 1.7 s   on 135.5,129.3,97.9 R/G 1.048   off 132.1,128.3,97.9 R/G 1.029
    t = 3.2 s   on 131.2,128.2,96.7 R/G 1.023   off 123.7,122.3,92.8 R/G 1.011

The near-ground control is a hard zero over 128,000 px in both frames.

SECONDS AND METRES. It is not a flash at 3 s; it is on screen for the whole
life of the cloud, widest just after 3 s:

    t=0.3s  25.3 m    t=1.7s  48.9 m    t=3.2s  49.3 m
    t=4.6s  34.9 m    t=6.0s  20.5 m    t=7.4s   6.6 m     gone at 8.0 s

LATER STRIKES MATCH. Second strike from the same camera, t=1.7 s: cloud
48.8 x 53.7 x 48.5 m against the first's 48.7 x 53.7 x 48.4 m.

Stills: scratchpad/chase-standoff.png (on above, off below),
scratchpad/c-t17-on.png, c-t17-off.png, c-t31-on.png, c-t31-off.png.


## M1.a13 - the dust rides the rim, not the crater floor. A choice, measured.

Once the column was seated in the bowl, the two seatings stopped agreeing.
The stem's foot goes on `Ground` at the impact - the crater floor - while
the skirt goes on the HIGHEST ground under its own 48 m span, which over a
deep crater is the rim. Measured on the same frame, chase camera, t=1.7 s:

    crater floor at the impact   -3.73 m
    skirt underside              +0.93 m
    the dust rides               +4.66 m above the floor

That is deliberate and it stays. The column belongs in the hole the strike
opened; the dust belongs on the ground around it, not draped down into the
bowl. Seating the skirt on the floor instead would sink the ring into the
crater and hide it behind the rim from every low camera - the same class of
mistake as burying it 23 m, arrived at from the other side.

It is written down because it is a choice and not a measurement: the number
is measured, the preference is not.


## M1.a13 - crater depth, and what is left standing in the hole

Both bullets measured before any code changed.

DEPTH. The core sets it at 0.15 of the radius - `mulFast(r, 9830)` - and that
number carries a written reason: the wall's steepest gradient is 2*D/R, the
truck holds 0.45 uphill and slides backwards at 0.50, so D/R must stay under
0.225. Current depths:

       1 M   radius 16.00 m   depth 2.40 m
      10 M   radius 19.08 m   depth 2.86 m
     100 M   radius 25.71 m   depth 3.86 m
    1000 M   radius 40.00 m   depth 6.00 m

Nothing here is twice anything, so the bullet is real work.

But twice is not available. Driven from the crater floor at full throttle in
the core itself, measured rather than argued:

    D/R 0.150   1000 M floor  -6.00 m   out after  5.3 s
    D/R 0.180   1000 M floor  -7.20 m   out after  5.4 s
    D/R 0.200   1000 M floor  -8.00 m   out after  5.5 s
    D/R 0.225   1000 M floor  -9.00 m   out after  5.7 s
    D/R 0.250   1000 M floor -10.00 m   out after 10.8 s
    D/R 0.300   1000 M floor -12.00 m   NEVER out in 40 s

At the doubled ratio the truck cannot leave the largest crater at all. The
written limit of 0.225 is confirmed on live code: it costs 0.4 s and the
cliff is just past it, between 0.25 and 0.30.

So "twice as deep" as written cannot be done without trapping the truck. The
deepest honest bowl is 0.225 - 1.5x, not 2x - which takes the 1000 M crater
from 6.00 m to 9.00 m. That is a Core change and it moves every hash and
golden vector, so it is not made on my own judgement.

WRECKS IN THE RADIUS. There is no wipe anywhere: nothing in `packages/core`
or in `Assets/Scripts` removes units or hulls inside a crater radius. Counted
on the running build a second after the strike:

    crater r 33.5 m, 1 open:   1 wreck inside, 8 on the field
    crater r 27.8 m, 2 open:   0 wrecks inside, 6 on the field

Small, but not zero, and a burnt-out hull standing in a fresh hole is exactly
what the bullet says should not be there.

A HARNESS FAULT, recorded because it cost two builds. The `[crater]` line was
printing from the first build; `godring.mjs` only forwarded `[cloud]`,
`bomber away` and `[strike] impact`, so it never reached the log. I read the
silence as the game returning early, wrote a second build to "make the log
unconditional", and blamed the picture for something my own filter was doing.


## M1.a13 - the strike's voice was never wired, and is not silent

Measured after the crater wipe turned out to have been unwired in the same
`if (_strike != null)` block. Fired from the SIM switch so the ninety-second
clock cannot be mistaken for the tap:

    [sim]   simulated liquidation $648,024,048 offered to the core (switch)
    [voice] strike: wired by Bootstrap False, found lazily True,
            audio present, clip yes
    [voice] PlayOneShot detonation #1 level=0.550 pitch=0.989 sources=6
    [voice] strike fired=95 clip=True source=True effectVolume=0.55
            listener=True

WHICH ASSIGNMENT RAN: not Bootstrap's. `_strike.audio` at Bootstrap.cs:760
sits inside BuildArmies behind `if (_strike != null)`, and the theatre is not
made until line 281, so it is skipped - and it would have handed over null
anyway, because `GameAudio` is not created until line 297, after BuildArmies.
Two faults on one line.

HEARD ANYWAY, because `StrikeTheatre` fetches it lazily at the impact
itself - "Lazily, because Bootstrap builds the audio and this in an order
that is not this component's business to depend on". That comment was right
and the fallback is what carries the sound.

So NO WIRE WAS ADDED. The code is left as it stands, per the instruction:
the sound plays, the clip is present, a listener exists, and the level and
pitch are real. What is committed is the line that says so, so the claim can
be re-checked rather than re-argued.

The dead assignment at 760 is still there. It never runs and it reads as
though it does - it is what sent me looking for a silent strike. Removing it
is a decision, not a measurement, so it stays until Daniel says.

NOTHING ELSE IN THAT BLOCK IS UNSET. The only two `_strike` assignments in
it were `fx`, now wired where the theatre is made, and `audio`, covered by
the lazy fetch. Every other use of `_strike` runs after line 281.


## M1.a13 - the tanks are not in a heap; they are not on the front either

Measured before touching anything, both ends: the core in node, and what the
renderer actually draws in a running build.

THE CORE DOES NOT STACK THEM. Armour over a round, closest pair and spread:

    t=  0s  n=24  x 170 m  z 158 m  closest  2.24 m  off the front: mean 74.4 m
    t=  1s  n=24  x 162 m  z 161 m  closest  8.16 m  off the front: mean 70.6 m
    t=  2s  n=24  x 148 m  z 150 m  closest  8.38 m  off the front: mean 64.1 m
    t=  5s  n=24  x 119 m  z 111 m  closest  8.28 m  off the front: mean 44.8 m
    t= 10s  n=23  x 104 m  z  95 m  closest  8.23 m  off the front: mean 18.4 m
    t= 30s  n=19  x 142 m  z 121 m  closest  8.21 m  off the front: mean 21.1 m
    t= 60s  n=20  x 114 m  z 142 m  closest  8.23 m  off the front: mean 25.2 m
    t=120s  n=19  x 149 m  z 133 m  closest  8.11 m  off the front: mean 23.5 m

The only stacking is at spawn: 2.24 m between the closest two, which is
inside a tank's own 3.2 m size, so they interpenetrate for under a second.
The core's own separation clears it by t=1 s and it never returns - 8.1 to
8.4 m for the rest of the round.

THE RENDERER IS FAITHFUL. From the running build, every few seconds:

    [tanks] core alive 24, drawn 24, skipped for want of a hull 0;
            drawn x -76.9..68.4 (145.3 m), z -75.0..72.3 (147.3 m),
            closest pair 8.37 m

Nothing is dropped for want of a hull, and the drawn spread and closest pair
match the core's. So the picture is not a renderer bug and there is no heap
to fix.

WHAT IS ACTUALLY WRONG is the other half of the bullet. They are not ALONG
the front: the mean distance from the front line at a tank's own x settles at
20 to 25 m and individuals sit 58 to 81 m off it, and the z spread is 95 to
161 m on a field 170 m deep. They occupy the whole depth rather than forming
a line.

That is a Core spawn/front rule, not a renderer one, and changing it moves
every state hash and golden vector - the same class of decision the crater
depth was. Not made here.


## M1.a13 - the front band already exists in Core, and half the armour is in it

Step 1 of the front bullet: read the old C# for the intended band before
changing anything in Core.

WHAT C# INTENDED. `Army.Spawn` sets `standoff = Rand(4f, 12f)` - "how far
behind the line this man digs in" - and `StepInfantry` uses
`goalZ = front - Dir * (standoff + squadOffsetZ)`. Spacing is
`FriendlySpacing 8.5 m` / `HostileSpacing 7.5 m`. Units are spawned at the
FIELD EDGE, `z = -dir * (HalfDepth - Rand(0,3))`, and walk up, deliberately:
the comment says a random depth behind the line put reinforcements thirty
metres from the fighting in plain view.

CORE ALREADY CARRIES IT, and it is not a copied leftover. `ARMOUR_STANDOFF`
is 9 m with `ARMOUR_SPREAD` 10, so armour holds 4 to 14 m off the seam;
riflemen get 4 m plus a spread plus a squad offset, and the file explains at
length that this was corrected against a recording - the core's earlier flat
0-8 m put both lines four metres too far forward, which killed 81-116
riflemen a round by bomb against the recording's 60-76, with 42-49% of bombs
hitting nobody against 50-58%. FRIENDLY_SPACING and HOSTILE_SPACING are the
same 8.5 and 7.5.

SO THE BAND IS NOT MISSING. Measured distribution, armour against its own
front line at its own x, sampled every half second from 10 s to 130 s,
4,677 samples:

     0-5 m    6.4%
     5-10 m  16.5%
    10-15 m  27.5%     <- half of it, 50.4%, is inside 15 m
    15-20 m  16.0%
    20-30 m   7.8%
    30-50 m  10.5%
    50+  m   15.3%     <- one in six

Half the armour stands in the intended band. The mean of 20-25 m I reported
earlier is pulled by a long tail, and that tail is two DESIGNED behaviours:
units give ground when crowded - "one that backs off when crowded ends up
scattered through a contested strip, which is where the trickle of
engagements comes from" - and reinforcements walk in from the field edge
during the round.

Tightening the band would undo a rule that carries recorded validation
numbers. That is a different decision from the crater depth, where the old
value was the cautious end of a rule nobody had measured: here the current
value IS the measurement. Not changed on my own judgement.


## M1.a13 - the formation bullet is answered by the distribution. Pick: leave the rule.

Daniel's call, 2026-09-06: do not tighten ARMOUR_STANDOFF or ARMOUR_SPREAD,
do not cap give-ground.

The band is Core's own measured rule and it already matches the C# intent -
Spawn's `standoff = Rand(4f, 12f)` behind the line with 8.5 / 7.5 spacing
against Core's 4 to 14 m off the seam with the same spacing. It is the
RECORDING CORRECTION: the earlier flat 0-8 m put both lines too far forward
and killed 81-116 riflemen a round against the recording's 60-76, with a bomb
miss-rate of 42-49% against 50-58%. A hard line would retune those numbers on
purpose, so it is not done.

The distribution is the answer, not the mean. Armour against its own front
line at its own x, 4,677 samples from 10 s to 130 s:

     0-5 m    6.4%      15-20 m  16.0%      50+ m  15.3%
     5-10 m  16.5%      20-30 m   7.8%
    10-15 m  27.5%      30-50 m  10.5%

50.4% inside 15 m. The tail - 10.5% at 30-50 m and 15.3% beyond 50 - is the
documented give-ground scatter plus reinforcements walking in from the field
edge, both deliberate. Mean 20-25 m was the wrong summary and I should not
have led with it: a mean cannot tell a line with stragglers from a scatter.

And there was never a heap: closest pair 2.24 m for under a second at spawn,
then 8.1 to 8.4 m for the rest of the round, with the renderer drawing 24 of
24 and skipping none.

Capping give-ground is not opened on this letter: it is a new investigation
with no measured share of the remaining gap.


## M1.a13 - nothing is under the ground, late in a run or early

Measured on a running build across a full round, 6,600 ticks, with strikes
landing during it. Distribution, not a mean.

TANKS. Hull bottom - the renderer's own bounds, so tracks and skirts
included - against the ground it stands on. 66 samples, 1,379 hull-readings:

    more than 1 m UNDER    0.0%
    0.3-1 m under          5.0%   ###
    5-30 cm under         42.3%   #####################
    on it (+/-5 cm)       22.6%   ###########
    5-30 cm over          29.7%   ###############
    0.3-1 m over           0.4%
    more than 1 m over     0.0%
    deepest -0.51 m, highest +0.36 m

TRUCK. Its own lowest point over the same round, 65 samples to tick 6600:
never below -0.06 m, never above +0.36 m.

NOTHING IS BURIED. Not one hull-reading in 1,379 is more than a metre down,
and the truck never goes under at all. The bullet's premise does not
reproduce at any tick, early or late.

There is a mild bias downward - 47.3% of readings sit below the ground
against 30.1% above - and it is explained by what is being compared:
`SeatOnTerrain` fits a plane through four corner samples and puts the
transform's ORIGIN there, while this measures the lowest vertex of the whole
model. A track that hangs below the hull's seating plane reads as 5 to 30 cm
under, which is what a track bedded into soil should look like.

The seating reads the CORE's surface - `roads.SurfaceHeight`, core ground
plus deck lift, falling back to `BlwpCore.SurfaceAt` - not Unity terrain and
not PhysX. No Rigidbody or transform read is involved, so the PhysX-era
failure this bullet was expected to have is not present either.

A HARNESS FAULT, the fourth of its kind this session and now fixed at the
cause: `godring.mjs` filtered console lines against a whitelist of tags, so
`[seat]` never reached the log and the build looked silent. It passes any
`^[tag]` line now instead of a list that has to be remembered.


## M1.a13 - the mining bars: what they show, and where it comes from

Measured on the running build before any change.

    [bars] 24 bars from live mempool: first six 8.9, 3.5, 2.8, 2.3, 2.1, 2.0
           sat/vB; labels "8.9", unit "sat/vB"
    [bars] ... first six 9.0, 3.5, 2.8, 2.3, 2.1, 2.0 sat/vB; labels "9.0"

Twenty-four bars, richest on the left. Each bar carries a numeric label and
the row carries one unit label, "sat/vB", spelled out once.

THE NUMBERS ALREADY MATCH THEIR SOURCE. `_barLabels[i].text` is written from
`rates[i]` - the same array that sets `_barTarget[i]`, the bar's height - in
the same block, so a label cannot disagree with its bar. Measured: the first
label reads 8.9 while `rates[0]` is 8.9, and moves to 9.0 when the rate does.

THE SOURCE IS NOT THE CORE, and cannot be. The rates come from the live
mempool - `stream.Transactions`, falling back to `ChainStats.FeeCurve` and
then `MempoolTerrain.FeeRates`. The core has no word for a fee rate: it is
handed the RELIEF built from the histogram through `setGround`, a round-setup
upload that sits outside the hashed state, exactly as a liquidation reaches
it as a size and never as an exchange. So "make the bar numbers match the
core" has nothing to match against.

WHICH LEAVES THE BULLET'S OWN WORDING. PRIORITIES says "no numbers on mining
bars" - remove the per-bar figures - which is the opposite action from
verifying them. The measurement supports the removal reading: there is
nothing wrong with the numbers, so the only work the bullet can mean is
taking them off the bars. Not done on my own judgement: deleting twenty-four
labels a player can currently read is not something to infer.

No PhysX read and no 2-D coupling anywhere in this path.


## M1.a13 - the per-bar figures are off the mining bars

Daniel's pick, 2026-09-06: PRIORITIES wins over the consistency reading. The
working order asked for no numbers on the bars, not a check that they agree.

BEFORE (measured on the running build):

    [bars] 24 bars from live mempool: first six 8.9, 3.5, 2.8, 2.3, 2.1, 2.0
           sat/vB; labels "8.9", unit "sat/vB"

Twenty-four TextMeshes named BarFigure0..23, each printing its own rate to
one decimal, plus one unit label for the row.

AFTER:

    [bars] 24 bars from live mempool: first six 15.5, 5.2, 4.3, 4.0, 3.4, 3.0
           sat/vB; per-bar figures 0, unit "sat/vB"
    [bars] ... first six 15.5, 5.2, 4.4, 4.0, 3.4, 3.1 sat/vB;
           per-bar figures 0, unit "sat/vB"

Counted, not eyeballed: the diagnostic now walks the screen's children and
counts TextMeshes named BarFigure*, and finds none. The figures are not
blanked, they are never built.

WHAT DID NOT CHANGE. Twenty-four bars, still fed from the same array, still
richest on the left, heights still `_barTarget` from `rates`, source still
the live mempool with the same two fallbacks, and the row still carries one
"sat/vB". The unit's placement used to be computed inside the label loop; the
tops and the pitch it needs now come from the bars themselves, so removing
the figures did not move it.

Renderer only. No core fee-rate was invented - the core still has no word for
one - no PhysX read, no 2-D coupling.


## M1.a13 - the whitepaper fits the frame: the block was still shaped for a plate that is gone

The rule this file already carries, applied to the layer under the one it was
learned on. The whitepaper sat at 22% through four changes because `Fit` had
been handed a 9.4 x 12.2 plate while the page was 73.8 x 52.3. That was fixed
by refitting against the live plate - and the TEXT was still cut for the dead
one.

BEFORE, measured on the running build:

    [paper] plate 73.8 x 52.5, room 69.4 x 49.4, text 70.7 x 100.9,
            k 0.489 -> drawn 34.6 x 49.4, covering 47% x 94% of the plate

The plate is LANDSCAPE, 1.41. The text block was PORTRAIT, 0.70 - eleven
short lines, shaped by its own comment "to the plate, which is 9.4 x 12.2 -
portrait, about 0.77". `Fit` takes the tighter axis, so the block filled the
height, ran out, and left half the width empty. Raising the fill from 0.80 to
0.94 had moved it three points and stopped, because the fill was never the
limit - the shape was.

AFTER, seven lines with the longest about twenty-two characters, near the
plate's own ratio:

    [paper] plate 73.8 x 52.5, room 69.4 x 49.4, text 85.2 x 64.1,
            k 0.770 -> drawn 65.6 x 49.4, covering 89% x 94% of the plate

47% x 94% to 89% x 94%. Neither axis is over 100%, so it fills the frame
without running off it.

No core, no PhysX, no invented quantity: this is a TextMesh scaled against
the mesh bounds of the plate it is parented to.


## M1.a13 - the whitepaper still, and what it exposed. NOT CLOSED.

Daniel asked for a still before this bullet counts as closed. It was the
right call: the coverage number was measured in a space the camera does not
use, and the photograph says so.

FIRST ATTEMPT AT THE STILL FAILED and must not be mistaken for evidence. A
PlayMode camera into a RenderTexture cannot render under `-batchmode
-nographics`: "RenderTexture.Create failed", and it wrote a 13 KB uniform
grey PNG. That test is deleted. The mushroom stills were taken from the
WebGL build in a browser, and that is the only pattern that works here.

THE STILL, from the build, truck stood in front of the plate:
scratchpad/paper-west.png at e1837fc. The page is not on a plate at all - the
lettering is sprawled across the whole depot, "31 Oct 2008" spanning the full
width of the view.

WHY, in world metres:

    [paper] WORLD: plate 0.0 x 12.2 x 9.4 m, text 0.0 x 49.4 x 65.6 m
    [paper] plate 73.8 x 52.5, room 69.4 x 49.4, text 85.2 x 64.1,
            k 0.770 -> drawn 65.6 x 49.4, covering 89% x 94% of the plate

The text is drawn four times taller and seven times wider than the plate it
belongs to, while the local numbers report a tidy 89% x 94%.

THE ROOT IS THE OLD TRAP, ONE LAYER FURTHER OUT. `Room()` reads
`MeshFilter.sharedMesh.bounds` - 73.8 x 52.5 - and the renderer DRAWS a plate
of 12.2 x 9.4. `Refit` was added to re-read the live plate and it re-reads the
same stale mesh. So the page is still "sized perfectly, to something else".

AND THE TEST SHARES THE MISTAKE. `PostOfficeTests.TheLetteringFillsItsPlates`
measures `mf.sharedMesh.bounds.size` against `mr.localBounds * localScale` -
the same stale frame. It asserts the largest lettering fills more than 55% of
its plate and passes today at 89% while the page covers the depot.

WHAT I TRIED AND REVERTED. A world-space second pass in `Fit` brought the
paper to 94% x 85% of the plate in world metres and the sprawl was gone from
the still - but applied to every plate it took `mined_face_03` down to 47%
and turned that test red, and confined to the paper it turned the same test
red on the whitepaper at 22%, because the test measures the stale frame. Both
are reverted; the tree is back at e1837fc.

So the bullet cannot be closed by measurement alone: the fit and the test
share one wrong reference for this plate, and correcting it means changing
what BOTH read. That is a decision, not a measurement.


## M1.a13 - one stale frame, removed from the fit AND from its test

The metric was wrong, not the threshold. `Room()`, `Fit`/`Refit` and
`PostOfficeTests.TheLetteringFillsItsPlates` all read
`MeshFilter.sharedMesh.bounds` - 73.8 x 52.5 for the whitepaper - while the
renderer draws that plate at 12.2 x 9.4 m. Production and the assert agreed
with each other and neither agreed with the screen, which is why 89% x 94%
read as closed while the still showed the page across the depot.

All three read the drawn plate now - `Renderer.bounds`, world metres, the
size the camera has. Same number in production and in the test.

    before  drawn plate 12.2 x 9.4 m, text 49.4 x 65.6 m   405% x 698%
    after   drawn plate 12.2 x 9.4 m, text 11.5 x 8.6 m     94% x  92%

Stable across four samples in one run: the fit is now RELATIVE - it measures
what is drawn and multiplies the scale by the ratio it is short or over by -
so the first pass with a real mesh lands on the target and every pass after
it is a no-op. `_paperFitted` is gone with the latch it guarded, and `Refit`
is `Fit`, because a plate swapped under its own name is simply measured
again.

TWO FAULTS OF MY OWN ON THE WAY, both caught by the suite rather than by me:

  - A world-space pass applied to EVERY plate took `mined_face_03` to 47%
    against the 55% the test requires. The other plates were already right;
    only the whitepaper's transform carries the odd scale.
  - `_room` was changed to hold the fraction of the plate a lettering is
    entitled to, and one leftover still wrote METRES into it, so the paper
    was told its share was 11.5 and came out 107 m wide on a 12.2 m plate.
    The test caught that too, in the drawn frame, which is the point.

The fill band was not moved: still 0.94, still >55% asserted.


## M1.a15 - the truck drives INTO the hole. Measured, no code changed.

The HARD line in item 9, never tested until now. It is a measurement, and
the answer is that the picture already does it.

IN THE CORE. Driven from outside the rim at full throttle, straight at the
centre, reading the core's own `surfaceAt` under the truck every tick. The
distribution is over the ticks spent inside 30 m of the centre:

     10 M  floor -4.29 m   under the truck: min -4.29  median -0.45  max  0.00
    100 M  floor -5.79 m   under the truck: min -5.78  median -3.25  max  0.00
   1000 M  floor -9.00 m   under the truck: min -9.00  median -7.61  max -3.96

At its closest approach - 0.0 to 0.1 m from the centre in all three - the
ground under the truck is the crater floor itself: 0.00 m above it. It does
not ride over the bowl at any size; the median shows it spends the crossing
well below the rim, and the deeper the crater the deeper the median sits.

IN THE BUILD. A liquidation fired from the SIM switch, then the truck put on
the crater it dug:

    outside   [seat] truck at tick 120: bottom +0.36 m vs the ground,
              ride 5.95, surface 5.09
    inside    [seat] truck at tick 224: bottom -0.10 m vs the ground,
              ride -1.63, surface -2.48
    [crater] nearest crater 0.0 m away, r 29.3 m

The truck's ride drops 7.58 m, from 5.95 to -1.63, on a surface that drops
7.57 m. It follows the bowl rather than standing over it, and its own lowest
point stays within 0.36 m of the ground the whole way.

STILL: scratchpad/into-hole.png. The truck sits inside the pale bowl with the
green rim curving around and above it, the armour on the horizon overhead,
the mushroom standing over the truck.

No code was changed for this bullet. The seating that puts it there reads
`Ground` - the core's surface, relief LESS craters - through
`roads.SurfaceHeight`, so the hole the core dug is the hole the truck drives
into. No PhysX read is involved and no 2-D coupling was reintroduced.


## M1.a15 - M1.d confirmed: the cap is above the driving camera's frame

Measured from the chase camera - no god view, no orbit, no debug - with the
truck stood off from the blast, and the cap's own renderer projected into
that camera. The share is of the WHOLE frame, and the on-screen size is the
part of its rect that is not past an edge.

    70 m stand-off
      t=0.3s  visible False  on screen 344x42 px = 1.6% of the frame
      t=1.7s  visible False  on screen 694x 0 px = 0.0%   rect y 794..1490
      t=3.1s  visible False  on screen 678x 0 px = 0.0%   rect y 790..1466
      t=4.6s  visible True   on screen 365x32 px = 1.3%

    150 m stand-off
      t=0.3s  visible False  on screen 218x127 px = 3.0%
      t=1.7s  visible True   on screen 392x 39 px = 1.7%   of 317 px of cap
      t=3.0s  visible True   on screen 395x 38 px = 1.6%
      t=4.3s  visible True   on screen 253x107 px = 2.9%
      t=5.7s  visible True   on screen 142x 81 px = 1.3%   all of it

At 70 m the cap is entirely off the top of the screen at both of the frames
that matter. At 150 m it is in the frustum but still cut: 39 px of a 317 px
head at 1.7 s. It is only whole once the cloud has SHRUNK, at 5.7 s.

The still is scratchpad/c-t17-on.png: the column rises out of the top edge
and the head is not in the picture.

So M1.d is real and it is not a culling or a placement fault - the cap is
where the core's impact says it is, and the stem is seated on the crater
floor. It is a framing fault: a 55 m column seen from a camera at truck
height subtends more than the driving view holds at the distances strikes
land.

NOT FIXED HERE, because the fix is a choice and not a measurement:

  - lower the cloud, `StemHigh` 55 m being a theatre number and not the
    core's, which costs the strike its scale; or
  - let the driving camera look up while a cloud is standing, which is
    camera work on a letter whose camera bullets are closed.

Both are player-facing decisions. The instrumentation that measures either
is committed; the choice is not mine to make.


## M1.a15 - the driving camera looks up while a mushroom stands

StemHigh stays 55 m. The view moves, not the cloud.

While a cloud is up, `StrikeTheatre` publishes the cap's world centre and
`ChaseCamera` raises its LOOK POINT towards it - never past it, and never
above `cloudLookUp`, 26 degrees over the horizontal, so the road stays in the
lower half of the frame. It eases in and out at 2.2/s and lets go by itself:
the theatre publishes nothing between strikes, so there is no state to clear.

Pictures only. Steering, throttle and brake are untouched; it is not an
orbit, not a god view and not a second stick, and nothing here reads or
writes a core value.

    70 m stand-off, cap on screen, share of the frame
      before   t=1.7s   694x  0 px   0.0%   rect y  794..1490
               t=3.1s   678x  0 px   0.0%   rect y  790..1466
      after    t=1.7s   298x204 px   6.6%   whole rect, nothing clipped
               t=3.2s   288x195 px   6.1%   whole rect

    150 m stand-off
      before   t=1.7s   392x 39 px   1.7%   of a 317 px head
               t=3.0s   395x 38 px   1.6%
      after    t=1.6s   231x156 px   3.9%   whole rect
               t=2.9s   233x157 px   4.0%   whole rect

Nothing else moved. The stem is still seated on the crater floor -
"foot was -31.96, crater floor -5.69, buried 26.28 m -> foot now -5.69" - and
the truck still rides the ground at +0.36 m, so it still drives into the bowl
rather than over it.

The still is scratchpad/c-t17-on.png: the whole cloud, stem and cap, standing
in the driving view with the depot and the ground still in the lower half.


## M1.a15 - the bomber and the bomb ARE in the driving picture

The worry was a crater with no cause: six seconds pass between the warning
and the hole, and if the aircraft and the bomb ran off the top the way the
cap did, the player would never see what dug it. Measured with the same probe
as the cap, from the same chase camera, at the same two stand-offs.

    70 m
      t=0.3s  plane  288x291 rect, on screen 288x124 px = 3.9%, CLIPPED top
      t=1.5s  plane  rect x -1666..-944, on screen  0x74 px = 0.0%
      t=2.9s  plane  rect x  -251..   4, on screen  4x33 px = 0.0%
      t=3.9s  plane  on screen 240x32 px = 0.8%    bomb 56x26 px = 0.2%
      t=5.0s  plane  on screen 227x32 px = 0.8%    bomb 49x32 px = 0.2%
      t=6.0s  plane  on screen 204x29 px = 0.6%

    150 m
      t=0.3s  plane  front FALSE - behind the camera, 0.0%
      t=1.7s  plane  rect x -793..-401, on screen 0x45 px = 0.0%
      t=3.0s  plane  rect x -311..   7, on screen 8x40 px = 0.0%
      t=4.1s  plane  on screen 273x40 px = 1.2%    bomb 60x29 px = 0.2%
      t=5.2s  plane  on screen 286x40 px = 1.2%    bomb 52x35 px = 0.2%
      t=6.2s  plane  on screen 256x34 px = 0.9%

SO THIS IS NOT THE CAP'S FAULT REPEATED. The same shape at both distances:
the aircraft comes in from the west, so for the first three seconds it is
behind the camera or off the LEFT edge - not above it - and from about t=4 s
it crosses the frame, releases, and both it and the bomb are on screen
through to impact. The bomb is small, 50-60 px by 26-35, but it is there and
unclipped for the whole fall.

TWO THINGS THAT ARE TRUE AND SMALL. At 70 m the plane is clipped at the top
when it first appears - 124 of 291 px at t=0.3 s - and for the first three
seconds of the warning it is out of frame at both distances. Neither hides
the cause: the release and the fall are both in the picture.

The camera's cloud look-up plays no part here. It engages only while a cloud
STANDS, which is after the impact, so the whole approach is measured at the
ordinary driving pitch.

No code changed for this bullet beyond the probe that prints it.


## M1.a15 - the t=0.3 s cap clip is the ease-in, and it is intermittent

Instrumented rather than guessed, because there were three candidates -
camera pitch, cloud height, cap placement - and the answer is none of the
ones that would have cost something.

    t=0.3s  [look] blend 0.52, cap needs 10.0 deg, allowed 10.0,
                   was -14.7, aiming -1.9
    t=1.7s  [look] blend 0.95, cap needs 16.8 deg, allowed 16.8,
                   was -14.7, aiming 15.1
    t=3.0s  [look] blend 0.99, cap needs 17.0, allowed 17.0, aiming 16.8

At the first instant the cap only needs 10.0 degrees - it is LOW, the cloud
has barely grown - and the allowed lift is the same 10.0, so the 26 degree
clamp is nowhere near binding. What is short is the blend: 0.52. The camera's
ordinary aim is -14.7 degrees, down at the road, and half way through the
ease that lands at -1.9 instead of +10.0.

So it is not the cloud's height, not where the cap sits, and not the clamp.
It is the ease-in at 2.2/s not having finished 0.3 s after the detonation.

AND IT IS INTERMITTENT. Two runs at 70 m: one clipped, 116 of 143 px, and one
whole, 147 of 147 px at 1.6% of the frame. It depends on where the strike
lands relative to the truck. At 150 m it did not clip at all - 128x78 of
128x78 at t=0.2 s - so it is a near-truck case only.

SHARE OF THE REMAINING PICTURE GAP: very small. One frame at 0.3 s, close in,
sometimes, while the flash and the blast are what the eye is on anyway. The
cap is whole from about t=0.6 s for the rest of the cloud's life.

NOT FIXED, and the reason is arithmetic rather than taste. To have the blend
at 0.9 by t=0.3 s the rate must be about 7.7/s, which swings the view 24.7
degrees in three tenths of a second - a lurch, and the ease exists precisely
so a strike does not snap the picture. The other way is to start the tilt at
the bomber's warning six seconds early, but there is no cap to aim at yet and
it would change what the approach looks like, which is a design decision and
not a defect.


## M1.a15 - RESIDUAL, accepted and left: the first-instant cap clip

Daniel's call, 2026-09-06: leave the ease-in at 2.2/s, do not pre-tilt at the
bomber's warning.

    t=0.3s   blend 0.52, cap needs 10.0 deg, allowed 10.0, aiming -1.9
             (the ordinary driving aim is -14.7, down at the road)
    70 m     one run clipped 116 of 143 px, one run whole 147 of 147
    150 m    no clip at all, 128x78 of 128x78

The cap is whole from about t=0.6 s for the rest of the cloud's life. The
clamp is not binding at 10.0 degrees and the 55 m column is not the cause;
the blend simply has not finished. A 7.7/s blend would put it whole at 0.3 s
and swing the view 24.7 degrees in three tenths of a second, which is the
lurch the ease exists to prevent.

Written down as a residual rather than a defect: intermittent, near-truck
only, one frame, while the flash and the blast hold the eye.


## M1.a15 - the dust rides 3.1 to 4.7 m over the floor, across four craters

Not a single-depth artefact. Four strikes, four crater sizes, the skirt's
underside against `Ground` at the crater centre:

    r 30.9 m   floor -2.87   skirt underside +0.78   gap 3.65 m
    r 35.7 m   floor -5.10   skirt underside -0.94   gap 4.16 m
    r 38.3 m   floor -4.52   skirt underside -1.41   gap 3.11 m
    (earlier)  floor -3.73   skirt underside +0.93   gap 4.66 m

The crater's own depth is 0.225 of its radius, so 6.95, 8.03 and 8.62 m for
the three measured radii. The gap is 36 to 53% of the depth, which is what
the recorded choice predicts: the column seats its foot on the floor while
the skirt seats on the HIGHEST ground under its own 48 m span, and at 24 m
out the bowl has climbed back most of the way to the rim.

So the choice holds across depths rather than being true at one. Nothing is
floating over flat ground: away from a crater the skirt sits ON the surface,
and the gap only exists over the hole, which is where dust thrown OUT of a
hole belongs.

WHAT I COULD NOT SAMPLE. Every crater here is large, 30.9 to 38.3 m. SIM
draws 1 to 1000 million uniformly in dollars and the radius follows the CUBE
ROOT of the load, so the small end is compressed and four strikes never
reached it. At the smallest crater the rule predicts something different in
kind - a 16 m crater is narrower than the skirt's own 24 m reach, so the
highest ground under the span is the surrounding relief and the gap should be
the full depth, about 3.6 m - but that is arithmetic, not a measurement, and
it is written here as such.

Seating reads `Ground` - the core's surface, relief LESS craters - through
`roads.SurfaceHeight`. No PhysX value is read anywhere on this path.


## M1.a15 - the small crater, and the seating rule confirmed end to end

The tail the SIM draw never reached. No game code was changed for it: the
bundle exports `submitLiquidation`, so the harness handed the core the load
itself - one million, which is `CRATER_LOAD_MIN` and the 16 m radius the rule
is defined at. Three strikes, all r 16.0 m:

    floor  0.48   skirt underside 3.43   gap 2.95 m   0.82 of the depth
    floor -0.07   skirt underside 3.72   gap 3.79 m   1.05
    floor  1.55   skirt underside 5.39   gap 3.84 m   1.07

Depth at 16.0 m is 0.225 x 16.0 = 3.60 m, so the mean is 0.98 of it. The
arithmetic said the gap should become the FULL depth once the crater is
narrower than the skirt's own 24 m reach, and it does.

Beside the large end already recorded:

    r 16.0 m   depth 3.60 m   gap 2.95-3.84 m   0.82-1.07 of depth
    r 30.9 m   depth 6.95 m   gap 3.65 m        0.53
    r 35.7 m   depth 8.03 m   gap 4.16 m        0.52
    r 38.3 m   depth 8.62 m   gap 3.11 m        0.36

One rule across the whole range: the fraction rises as the crater narrows
towards the skirt's reach, and falls as it widens past it. Nothing here is an
artefact of a single depth and nothing contradicts the choice, so the game is
left alone.

The spread at 16 m - 0.82 to 1.07 - is the surrounding relief: the skirt
seats on the HIGHEST ground under its span, and 24 m out that ground can sit
above or below the crater's own rim depending on the hill it landed on. Above
1.0 simply means the ground out there was higher than the rim.

Seating still reads `Ground` through `roads.SurfaceHeight` to the core
surface. No PhysX value anywhere on this path.


## 9. M1 liquidation picture - MEASURED-COMPLETE, still open on the voice

Every named visual hole is fixed or recorded as a deliberate choice, and each
was measured on the browser build rather than inferred from the suite:

  - the bomber crosses the driving frame and the bomb is on screen, unclipped,
    for the whole fall, at 70 m and 150 m
  - the HUD names the liquidation the core took and the exchange it came off,
    gated on StrikeCount with an eight-second fade; a simulated strike reads
    "simulated"
  - the mushroom's stem stands on the crater floor and its cap is in the
    driving camera - 6.6% and 6.1% of the frame at 70 m, whole and unclipped,
    against 0.0% before
  - the cloud stays 55 m; the view moves, not the cloud
  - the truck drives INTO the bowl: the ground under it reaches the crater
    floor, and in the build the ride drops 7.58 m against a 7.57 m surface
  - burnt-out hulls inside the radius are wiped
  - the detonation plays, and no debug key ships

DUST SEATING, the one deliberate choice, now measured across the whole range:

    r 16.0 m   depth 3.60 m   gap 2.95-3.84 m   0.82-1.07 of depth
    r 30.9 m   depth 6.95 m   gap 3.65 m        0.53
    r 35.7 m   depth 8.03 m   gap 4.16 m        0.52
    r 38.3 m   depth 8.62 m   gap 3.11 m        0.36

RESIDUAL, accepted: the first-instant cap clip, intermittent and near-truck
only, cause identified as the camera's 2.2/s ease-in rather than the cloud,
the cap's placement or the 26 degree clamp.

REMAINING UNDER ITEM 9: M1.a11 alone - the strike's voice. It is blocked on a
human ear, not on code: a headless browser has none, and it will not be
closed from the harness. Item 9 stays open around it.


## M1.a13 SIM bullet reopened - the daily site is a stale build

Daniel, 2026-09-06 17:33, iPhone on btc-logistics-core.pages.dev: PRACTICE
ON, DEBUG line visible, no SIM button.

MEASURED BEFORE CHANGING ANYTHING, and there is nothing to change:

  - the live wasm is 10,290,270 bytes against the local build's 10,288,371 -
    a different build. Both are compressed, so grepping either for the SIM
    strings proves nothing, and the control string confirms that test is
    useless; it is not the evidence.
  - `.github/workflows/core.yml` runs the core acceptance on push and does
    NOT deploy. Deployment is `deploy-core.sh` by hand, to project
    btc-logistics-core.
  - I have not run it once this session. The SIM switch was committed at
    32cae7d today, so the daily site cannot have it.
  - and it is not a phone-layout fault: rendered at iPhone landscape,
    844 x 390, the switch draws under PRACTICE and reads "SIM . OFF / tap to
    fire liquidations". scratchpad/phone-hud.png.

So the button is absent from Daniel's phone because the build he is looking
at predates it, not because the feature is missing or broken. The fix is a
deploy of the current build to the daily URL, which is an outward-facing
action and his call, not mine.


## M1.a13 scoring - the risk map is fine; the clamp is what flattens it

Daniel 18:11/18:15: score is proximity to the front, risk - the seam must pay
massively more than the edges - and it does not.

THE RISK MAP IS NOT THE FAULT. `threatAt` measured across the field at t=30 s
(0 to 1, armour counts 1.0 and infantry 0.18 within range):

              z=-70  z=-40  z=-15  z=0    z=+15  z=+40  z=+70
      x=-100   0.00   0.00   0.00   0.10   0.10   0.10   0.10
      x= -50   0.17   0.29   0.96   1.00   0.71   0.50   0.30
      x=   0   0.02   0.70   1.00   1.00   1.00   0.72   0.10
      x=  50   0.24   0.58   0.84   0.70   0.68   0.04   0.02
      x= 100   0.00   0.10   0.10   0.21   0.19   0.00   0.00

That is a well-shaped map: nothing at the corners, saturated at the seam.

THE CLAMP IS. Exposure accrues as `threat * (1 + cargo) * forward metres`, and
the score is

    1000 * min(exposure, EXPOSURE_REFERENCE) / EXPOSURE_REFERENCE
         * (REFERENCE_TICKS / ticks) * cargo

with EXPOSURE_REFERENCE = 190. A run gains about 180 m of x, and a full bed
makes the multiplier 2, so the reference is reached at an AVERAGE THREAT OF
0.53. Anywhere near the seam averages far above that - the middle of the map
integrates to roughly 306 - so a dangerous run and a moderately dangerous run
both clamp to 1.0 and score the same 1000. Risk stops paying at about half of
it.

So the shape Daniel wants is already computed; it is thrown away by a ceiling
that is too low to separate the two runs he drove.

NOT CHANGED HERE. This is `packages/core/src/rules/score.js` - a core rule, so
it moves every state hash and golden vector, exactly as the crater depth did -
and "massively more" is a number somebody has to choose. What the fix looks
like is either a much larger reference, or dropping the clamp and letting the
factor run past 1.0 so the seam pays several times the edge.



## 2026-09-06  M1.a13 closed: the reckoning, not new work

No code changed here. This is the count that lets the letter be marked
done, taken at HEAD 3cd1825 with nothing uncommitted but PRIORITIES
itself.

  core acceptance   PASS
     node --test    67 tests, 67 pass, 0 fail
     cross-engine   node vs bundle-node identical,
                    72289561158074cc17d11f756fa36e8acf6dc5b050dface15f242473fc341cb2
     cross-version  SKIPPED, one runtime on this machine
     cross-arch     SKIPPED, no docker daemon

  EditMode  139: 138 green, 1 red
     CombatFxTests.RifleFireProducesAFlashAndATracer - the known one. It
     drives the RETIRED C# army through Bind with Populate(0, 20) and that
     path raises no Shot. Editor-only by construction; the product does not
     run that engine.

  PlayMode  190: 168 green, 12 red, 10 skipped
     Eleven are the documented Battlefield.Army set - BothArmiesAreOnThe
     FieldAndOnTheGround, ArmourBlocksTheTruck, TheTruckCanDriveOnAfter
     HittingTheArmy, UnitsDoNotShoveEachOtherWithPhysics, ArmiesFightNear
     TheSeamRatherThanWanderingOff, DamageIsFeltInTheDriving, CrashingInto
     ArmourWritesItOff, ArmiesAreActuallyDrawn, SoldiersStandOnTheGround
     AndAreAnimated, TanksStandOnTheGroundRatherThanInIt, RoadsAreActually
     Drawn. Same names as the last count; none is on the deploy path.

     The twelfth is PostOfficeTests.TheGogglesAnimate, "0.0 vs 0.02" - the
     load flake this book has carried since item 1. Not waved away: run on
     its own against the same tree it is green, 1 of 1. It wants a mempool
     fetch to land inside a two-second window and does not get one while
     190 tests share the machine.

  Suite growth since the last count: EditMode 136 -> 139, PlayMode 180 ->
  190, from the seating, crater-wipe and fit tests this letter added.

THE LIVE BUILD IS THE ONE AT HEAD, not an older upload that happens to
work. btc-logistics-core.pages.dev/Build/webgl.wasm.unityweb md5
c0b45c2e679bfa959f548643a5f8fa72, identical to the local artefact. The
build ran 19:03-19:05; the last source touched under Assets or
packages/core/src was GameAudio.cs at 18:59, and the only tree difference
against HEAD is the addressables meta that is on the do-not-commit list.
So the deployed binary carries the detonation fix, the ticker trim, the
wreck life, the streaming order and the 320 exposure ceiling.

btc-logistics-war.pages.dev untouched.


## 2026-09-06  M1.a14 bullet 1 and 2: the four cases a13 never drove

a13 measured the driving camera on ONE keyboard slalom and took the worst
off-nose from 8.7 degrees to 3.8. The bullet says "never", and a slalom is
not never, so the four cases it does not contain were driven headless in
PlayMode BEFORE any camera edit. No camera edit came out of them.

Two angles, because "the direction the truck drives" is not always the nose:
off-nose is the camera against the hull, off-travel the camera against the
velocity vector. Velocity is read the way `ChaseCamera.cs:380` reads it -
the core when a core answers, the kinematic body only as the fallback. In
the editor `BlwpCore.Available` is false, so this is the renderer's geometry
with the PhysX velocity standing in for the core's; the camera path does not
branch on where the vector came from.

The frame is the last column and it is the one that matters. The driving
lens is 58 degrees vertical, about 44 degrees from the middle of the picture
to its edge, so a point 20 m down the road is projected into the camera and
its place across the frame recorded: 0.00 is the left edge, 1.00 the right,
0.50 dead centre.

  case                worst off-nose   off-travel   slip    road across
                                                            the frame
  stop and reverse      0.0 deg        180.0        180.0   0.50 .. 0.50
  spin-out             24.9             34.5         40.9   0.50 .. 0.64
  impact throw         15.4             15.4          0.0   0.50 .. 0.56
  look released        33.7             33.7          0.0   0.34 .. 0.50

  back under 2 degrees off the nose:
    reverse 0.00 s, impact 0.63 s, spin-out 3.06 s, look 4.09 s
    (the look itself was 54.0 degrees of orbit yaw, 0.00 left at the end)

SO THE BULLET IS ALREADY TRUE, and that is the finding. The camera does
swing - 24.9 degrees through a handbrake spin, 15.4 under an impact - but
the road it swings away from stays in the picture the whole time, never
closer than a third of the way in from an edge. Reversing does not move the
camera at all: off-nose 0.0, the road dead centre, and off-travel 180
because the truck is going backwards while the driver looks over the bonnet.
That is a design decision, not a fault, and it is recorded rather than
quietly "fixed" - turning the view round in reverse is Daniel's call.

The look case is the only one that puts the road off centre, to 0.34, and it
is the driver's own drag. It comes back: 0.00 degrees of orbit left when the
window closes.

NO CAMERA EDIT. `ChaseCamera.cs` is untouched by this letter so far.

## 2026-09-06  M1.a14 bullet 2: the strike tilts the view, it does not swing it

Measured in the same probe rather than argued. A cloud raised 60 m ahead
and 45 m to the SIDE of the road, with the camera watched frame by frame:

  view pitch          up to 25.4 deg of the 26 deg `cloudLookUp` clamp
  worst yaw step      0.08 deg in a frame
  worst off-nose      0.2 deg
  road across frame   0.50 .. 0.50, dead centre throughout

So there is no snap to the bomb and there is no reparent: the only thing
that moves is pitch, it stops at its own clamp, and the yaw the driver
steers by does not move at all. Bullet 2 is closed on those numbers.

The pitch STEP per frame is not a usable number and is written down here so
it is not quoted as one: headless batchmode runs frames of wildly uneven
length, and the same 2.2/s ease read 4.99 degrees in one frame in one run
and 1.15 in the next. What is stable is that the whole tilt takes about a
second and yaw never moves.

Sideways matters. The first cut raised the cloud DEAD AHEAD, and a mutant
that aimed the camera at the cloud - yaw and all, the exact snap this test
forbids - passed, because pointing at something straight in front of you
needs no yaw. With the cloud 45 m off the road the same mutant dies at
32.96 degrees of yaw in a frame.

## 2026-09-06  M1.a14: the cap outlived its theatre

FOUND BY THE PROBE, not looked for. The strike case reported "view pitch up
to 0.0 deg" while the tilt plainly worked, and the tilt then appeared in the
NEXT test's log - on a camera whose scene had been reloaded and whose cloud
did not exist.

`StrikeTheatre.CapCentre` is static and is cleared in one place only, where
`Column` reaches `Gone`. A theatre that goes away while a cloud is standing -
a restart, a scene change, a round that ends on a strike - left the last
cap's world position published for good, and every driving camera after it
pitched up at nothing. The proof is in the test that names it: destroy the
theatre with a cloud up and the cap is still published at
(-40.47, 33.08, 10.14).

Fixed where it belongs, one line: `void OnDisable() => CapCentre = null;`.
Pictures only, no core value touched.

## 2026-09-06  M1.a14: what the probe got wrong before it got anything right

Three faults in my own measurement, all found by the numbers disagreeing
with themselves rather than by reading the code again:

  - ALL FOUR CASES ON ONE TRUCK. The impact case inherited the spin-out's
    slide - 73.4 degrees of slip while it was supposed to be driving
    straight - and by the fourth case the truck was not moving at all, so a
    released look was measured over a parked lorry that read speed 0.0.
    One case per test now, each from a fresh scene, and a guard that fails
    the case if the truck never reached 6 m/s.
  - TIME TO RETURN WAS THE FIRST FRAME UNDER THE THRESHOLD, which is frame
    one in every case, before the disturbance has developed. It printed a
    confident 0.00 s for a camera about to swing 43 degrees. It is the LAST
    frame ABOVE the threshold now, and the clock carries across a two-part
    window - the spin-out samples the slide and then the settle, and with
    the clock restarting it claimed the camera was back on the nose after
    0.01 s.
  - 300 FRAMES IS NOT SIX SECONDS. Headless batchmode renders as fast as it
    can, so the strike loop ran under a second of game time, the camera's
    2.2/s ease reached a blend of 0.00, and the probe reported a tilt of 0.0
    degrees for a tilt that works. Seconds, not frames.

MUTATION-CHECKED, one mutant per test, each reverted immediately:

  camera settles behind velocity again  -> Reversing red, road at -1.00,
                                           i.e. behind the camera
  yawDamp 2.8 -> 0.5                    -> SpinOut red at 0.92 across frame
  the look never eases back             -> ComesBack red, 54.0 deg held
  aim at the cloud, yaw included        -> Strike red, 32.96 deg/frame yaw
  no OnDisable                          -> CapIsForgotten red
  impact throw six times as violent     -> SURVIVED, and it should: a shake
                                           moves the camera, not its aim, so
                                           the road stays in the picture and
                                           the asserted property is still
                                           true. The bite for that case is
                                           the decay, and the decay mutant
                                           (3.2 -> 0.05) does kill it.


## 2026-09-06  M1.a14 HUNTED: both engines put 100% of the truck's damage on tank shells

Measured before any edit, and the answer is not the one the bullet expects.

The question was what share of the damage to a PARKED truck is tank fire in
the retired C# army against what the core does now. Same establishment is
not possible - the C# recording is 24 armour and 72 infantry a side, the
core holds 12 and 36 - so the SHARE is the comparable figure, not the rate.
Both were run with the truck held at one place, Heat at zero, and the window
closed where the truck is written off, because damage is withheld after that
and a tally that keeps counting reports a battle nobody was in.

  parked at   C# seconds  shells  damage    core seconds  hits  damage
   z =   0      13.73       21     157.1      12.45        19    153.1
   z =  -5      13.73       21     159.3      12.45        20    158.7
   z = -12      17.35       19     153.1      16.30        20    159.9
   z = -25      17.40       19     156.5      16.73        19    155.5
   z = -34      20.78       18     153.3      20.47        18    151.9

  tank share of damage to the truck:   C# 100.0%   core 100.0%

SO NOTHING IS MISSING FROM THE DAMAGE. X is zero of Y. The core hunts the
truck as hard as the C# army did and kills a parked one in 12 to 20 seconds,
all of it armour, within a second and a couple of shells of the engine it
replaced. Riflemen contribute nothing to a parked truck in EITHER engine
while it is alive: the rifle reaches 26 m against the tank's 34 to the
courier, and the tank finishes it first. The rifle band exists in both
(`COURIER_RIFLE_MIN` 1.5 to 3.5, `Army.cs:737`) and is simply never the
thing that kills you.

Two caveats on the record. The C# side needs a subscriber on `CourierHit`
to see the hits at all, and `?.Invoke` evaluates `Rand(...)` only when
something is subscribed - so watching the battle draws numbers an unwatched
run does not, and this is not bit-identical to a silent one. The share does
not turn on which draw a shell took. And the two engines were run from their
own seeds, not a shared one; the agreement is of behaviour, not of stream.

WHERE THE GAP ACTUALLY IS, found while looking for it and NOT acted on:

  1. The picture never points a barrel at the player. `CombatFx.Muzzle` is
     wired to the core - `fired` comes off the core's reload clock at
     CombatFx.cs:1061 and the flash and tracer are drawn - but the target
     search at :1109 only ever considers other UNITS: it skips `j == i`,
     skips the dead, skips the wrong arm, skips own side, and the truck is
     not in that list at all. When the core spends a shell on the courier -
     which is 100% of what hurts the player - the tracer is drawn at some
     other tank instead, or down the unit's heading when nothing is in
     reach. So the player is hit hard, repeatedly, and never sees anyone
     aiming at him. That is what "tanks and soldiers do not shoot" looks
     like from the driving seat.

  2. HUNTED is not a combat state at all. `DriveHud.cs:736` takes the stars
     from `CargoBay.Heat`, and that is fees and cargo value only - "how
     badly the war wants this load" - so it says HUNTED at four stars
     because of what is in the bed, never because armour is firing at you.
     Whether it ever reaches four stars on a normal load is a second
     question and is not measured here.

Neither was touched. The measurement is `ArmyDamageReferenceTests.
MeasureWhatHitsAParkedTruck`, Explicit, in the same shape as the other
reference measurements in this repo: it prints `[hunted]` lines and asserts
nothing.

  EditMode 140: 138 green, 1 red, 1 skipped - the red is the known retired
  rifle path, the skip is this measurement.


## 2026-09-06  M1.a14: the barrel points at the truck the core just hit

The damage was never missing - both engines write a parked truck off in
twelve to twenty seconds and 100% of it is tank shells. The picture was.
`CombatFx.Muzzle` drew the flash and the tracer off the core's own reload
clock, correctly, but its target search only ever considered other UNITS: it
skips self, the dead, the wrong arm and its own side, and the truck was not
in that list at all. So the shell the core had just spent on the courier was
drawn going at some other tank, or down the unit's heading when nothing was
in reach. The player was hit repeatedly and never shown a barrel pointed at
him.

NOT A C# LEFTOVER COPIED. The old `Army.Bind` path skipped the truck here
too; there was nothing to copy. This is the core's own rule, from both
firing sites in `sim.js`: the courier outranks the enemy the unit had picked
when it is inside the reach for that arm AND nearer than that enemy, and
only once a foe has been found at all - a unit with nobody in range does not
fire at the truck standing beside it.

THE TWO REACHES ARE NOT THE SAME NUMBER, and mixing them would be exactly
the unit error this letter is told to avoid: `COURIER_RANGE` is 34 m for a
tank, and a rifleman's reach to the courier is his own `RIFLE_RANGE`, 26 m.

THE SHARE. Of the shells the core spent on the courier, how many does the
renderer now point at the truck? The core decides from the positions the
tick STARTS with and CombatFx reads the state it ENDS with, so the two can
disagree even with the same rule; this counts how often they do. Parked
truck, Heat zero, window closed where the truck is written off, the same
five stand-offs as the damage measurement:

  parked at   shells at the courier   drawn at the truck   at another unit
   z =   0            33                     33                  0
   z =  -5            30                     30                  0
   z = -12            29                     29                  0
   z = -25            28                     28                  0
   z = -34            27                     27                  0

  share: 100.0% at every stand-off, and 0 of the 291 shots that went at
  UNITS were drawn at the truck by mistake.

And with the truck DRIVING rather than parked, because a parked truck is the
kind case for a rule that reads a stale position: 8 shells on the courier, 8
drawn at the truck, 100.0%, 0 wrong out of 19 shots at units. A tick of
staleness is not enough to move a target 34 m.

WHAT THIS MEASUREMENT IS NOT. It is the rule and the staleness, computed
against the core in node; it is not the shipped C# executing. `BlwpCore` is
a stub outside a WebGL build, so no editor test can run CombatFx's core path
at all. The C# side of it is pinned instead by `CourierMuzzleTests`, seven
EditMode assertions on `CombatFx.ShotGoesAtTheCourier` with the edges the
core has - strict at the reach, strict at "nearer", and no shot without a
foe. Mutation-checked, each reverted at once:

  a rifleman given the tank's 34 m reach -> ARiflemanReachesTheTruckSix
                                            MetresLessFarThanATank red
  the nearer target no longer wins       -> TheNEARERTargetWins and
                                            TheEdgesAreTheCoresEdges red
  no foe needed                          -> NobodyInRangeMeansNoShotAt
                                            TheTruckEither red
  the edges go soft, < becomes <=        -> TheEdgesAreTheCoresEdges red

Renderer only. No core change, no new core word, nothing about HUNTED or the
HUD, and nothing here decides anything - the core has already spent the
shell; this only points the barrel where it went.


## 2026-09-06  CORRECTION: the old C# did NOT skip the truck when it drew a shot

Written into the previous entry and into 07f2eed's message: "the old
`Army.Bind` path skipped the truck here too; there was nothing to copy."
That is wrong, and the code says so plainly.

`Army.StepArmour` sets `at = c` when the shot is on the courier and then
raises `Fired?.Invoke(v, impact)` with that point; `Army.StepInfantry` does
the same through `mark` and `Shot`. `CombatFx.Bind` at :1429 draws the tank
tracer at exactly that point. So the C# AIMED AT THE TRUCK CORRECTLY.

What was true is a different sentence: `Bind` was never called in the shipped
build - `army` is null and the measurement in the file says pieces 0, combat
sounds 0 - so the correct draw never ran, and the core-driven redraw that
replaced it re-derived the target from unit positions alone and dropped the
courier. The regression came in with the rebuild, not from the C#.

The fix at 07f2eed is unaffected: it restores what the C# intended AND what
the core's rule says, and the seven pinned edges are the core's. Only the
sentence about where the fault came from was wrong.

## 2026-09-06  M1.a14 HUNTED: what the overlay keyed off, then and now

                         old C#                        today
  the word HUNTED        DriveHud, stars from          the same file, the
                         `bay.Heat`, four stars up     same `bay.Heat`.
                         Cargo fees and value only.    Unchanged.
  what fed the army      `Army.Heat`: widens the       the core has no heat
                         courier reach x(1+1.4H),      input to the army at
                         lets the truck outrank a      all. It implements
                         nearer tank x(1+2.5H), and    the Heat-ZERO
                         multiplies the shell          specialisation and
                         x(1+0.6H).                    says so in comments.
  was that ever fed?     NO. A grep for an assignment  n/a - there is no
                         to `Army.Heat` in shipped     field to feed.
                         code finds nothing. Two test
                         files set it, both to zero.
  the cargo heat rule    `CargoBay.Heat` = clamp(fee   `cargo.js heat()` =
                         /20000) + clamp(btc/25)*0.45  the same formula, and
                                                       the core owns it. The
                                                       HUD still reads the
                                                       C# copy.

SO THE FORK LANDS ON HEAT. The old game showed cargo heat and never showed
being shot at, in any build, at any time. HUNTED stays on `CargoBay.Heat`
and no incoming-fire signal is invented in the renderer.

BUT THE C# INTENT WAS NOT WHAT IT SHIPPED, and that is the real content of
"HUNTED seems dead". `Army.Heat` carries a written intent - "how badly both
sides want the truck, set from what it is carrying. Without this the freight
choice had no consequence at all - the player simply took the most valuable
thing on the ramp every time" - and nothing ever set it. What the coupling
would have been worth, measured on the C# army at z=-25:

  heat 0.00   17.40 s to write-off   19 shells
  heat 0.50    8.85 s                15 shells
  heat 1.00    8.20 s                12 shells

A full load would die 2.1x faster than an empty one. Today, and in every
build that ever shipped, it dies at exactly the same rate - so four stars
mean nothing is different, which is what a dead status looks like.

That is a RULE, and the core already owns fire, reach and the
courier-outranks test, so it belongs there and not in the renderer. It is a
change of behaviour, not a redraw, and it is not made here.

## 2026-09-06  M1.a14: the tilt that shows the cap takes the road off the bottom

ASKED FOR AS A FRACTION AND IT IS 79.4%, so it is written down before
anything else on this letter is ranked.

The a14 camera probe asserted where the road lands ACROSS the frame and
never up it. That is the one axis the strike tilt can plausibly break, since
pitching the view up pushes the road DOWN the picture, and I closed bullet 1
without measuring it. Measured now, from the same probe, while a cloud
stands:

  road across the frame   0.50 .. 0.50    dead centre, as reported
  road UP the frame      -0.05 .. 0.61    below the bottom edge at its worst
  off the bottom for      3616 of 4555 frames, 79.4% of the time a cloud is up

So for four fifths of every mushroom, the direction the truck drives is not
in the picture at all - it is under the bottom edge. That is bullet 1's own
words failing, and it is a consequence of a13's fix for M1.d: the cap was
brought into frame by raising the look point, and the road went out the
bottom to make room. `cloudLookUp` is 26 degrees and the measurement says
the road cannot afford all of it.

BULLET 1 IS REOPENED on this number. It was closed on four cases - reverse,
spin, impact, released look - none of which has a cloud standing.

Not fixed here: the fix is a choice between lowering the clamp, holding the
road at a floor in the frame, and framing both by pulling back, and the
letter's sequence puts it after the barrel, which is done. The probe now
records the vertical place every run so the choice is made on numbers.


## 2026-09-06  the view pulls back so the road and the cap share the frame

The pick was pull back and frame both, with a hard floor that the road stays
in the picture for the whole cloud, and no dropping the 26 degree clamp as
the first move. Walked, not guessed. One fresh cloud a rung, a second and a
half to let the position damp settle, then two seconds of sampling, frame
640x480:

  pull-back  lift   road lowest   below the edge   cap up frame   truck   aim
     0 m      0 m      -0.05        1250/1304          0.58       200 px  25.4
    10 m      0 m       0.06          0/1611           0.55        89 px  21.8
    20 m      0 m       0.11          0/1945           0.53        54 px  20.0
    30 m      0 m       0.15          0/1391           0.53        39 px  18.5
    45 m      0 m       0.19          0/1446           0.52        27 px  16.5
    60 m      0 m       0.23          0/1897           0.51        21 px  14.9
    20 m      6 m       0.03          0/1758           0.53        59 px  16.9
    30 m      8 m       0.08          0/1529           0.52        41 px  14.6

TWENTY METRES, no lift. Ten already puts the road back in the picture but at
0.06 it is clinging to the edge, and a slope or a crest would put it under
again; twenty is the first rung with a real share of the frame under it. The
truck costs 200 px down to 54 - eleven per cent of a 480-tall frame, which is
smaller but is not a speck, and sixty metres at 21 px would be one. LIFT MAKES
IT WORSE and is left at zero: raising the camera tips the aim down at the road
and pushes it back towards the bottom, 0.11 to 0.03 at the same distance.

THE CLAMP WAS NOT TOUCHED and did not need to be. Standing further off drops
the angle the cap needs on its own: the aim peaks at 21.2 degrees where it
used to sit against the 26 degree ceiling, so the clamp stops binding without
being lowered. That is the difference between framing both and trading one
for the other.

  before   road up the frame -0.05..0.61, below the bottom edge for 3016 of
           4078 frames of a standing cloud, cap 0.58..0.75, truck 109 px
  after    road up the frame  0.08..0.61, below the bottom edge for 0 of
           3208, cap 0.54..0.72 and never off the top, truck 53 px

The floor is asserted, not admired: `AStrikeTiltsTheViewAndDoesNotSwingIt`
now requires zero frames below the bottom edge and zero frames with the cap
off the top. Mutation-checked by putting the pull-back back to zero - 3235 of
4163 frames below the edge, red.

Still true and still unasserted: this is the editor's aspect, 640x480, not a
phone's, and a wider frame is more forgiving horizontally and identical
vertically. The core does not drive the truck here either. Both were already
written down.

  PlayMode 197: 175 green, 11 red, 11 skipped - the documented
    Battlefield.Army set, and the new skip is the pull-back ladder
  EditMode 148: 145 green, 1 red, 2 skipped


## 2026-09-06  M1.a13: a hunted load is actually hunted

HARD from Daniel 21:18: high hunted must mean more fire, low hunted little
fire; heat does not scale shots. It did not, and it never had - in this core
or in the game before it.

WHAT WAS THERE. `Army.Heat` in the retired C# widens the reach a tank
notices the truck at, lets the truck outrank a tank that is closer than it
is, and multiplies the shell. It is documented as the whole point of
choosing freight - "without this the freight choice had no consequence at
all - the player simply took the most valuable thing on the ramp every time"
- and a grep for an assignment to it in shipped code finds nothing. Two test
files set it, both to zero. So the rule existed, was never fed, and the core
faithfully ported the heat-zero specialisation of it.

WHERE IT WENT. `S_HEAT`, its own word in the hashed state, and NOT `S_CARGO`:
that word is the score's cargo factor and `accrue` already reads it as a
heat, so writing the hunt into it would tie how hard you are shot at to what
the run pays - a coupling nobody asked for, and one that would move the
scoring settled earlier in a13. Zero until a host says otherwise, so a core
nobody has spoken to is bit-identical to the recordings; there is a test for
exactly that.

The three factors are the C#'s own, in Q16.16, and they are three FUNCTIONS
rather than three lines of inline arithmetic. That is not tidiness: with them
inline, zeroing the reach and zeroing the shell both left the end-to-end
measurements green, because the outranking alone carried the whole effect. A
factor no test can kill is a factor nobody is holding.

WHAT IT COSTS, parked truck, one heat a run, seconds to write-off:

  behind the line   heat 0.00   heat 0.35   heat 0.70   heat 1.00
    z = -12          16.30 s     10.48 s      8.08 s      7.78 s
    z = -25          16.73 s     10.87 s      8.60 s      8.00 s
    z = -50          85.33 s     17.53 s     10.92 s      8.08 s

At the line a full load dies about twice as fast; fifty metres back it is
10.6x, because that is where the widened reach does its work - an empty truck
is beyond notice there and a laden one is not. That is "high hunted means
more fire" in numbers, and low hunted means the recordings.

THE WIRE. Nothing could tell the core what was on the bed: there was no such
entry point. `setHeat` is one now, in the same shape as `setGround`,
`setSolids` and `teleport` - core function, bundle export, jslib entry,
`BlwpCore.SetHeat`, and one call in `LoadoutPanel.Confirm` after the round
starts, because starting it clears the word. Unity sends the number; every
consequence of it is the core's.

THE LAYOUT MOVED, which is the part that would have been silent: `SCORE_WORDS`
7 to 8 pushes `O_UNITS` from 25 to 26, and C# and JavaScript index the same
buffer. `BlwpLayout.cs` is regenerated from `state.js` by the generator that
exists for this exact failure. Golden vectors regenerated and the bundle
rebuilt; not loosened.

MUTATION-CHECKED, one factor at a time, each reverted:

  reach x1.4 zeroed   -> "heat widens the reach ... by arm" red
  reach x0.8 zeroed   -> the same test red on the rifle's word
  outrank x2.5 zeroed -> "outranks a foe that is nearer" AND "a hunted load
                         is written off sooner" both red
  shell x0.6 zeroed   -> "heat multiplies the shell" red

Two of the assertions are exact fixed-point words with the real number beside
them, because 1.4 and 0.6 are not representable in Q16.16 - 91750/65536 is
1.3999939 - so the reach at full heat is 5347724 and not 34 x 2.4 x 65536.
Both are asserted: the word, which any change to a factor moves, and that it
is within a thousandth of a metre of what the C# meant.

STILL OPEN AND NAMED: the overlay's stars still come from Unity's own
`CargoBay.Heat` rather than from the word the core now holds. Same formula
today - `cargo.js heat()` is the identical rule - so the picture and the core
agree, but it is one rule in two places.


## 2026-09-06  the stars read the word the war hunts with

The overlay took its heat from `CargoBay.Heat` - Unity's own copy of the rule
- while the shooting took its heat from the core's `S_HEAT`. They agreed,
because the formula is written twice and identically, which is the
arrangement that stops being true the first time one side changes.

`DriveHud.DrawWanted` reads `BlwpCore.Heat` now and nothing else. The yard
still CHOOSES the number - `LoadoutPanel.Confirm` hands it over at roll-out -
but the picture reports the word the war is hunting with. There is no
fallback: with no core answering, the heat is zero and the stars stay off
rather than being invented from a second source. `bay.Heat` no longer appears
in `DriveHud` at all.

ONE NUMBER, TWO READERS, walked over the loads that produce it:

    fee sats     btc   heat sent   core word   heat read   stars   word
           0       0      0.0000           0      0.0000       0   -
         500       0      0.0250        1638      0.0250       1   WANTED
        4000       0      0.2000       13107      0.2000       1   WANTED
       12000       0      0.6000       39321      0.6000       3   WANTED
       14000       0      0.7000       45875      0.7000       4   HUNTED
       20000       0      1.0000       65536      1.0000       5   HUNTED
        6000    1200      0.5160       33815      0.5160       3   WANTED
       20000    2500      1.0000       65536      1.0000       5   HUNTED

The round trip is exact - what the yard sends is the word the hunt reads and
the stars are drawn from. Heat zero is still bit-identical to the recordings;
`an untold core hunts exactly as the recordings do` asserts that by hashing a
core nobody spoke to against one told zero.

TWO THINGS THAT CAME WITH IT.

The `bay.IsLoaded` gate went, because an empty bed is heat zero and already
draws nothing - keeping the bed as a second opinion about whether to show
anything bought nothing. But the heat word survives the round in the core: it
is cleared by the next roll-out, not by arriving, and the old gate had been
hiding the stars when the bed emptied on delivery. So the stars are gated on
`RunState` being live instead. Still one source, and it is the core's.

And the display rule is pinned where it could not be before: `StarsFor` and
`WantedWord` are static, so five EditMode assertions hold the ceiling, the
floor, and both sides of the HUNTED edge - 0.60 is WANTED and 0.61 is HUNTED
- without a scene.

STILL A SECOND HEAT, NAMED AND NOT LIVE: `RunScore.RateNow` reads `bay.Heat`
for the exposure rate. It is behind `if (FromCore) ... return;` and the file
says why - the core's own rate is read back instead - so it is a dormant
fallback for a build with no core, not a second source on the deploy path.

## 2026-09-06  the pull-back holds on a phone-shaped frame

Named as a hole when the twenty metres were measured, because the batchmode
frame is 640x480 and the thing fixed is a VERTICAL fit: a phone in landscape
is 2.16 to 1, much shorter for its width, and that is the unkind case.

  aspect      road lowest   below the edge   cap up the frame   off the top
  1.33 : 1       0.09          0/1335           0.54..0.56          0
  1.78 : 1       0.11          0/1878           0.53..0.53          0
  2.16 : 1       0.11          0/1255           0.53..0.53          0

It holds, and the reason it holds is worth writing down rather than being
lucky: Unity's camera keeps the VERTICAL field of view fixed and widens
horizontally, so a wider frame costs nothing vertically. The 4:3 reading is
the tightest of the three, not the loosest.


## 2026-09-06  the HUD stops drawing on top of itself

Daniel photographed it at 22:17 on an iPhone: the block board on the dollar
sign of "$79,810", "CONDITION 100%" laid across the board's own last line,
the practice switch under the centred "BLOCK 965,829 · 2:06", and MUTED and
DEBUG as two grey word-slabs stacked down the right edge. Three asks at
22:18 - a build number on the loading screen, exposure back or explained, no
overlaps on desktop or iOS - and two more at 22:21: condition and danger
stacked, the settings as icons.

THERE WAS AN OVERLAP TEST AND IT WAS GREEN. It checked one pair, the
condition bar against the block board, at 1600x900, which is neither a phone
nor a desktop anyone uses. It stayed green through all four faults. The new
one walks every pair of top-level boxes across eight shapes, including both
orientations of a phone, the way the title screen has been checked since it
was drawing over itself.

FOUR CAUSES, each a number rather than a look.

  1. The block box claimed 3.20 line-heights and `DrawBlock` laid out 3.77 -
     0.15 in, a title, 0.62 of clock bar, the time left, the pending line.
     With a leaderboard it claimed 4.40 against 6.17. So the last line was
     drawn outside its own yellow border and the condition bar, which is
     positioned from that claimed height, landed on it. There is one list of
     rows now, walked by the drawing AND by the measurement, and the box is
     the content plus a fifth of a line.

  2. The price was drawn into `new Rect(0, y, w, ...)` - the whole screen -
     and centred in it. On a desktop the columns are far apart and it looks
     right; on a phone the "$" reached the block board. It is centred in the
     GAP between the columns now, and it shrinks to fit that gap rather than
     spilling out of it: 13% of the short side is wider than the gap a phone
     leaves. The centred block line and the liquidation line moved with it.

  3. The practice switch was positioned under "block plus condition". The
     danger meter joining that column would have gone straight under it, so
     the switch is measured from the meter now and the whole stack is
     block, condition, danger, practice, SIM - asserted in that order and
     asserted to fit above the steering pad on a 844x390 phone.

  4. MUTED and DEBUG were `s*0.7` wide and `s*0.34` tall, stacked. They are
     `s*0.34` squares side by side on one row now, in the width the view
     toggle already claimed, so the right column did not grow. The glyphs are
     drawn from rectangles rather than typed: an emoji or a box-drawing
     character depends on the browser's font, and a missing glyph is a blank
     square where a control used to be.

EXPOSURE WAS NEVER REMOVED. It was switched off by the mode Daniel was in:
`RunScore.Running` is false while the truck is invulnerable and practice
makes it invulnerable, so the one meter that exists to TEACH a rule was
hidden from the mode a player learns in. It draws in practice now and banks
nothing there, which is the truth about practice. And it has moved out of the
top-right corner to sit directly under the condition bar, same column, same
width - the two numbers about the run you are in, together.

`ScoreTests.ExposureMeterClearsTheBlockBoard` required the opposite - the
meter to the RIGHT of the whole left column - so it was INVERTED rather than
relaxed, renamed `TheDangerMeterSitsUnderTheConditionBar`, and it now checks
four sizes instead of one.

THE BUILD NUMBER is stamped by `BuildWebGL.Run` into `Resources/build.txt`
from the commit being built, and read back by `BuildStamp`. It gets a row of
its own under the title bar, checked against every other box on the splash,
because it is only useful if nothing is drawn over it. In the editor it reads
"dev", which is the honest answer there. It exists because twice in one
session a measured fix "changed nothing on the phone" and both times the page
was serving an older build than the one being argued about.

MUTATION-CHECKED, each reverted at once:

  block box back to the 3.20 it claimed  -> survived at first, and that was
                                            the finding: nothing held the box
                                            to its own content. With the row
                                            list and the content assertion, a
                                            box 15% short is red at 1920x1080

THE SHORTFALL, BEFORE AND AFTER, printed by `MeasureTheBlockBoxAgainstIts
OwnRows` rather than argued. Same proportion at every size, because both the
old constant and the content scale with the line height:

  size        claimed before   content drawn   outside   claimed now   spare
  1920x1080      99.2 px         116.9 px      17.7 px     122.5 px    5.6 px
  1366x768       99.2           116.9          17.7        122.5       5.6
   844x390       64.5            76.0          11.5         79.6       3.6
   640x480       74.4            87.7          13.3         91.8       4.2

15.1% of the readout was drawn outside its own border, at every shape, and
the condition bar was positioned from the number that was 15% short. That is
the whole of fault 1.
  headline back across the whole screen  -> TheHeadlineNeverReachesEither
                                            Column red
  the icons overlapping by a hair        -> TheSettingsAreTwoSquareIconsOn
                                            OneRow red, which is how the
                                            first cut of the icon row was
                                            caught before it shipped

  PlayMode 203: 178 green, 12 red, 13 skipped. Eleven are the documented
    Battlefield.Army set; the twelfth is RampReadyTests.TheRealTransactions
    ReplaceTheStandInsWhileNothingIsLoaded, which is the ROTATING flake this
    book has carried since item 1 - one of it and TheGogglesAnimate appears
    per run, never both. Not waved away: run on its own against this tree it
    is green, 1 of 1, and TheGogglesAnimate was green in the full run.
  EditMode 153: 150 green, 1 red, 2 skipped - the red is the known retired
    C# rifle path.


## 2026-09-06  the rest of the HUD gets rects, and two more full-width boxes turn up

The overlap test covered the boxes I had exposed and nothing else. These are
the ones it could not see, given rects someone can ask for: the wanted row,
the UNDER FIRE banner, the streaming list, the send-off card and the arrival
card. `DrawFallout` and `DrawWaypoint` are deliberately NOT here - they are
markers projected from a world position through the camera, so where they
land depends on where the truck is looking and a static rect for them would
be a fiction.

THE SAME MISTAKE, TWICE MORE. Both were a box the width of the screen with
the text pushed to one side, which looks correct and cannot be checked:

  wanted row     before 0..1893 of 1920, right-aligned text
                 after  1637..1893
  UNDER FIRE     before 0..1920, centred text
                 after   371..1614, the gap between the columns

Measured at 1024x768 the banner's box lay straight over the condition bar.
The text was centred so it LOOKED fine - which is why it survived a photo.

THE STARS. In the 22:17 picture the word WANTED is on screen and the row
above it is empty. Instrumented rather than guessed: both fonts a build can
end up using report U+2605 and U+2606 present - the embedded LegacyRuntime
and the OS Arial - so the glyph is not missing HERE. But `HasCharacter` in
the editor answers for the editor's font stack, a browser has no OS fonts at
all and falls back to whatever Unity embedded, and that question cannot be
settled from this machine. So it is removed rather than argued: five squares,
filled for earned and outlined for not, drawn from the same white texture as
the settings icons and for the same stated reason. Whatever the browser's
font has, the stars are rectangles.

THE HEADLINE'S GAP WAS MEASURED FROM TWO OF THE FOUR COLUMN BOXES. The
condition bar inherits the diagnostics panel's `min(320, w * 0.34)`, which is
wider than the block board, and wider than the practice switch on a wide
short window. The edge is asked of the boxes now instead of recomputed from
their formulas.

AND THERE IS NO GAP AT ALL ON A PHONE HELD UPRIGHT. The old code floored the
headline's width at 60 px, which invents room: at 390 wide the practice
switch alone is 52% of the screen and the columns meet in the middle. The
floor put the headline 64 px inside the wanted row while the arithmetic
reported everything fine. It returns an empty box now and the price is not
drawn - it is worth less than the controls it would sit on, and this file
already does the same for the loading panel.

  size        headline gap   wanted row      UNDER FIRE
  1920x1080    371..1614     1637..1893      371..1614
  1366x768     352..1095     1112..1347      352..1095
  1024x768     352..753       770..1005      352..753
   844x390     320..691       701..834       320..691
   640x480     323..471       481..628       323..471
   390x844     none, 0 px     236..369       not drawn

## 2026-09-06  the same column with the diagnostics panel up

DEBUG on is the state Daniel drives in, and `HealthBox` switches its top
between the block board and the diagnostics panel - with the danger meter,
the practice switch and the SIM switch all measured from it. None of that was
checked with the panel up. It holds:

  size        diag ends   condition   danger   practice   SIM ends   of
  1920x1080      362         371        433      504        645      1080
  1366x768       350         356        409      468        570       768
   844x390       223         227        261      297        378       390
   640x480       258         262        301      341        422       480

Nothing overlaps and the order is kept. The phone is the tight one: the SIM
switch ends 12 px above the bottom edge at 844x390 with the panel up. That is
clearance, not comfort, and it is written down because one more row in the
diagnostics panel would spend it.

AND A FOURTH ONE, found by grepping the file for the shape rather than
waiting for another photograph: `IRRADIATED` was `Rect(0, h * 0.30f, w, ...)`
with centred text. It is in the gap now, and the two radiation marks that
flank it follow the band instead of the middle of the screen.

The WASTED band is deliberately left full width and is NOT checked: it is a
dark scrim behind a word the size of the screen, on a run that has already
ended, and covering the HUD is what it is for. So is the UNDER FIRE vignette,
which is four strips along the four edges - a frame, not a box.

MUTATION-CHECKED, each reverted at once:

  UNDER FIRE back across the screen        -> TheCornersAndBannersClearThe
                                              Column red
  wanted row back to the whole width       -> the same test red
  the column ignores the diagnostics panel -> TheColumnStillStacksWithThe
                                              DiagnosticsPanelUp red
  left edge blind to the condition bar     -> SURVIVED at first. At every
                                              shape in the list the practice
                                              switch happened to be wider by
                                              a hair, so the term was dead
                                              weight. A wide short window -
                                              1000x360, where the panel is at
                                              its 320 px cap and the switch is
                                              not - distinguishes them by 18
                                              px, and the mutant dies there.
                                              The shape was added because it
                                              is one a browser can be, not to
                                              make a mutant fail.


## 2026-09-07  the liquidation line, the two cards, and the panel that is not this screen

THE LIQUIDATION LINE now has a rect, and the headline stack has fixed rows.
The rows were placed from the price's FITTED size - the price shrinks when
the gap is narrow - so the ticker, the liquidation line and the block clock
all moved up the screen the moment the price gained a digit. They are placed
from the unfitted size now; only the price's own glyphs change size inside
its row.

  size        the line              clear of the column   of the wanted row
  1920x1080   371..1614 x 249..305        30 px                24 px
  1024x768    352..753  x 178..218        17 px                17 px
   844x390    320..691  x  91..112        25 px                10 px
  1000x360    338..847  x  83..101        10 px                10 px

And it was taller than its own row: 78.4 px of box in a 56.4 px row at
1920x1080, reaching into the block clock underneath. The block board's fault
in another corner. The row's height is the distance to the row below it now,
and one line of the sub font is 49 px, so there is room for what is drawn.

THE TWO CARDS CAN BOTH BE UP AND WOULD BE LAID ON EACH OTHER. The send-off
runs 3.4 s from roll-out and the arrival card 5 s from a delivery or a miss -
two independent clocks, nothing linking them. Deliver, confirm the next load
inside five seconds, and both draw. They sit at 18% and 20% down the screen:

  size        send-off      arrival       shared height
  1920x1080   216..352      194..400        136 px
  1024x768    154..278      138..328        124 px
   844x390     78..142       70..168         64 px
  1000x360     72..131       65..154         59 px

Gated rather than moved: two cards side by side on a phone are two cards
nobody can read, and of the pair the one about the run that has ENDED is the
one to drop when a new run is starting. `ArrivalIsHiddenBy` is static so the
rule is assertable without waiting five seconds for a clock.

THE LOADOUT PANEL IS A DIFFERENT SCREEN and is left alone. While it is open
`DriveHud.OnGUI` returns after `DrawWasted` - the block board, the wanted
row, the danger meter, the streaming list, the waypoint and the diagnostics
are all skipped, and `GUI.depth` is inverted so nothing of the game HUD can
land on the window. The ONE exception is deliberate and is named here rather
than tested: a small price line at 2% by 1.2%, drawn only while loading,
because the price is not what the player is reading while choosing freight.
Whether that line lands on the panel's own frame is not checked by anything.

MUTATION-CHECKED, each reverted at once:
  the liquidation row back to 1.6 line-heights -> TheLiquidationLineClears
                                                  ItsNeighbours red
  the arrival card no longer yields            -> TheTwoCardsAreNeverUp
                                                  Together red

## 2026-09-07  a frame, and the three things arithmetic could not see

"Arithmetic is not a frame" was right, and the note in this book saying a
frame cannot be taken here was out of date. This machine has an X server on
:0 and Unity brings up an OpenGL 4.6 device on it. Two routes fail and one
works, so they are written down: `WaitForEndOfFrame` is never evoked in
batchmode, and `ScreenCapture.CaptureScreenshot` needs a presented frame that
batchmode never gives. WITHOUT `-batchmode`, on the real display, the capture
lands: 733x293, 2194 distinct colours, luminance 6..255 - guarded against the
uniform-grey PNG this project was nearly fooled by once.

The picture is scratchpad/shots/hud-733x293.png. What it shows that the rects
had already fixed: the block readout inside its own border, condition and
danger stacked under it, practice and SIM under those, the price centred in
the gap and off the board, the two settings icons side by side.

THREE THINGS IT FOUND THAT NO RECT COULD:

  1. GERMAN ON THE DRIVING HUD. The streaming list said "aus Cache",
     "fehlgeschlagen" and "wartet" in a build whose every other string is
     English. The one German check in this project reads the model LABELS,
     which have been English all along, so nothing ever looked at the words
     beside them. They are "cached", "failed" and "waiting" now, behind a
     static so they can be asserted without a scene.

  2. The streaming list overlaps the headline stack. It is checked against
     the column and the wanted row and passes both; the block clock and the
     liquidation line underneath it are not in that check, and in the frame
     the list is drawn straight across them. NOT FIXED - written down.

  3. A score column top right - SCORE, BANKED, CARGO - with no rect, no
     overlap check, and its top line clipped by the edge of the screen in the
     frame. NOT FIXED - written down.

AND ONE THING THE FRAME CANNOT SHOW: the wanted pips. They read
`BlwpCore.Heat`, the core is a stub outside a WebGL build, so the heat is
zero in the editor and the row correctly draws nothing. `WithNoCoreAnswering
ThereAreNoStarsToInvent` asserts exactly that. The pips can only be seen in a
browser.


## 2026-09-07  the score column, the model list, the corner price, and four frames

THE SCORE COLUMN had no rect and two faults followed from that. Its box was
`w - pad * 2` - the whole screen, the fifth element in this file built that
way - for the written reason that a right-aligned label in a narrow box is
clipped on the LEFT. And it stacks upward off the driving pads with no floor,
so on a short window it ran off the top: photographed at 733x293 with CARGO
cut in half by the edge.

  size        the box                    width   first line clear of the edge
  1920x1080   1614..1893 x 314..575      279 px          314 px
  1024x768     753..1005 x 212..429      252 px          212 px
   844x390     691..834  x 108..239      143 px          108 px
  1000x360     847..990  x 106..237      143 px          106 px

Three things had to be got right together and each one broke the next:

  1. Clamping the top made the BOX shorter while the drawing kept stacking
     upward from the same baseline - the block board's fault a third time -
     and the photograph still showed CARGO clipped. The box keeps its full
     height and moves DOWN instead; the drawing takes its baseline from the
     box, so the stack moves with it.
  2. A narrower box then clipped the long lines on the left, exactly as the
     original comment warned: "586 sat" where "CARGO 9 parcels - 580 sat"
     was meant. The free strip beside the left column is 143 to 279 px at
     these shapes and the longest line wants more at full size, so the type
     shrinks to its box - the price's own trick, applied to the group so the
     five rows keep their relative sizes, floored at 10 px.
  3. Pushed down off the pads on a short window, the stack landed in the
     top-right corner on the sound and debug icons. Its top is below them
     now.

THE MODEL LIST was at `w - width - pad, h * 0.30f` - the right-hand side, a
third of the way down, which is where the block clock and the score column
are. It was checked against the left column and the wanted row and passed
both. In the gap under the block clock now, where nothing permanent lives and
a list that retires four seconds after the last model lands belongs.

  size        the list             below the clock   left of the score column
  1920x1080   371..661 x 389..771       22 px               952 px
  1024x768    352..642 x 290..666       15 px               111 px
   844x390    320..610 x 149..382        8 px                81 px
  1000x360    338..628 x 139..352        8 px               219 px

Eleven models at a comfortable pitch is 244 px and a phone has 233 px under
the clock, so the last row was a pixel off the screen at 844x390 and
twenty-one off at 1000x360. The pitch tightens to the room rather than the
list dropping rows - the model that FAILED is the one worth seeing - and it
never goes below the font's own size. One function, asked by both the box and
the drawing.

THE CORNER PRICE does not land on the loadout panel. It is the one piece of
the driving HUD that survives into that screen; the panel starts at a tenth of
the height and the line ends well above it at all four shapes. Asserted now
rather than assumed. Nothing else about the loadout screen is this letter.

FOUR FRAMES: NOT AVAILABLE, and the reason is measured rather than asserted.
`-screen-width` and `-screen-height` are PLAYER arguments; in the editor the
Game view decides its own size and ignores them. `Screen.SetResolution(844,
390)` was then asked for directly and the log says: "asked for 844x390, screen
reports 733x293". The editor will not present the four shapes. A built player
would - the WebGL build in a browser at a set viewport - and that is the
deploy path, which this letter has not reached.

What the one shape that DOES present is worth: 733x293, an aspect of 2.50
against a phone's 2.16, three captures across the fixes. It found the German,
the list over the clock, the clipped score column, and then each regression I
introduced while fixing them. Every rect in this file was green through all
of it.


## 2026-09-07  the exposure warning gets a row of its own

"NO SCORE OUT HERE - GET CLOSER TO THE FIGHTING" was drawn at
`meter.xMax - min(w * 0.75f, 560f)`: 560 px reaching LEFT from the danger
meter's right edge. That was correct when the meter lived in the top-right
corner and there was nothing to the left of it. Moving the meter into the
column left the sentence running backwards across the practice switch and off
the screen - at 1920x1080 it started at x = -218.

It is a row of the column now, in the column's own width, and the row is
RESERVED whether the warning is showing or not. A switch that jumps down the
screen the moment the player drives out of the corridor moves exactly when he
is looking at it.

  size        the warning row              gap to the practice switch
  1920x1080   21.6..341.6 x 486..531             8.6 px
  1024x768    15.4..335.4 x 356..386             7.7 px
   844x390     7.8..294.8 x 190..210             7.8 px
  1000x360     7.2..327.2 x 178..198             7.2 px
   733x293     5.9..255.1 x 148..168             5.9 px

THREE PASSES, AND THE FRAME CAUGHT EACH ONE. The rects were green after the
first: the row was in the column and nothing overlapped. The picture showed
the sentence WRAPPED to two lines with the second drawn over the switch -
`GUI.skin.label` wraps by default and `CalcSize` measures the unwrapped
width, so the fit was computed for one line and the label drew two. With
wrapping off it was clipped instead, and right-aligned clipping takes it off
the LEFT: "SCORE OUT HERE" where "NO SCORE OUT HERE" was meant, which says
the opposite of the warning.

Forty-eight characters do not fit a 243 px column at the 9 px floor - about
264 px of text - so the sentence loses its second half rather than its first
where there is no room. The verdict survives, the instruction goes. Measured
at 733x293: "NO SCORE OUT HERE", one line, in full, clear of the switch.

The column then ran 9 px past the bottom of a phone with the diagnostics
panel up - the 12 px of clearance written down as "clearance, not comfort"
was exactly what the new row spent. The two switches have slack in them and
the screen edge does not, so they shrink when the column is tight, floored at
28 px. With DEBUG on at 844x390 the SIM switch now ends at 380 of 390.

MUTATION-CHECKED: the warning back to its 560 px box kills two tests - it
runs off the left edge at -218, and it is no longer the column's width.

  EditMode 156: 151 green, 2 red, 3 skipped. One is the known retired C#
    rifle path. The second is RunOverBodyTests.AThrownBodyIsHandedToThe
    PhysicsEngine, which this book already carries as a load flake seen
    during the camera letter - "0.831 vs 1.0, 5/5 green". Not taken on
    trust: run on its own against this tree it is green, 1 of 1.
  PlayMode 212: 186 green, 11 red, 15 skipped - the documented
    Battlefield.Army set only, no rotating flake this run.


## 2026-09-07  the cards, the debug readout and the panel rows

FOUR MORE RECTS and three of them found something.

THE DEBUG READOUT is a second debug panel and not the F1 box: that one is top
LEFT and the condition bar already stacks under it, this one hangs from the
debug ICON in the top-right corner - which is the corner the score column was
pushed into last turn. Measured at 1920x1080 it lay over the column from
y=297 to y=483. The readout is developer chrome behind a toggle and SCORE,
BANKED and CARGO are what the player is playing for, so the column steps under
the readout, the same shape as the condition bar stepping under the F1 panel.

That moved twice more before it settled, and each was a real fault:

  - The readout is 260 px wide against the settings column's 60, so with it up
    the headline gap's right edge is the READOUT's left edge, not the icons'.
    At 1024x768 the readout reached x=744.8 and the block clock's box ran to
    753.
  - Pushing the column down fired a branch that gave it the FULL screen width
    when it sat below the SIM switch, and it then swallowed the gap and was
    drawn over the model list - a box from x=27 across a list at x=371. That
    branch is gone: the column always takes the strip right of the gap and the
    type shrinks to it. A permanent layout cannot depend on which transient
    thing happens to be in the gap.

THE TWO CARDS were 92% of the screen wide and centred on it, so they covered
the left column by construction. Measured at 1024x768 the send-off ran from
x=41 across a condition bar at x=15. A card is a takeover of the middle of the
screen and that is what it is for - but the middle of the screen is where the
driver's numbers are, and a card over the condition bar hides whether he is
still alive. Both stand in the gap under the block clock now, and the model
list stands aside while either is up: of the two things that want that column,
a list of model names is the one to drop while the player is being told what
his run was worth.

A GAP OR NOTHING. `HeadlineBox` reported any positive room while the drawing
refused to use anything under 60 px, so at 640x480 it claimed 34.88 px that
nothing would ever be drawn in - and every box measured from it inherited the
fiction. One threshold, `UsableGap`, in one place.

THE PANEL ROWS are checked the way the block board is: both panels lay lines
out at `lh` apart and both boxes are built from a line count, which is exactly
how the board came to claim 3.20 lines and draw 3.77. Both hold.

AND A FAULT IN THE TESTS THEMSELVES, worth writing down because it made two
other tests lie: the new test sets `GameSettings.Debug` to measure the HUD
with the readout up, and a FAILING assertion left it set. The next four tests
then measured a screen with the debug panel showing that they had never asked
for, and two went red for it. It is a try/finally now.

MUTATION-CHECKED, each reverted at once:
  the send-off card back across the screen -> two tests red
  the score column ignores the readout     -> TheDebugPanelAndTheCards red
  the debug box shorter than its rows      -> the same test red


## 2026-09-07  a built player, and the shapes this machine can and cannot show

The editor will not present the four shapes - asked for 844x390 it reports
733x293, which is already on the record. A PLAYER does, so one was built:
`BuildLinux.Run`, a StandaloneLinux64 player at 100 MB, driven by `AutoPlay`,
which exists only when `-autoplay` is on the command line and dismisses the
title screen and takes a load so a screenshot has something to photograph. A
player started the normal way never constructs it.

WHAT PRESENTED AND WHAT DID NOT, because two of the four cannot on this
machine and that is a fact, not a shrug:

  844x390    presented, captured, client area 844x390 in an 845x429 window
  1000x360   presented, captured, 1002x399 with the frame
  1024x768   CLAMPED to 1025x694 - the X display is 1280x720 and the window
             cannot be taller than the desktop
  1920x1080  NOT POSSIBLE - wider and taller than the 1280x720 display

`xdpyinfo` says 1280x720. The two that fit were photographed; the two that do
not need a bigger display or a browser at a set viewport, which is the deploy
path.

AND THE FIRST PLAYER FRAME FOUND ONE MORE. `DrawBlockTimer` draws "BLOCK
965,853 - 2:23" and then "the block is the round - arrive before it closes"
underneath at `font * 1.2`, while `BlockTimerBox` stopped at `font * 1.35` -
so the sentence was outside its own rect, and the model list, which is
measured to sit below that box, was drawn across it. The block board's fault
in a fourth place, and the rect tests were green through it because the box
was the thing that was wrong.

Fixed, rebuilt, and photographed again: at 844x390 and at 1000x360 every
number the driver reads stands clear - the block board inside its border,
condition, danger, the warning row, practice and SIM down the left; price,
ticker, block clock and its sentence, then the model list down the middle;
cargo, score and banked on the right; the two settings icons in the corner.

THE ONE THING THAT STILL CROSSES ANYTHING is the drop-off marker - "DROP-OFF
215 m" over the ticker - and that is the world-projected waypoint, excluded on
purpose along with the fallout marker, the WASTED scrim and the UNDER FIRE
frame.

The models fail to stream in this player: the Addressables bundles are built
for WebGL and there is no StandaloneLinux64 catalogue. That is expected and it
made the pictures MORE useful, not less - the list is photographed in its
failed and waiting states, which is the widest it ever gets.


## 2026-09-07  the card contents, and the two debug panels in all four states

THE CARDS HAD THREE FORMULAS FOR ONE NUMBER. `SendOffBox` sized itself from
`clamp(min(w, h) * 0.055, 20, 46)`, `DrawSendOff` drew from
`round(min(w * 0.034, min * 0.060))` and `DrawArrivalCard` from `0.040 /
0.070`. At 844x390 the box was built for 21.45 and the send-off drew at 23, so
the content was taller than the frame meant to hold it - the block board's
fault a fifth time, and invisible because a card is up for three seconds.
One `CardHead`, asked by both, and a `CardContentHeight` the box is asserted
against.

AND THE WORDS NOW FIT THE CARD. It stands in the gap - 371 px on a phone in
landscape, not the 92% of the screen it used to take - so a headline sized for
the old width was cut off at both ends by the centring. Three places in this
file were already shrinking type to a box by hand and each did it slightly
differently; there is one `FitInto` now, with one floor and one margin.

THE TWO DEBUG PANELS ARE INDEPENDENT and only two of their four states had
ever been walked. The F1 diagnostics box is top left with the condition bar
stacked under it; the corner readout hangs from the debug icon with the score
column stacked under it. All four, at five shapes. Rects at 844x390:

  state                F1 box          corner readout   condition    score
  debug off, f1 off    8,8 287x215     not drawn        8,92         691,108
  debug off, f1 on     8,8 287x215     not drawn        8,227        691,108
  debug on,  f1 off    8,8 287x215     574,111 260x120  8,92         564,237
  debug on,  f1 on     8,8 287x215     574,111 260x120  8,227        564,237

The block clock is 320,112 371x47 with the readout down and 320,112 244x47
with it up - the gap narrows because the readout is 260 px wide against the
settings column's 60.

AND ON A SHORT WINDOW THEY DO NOT BOTH FIT. At 1000x360 with the readout up
the score column ended at y=365 of 360. Of the two, one is eight lines of
developer numbers behind a toggle and the other is what the player is playing
for, so where they do not both fit the READOUT is not drawn at all. Two knock-
ons came with that and both were measured, not guessed: an empty rect sits at
x=0, so clamping the headline gap to it took the gap negative and the score
column then took the whole width across the condition bar; and the content
check compared a real height against nothing.

MUTATION-CHECKED, each reverted at once:
  the card box back to its own head formula -> TheDebugPanelAndTheCards red
  the readout never yields to the score     -> two tests red


## 2026-09-07  deployed, and photographed at the two shapes nothing here could show

The daily is this tree. `webgl.wasm.unityweb` on btc-logistics-core.pages.dev
is md5 cc2bd8da5ae829cafe22a2fc0e863ba2, identical to the local artefact, built
from 749e0c2. btc-logistics-war.pages.dev untouched.

THE BUILD FAILED FIRST AND THE REASON IS WORTH KEEPING. `BuildWebGL` has a
hardcoded `DefaultOutput` of `/Users/daniel/code/btc-logistics-war/...` - a Mac
path - so on this machine it tried to create `/Users/...` and got permission
denied after sixteen seconds, having already stamped the build. It needs
`-buildOutput /tmp/btc-phase0/unity-proto/build/webgl` here. With that it
succeeded in 6:01 at 19 MB.

BROWSER VIEWPORTS, which is where 1024x768 and 1920x1080 actually exist - the
editor reports 733x293 whatever is asked for and this machine's X desktop is
1280x720. Chromium under SwiftShader against the deployed page:

  1024x768   driving HUD photographed. Block board inside its border,
             condition, danger, the warning row, practice and SIM down the
             left; price, ticker, LIQUIDATED $320, block clock and its
             sentence down the middle; cargo, score and banked on the right;
             one filled pip of five and WANTED in the corner.
  1920x1080  the same, fully lit, with five filled pips and HUNTED at 13,921
             sat aboard.

AND THE BUILD NUMBER IS ON THE TITLE SCREEN IN A BROWSER: "build 749e0c2 -
2026-09-07 00:47 UTC", its own row under the bar, photographed at 1024x768.
That bullet is closed on a picture rather than on the code being present.

THE PIPS ARE ONLY VISIBLE HERE. They read `BlwpCore.Heat` and the core is a
stub outside a WebGL build, so the editor and the Linux player both correctly
draw nothing. The browser is the only place the wanted row can be seen at all,
and it draws: one pip at 3,219 sat, five at 13,921.

DRIVING THE PAGE TOOK TWO CORRECTIONS AND BOTH ARE THE SAME MISTAKE. A click
at a fixed screen fraction hit PLAY at 1024x768 and missed at 1920x1080,
because the panel is `min(86% of the width, 900 px)` and its button row is a
fixed inset from the panel's bottom - the fraction moves with the viewport.
Same again for AUTO and ROLL OUT, which are thirds of a bar that is
`min(94%, 1040 px)`. Both are computed from the same arithmetic the game lays
them out with now.

The only thing crossing anything in either picture is the drop-off marker over
the ticker - world-projected, excluded on purpose with the fallout marker, the
WASTED scrim and the UNDER FIRE frame.


## 2026-09-07  M1.a13 closed: the count, the build and the four shapes

  EditMode 156: 152 green, 1 red, 3 skipped
    red   CombatFxTests.RifleFireProducesAFlashAndATracer - the retired C#
          army's rifle path, which raises no Shot. Editor-only by
          construction; the product does not run that engine.
    skip  the two parked-truck reference measurements and the glyph probe
  PlayMode 214: 187 green, 12 red, 15 skipped
    red   the eleven documented Battlefield.Army reds, unchanged names, plus
          RampReadyTests.TheRealTransactionsReplaceTheStandInsWhileNothing
          IsLoaded - the rotating load flake, green 1 of 1 on its own against
          this tree, checked rather than assumed.

  live   btc-logistics-core.pages.dev/Build/webgl.wasm.unityweb
         md5 cc2bd8da5ae829cafe22a2fc0e863ba2, identical to the local
         artefact, built from 749e0c2. btc-logistics-war.pages.dev untouched.

  shapes 844x390   Linux player, photographed
         1000x360  Linux player, photographed
         1024x768  browser on the daily, photographed
         1920x1080 browser on the daily, photographed

AND ONE THING THAT WAS NOT A STRAY EDIT. The build refreshed
`WebGLTemplates/BtcLogistics/blwp-core.js` through `SyncCore`, and the diff is
not cosmetic: the committed copy still had `SCORE_WORDS = 7` and no `S_HEAT`.
That is the core the browser LOADS. Leaving it out would have left the repo
saying the page runs a core without the heat word while the deployed page runs
one with it - the same class of fault as the stale bundle this project has
been caught by before. It is committed, and it is byte-identical to
`packages/core/dist/blwp-core.js`.

`Assets/Resources/build.txt` is deliberately NOT committed: it is written at
build time from the commit being built, so a copy in the tree would be a stamp
that is wrong the moment anything else lands.


## 2026-09-07  M1.a14 step 1: the recorded evidence re-measured at HEAD

Verified, not rebuilt. Every figure reproduces:

  the barrel share, parked        recorded    now
    z =   0   shells on courier      33        33, 100% drawn at the truck
    z =  -5                          30        30, 100%
    z = -12                          29        29, 100%
    z = -25                          28        28, 100%
    z = -34                          27        27, 100%
    driving                         8 of 8     8 of 8, 100%

  the heat ladder, seconds to write-off
                heat 0.00  0.35  0.70  1.00      now
    z = -12       16.30  10.48  8.08  7.78    identical, digit for digit
    z = -25       16.73  10.87  8.60  8.00    identical
    z = -50       85.33  17.53 10.92  8.08    identical

  the five camera cases: 8 of 8 green, road in frame in every one -
    reverse 0.50..0.50, spin 0.50..0.64, impact 0.50..0.55, released look
    0.34..0.50, standing cloud 0.50..0.50 across and 0.08..0.71 up with 0 of
    4414 frames below the bottom edge.

TWO FIGURES MOVED AND NEITHER IS A SLIP.

The impact off-nose read 22.2 and then 12.8 against a recorded 15.4 - three
runs of the SAME code. The shake is Perlin noise sampled at `Time.time * 47`,
so its worst reading depends on wall-clock phase and is not a stable number.
What is stable is the thing asserted: the road at 0.50..0.55, 0.56 and 0.58
across those three runs. This is exactly why the assertion is "the road is on
screen" and not a degree count.

The strike pitch read 21.2 and 21.3 against a recorded 25.4 - and 25.4 is the
PRE-PULL-BACK number. 21.2 is what this book and PRIORITIES already record
after the 20 m pull-back: "the aim peaks at 21.2 and the clamp stops binding
on its own". Nothing slipped; the older figure was read against older code.

## 2026-09-07  M1.a14 step 2: the live page shows the core, and one number it does not

Read off btc-logistics-core.pages.dev at 1024x768 in a browser, with the
debug readout turned on so the core speaks for itself:

  core DRIVING · tick 824 · speed 2.1 m/s 7 km/h · pos -16.4, 8.4 ·
  heading 90 · practice on (scene)

Beside it on the same frame: CONDITION 100%, DANGER x1.00, five filled wanted
pips and HUNTED at 12,790 sat aboard, CARGO 9 parcels. The camera is behind
the truck the core is placing - the position in the readout is the core's own
`T_X`/`T_Z` - and the heat is the core's word. Both are on the player's screen.

AND SCORE READ 0 WHILE DANGER READ x1.00. That is not the core: driven in
node on the same rules, `runScore` returns 432 at ten seconds and 642 by the
far end of the map, and 389 on a run that ends wrecked. The zero was Unity's.

  practice=0   tick 600   x  25.4   exposure 118.4   score 389 (wrecked)
  practice=1   tick 600   x  22.4   exposure 131.6   score 432
               tick 1200  x  57.7   exposure 179.0   score 587
               tick 1800  x 130.0   exposure 195.6   score 642

`DriveHud` showed `live ? Projected : LastScore`, and `live` was
`RunScore.Running`, which is false while the truck is invulnerable - and
practice makes it invulnerable. So the score line showed the LAST run's number,
zero on a first drive, in the mode a player learns in. The same fault the
danger meter had and was fixed for; the score line now reads the core's
projection in practice too.

THE CORE IS NOT REACHABLE FROM PAGE SCRIPT, and that is worth writing down
rather than working around: `Module.blwp` lives inside the emscripten closure
and the template throws the instance away - `createUnityInstance(...).then(()
=> ...)` ignores its argument. Reading the core from the browser would mean
changing the shipped page for a measurement, so it is read the way the player
reads it instead, with the core's own readout in the same frame.

ALSO SEEN AND NOT THIS LETTER: the loading page carries one German string,
`index.html:225`, "Der Loader konnte nicht geladen werden." It is player-
facing, in a build whose every other string is English.


## 2026-09-07  M1.a14 step 3: the editor no longer computes a score

`RunScore` carried a second scoring formula for when no core is answering.
On the deploy path it never ran - but in the editor the core is a stub, so it
ALWAYS ran there, and FIVE PlayMode tests were measuring Unity's arithmetic
and calling it the score. Not three: the count came out of running the suite
with the formula gone, not out of reading the file.

MOVED FIRST, DELETED SECOND. Each rule now lives in `packages/core/test`
where the core actually runs, and each has a mutant that kills it:

  an empty bed collapses a score that was already built
      drive 1200 ticks, score 587, set S_CARGO to 0, score 0
      mutant: cargo dropped from scoreOf -> red
  nothing accrues while the truck is still on the apron
      16.8 m out at tick 180, exposure 0; 22.3 m at tick 210, exposure 4290
      mutant: the apron stops refusing -> red
  a wreck banks nothing, however much the run had earned
      standing score 587, hp to 0, state RUN_WRECKED, S_DELIVERED still 0
      mutant: banked on any outcome -> red
  the seam banks more than the quiet lane for the same ground
      at 60 m of ground made good: edge 110.4, 145.9, 155.7, seam 178.9
      mutant: flat threat -> red
  heat raises what a metre of ground is worth
      half danger over ten metres pays 5.0 cold and 10.0 at full heat
      mutant: none needed, the assertion is exact arithmetic

THE FIRST APRON TEST WAS WRONG AND THE MUTANT SAID SO. It held the truck
still and was green with the apron rule deleted - `accrue` pays only for
ground made good, so a stationary truck earns nothing whatever `earning`
says. It proved the wrong thing. Driving across the boundary instead, both
sides asserted, and the mutant now dies.

THE NUMBERS DID NOT TRANSPLANT. The C# asserted 1.8x between the seam and the
quiet lane, measured against its own threat model and its own fixture. In the
core at equal ground the gradient is 1.62x, so the core test asserts 1.5x with
the monotonic ordering beside it. Copying 1.8 would have been carrying a
constant into different units.

WHAT WAS DELETED: `Projected`'s C# formula, `Exposure`'s C# accumulator, the
whole `!FromCore` branch of `Track`, and `RateNow()` - which walked a C# army
that no longer exists, fell through to a geometry fallback, and multiplied by
`bay.Heat`, Unity's own copy of a rule the core owns. `DriveHud` used it to
tell "out of the corridor" from "going round in circles"; it reads the core's
own last warm rate now.

  before  ScoreTests 9 tests, 5 of them measuring the C# formula
  after   ScoreTests 4 tests, all of them Unity's own behaviour
          packages/core 79 tests, 79 green


## 2026-09-07  the score on the daily is the core's, read off the screen

Deployed and photographed at 1024x768 in a browser, practice mode, with the
core's own readout in the same frame:

  on screen   SCORE 311   ·   DANGER x1.00   ·   CARGO 9 parcels, 2,897 sat
              BANKED 0, "yours only if you reach the drop-off"
  readout     core DRIVING · tick 1048 · pos -10.8, 8.0 · practice on (scene)

THE TWO NUMBERS CLOSE. `scoreOf(exposure, 1048, 0.70)` returns exactly 311 for
an exposure of 94.63, and the time factor at 1048 ticks is at its 1.5 ceiling.
DANGER reads x1.00 because the meter is `clamp01(exposure)` and 94.63 saturates
it - consistent, not contradictory. The cargo term is 0.70 because that is what
`init` writes and nothing in Unity sets it.

And the stronger fact: there is no longer any other formula it COULD be.
`Projected` is `BlwpCore.RunScore()` and nothing else - the C# arithmetic that
used to sit behind `FromCore` is deleted. Before this letter the same screen in
the same mode read SCORE 0, because the HUD showed the last run's number while
the truck was invulnerable.

  live   btc-logistics-core.pages.dev/Build/webgl.wasm.unityweb
         md5 62f9ef3497f8e903c97ec12d04172ae8, identical to the local
         artefact, built from 4fb231c. btc-logistics-war.pages.dev untouched.


## 2026-09-07  M1.a14 camera and HUNTED, measured on this tree

CAMERA - the five cases, 8 of 8 green, road in the picture in every one:

  case                worst off-nose   road across the frame   speed
  stop and reverse       0.0 deg           0.50 .. 0.50       14.0 m/s
  spin-out              20.6               0.50 .. 0.61       12.5
  impact throw          25.7               0.46 .. 0.60       16.5
  released look         34.3               0.33 .. 0.50       12.5
  standing cloud         0.0               0.50 .. 0.50       parked
    and up the frame 0.06 .. 0.58, 0 of 3566 frames below the bottom edge,
    pitch 22.5 of the 26 clamp, yaw 0.00 deg in a frame, cap never off the top

ONE OF THEM WENT RED FIRST AND IT WAS THE FIXTURE, NOT THE CAMERA. The
reverse case failed its own guard - "the truck only reached 5.3 m/s, so this
case measured nothing" - because five seconds of throttle is enough alone and
not enough with the whole suite, a browser and two builds sharing the machine.
Run on its own it reaches 14.0 m/s and reads 0.0 degrees off the nose and
0.50..0.50 across the frame, the recorded values exactly.

The guard is not the thing to relax: it is the only reason a camera test on a
stationary truck cannot pass. So `UpToSpeed` waits FOR the speed now, up to
four times as long, and still gives up rather than pretend. Every case reached
12.5 m/s or better on the next full run.

WHAT THE CAMERA READS: the pose is the core's - `CoreDrivenTruck` writes
`transform.SetPositionAndRotation` from `T_X`/`T_Z` and the camera follows that
transform, and the direction it settles behind is the hull heading, not a
velocity vector. The one PhysX read left in `ChaseCamera` is
`targetBody.linearVelocity` at line 390, behind `BlwpCore.Available`, and it
feeds reach, rise and the lens - how far back the camera sits and how wide it
opens. It cannot run when a core is answering.

HUNTED - what the player saw on the daily against what the core says:

  on screen   one filled pip of five, WANTED, CARGO 9 parcels 2,897 sat
  the core    heat(2897, 0) = 0.1448 -> ceil(0.1448 x 5) = 1 pip -> WANTED

  the 1920x1080 shot earlier read five pips and HUNTED at 13,921 sat:
    heat(13921, 0)    = 0.6960 -> 4 pips, HUNTED
    heat(13921, 1200) = 0.9120 -> 5 pips, HUNTED
  so the fifth pip is the BTC term, which the picture does not name - both
  readings are HUNTED either way.

`DriveHud` reads `BlwpCore.Heat` and nothing else: no fallback, no second
copy. The word and the pips are the core's word.

THE ONE THING NAMED AND NOT DONE: three core-first pairs remain that fall back
to a PhysX or C# value when no core answers - `ChaseCamera`'s velocity, the
HUD's speed and slip readout, and the engine note in `GameAudio`. None can run
on the deploy path. They are NOT the class of thing the score fallback was: a
second scoring engine computed an OUTCOME, while these feed a lens, a
speedometer and a pitch. Deleting them would leave the editor's camera with no
velocity at all and take several camera tests with it, exactly as the score
deletion took five. Named here rather than done quietly.


## 2026-09-07  the two engines compared again, and one constant had not crossed

Asked whether a14 needed anything else, the answer was yes, and it came out of
putting the C# constants next to the core's rather than trusting that the
score slice was finished when the C# formula was deleted.

  what it is                 C# (RunScore)        core (rules/score.js)
  the apron                  spawnFreeRadius 22   APRON_RADIUS 22 m      agree
  par time                   referenceSeconds 65  REFERENCE_TICKS 3900   agree
                                                  = 65 s at 60 Hz
  exposure reference         exposureReference    EXPOSURE_REFERENCE     DIFFER
                             190                  320

The 190 is the value a13 replaced with 320 in the core, and it was still being
multiplied into `Blwp.BlwpCore.Exposure` - a reading already in the core's own
units - inside the branch that runs when the core IS driving. Not a dormant
fallback: the live path.

  measured on a drive, exposure gained per metre of new ground
    tick 300   0.255 per metre     x190 =  48.4   clamped to 2.00
    tick 450   1.386               x190 = 263.4   clamped to 2.00
    tick 600   1.700               x190 = 323.0   clamped to 2.00
    tick 750   7.887               x190 = 1498.6  clamped to 2.00

The true rate runs 0.255 to 1.700, which is a real gradient inside the 0..2
band the meter is documented for - "zero at the map edge, 1 on the seam with
an empty bed, up to 2 on the seam under five stars". Multiplied by 190 it
saturates at the first metre and stays there. So the meter's bright cap, the
`cold` test that decides whether the warning shows at all, and the stalled
warning that tells "out of the corridor" from "going round in circles" were
all reading a pinned constant.

The multiplier is gone and the units are pinned by `RunScore.RateFrom`, a
static with three EditMode tests: what goes in comes out, divided by the
ground, nothing scales it; the 0..2 clamp holds; and no ground made good is no
rate. Putting the 190 back kills the first of them.

THE OTHER TWO ENGINE COMPARISONS ALREADY STAND: HUNTED was measured against
the C# army at three heats (17.40 / 8.85 / 8.20 s to write-off against the
core's 16.73 / 10.87 / 8.60 / 8.00), and the barrel share against both
engines at five stand-offs. The camera has no recording to compare against -
`PhysxReferenceTests` records the truck, the hills and the wall, not the view -
so it is measured against its own five cases instead.

  deployed with the meter fix: md5 31997c8588b15ef7d9fe840dc2bbbd19, identical
  to the local artefact, built from 06df48e. Photographed at 1024x768:
  SCORE 321 at tick 1040 - scoreOf needs exposure 97.72 for exactly that -
  DANGER x1.00 with the live cap riding the fill instead of pinned, five pips
  and HUNTED at 14,340 sat aboard, core DRIVING at pos -13.8, 12.3.
  btc-logistics-war.pages.dev untouched.


## 2026-09-07  M1.a15  the wheel's box grows as it turns, and no tyre is in the road

The driving bury was the last thing left of a15. Standing at the depot the
wheel sits at 0.000 (fixed in 3bd4208, closed, not re-measured). Driving, the
same probe reported 0.12-0.21 m of tyre inside the road, and the open question
was whether that was real penetration or the world-aligned bounding box
inflating as the wheel spins. `Renderer.localBounds` answers it without
enabling Read/Write on the model, so the diagnostic was made to print both and
the daily was driven.

THE MEASUREMENT. `btc-logistics-core.pages.dev`, wasm md5
31997c8588b15ef7d9fe840dc2bbbd19, built from 06df48e. 36 `[wheel]` lines:
23 standing at the depot, 13 driving and steering.

  standing, repeated and stable
    visual radius 0.523, bottom 3.099, ground 3.099, sunk 0.000
    core 2.799, terrain 2.799, core-terrain 0.000, deck lift 0.300
    (one early sample 0.530 / 0.007, before the truck had settled)

  driving, all thirteen, against the seated radius of 0.523 m

    world box half-height   sunk     half-height - 0.523   residual
         0.539             0.016           0.016            0.000
         0.541             0.019           0.018            0.001
         0.559             0.036           0.036            0.000
         0.624             0.101           0.101            0.000
         0.638             0.115           0.115            0.000
         0.649             0.126           0.126            0.000
         0.694             0.172           0.171            0.001
         0.711             0.188           0.188            0.000
         0.715             0.192           0.192            0.000
         0.736             0.213           0.213            0.000
         0.740             0.217           0.217            0.000
         0.746             0.223           0.223            0.000
         0.763             0.240           0.240            0.000

  the mesh's OWN extents, all 36 lines: 0.415, 0.680, 0.680 -> axle X
  core-terrain 0.000 on all 36 lines

The bury is the box's growth, to within the millimetre the log prints. The
world half-height runs over 0.224 m while the mesh's local extents do not move
at all, and seven of the thirteen report a world radius LARGER than the mesh's
own local radius of 0.680 - 0.694, 0.711, 0.715, 0.736, 0.740, 0.746, 0.763 -
which no vertex can produce and only an axis-aligned box around a rotated
object can. Standing, where the wheel is not turning, the box equals the
seated radius and the bury is 0.000.

It is also an identity once written out. The seating puts the mesh's CENTRE at
`ground + radius`, so

  sunk = ground - box.min.y = ground - (centre.y - box.extents.y)
       = box.extents.y - radius

and the only term that varies is the box. `sunk` cannot tell a rotated wheel
from a buried one; it was never able to.

FINDING: the 0.12-0.21 m driving bury is bounding-box inflation. No tyre is in
the road. Nothing is corrected, no Read/Write is enabled, no pixel changed, and
nothing was deployed for it.

WHAT WAS CHANGED, all of it measurement rather than picture:

  - `CoreDrivenTruck.SeatingOf(i, out WheelSeating)` reads one wheel: the
    ground under it, the mesh's own radius, where the mesh's centre actually
    is, and the world box's floor. `Tyre` is `ground + radius - centre.y` and
    is rotation-proof, because the wheel is round about its axle and its two
    cross-axle extents are equal - 0.680 and 0.680 - so the distance from
    centre to rim is the same at every spin angle. `Box` is the old number,
    kept because it is what the browser log shows.
  - the `[wheel]` line now prints "box sunk" and "tyre sunk" side by side, so
    the next person to read it cannot mistake the one for the other.
  - `PoseWheels` takes the steer, the speed and the frame time as arguments
    instead of reading `BlwpCore` and `Time.deltaTime` inside. Same code; the
    Update call site passes the core's own three numbers. This is what lets
    the seating be run in an editor, where the core is a stub that would drive
    nothing.

THE ROUND-PLAYING TEST, asked for either way. `WheelSeatingTests`, PlayMode,
three tests:

  - eight rounds, the truck put on a fresh spot and heading each time and the
    wheels re-streamed each time, rolling 40 frames at 9 m/s - about 1.7 whole
    turns of a 0.55 m wheel - then every wheel read. `Tyre` within 0.01 m of
    zero, AND the lowest real VERTEX of the wheel mesh not below the ground.
    The vertex scan is the claim made without the seating's own arithmetic.
  - the finding held as a test: over 120 frames of turning, the world box
    claims more than 0.05 m of bury while the tyre never moves 0.01 m. If a
    future probe goes back to trusting `bounds`, this says which number moved.
  - eight rounds of re-collect all seat on the same radius, and on the mesh's
    real one. This is "worse after round 1 or 2" stated as a number: a
    re-collect returning a different radius or hub is the only thing that
    could make round three sit lower than round one.

The stand-in is a sphere squashed to a tyre's extents with its renderer hung
off the pivot, as the streamed model's is - a stand-in centred on its pivot
could not show the 0.178 m bury 3bd4208 fixed. `StartRound` is not called: it
returns on its first line without a core, so calling it in an editor would be
a line of test that does nothing and reads as though it did something.

SECOND FINDING, out of the same measurement rather than looked for. The round
test's log showed one unchanging mesh seated on a DIFFERENT radius every
round - 0.503, 0.488, 0.486, 0.493, 0.507, 0.518 m - and the rounds differ by
nothing except which way the truck was pointing when the model was handed
over. `Bootstrap.NormaliseTruckModel` sized the streamed truck by

    6.4 / max(worldBounds.size.x, worldBounds.size.z)

which is the same axis-aligned world box. A truck standing at an angle is
measured across its own diagonal, comes out too long, and is scaled down to
compensate; the sole had it too, because a rotated box's floor is below the
model's own, so a truck delivered at an angle was also set down at the wrong
height. The function already knew the difference - two lines on it re-measures
"in the TRUCK's space, not the world's" - and only the length had been left
behind in the world's.

  measured on the stand-in, 6.4 m long, wheel radius 0.550 m
    world box   heading  0 deg -> 0.550 m     heading 15 deg -> 0.517 m
    own box     heading  0 deg -> 0.550 m     heading 15 deg -> 0.550 m
  a 6% size difference for pointing fifteen degrees off north

`Bootstrap.Measure` carries each renderer's OWN box corner by corner into the
truck's space, which is exact under rotation and needs no Read/Write. Both
the length and the sole read it now. This one DID change pixels - the truck is
the size it is meant to be whatever heading it streams in on - so it deploys.

MUTANTS, both killed:
  - `Measure` put back into world space: `TheModelIsSizedTheSameOnEveryHeading`
    red at 15 deg, 0.517 m against 0.550 m.
  - the seating put back on the collider radius, which is the 3bd4208
    regression: `TheTyreStaysOnTheGroundThroughEightRounds` red at -0.027 m
    and `TheWorldBoxClaimsABuryTheTyreDoesNotHave` red with the tyre moving
    0.027 m while the box grew 0.214 m.

The editor reproduces the browser's numbers on the real streamed wheel, which
is the part that makes this a measurement rather than a story:
`SmallTruck_Tyre_B_L`, local extents 0.415, 0.680, 0.680, seated on 0.523 m,
box sunk 0.122 / 0.082 / 0.046 / 0.036 / 0.076 m and tyre sunk 0.000 in every
one of them.

TESTS, counted per suite.

  PLAYMODE  213 / 185 green / 13 red / 15 skipped, and 213 / 186 / 12 / 15 on
            a second full run of the same code. Eleven of the reds are the
            known list. The other two are both green when run alone -
            `ScoreTests;PostOfficeTests` on their own: 15 of 15 - and only one
            of them appeared twice:
              PostOfficeTests.TheGogglesAnimate       the documented load
                                                      flake, item 1: green
                                                      alone, red under load
              ScoreTests.IdlingEarnsNothingEvenOnTheSeam
                                                      red on run 1, green on
                                                      run 2, green alone
            Four more PlayMode fixtures' worth of world-building is what the
            suite gained, and that is the load both of them are sensitive to.
            Named rather than tuned away.
  EDITMODE  159 / 155 green / 1 red / 3 skipped. The red is
            `CombatFxTests.RifleFireProducesAFlashAndATracer`, the known one.
  NEW       WheelSeatingTests, 4 PlayMode tests, all green.

DEPLOYED AND RE-MEASURED ON THE LIVE DAILY. btc-logistics-core.pages.dev,
wasm md5 f530f17206c36c3ec191dfb964ce8d4d, identical to the local artefact,
built from 2011145. btc-logistics-war.pages.dev untouched (HTTP 200, not
redeployed). The probe was run again against the deployed page:

  standing at the depot, 20 lines
    box sunk 0.000, tyre sunk 0.000, seated on 0.523
    (one line at 0.007 / 0.000 before the truck had settled)

  driving, 17 lines
    box sunk   0.044 0.047 0.056 0.068 0.075 0.106 0.118 0.130 0.146 0.159
               0.180 0.199 0.214 0.220 0.223 0.233 0.245
    tyre sunk  0.000 on every one of the seventeen
    seated on  0.523 on every one of the seventeen, across a run that turned
               the truck through the whole map - which is the heading fix
               holding on the live build, not only in the fixture

So the two numbers now sit next to each other in one line and say different
things, and the one that means something says the tyre is on the road.


## 2026-09-07  M1.a15 audited: three leftovers found, all closed

Asked whether a15 needed anything else, the answer was yes three times.

ENGINE COMPARISON FIRST, since that is what the question asks for. There is no
C#-versus-core pair to compare here: the wheel seating already comes through
the core. `RoadNetwork.Ground` is documented as the funnel - "it comes from
the CORE, `surfaceAt` in sim.js is the one thing that says what the ground is,
and it is the relief LESS the craters" - and Unity contributes only the deck it
draws on top. The live probe prints both sides on every line and they agree:
`core-terrain 0.000` on 35 of 37 lines and -0.001 on the other two. Off a
lane the two are identical to the millimetre (core 1.944, terrain 1.944, deck
lift 0.000); on a lane the drawn surface is the core's plus the deck (core
4.531, ground 4.831, deck lift 0.300), which is the renderer adding the road
it draws and not a second opinion about the ground.

CHECKED AND CLEARED, so it is not left as a suspicion: the two red tests named
"stands in the ground" - `ImportedModelTests.TanksStandOnTheGroundRatherThanInIt`
and `SoldiersStandOnTheGroundAndAreAnimated` - are not a seating fault. They
fail with "no tank hulls found" and "no soldiers found": the C# army is retired
and there is nothing in the scene for them to measure. Same for the three
`VehicleTests` nulls. They stay on the known list.

1. THE WHEEL ROLLED ON THE COLLIDER'S RADIUS. `_spin` was advanced on
   `_wheelRadius`, the WheelCollider's 0.550 m, while every seating line used
   the mesh's 0.523 m - the same leftover 3bd4208 took out of the seating and
   left in the rolling. The tyre turned 5.2% slower than the ground it stands
   on and slipped for the whole drive. Now `_rollRadius`, the mesh's own mean.
   Measured, not declared: 9.00 m of road turns a 0.620 m stand-in 832 deg,
   and the mutant that rolls on the collider turns it 938.

   That test was VACUOUS when first written and said so on the second run: the
   stand-in was 0.550 m and the collider is 0.550 m, so both radii turn the
   wheel through the same angle and the mutant survived. The stand-in is 0.620
   now, and the test refuses to run if the two are within 0.02 m of each other.

2. THE INSTRUMENT SHIPPED. The `[wheel]` line was printing to the console of
   the live build every two seconds. The finding it produced is closed and held
   by tests, so it is behind `GameSettings.Debug` now - the DEBUG icon on the
   HUD brings it back when it is wanted again.

3. THE ROAD WAS NOT DRAWN WHERE THINGS STOOD ON IT. `RoadNetwork` said so
   itself, in a comment ending "whether that is the gap in the photograph is a
   measurement, not an argument". It is 0.272 m, measured against the ribbon's
   OWN vertices in a built world, at (59.7, 45.2), over 804 drawn
   cross-sections.

   Two causes, one fix. The ribbon lays two vertices per cross-section and
   spans them flat, so the drawn road is a CHORD between its edges while
   everything on it was seated on the ground under its own feet - above that
   chord over a crest, below it in a hollow. And the mesh drops a worn stretch
   by `broken * 0.55` on one edge and `broken * 0.30` on the other, drawing a
   rut the seating had never heard of. `SurfaceHeight` now builds the ribbon's
   surface the way the mesh builds it: the same `side`, the same two edge
   samples, the same wear across the width, and the same shoulder fade so
   nothing steps at the edge. Worst gap 0.272 m -> under 0.02 m.

   Mutant: `SurfaceHeight` back to `Ground + Lift` goes red at 0.272 m.

   TWO FAULTS IN THE TEST ITSELF, both found by running it rather than reading
   it. It walked every `Road_` mesh in the scene, and the full suite leaves
   earlier worlds standing: it compared one network's ribbon against another
   network's model, and a network whose terrain has since been destroyed
   answers 0 for the ground while still holding the mesh it built when the
   terrain was there. That produced a 2.34 m disagreement about a road that is
   fine. It now walks the network the TRUCK is seated by.

TESTS. PlayMode 215 / 188 green / 12 red / 15 skipped. Eleven are the known
list; the twelfth is `ScoreTests.IdlingEarnsNothingEvenOnTheSeam`, the load
flake from earlier today - green when run alone, green on the run before this
one. EditMode 159 / 155 green / 1 red / 3 skipped, the known CombatFx one.
`RampReadyTests.TheRealTransactionsReplaceTheStandInsWhileNothingIsLoaded`
went red once under load and is green alone; named because it had not been
seen before.


## 2026-09-07 07:39  the view is the player's, and the build has a number

REVERSED, on Daniel's word: "when the atom bomb comes the camera is still
ripped from his hands. That must not happen. View stays unchanged." So the
three tunables a14 measured a ladder for - `cloudLookUp` 26 deg, `cloudPullBack`
20 m, `cloudLift` - are gone, with the blend that drove them and the block
that re-aimed the look point. Nothing in `ChaseCamera` reads
`StrikeTheatre.CapCentre` any more.

The test is reversed with the rule rather than deleted. `AStrikeTiltsTheView-
AndDoesNotSwingIt` asserted the view DID tilt (`worstPitch > 1`) and that the
cap stayed framed; `AStrikeLeavesTheViewWhereThePlayerHadIt` runs the same six
seconds twice from the same pose, once quiet and once with a mushroom 45 m off
the road, and requires the camera to end up in the same place looking the same
way - under 0.25 m and 0.5 deg, against the 20 m and 26 deg that were there
before. The two ladder harnesses that picked the rung are deleted: there is no
rung to pick.

THE BUILD NUMBER, asked for as 0.0.xxx and on both screens.
  - `StampTheBuild` writes `0.0.<git rev-list --count HEAD>` - 0.0.550 at this
    commit - into `Resources/build.txt` AND onto `PlayerSettings.bundleVersion`.
  - the SPLASH reads the file through `BuildStamp.Current`.
  - the LOADING screen reads the version through the template's
    `{{{ PRODUCT_VERSION }}}`, and now says "build 0.0.550" rather than the
    bare number.
  One string, two screens, no way for them to disagree. The old stamp was
  `43e3375  ·  2026-09-07 05:28 UTC`: a hash nobody can put in order, on one
  screen only. `BuildNumberTests` pins the shape and names the old one so it
  cannot come back quietly.

AND THE LOADING SCREEN STOPPED SPEAKING GERMAN while it was open - it was the
first screen of the game and every word on it was German: "Verbindung wird
aufgebaut", "Programm wird geladen", "Spieldaten werden geladen",
"Schlachtfeld wird aufgebaut", "Fast fertig", "Einige Megabyte", "Der Loader
konnte nicht geladen werden", and the note under the bar.

M1.a8, PAUSED at 07:39 after one measurement. Asked: try the routed /market
path on coin-margined. Probed for 300 s each, from this machine:

  dstream /market/ws/!forceOrder@arr  (the ask)   open 792 ms   74 messages   BTC* 0
  dstream /ws/!forceOrder@arr         (control)   open 729 ms   74 messages   BTC* 0
  fstream /market/ws/!forceOrder@arr  (control)   open 765 ms   74 messages   BTC* 0

All three opened and all three delivered the same 74 messages with no BTC*
symbol among them - including the fstream path that is the one already shipping,
which is what says this window was quiet rather than the coin-margined route
being wrong. Nothing was merged into `OnLiquidation`, because nothing spoke.
The run wants repeating at a busier hour before a8 is called either way.

DEPLOYED AND PHOTOGRAPHED. btc-logistics-core.pages.dev, wasm md5
1f2678c3cb24240d3ba9f3efa0b61c4a, identical to the local artefact, built from
ab4ab5b and stamped 0.0.551. Both screens shot at 1024x768:

  loading screen  "Bitcoin Logistics War / build 0.0.551 / 0 % · 0.0 / 19.2 MB
                  / Loading the program … / 19.2 MB to load. The first time is
                  the slowest — after that most of it is in the browser cache."
                  Every word English, and the number under the title.
  splash          "build 0.0.551", right-aligned under the title bar, above the
                  three numbered steps and the PLAY / SPECTATE buttons.

btc-logistics-war.pages.dev untouched (HTTP 200, not redeployed).


## 2026-09-07 07:28  M1.a8: the routed path on coin-margined is the USDT-M stream

Asked: try the routed /market path on coin-margined; if it speaks, merge BTC*
into the same `OnLiquidation`; if it still pays 0, say so with the measurement.

FIRST PROBE, 300 s each, message counts only:

  dstream /market/ws/!forceOrder@arr  (the ask)   open 792 ms   74 messages   BTC* 0
  dstream /ws/!forceOrder@arr         (control)   open 729 ms   74 messages   BTC* 0
  fstream /market/ws/!forceOrder@arr  (control)   open 765 ms   74 messages   BTC* 0

Three hosts, one count. That is not an answer - the fstream control is the
path already shipping, and it paid 0 BTC* too, so the window was quiet. Counts
cannot tell a quiet market from a wrong route.

SECOND PROBE, the same 300 s but recording SYMBOLS, which can:

  dstream /market/ws   46 messages, 23 symbols, 0 coin-margined
  dstream /ws          46 messages, 23 symbols, 0 coin-margined
  fstream /market/ws   46 messages, 23 symbols, 0 coin-margined

    WLDUSDTx14  UAIUSDTx4  IOSTUSDTx3  BTRUSDTx2  PONSUSDTx2  SOPHUSDTx2
    FILUSDTx1  ETHUSDTx1  XANUSDTx1  DOODUSDTx1  ...

The three tables are IDENTICAL - the same symbols in the same counts. Every
name ends in USDT and not one carries an underscore, and an underscore is how
every coin-margined contract is named: BTCUSD_PERP, BTCUSD_241227. So dstream
is serving the same USDT-M all-market force-order stream fstream serves, and
the routed path does not reach coin-margined at all.

THE HARNESS WAS CHECKED BEFORE THAT WAS BELIEVED, because three identical
tables is exactly what a harness bug looks like. Two rows on genuinely
different streams: dstream /market/ws forceOrder 2 messages in 20 s, fstream
/public/ws btcusdt@bookTicker 710. The rows are independent; the sameness is
the exchange's.

CONCLUSION: 0, and now with a reason rather than a quiet window. Nothing was
merged into `OnLiquidation` - merging it would merge the stream already
shipping with itself. A coin-margined stream would need a URL this project has
not measured, and none was invented.


## 2026-09-07 08:30  M1.a8 CLOSED: the documented coin-M liquidation stream carries USDT-M orders

THE EARLIER MEASUREMENT IS RETRACTED. The 07:28 probe opened three sockets at
once and reported dstream and fstream returning the identical symbol table,
and concluded "dstream serves the same USDT-M all-market stream fstream
serves". Two hosts on different IPs serving different contract sets cannot
return identical tables, and single-socket runs do not reproduce it. Whatever
that probe measured, it was not the exchange. Everything below is ONE socket
at a time, nothing else running.

THE DOCS. Binance names it, so this is not an invented URL:
  https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Liquidation-Order-Streams
    base endpoint  wss://dstream.binance.com
    stream name    !forceOrder@arr
    update speed   1000ms
    payload symbol BTCUSD_200925
  and the migration notice, which is why the routed path is the current one:
  https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Important-WebSocket-Change-Notice
    legacy URLs decommissioned after 2026-04-23; use /public, /market, /private

THE HOST IS GENUINELY COIN-MARGINED, checked before anything was concluded
from it:
  dapi.binance.com/dapi/v1/exchangeInfo   30 symbols, 30 with an underscore
                                          BTCUSD_PERP, AAVEUSD_PERP, BTCUSD_260925 ...
  fapi.binance.com/fapi/v1/exchangeInfo   897 symbols, 4 with an underscore
  wss://dstream.binance.com/ws/btcusd_perp@markPrice
                                          4 messages in 15 s, symbol BTCUSD_PERP
  dstream and fstream resolve to different IPs (57.180.191.254 / 54.168.230.110)

THE DOCUMENTED ALL-MARKET STREAM, ON THAT HOST, ONE SOCKET, BOTH ROUTES:

  wss://dstream.binance.com/ws/!forceOrder@arr           300 s
     84 messages, 31 symbols, 0 with an underscore
     UAIUSDTx14  IOSTUSDTx10  SOLVUSDTx6  COTIUSDTx5  CATIUSDTx4  XANUSDTx4 ...
  wss://dstream.binance.com/market/ws/!forceOrder@arr    300 s   (current route)
     100 messages, 42 symbols, 0 with an underscore
     DOODUSDTx16  IOSTUSDTx14  MARSCOINUSDTx7  CFGUSDTx4  ORCAUSDTx3  XRPUSDTx3 ...

  a raw one, so the shape is on the record rather than described:
    {"e":"forceOrder","E":1788762843264,"o":{"s":"DOODUSDT","S":"SELL","o":"LIMIT",
     "f":"IOC","q":"13828","p":"0.0021970","ap":"0.0022310","X":"FILLED",
     "l":"11719","z":"13828","T":1788762842255,"ps":"DOODUSDT","st":1}}

AND THOSE SYMBOLS ARE NOT COIN-MARGINED CONTRACTS. Fifteen of the names
above, checked against Binance's own exchangeInfo for both products:

  DOODUSDT IOSTUSDT MARSCOINUSDT CFGUSDT AKEUSDT ORCAUSDT ENAUSDT XRPUSDT
  ETHUSDT XANUSDT SOLVUSDT CATIUSDT UAIUSDT COTIUSDT BULLAUSDT
    on coin-M (dapi):  0 of 15
    on USDT-M (fapi): 15 of 15

So the coin-M all-market liquidation stream, at the host and stream name the
docs give, on both the legacy and the current route, delivers USDT-M force
orders. Subscribing to it would merge the stream already shipping with itself.

THE ONLY OTHER ROUTE A COIN-M LIQUIDATION COULD TAKE is the per-symbol
`<symbol>@forceOrder` stream, so every coin-M symbol was subscribed at once:

  wss://dstream.binance.com/market/stream?streams=btcusd_perp@forceOrder/
    aaveusd_perp@forceOrder/ ... 30 streams, all of dapi's symbols     600 s
      0 messages, 0 symbols

The socket opened and stayed open; it simply paid nothing. That is not proof
the route is broken - coin-M liquidations are rare and 600 s is a short look -
but it is not something that can be wired on and called measured either.

NOTHING NEW REACHED `OnLiquidation`. No source was added. Wiring the
all-market stream would duplicate the USDT-M feed already there; wiring the
per-symbol streams would add a fourth socket to the shipping game that has
never been observed to deliver a single message.

a8 is CLOSED as pays-0: the coin-margined liquidations a player would see are
still zero, and now with the reason on the record rather than a quiet window.

AND ONE RED OF MY OWN, FOUND AND FIXED RATHER THAN LEFT. The road test added
earlier today went red in the full suite while passing alone - 2.98 m, then
-2.34 m, about roads nobody had touched. Two causes, both the same shape:

  - it took whichever `CoreDrivenTruck` the scene handed over, and other
    fixtures leave their worlds standing. A leftover truck is seated by a
    leftover road network whose terrain has since been destroyed, so its
    ground answers 0 under ribbons it still holds. It tears the scene down
    before building its own world now, and refuses to measure a network whose
    terrain is gone.
  - the ground comes from a live fetch and reshapes under the road.
    `RoadNetwork.Update` notices within 0.25 s and rebuilds, so measuring
    across that window compares a surface sampled now against a mesh built
    against the heights of a moment ago. The test holds the terrain version
    still for two rebuild ticks before reading anything.

Nothing was relaxed - the bound is the same 0.02 m - the two sides are made
the same age. PlayMode is back to the known eleven.


## 2026-09-07 09:10  M1.a8 REOPENED: a BTCUSD_PERP liquidation does cross that stream

THE 08:30 CONCLUSION IS RETRACTED - the second one I have had to take back on
this letter. It said the documented coin-M all-market stream "delivers USDT-M
force orders" and that subscribing would merge the shipping feed with itself.
The first half is mostly true and the conclusion drawn from it was wrong.

Asked whether any hole remained that would put a real coin-M liquidation on
the map without inventing a URL, the two route shapes the change notice names
and had not been tried were tried:

  wss://dstream.binance.com/public/ws/!forceOrder@arr          180 s
     70 messages, 35 symbols, 1 with an underscore
  wss://dstream.binance.com/market/stream?streams=!forceOrder@arr   180 s
    139 messages, 66 symbols, 2 with an underscore

Underscores, where the 300 s captures had none. An underscore is not proof by
itself - USDT-M has dated contracts too, BTCUSDT_261225 - so the names were
taken in full and each checked against Binance's own two lists:

  wss://dstream.binance.com/market/stream?streams=!forceOrder@arr   300 s
    588 messages, 214 symbols, 4 with an underscore

      ETHUSD_PERP     x1   on coin-M (dapi): YES   on USDT-M (fapi): no
      BTCUSD_PERP     x1   on coin-M (dapi): YES   on USDT-M (fapi): no
      XRPUSD_PERP     x1   on coin-M (dapi): YES   on USDT-M (fapi): no
      BTCUSDT_261225  x1   on coin-M (dapi): no    on USDT-M (fapi): yes

      BTC* of every kind: BTCUSDTx15  BTCUSDCx3  BTCUSD_PERPx1  BTCUSDT_261225x1

So the stream carries both, and coin-M is about half a percent of it - 3 of
588. That is why the earlier windows saw none: 84 and 100 messages give an
expectation below one. Zero was a sample size, not a fact about the exchange,
and it was read as a fact.

WHAT IS ACTUALLY TRUE, then. A coin-margined BTC liquidation crosses a stream
Binance documents, at a URL nobody had to invent. It pays 0 to the player for
one reason only: nothing in the game subscribes to dstream. `MarketFeed` opens
fstream, Bybit and OKX.

WHAT WIRING IT NEEDS, named so the next turn does not have to re-derive it:
  - a fourth source on wss://dstream.binance.com/market/stream?streams=!forceOrder@arr
  - a coin-M-ONLY filter on that source. The stream carries the USDT-M orders
    fstream is already delivering, so taking everything would count them
    twice. The test is not "has an underscore" - BTCUSDT_261225 has one and is
    USDT-M - it is the coin-M shape: BTC followed by USD and then _, as in
    BTCUSD_PERP and BTCUSD_260925.
  - the value is in COIN, not USDT: the coin-M payload's `q` is contracts of
    100 USD for BTC, so `UsdValue` cannot be `q * price` the way the USDT-M
    one is. That is a rule, and it needs its own measurement before it ships.
  - `HandleFutures` already accepts the name: it filters `StartsWith("BTC")`
    and rejects only BTCDOM, so BTCUSD_PERP passes.

NOT DONE THIS TURN because no feature code was to be written. Nothing was
added to `OnLiquidation`; the game is unchanged.


## 2026-09-07 10:05  M1.a8 CLOSED: coin-margined liquidations pay

Wired, and the number moved from absent to a dollar amount.

THE SOURCE. A fourth `MarketFeed` source, same shape as the fstream one - no
subscribe frame, no keepalive, the stream is in the URL:

    binance-cm  wss://dstream.binance.com/market/stream?streams=!forceOrder@arr

THE FILTER, and why it is not "has an underscore". That socket carries both
books - 588 messages over 300 s, of which 3 were coin-M - so taking everything
would put every USDT-M liquidation on the map twice, once off each socket. The
trap is the dated USDT-M contracts: BTCUSDT_261225 has an underscore, starts
with BTC, and arrived on this very socket during the capture. `IsCoinMargined`
matches the shape Binance actually uses - a base, then USD, then the
underscore - and was checked against their own two lists rather than reasoned
about:

    dapi (coin-M)   30 symbols   the rule takes 30
    fapi (USDT-M)  897 symbols   the rule takes  0
    fapi's four underscore names: BTCUSDT_260925, ETHUSDT_260925,
                                  BTCUSDT_261225, ETHUSDT_261225   all rejected

THE VALUE. The quantity on this book is CONTRACTS, not coin. Contract sizes
off dapi's exchangeInfo, read 2026-09-07:

    contractSize 100 USD    3 symbols   BTCUSD_PERP, BTCUSD_260925, BTCUSD_261225
    contractSize  10 USD   27 symbols   AAVEUSD_PERP, ADAUSD_PERP, ...

THE MEASUREMENT, on an order caught off that socket rather than one written
here. E=1788767113682, BTCUSD_PERP, forced BUY, q=197, ap=79288.0:

    before   0            nothing subscribed to the book it came from
    after    $19,700      197 contracts x 100 USD
    the wrong reading     $15,619,736   (197 x 79288.0, the USDT-M rule)

    and it is a forced BUY, so it closes a SHORT - the side is read the same
    way as on the other Binance book.

MUTANTS, both killed:
  - filter removed: `AUsdtMarginedOrderOnTheSameSocketIsDropped` red, and
    `EveryForcedOrderStillProvesTheSocketIsAlive` red at 2 accepted of 3.
  - valued as `contracts * price`: `ACoinMarginedLiquidationPaysRealDollars`
    red at 238,239.30 against 300.00 on the earlier fixture - a 794x
    overstatement of a single order.

TESTS. EditMode 169 / 165 green / 1 red / 3 skipped - eight new, the red the
known CombatFx one. PlayMode 213 / 189 green / 11 red / 13 skipped - the known
eleven, nothing new.

The `Forced` counter still moves on EVERY forced order on that socket,
accepted or not, and that is deliberate: BTC coin-M is about half a percent of
the traffic and can be silent for an hour, so a counter that only moved on
accepted orders could not tell a quiet book from a dead subscription.

DEPLOYED AND CHECKED ON THE DAILY. btc-logistics-core.pages.dev, wasm md5
903ea91fc67d1dfaa1525f3d6b340daa, identical to the local artefact, built from
ce9517a and stamped 0.0.557. btc-logistics-war.pages.dev untouched (HTTP 200,
not redeployed). The page's own console, off the deployed build:

    [feed] binance open, subscribe not needed
    [feed] binance-cm open, subscribe not needed
    [feed] bybit open, subscribe sent
    [feed] okx open, subscribe sent
    [feed] bybit is delivering
    [feed] okx is delivering
    [feed] binance is delivering
    [feed] binance-cm is delivering

Four sockets, all four delivering. No liquidation was ACCEPTED off binance-cm
in that 100 s window, and that is the expected shape rather than a failure:
BTC coin-M is about half a percent of a stream that itself carries a few
orders a minute, so the wait for one is measured in tens of minutes. "Is
delivering" is the check that can be made in a browser run; the payout itself
is pinned by the captured order in `CoinMarginedFeedTests`.


## 2026-09-07 10:50  a8 audited: the units the core is handed, and two tests of mine

THE ENGINE QUESTION, answered with numbers. There is no second engine sizing a
strike any more: `Bootstrap` hands every accepted liquidation to
`BlwpCore.Liquidation(usd)`, and the C# side gets only the SIDE and the venue,
for the renderer. So the comparison that matters is not core-versus-C#, it is
whether the NEW book reaches the core in the same units as the old one.
`BlwpCore.Scale` is the whole conversion - millions of USD in Q16.16, rounded,
floored at one step of $15.26 - and it is readable outside a WebGL player, so
it was measured rather than argued:

  the captured order, 197 contracts of BTCUSD_PERP at 79288.0

    before                      0 steps      nothing subscribed to that book
    after, coin-M rule     $19,700 ->  1,291 steps
    the USDT-M rule    $15,619,736 -> 1,023,655 steps

  1,023,655 / 1,291 = 793x the strike. The crater follows the cube root of the
  size, so that is about nine times the radius - not a rounding error, a
  different weapon.

  one BTC coin-M contract, $100 -> 7 steps. The smallest order this book can
  produce still reaches the core rather than being floored away, which is the
  thing worth checking about a book whose quantities are small integers.

  and one rule, not two: Scale(coin-M $19,700) == Scale(USDT-M $19,700). Four
  tests, `CoinMarginedCoreUnitsTests`.

TWO REDS OF MY OWN, both from this letter, both fixed rather than listed:

  - `CargoTests.TheWindowChromeDrawsWithoutThrowing` went red on the line
    "[feed] binance-cm open, subscribe not needed". It watched for a throw by
    requiring the CONSOLE TO BE SILENT - `LogAssert.NoUnexpectedReceived`
    fails on an ordinary Log too - which made it a hostage of whatever else
    spoke in those twenty frames. It listens for the thing itself now:
    Exception, Error and Assert fail it; a Log does not.
  - `WheelSeatingTests.TheRoadIsDrawnWhereThingsAreSeatedOnIt` was
    intermittent, about one run in three, always -2.34 m at (82.4, -24.1).
    Not noise: the frontline moves every frame and the lanes bend around it,
    while `RoadNetwork` rebuilds at most every 0.25 s, so between two rebuilds
    the seated centreline has walked on while the ribbon still holds the old
    one - and (82.4, -24.1) is where a lane bends hardest. The test watches a
    ribbon's own vertices and reads the road in the frame they change. Three
    consecutive runs green, and a `[road]` line now prints the lane, the
    seated height, the drawn height, the lift and the wear if it ever fails
    again. The 0.02 m bound is untouched.
  - `EveryRoundMeasuresTheSameWheel` flaked once for a third reason worth
    naming: the streamed truck can arrive mid-run, so round 7 measured the
    real 0.523 m tyre while round 1 measured a 0.620 m stand-in. That is the
    model changing, not a re-collect lying about one mesh, and the fixture is
    about the second thing - so it re-baselines when the wheel's name changes.

TESTS. PlayMode 213 / 187 green / 13 red / 13 skipped: the known eleven plus
TWO of the three load flakes at once, which has not happened before - both are
green alone and the note above is updated. EditMode 173 / 169 green / 1 red /
3 skipped, the known CombatFx one.


## 2026-09-07 11:40  the line under the price is English

The last German word anywhere a driver looks. It was drawn under the price
whenever the spot feed had not delivered one yet - the first seconds of a
session, and so never in a photographed frame, which is how it survived a13's
whole German sweep. `StreamingWordsTests` was written for exactly this class
of fault and could not see this one: it reads the streamed model list.

MEASURED OFF THE DRAW PATH, not off the source. The line was first pulled out
of `DrawHeadline` into `DriveHud.PriceSubline(price, changePct, status)` with
its text unchanged, so what the tests read is what the HUD draws. Then:

    before   "verbinde … (connecting)"      price 0, status connecting
    after    "connecting … (connecting)"

    and with a price, unchanged in both:
             "-0.77% 24h"  "+1.20% 24h"  "0.00% 24h"

The before is not a quotation from a comment - it is the string the function
returned with the old text in it, printed by the three tests failing on it:
"price 0 status connecting reads "verbinde … (connecting)", which is German".
Putting the German back is therefore its own mutant, and it kills all three.

Nothing else moved. The line still says the day's move once a price is there
and nothing about the connection, which was a decision taken when the feed
roll ran the width of an iPhone across the scene; `Venues()` and
`market.Status` stay in the debug panel. No simulation value is involved -
this is a renderer string, and the core has no opinion about it.

TESTS. EditMode 176 / 172 green / 1 red / 3 skipped, three new, the red the
known CombatFx one. PlayMode 213 / 188 green / 12 red / 13 skipped: the known
eleven plus one load flake, `PostOfficeTests.TheGogglesAnimate`.

DEPLOYED. btc-logistics-core.pages.dev, wasm md5
b08a385f88a499bb731beec8c3696846, identical to the local artefact, built from
aa29cdb and stamped 0.0.561. btc-logistics-war.pages.dev untouched.

PHOTOGRAPHED, with what the photograph can and cannot show. Shot at 1024x768
200 ms after Play: the headline reads "$79,379  -0.72% 24h" - the branch that
HAS a price, English, and no German anywhere in the frame. The connecting
branch could not be caught: the spot socket delivers a price before the splash
can be dismissed, which is the same reason this word survived a13's sweep in
the first place. That branch is pinned by the three tests instead, read off
the same function the HUD draws from.


## 2026-09-07 12:20  the driving HUD speaks English - and it was two places, not one

I reported the connecting word as "the only one left in that file". That was
wrong, and wrong for a reason worth writing down: the sweep behind it searched
for a fixed list of German words, and the list was built from the words already
found. Every row of the DEBUG panel is German and not one of them carries an
umlaut, so a check that looks for ä/ö/ü/ß walks straight past them.

  Tempo   68 km/h                        ->  Speed   68 km/h
  Gas +0.8  Lenk -0.3  HB                ->  Thr +0.8  Steer -0.3  HB
  Drift   2.6 m/s   Raeder 4/4           ->  Drift   2.6 m/s   Wheels 4/4
  Fluss   -0.42                          ->  Flow    -0.42
  Panzer   gruen 3  rot 4                ->  Armour   green 3  red 4
  Soldaten gruen 11  rot 9               ->  Infantry green 11  red 9
  Luft     2 Heli  1 Bombe(n)            ->  Air      2 heli  1 bomb(s)

That panel sits behind the DEBUG icon, which is on the driving HUD, so it is
something a player can open - not developer-only.

MEASURED OFF THE DRAW PATH, as the price line was. Each row is a small public
function the panel calls, so what the test reads is what is drawn, and the row
COUNT is untouched - which is what `DiagnosticsContentHeight` and
`DebugPanelBox` are measured on, and why a13's layout tests are unaffected.

AND THE SWEEP DONE PROPERLY THIS TIME, over every shipping script rather than
one file, with a word list of German-only markers including the umlaut-free
ones. Five hits remain and all five are false positives - "grade", "deg" and
"Wasted Grade" catching a "Grad" marker. No German string reaches a player.

  `MempoolFeed.Status` also carried "verbinde …" and "lade Mempool …". They are
  DEAD - nothing in the project reads that property - and they are English now
  anyway, because a dead string is one refactor away from being drawn.

STILL GERMAN, and deliberately left: the assertion messages in the test suites.
They are not player-facing, they are not in a shipping script, and rewriting
616 of them is not this letter.

TESTS. EditMode 178 / 174 green / 1 red / 3 skipped - five new, the red the
known CombatFx one. PlayMode 213 / 189 green / 11 red / 13 skipped - the known
eleven exactly, no load flake in this run.


## 2026-09-07 13:30  M1.a16 deployed and spectate photographed

Built from 752e4b1 - "score the front, not the rim" - after two earlier builds
went stale under me: HEAD moved from ffcbfa2 to 19284ed to 752e4b1 while a
build was running, so the first artefact was thrown away rather than deployed.
The generated core bundle was reset to HEAD before rebuilding, so the wasm
carries the rules that are in the tree and not a mixture of two of them.

  stamped        0.0.567 (752e4b1)
  compile errors 0
  local wasm     59ea55f8cdddca795e1a8e768b956723
  live wasm      59ea55f8cdddca795e1a8e768b956723   identical
  loading screen build 0.0.567
  btc-logistics-war.pages.dev   HTTP 200, not redeployed

SPECTATE, photographed on the deployed build at 1024x768, three shots across a
running round - 5 s, 25 s and 60 s after pressing SPECTATE, so "price only" is
shown to hold while a round runs and not merely on the first frame:

  on screen   EXIT (top left, on the spectator camera)
              $79,419
              -0.70% 24h
              "drag to look · pads to fly · two fingers up/down for height"
              the two flight pads

  NOT on screen   block board, block clock, score column, BANKED, PRACTICE,
                  SIM, CONDITION, DANGER, HUNTED, cargo, manifest, the
                  liquidation line

The war itself is visible below - tanks burning on both sides of the seam,
infantry in the grass, the mempool wall with its block panels - which is the
point of spectating. The hunt tuning and the score rule were not touched here;
they arrived in the tree at 19284ed and 752e4b1 and this letter only put them
on the daily and photographed the HUD.

AUDIT OF a16, and the gap it found: NO SUITE HAD BEEN RUN since the a16 core
changes landed. Three commits moved the money law - the heat factors at
ffcbfa2 and 19284ed, the score's front weighting at 752e4b1 - and regenerated
all eight golden vectors, and the letter was marked done off a photograph of
the HUD. Run now:

  core       80 / 80 pass, including all eight vectors after regeneration
  guard      19 files clean
  PlayMode   213 / 188 green / 12 red / 13 skipped
  EditMode   178 / 174 green /  1 red /  3 skipped

The PlayMode reds are the known eleven plus `PostOfficeTests.TheGogglesAnimate`,
the load flake; EditMode's is the known CombatFx one. Nothing new.

CORE VERSUS OLD, in numbers rather than in feel. At heat ZERO the two engines
are not merely close, they are identical BY CONSTRUCTION: all three rules are
`base + base * (heat * FACTOR)`, so at heat 0 the second term is exactly zero
whatever the constant is. a16 changed only those constants, so every C#
recording - all of which were taken at heat zero, because `Army.Heat` was
written and never assigned by anything - compares exactly as it did before
this letter. a13's comparison stands untouched and did not need re-taking.

  what changed, and only above heat zero
    tank reach at full heat   34 x 1.4 = 81.6 m  ->  34 x 1.3 = 44.2 m
    outrank                   2.5                ->  0.5
    shell                     x1.6               ->  x1.22
    rifle reach               x0.8               ->  x0.2

There is no recording to compare full heat against - the C# never ran a heat
path at all - so a16's numbers come from the core's own rail sims: 55/150 =
36.7% delivered on the seam, 105/150 = 70% on the rim, and a seam run scoring
a mean 629 against the rim's mean 4.

TWO THINGS NAMED, NOT PARKED:

  - the spectate gate has NO automated test. It is a drawn rule and the only
    evidence is the live photograph. Pinning it needs a rendered frame, which
    this machine cannot produce - the same missing graphics device that keeps
    `VisibilityTests.RoadsAreActuallyDrawn` red under -nographics. A helper
    that asserted the gate's own boolean would prove nothing about the order
    of the draw calls, which is what a regression would break, so none was
    written.
  - `LoadoutPanel` draws its own IMGUI and is not gated on the spectator. It
    opens on `TruckHealth.Respawned`, and spectate does not stop the world:
    the truck still stands in the depot while the war runs. If it were written
    off during a spectate the ramp would open over the price-only view. Not
    observed in 60 s of spectating, and unlikely because an empty bed is heat
    zero and the tank reach at heat zero is the base 34 m while the depot is
    far from the front. Listed so it is not rediscovered as a fault rather
    than guarded against on a case nobody has seen.


## 2026-09-07 14:20  M2.1 slice A: the client signs a state hash and a node stores it

Everything under this was already built and none of it had ever been driven
from the player's side. Measured before writing anything:

  the hashing bridge is COMPLETE, end to end, and was already there
    packages/core/src/state.js   hash(st)
    tools/bundle.js              exports it as `hash`
    blwp.jslib                   BlwpStateHash(ptr, cap), ASCII hex out
    BlwpCore.cs                  StateHash()
  the node side is complete too
    checkpoints table keyed (round, entry, tick), round.checkpoint(bytes) on
    /play, GET /checkpoints, equivocation / chain head / monotonic tick / the
    named input chain each refused by name, signature verified under the
    entry contract's sessionPubkey
  what did not exist
    anything that BUILDS a checkpoint - `encodeCheckpoint` was called by
    tests and by nothing else - and Unity does not talk to a node at all: no
    script mentions blwp-node, /play or /round.

So the missing piece was exactly the client half, and that is this slice.

WHERE IT LIVES, and why not in C#. `packages/blwp-client`, JS, using
`@blwp/protocol` as the one encoder. Re-encoding a checkpoint in C# would put
a money-bearing wire format into two implementations, which is the fault this
project has removed twice this week - a second score formula and a second
army. There is no second encoder here and there must never be one.

The core and the signing function are INJECTED rather than imported. In a
browser the core is the bundle already running in the page - the object the
game is drawing from - and the session key belongs to the run. Importing
either would give the client an opinion about which core the player runs,
which is the one thing it must not have.

THE ONE CONVERSION, and it was a real seam rather than a formality: the core
answers in HEX - `hash(st)` returns 64 characters and the jslib writes those
same characters as ASCII - while the protocol's field is 32 raw bytes. Found
by running it: `Error: expected 32 bytes, got 64`. `fromHex` is the protocol's
own, and a core that answered anything else is refused by name rather than
silently truncated into a mark that signs cleanly and commits to the wrong
state.

MEASURED against a real node process on a real port, with a real core:

  happy path      round opened over HTTP, the id equals roundId(contract);
                  entry joined, the id equals entryId(contract); a core driven
                  120 ticks at 0.7 throttle; its hash signed and sent on /play
                  -> "stored". GET /checkpoints answers x-checkpoints: 1, 231
                  bytes, and the decoded record's id is the one the client
                  signed, its tick is 120, its previousHash is the 32 zero
                  bytes, its inputChainHash is the genesis, its stateHash is
                  the hash the core produced, and its signature verifies under
                  the session key in the entry contract.
  equivocation    the same tick with a state reached by reversing instead:
                  "error equivocation at tick 60: <id> already stored, now
                  <id>", both ids named, and the store still holds one.
  the chain       a mark chaining to the start of the round after the head has
                  moved: "error the checkpoint does not follow the chain head".
  the head        a refused mark must not move the client's head, or every
                  later mark is refused for a reason that has nothing to do
                  with it. A tick going backwards is refused - "error expected
                  a tick after 60, got 30" - and the next mark still lands and
                  names the stored one as its parent.

MUTANTS, three, and the second one caught a hole in my own test:
  a constant hash instead of the core's        2 tests red, "the hash on the
                                               wire is not the hash the core
                                               produced"
  the head moves even on a refusal             SURVIVED at first. The test
                                               sent the refused mark AROUND
                                               the client, on the raw socket,
                                               so the client was never asked
                                               to make it and its head was
                                               never touched. Rewritten to go
                                               THROUGH the client; the mutant
                                               then goes red.
  signing the raw encoding, not the tagged id  all 4 red, the node refusing
                                               the signature

SUITES, each on its own:
  packages/core        80 / 80        determinism guard 19 files clean
  packages/protocol    78 / 78        money guard        7 files clean
  packages/blwp-node   33 / 33
  packages/blwp-client  4 / 4         new
  Unity  untouched - `git status` shows no changed file under unity-proto, so
  PlayMode stays 213 / 188 / 12 / 13 and EditMode 178 / 174 / 1 / 3 from the
  run at eebba50. Nothing was built and nothing was deployed.

The money guard does not cover this file and was not extended to reach it:
its stated rule selects files that move a stake or carry Q16.16 words into the
core, and this one carries a hash, two ids and a tick. Naming that here rather
than widening a shared tool inside a slice that is about something else.

AUDIT OF SLICE A, and it found one hole in the slice itself.

THE HOLE: the client took the round and entry ids ON THE NODE'S WORD. It
posted the contract and returned whatever bytes came back. An id here is the
tagged hash of a contract the CLIENT wrote, so the client can compute it and
has no reason to be told it - and a node is not trusted in this protocol, which
is the whole premise. Taking the answer would file every mark of the round
under an id the player cannot show belongs to their own contract.

  fixed: `openRound` and `join` compute `roundId(contract)` / `entryId(entry)`
  themselves and read the node's answer as AGREEMENT. A different answer is a
  disagreement about which round this is, named in full:
    "the node calls this round <what it said>, and its contract hashes to <id>"
  tested against a stub that answers 201 with the wrong thirty-two bytes,
  because a real node cannot be made to lie without changing it.
  mutant: taking the answer back -> that test red. 5 tests now, not 4.

CHECKED AND FOUND CLOSED ALREADY, so it is not left as a suspicion: a
non-integer tick cannot reach the wire. `encode.js`'s `u32` is
`Number.isInteger(v) || throw`, measured directly - `encodeCheckpoint` with
tick 60.7 answers "u32 out of range: 60.7". Nothing needed adding for it.

NAMED AND OUT OF THIS SLICE, deliberately:
  - the client's chain head lives in memory only. A client that reconnects
    mid-round starts at NO_PREVIOUS and its first mark is refused for the
    chain head. Reading the head back off `GET /checkpoints` is reconnection
    work and belongs with the game sending marks for real, not here.
  - the money guard still does not reach this package. Its rule selects files
    that move a stake or carry Q16.16 words; this one carries a hash, two ids
    and a tick, and widening a shared tool inside this slice was refused.

SUITES after the fix, each on its own:
  packages/core        80 / 80    determinism guard 19 files clean
  packages/protocol    78 / 78    money guard        7 files clean
  packages/blwp-node   33 / 33
  packages/blwp-client  5 / 5
  Unity untouched - no changed file under unity-proto - so PlayMode stays
  213 / 188 / 12 / 13 and EditMode 178 / 174 / 1 / 3.

NOT DEPLOYABLE AND NOTHING TO DEPLOY: no Unity file changed, so the artefact
would be byte-identical to the one already live. The daily is still the last
good playable, checked rather than assumed: wasm md5
59ea55f8cdddca795e1a8e768b956723, build 0.0.567 from 752e4b1, and
btc-logistics-war.pages.dev untouched at HTTP 200.


## 2026-09-07 15:10  M2.1 receipts: the node answers a mark with a signed receipt

THE DEPENDENCY THAT WAS NOT ONE. `receipt.js` and PRIORITIES both said
receipts wait on step 5b, "because a node signs with its own key and the
daemon has no identity yet". Measured, that was an accurate description of the
state - `grep` for pubkey/secretKey/identity across `blwp-node/src` returned
nothing - but not of the dependency. 5b is DISCOVERY: BOND_MARKER and the
advertisement in the bond transaction's witness, so a stranger can find a
node's address and key on chain. Issuing a receipt needs a keypair the node
holds and a key the client already has, and the client already has it: the
Round Contract carries `nodes`, a sorted vector of 32-byte keys, and the client
wrote that contract. Accepted by Daniel before any code was written.

WHAT CHANGED, in three places.

  the store    one row, `identity`, with a CHECK that keeps it one. A daemon
               with two identities would sign some receipts with each and a
               client checking them against the committee would be right to
               refuse half. Read on the first ask, generated if absent.
  the node     `receiptFor(id)`: made once, stored keyed by the checkpoint it
               answers, and re-served ever after. The reply to a checkpoint is
               that receipt instead of 'stored'/'repeat'. Batches are
               untouched and still answer a count - the first byte of a binary
               answer says which kind it is, the same way the request does.
  the client   `readReceipt` checks three things and names each failure on its
               own, and the chain head moves on a verified receipt rather than
               on a word it had not checked.

WHY A REPEAT MUST GET THE SAME RECEIPT, and it is not tidiness. Section 10's
claim is that the player committed to that state at approximately that real
time. A re-sent mark answered with a fresh `receivedAtMs` would hand the
player two times for one commitment, and re-sending is exactly what a client
does when it never learned the first one landed. The store makes it true;
without it the mutant below passes.

MEASURED, before and after:

  the answer to a checkpoint    'stored' / 'repeat'  ->  139 bytes, first byte
                                10, a signed CheckpointReceipt
  a repeat                      the word 'repeat'    ->  the same 139 bytes,
                                the same receivedAtMs
  the node's identity           none at all          ->  32-byte pubkey, the
                                same after reopening the same store file, and
                                different for a different file
  the client's head moved on    the string 'stored'  ->  a receipt whose mark,
                                key and signature it checked

  suites   blwp-node   33 -> 34      blwp-client   5 -> 7
           core        80 -> 80      protocol     78 -> 78   (both untouched)

ONE THING FOUND BY RUNNING IT, not by reading: Node's WebSocket hands a binary
frame back as a Blob unless `binaryType` is set, and `new Uint8Array(blob)` is
silently EMPTY rather than an error. The receipt came back as a 139-byte Blob
and read as a zero-length array; the assertion failed, the socket was left
open, and the whole node suite HUNG rather than reporting. Both the client and
the test harness ask for an arraybuffer now, and the probe that found it is in
the scratchpad.

MUTANTS, four, each killing exactly one test:
  the receipt's mark is not checked        red: "the receipt is for 7777..."
  any key is accepted, not the committee's red: "is not on this round's
                                           committee"
  the signature is not verified            red: "does not verify under its
                                           own key"
  a repeat gets a fresh receipt            red in BOTH suites: the client's
                                           repeat test and the node's

TESTS TOUCHED RATHER THAN LOOSENED: six node tests asserted the words 'stored'
and 'repeat'. The rule changed by decision, so they assert the new rule -
each now decodes the receipt, recomputes its id and verifies the signature
under the key the node publishes. Two of them then failed for a fault of MINE:
`send` advances the chain, so asking `make` for the same mark afterwards built
a different one chained onto itself. The rig keeps the mark it sent.

Unity untouched, nothing built, nothing deployed. The daily is still 0.0.567
from 752e4b1.


## 2026-09-07 16:05  M2.1 receipts: recoverable after a reconnect, and gossiped between nodes

THE HOLE FLAGGED LAST TURN, closed first. A client can recompute every mark it
ever sent - it built them - but it cannot rebuild a signature over one. Until
`GET /receipts` existed, a dropped socket lost them for good, and a receipt
that cannot be recovered is not evidence of anything later.

  GET /receipts?round=&entry=   fixed-size records back to back, the same
                                shape /checkpoints comes back in, in tick
                                order and then by signer, with x-receipts
                                naming the count
  the client                    `recoverReceipts` verifies every one against
                                the committee in the contract it holds, and
                                refuses three ways by name: a signer off the
                                committee, a signature that does not verify,
                                and a body that is not a whole number of
                                139-byte receipts

GOSSIP, on the socket that was already there. A receipt arriving on /play is
recognised by its first byte, the same way a mark is, so gossip needed no
second port and no envelope. A peer's receipt is kept only after the same
three checks the client makes - and the committee is read off the ROUND
CONTRACT this node already stores, never off the message. A member
contradicting itself on one mark is refused by name rather than stored beside
its first answer.

  the receipts table  keyed (checkpoint_id) -> (checkpoint_id, node_pubkey),
                      because 13C wants a mark to be able to carry one from
                      every member, and a second, different one from the SAME
                      member is a node contradicting itself

QUORUM, counted and not decided. Section 13C: the canonical transcript is the
longest chain carrying receipts from at least five committee nodes.
`receiptCount` answers how many DIFFERENT members have receipted a mark. A
seven-member round was measured going 1 -> 5 -> 7 as members' receipts arrived.
Whether a count is enough, and what the no-quorum rule does, needs the other
six daemons to exist; it is written as the next sub-item rather than invented.

MEASURED ACROSS TWO REAL NODE PROCESSES, on two ports:

  before   a receipt existed only in the reply to the mark that made it. A
           reconnect lost it; no second node could hold it; receiptCount did
           not exist.
  after    mark receipted on node one; the same mark sent to node two, which
           receipts it itself; node one's receipt offered to node two on its
           /play socket and answered 'held'; node two then holds 2 for that
           mark, and a fresh client recovers both from node two with the
           gossiped one byte-identical to what node one issued.

  suites   blwp-node   34 -> 37      blwp-client   7 -> 10
           core        80 -> 80      protocol     78 -> 78   (both untouched)
           determinism guard 19 clean, money guard 7 clean

MUTANTS, four, and the fourth found a test that was not testing:
  gossip skips the signature                   node red
  gossip accepts a key off the committee       node red
  a peer contradicting itself is stored anyway node red
  recovery does not verify what it fetched     SURVIVED. Everything it
                                               recovered was genuine, because
                                               a real node cannot be made to
                                               serve a bad receipt. A stub
                                               that serves a forged one, a
                                               stranger's, and a truncated
                                               body was added; the mutant then
                                               goes red.

Unity untouched, nothing built, nothing deployed. The daily is still 0.0.567
from 752e4b1, and btc-logistics-war.pages.dev was not approached.


## 2026-09-07 16:50  M2.1 batch resume: a dropped socket costs a client nothing

MEASURED FIRST, on a running node, before anything was written. Two batches of
200 ticks published and the socket dropped:

  GET /transcript    200   8287 bytes   x-ticks=400
                     decodes to 2 batches, chain ok, so the next due tick is
                     400 and the head is 269dc1b9...
  GET /checkpoints   200      0 bytes   x-checkpoints=0
  GET /receipts      200      0 bytes   x-receipts=0

So the DOOR was already there - `/transcript` has served the batches since
step 2 - and nothing in the client asked for it or checked a byte of it. And
the larger finding: THE CLIENT COULD NOT SEND A BATCH AT ALL. Only tests did,
raw over the socket. "The batches the client already sent" was a thing that
had never happened.

WHAT THE SPEC ASKS FOR, and it is not what the phrase suggests. Section 11
hash-chains the inputs and leaves publishing to the client; IMPLEMENTATION.md
is blunter - "the daemon never requests retransmission: publishing is the
client's duty, and unpublished inputs cost the player the run". So a
reconnecting client does not want its batches BACK. It has them. It wants the
two numbers that let it carry on: the tick the node is owed next, and the head
to hang the next batch off. No new door was invented for that.

  the client   `batch(ticks, ...)` builds an InputBatch from its own head and
               next tick, sends it, and moves neither unless the node answers
               a count - the same rule the marks follow.
  `resume`     reads the transcript, refuses to take it, and returns the tick
               owed and BOTH chain heads.

AND NO SIGNATURE IS INVENTED. An `InputBatch` carries none in this protocol -
the chain hash is its integrity - so the checks that apply are that the
transcript is for the round and entry this client asked about, that the chain
is unbroken, and that the records are whole. Each refused by name.

THE OTHER CHAIN, resumed with it. A client's mark head is lost by the same
dropped socket, and a resume that left it at the start of the round would look
fixed until the first checkpoint after it, which would then be refused for not
following the head. `resume` reads it off `/checkpoints`, which was already
there too.

BEFORE AND AFTER, measured end to end:

  before   a fresh client owed the round from tick 0 and had no head. Its
           first batch after a reconnect would have been refused for a gap and
           its first mark for the chain head.
  after    resume: 2 batches, 400 ticks, next tick 400, batch head equal to the
           one the first client published, mark head equal to the mark it
           published, 1 receipt recovered - and the reconnected client's next
           batch (200 accepted) and next mark ('receipted') both land.

  suites   blwp-client  10 -> 13
           blwp-node    37 -> 37   core 80 -> 80   protocol 78 -> 78
           all three untouched; determinism guard 19 clean, money guard 7 clean

MUTANTS, five, each killing exactly one test:
  resume does not check the chain            red
  resume takes a transcript for another round red
  the batch chain moves on a refusal          red
  resume forgets the mark chain head          red
  resume ignores where the ticks got to       red

A real node will not serve a broken transcript, so the first two are driven by
a stub - the same shape as the forged-receipt stub - or the mutants would have
survived on honest data.

Unity untouched, nothing built, nothing deployed. The daily is still 0.0.567
from 752e4b1.


## 2026-09-07 15:10  M2.1 step B: the game opens a session and its marks come back receipted

MEASURED FIRST. The jslib exported 16 functions and every one was the core -
init, step, read state, hash, score, ground, solids, restart, teleport,
impact, params, liquidation, heat, frontline, surface, words - matched one for
one by 16 DllImports. Nothing in `unity-proto/Assets/Scripts` mentioned
blwp-node, /play, a round or a checkpoint. Step B was entirely new plumbing.

THE CLIENT IN THE PAGE. `packages/blwp-client/tools/bundle.js` is the same
smallest-possible bundler the core uses, for the reason that file records: a
bundler in the trust path is a bad property for something that pins money.
55.4 KB from 11 modules, and it carries NO crypto - signing and verifying are
injected - so it is the protocol's encoding plus the client's rules and
nothing else. `bundle.test.js` holds it to the modules: same round and entry
ids, the same signed mark byte for byte over a core driven 120 ticks, the same
words when refusing a short receipt. A one-tick drift planted in the bundle
turns it red.

Signing is awaited now, so the browser's own Ed25519 through `crypto.subtle`
can be used rather than vendoring a curve into the page. A synchronous signer
still works exactly as before.

THE SESSION KEY lives in the page, made by `crypto.subtle.generateKey`,
non-extractable, and never crosses the bridge - Unity cannot read it and has
no use for it. It is ephemeral and lasts exactly the run, which is what the
protocol asks of a session key: the long-term entry key signs once, at the
entry, and never again per mark. A page RELOAD therefore ends the ability to
sign for that entry, which is a consequence worth naming rather than hiding -
a reload is not a socket drop, and nothing in this slice claims to survive one.

THE INPUTS ARE TAKEN WHERE THE CORE IS STEPPED, inside `BlwpStep`, not from a
copy Unity keeps. A transcript has to be the inputs the core actually stepped
on; two records of one thing is how they start to differ, and a verifier
replaying the wrong one lands somewhere else with nothing to say it went
wrong.

THE CADENCE is the spec's, written as arithmetic rather than as two numbers:
`IMPLEMENTATION.md` puts INPUT_BATCH at 10 Hz and CHECKPOINT at 1 Hz, the core
runs at 60 ticks a second, so every 6 ticks and every 60.

MEASURED END TO END, with nothing deployed: a real blwp-node on a real port,
the real built player served over HTTP, and a real browser pressing PLAY.

  before                       rounds 0  entries 0  batches 0  marks 0  receipts 0
  first attempt                rounds 1  entries 0  ...  and "[blwp] session:
                               Failed to fetch". The round was created and the
                               ANSWER was unreadable: the daemon sent no CORS
                               headers, and a browser is always on another
                               origin. There is nothing for an origin check to
                               protect here - every write is authorised by a
                               signature over a tagged hash and there are no
                               cookies - so the headers are sent, including
                               the x- counts a client reads answers out of.
  with CORS                    rounds 1  entries 1  batches 75  marks 20  receipts 20
                               75 batches is 450 ticks against 20 marks, which
                               is 1200 ticks seen: two thirds of the inputs
                               were refused and thrown away. Both chains hang
                               off state the client updates when an answer
                               returns, and two publishes in flight build the
                               second from state the first has not finished
                               moving. Serialised through one queue.
  after                        rounds 1  entries 1  batches 118  marks 11  receipts 11
                               x-ticks 708, and 118 x 6 = 708 - nothing lost.
                               Mark ticks 60, 120, 180, 240, 300, 360, 420,
                               480, 540, 600, 660: the 1 Hz cadence exactly.
                               transcript hash c207f484c49d7df7...

  A queued mark hashes the state AT THE TICK IT NAMES, not when the queue
  reaches it, or a checkpoint would commit to a world a few frames later than
  the tick it claims.

TESTS. EditMode 178 -> 185 (7 new, `NetSessionTests`), 181 green, 1 red - the
known CombatFx one. PlayMode 213 / 189 / 11 / 13, the known eleven, nothing
new. core 80/80 with the determinism guard 19 clean, protocol 78/78 with the
money guard 7 clean, blwp-node 37/37, blwp-client 13 -> 17.

The session is OFF unless the page names a node and a round. No build that has
shipped names either, so the daily is exactly the game it was. Nothing was
deployed and the daily is still 0.0.567 from 752e4b1.


## 2026-09-07 15:40  M2.1 step B: the socket drops and the run carries on

The hole named when the happy path landed: the resume path existed in the
client and nothing in the page reconnected or called it.

  the client   tells its owner when the socket goes, and answers everything in
               flight by name first - "error the socket closed". A publish
               that never settles stops the queue behind it for the rest of the
               run. `send` on a dead socket answers rather than throwing, in
               the same shape a refusal takes, so a caller that already handles
               "the node said no" handles this too.
  the page     reconnects on a new socket and asks where the node got to, then
               carries on. No new protocol: `connect` and `resume` are the ones
               that were already there.

AND THE TICKS ARE KEPT WHILE IT IS DOWN. They used to be dropped on the floor
when the state was not ready, which would leave a hole in the chain - and the
node refuses a gap at intake, where a client can still fix it, so the run would
have ended at that hole with every input after it unusable. They pile up and go
out in order from the tick the node says it is owed. A refused batch is put
back in front of whatever arrived since, for the same reason.

MEASURED END TO END, the same way as the happy path - real node, the real built
player over HTTP, a real browser - with the drop done from the NODE's side,
`sock.terminate()` on every /play connection, which is what a network going
away looks like to the page:

  before the drop   rounds 1  entries 1  batches 119  marks 11  receipts 11
  the page said     "[blwp] resumed at tick 773, 119 batches and 11 receipts
                    behind us"
  after             rounds 1  entries 1  batches 133  marks 12  receipts 12
                    x-ticks 1367, transcript hash eb514b3437165b7e...
                    mark ticks 120, 180 ... 720, then 1320

The node accepts no gap, so the transcript reaching 1367 contiguous ticks IS
the proof that nothing was lost across the drop. The mark chain continued too:
the twelfth mark, at tick 1320, chains onto the eleventh at 720 and came back
receipted. No mark was taken while the socket was down, which is right - a
commitment nobody can receipt is not evidence of anything.

TESTS. blwp-client 17 -> 19, two new: everything in flight is answered when the
socket goes and the owner is told; and a client that reconnects on the same
round carries on, both chains read back and the next batch and mark accepted.
blwp-node 37/37, core 80/80 with the determinism guard 19 clean, protocol 78/78
with the money guard 7 clean. PlayMode 213 / 189 green / 11 red / 13 skipped
and EditMode 185 / 181 green / 1 red / 3 skipped, both unchanged - no C#
changed in this piece, only the jslib and the client.

Page reload is deliberately NOT handled: a session key lasts the run, a reload
is not a socket drop, and no persistence was added for it.

STEP B, THE TABLE, kept here rather than in the working list:

  happy path      before   rounds 0  entries 0  batches 0    marks 0   receipts 0
                  after    rounds 1  entries 1  batches 118  marks 11  receipts 11
                           x-ticks 708, 118 x 6 = 708, nothing lost
                           mark ticks 60, 120, 180 ... 660, the 1 Hz cadence
  a dropped socket, terminated from the node's side
                  before   batches 119  marks 11  receipts 11
                  the page "resumed at tick 773, 119 batches and 11 receipts
                           behind us"
                  after    batches 133  marks 12  receipts 12, x-ticks 1367
                           mark ticks 120, 180 ... 720, then 1320

THE THREE LEFTOVERS, named when B closed and not done in it:
  - a reconnect is attempted ONCE. A node still down when it retries leaves
    the session in `error` and nothing tries again.
  - the held ticks grow without limit while the socket is down. Nothing
    watches `bufferedAmount` either, which is IMPLEMENTATION.md's own note:
    "`ws` buffers without limit... above a threshold drop ghost frames first -
    they are non-authoritative by definition - and never receipts."
  - a page RELOAD ends the run's ability to sign, because the session key
    lasts the run by design. Not a socket drop, and deliberately not handled.


## 2026-09-07 16:30  M2.1 backpressure: a node can go away and the run comes back

WHAT EACH HOLE COST, measured before writing anything.

  the tick rate on this machine   649 batches x 6 = 3894 ticks in about 90 s,
                                  so ~43 ticks a second headless; 60 in a real
                                  browser
  a tick on the wire              5 int32 words = 20 bytes
  the node's caps                 a batch may not exceed the round's own
                                  blockTicks (9000 in the test contract), and
                                  MAX_INPUT_BATCH_BYTES is 1,835,087 which is
                                  also MAX_FRAME_BYTES

  HOLE 1, one reconnect only.  `net.tick` returned early for `error`, so the
  moment that single attempt failed the session was finished: no tick and no
  mark published again, and nothing tried again. Cost: ALL of the remaining
  run, triggered by a blip of any length that happens to land while the node
  is restarting. This is the likely one.

  HOLE 2, the hold grows.  It grows at 20 bytes a tick, so ~1.2 KB/s at 60 Hz,
  and it is bounded by the round - 9000 ticks is 180 KB - so memory was never
  the danger. The danger is the WALL: past 9000 held ticks the drain is one
  batch longer than the round allows, refused by name, put back, and re-sent
  for ever. That is about 150 seconds of outage at 60 Hz, and after it the run
  is stuck even when the network returns. Less likely, but unrecoverable.

WHAT WAS DONE, three things and each of them the spec's own words:
  - reconnect keeps trying, backing off 1, 2, 4, 8 seconds, until the run ends.
  - a drain is chunked at 600 ticks, never more than the round's blockTicks, so
    a long outage leaves as several ordinary batches instead of one the node is
    bound to refuse.
  - `bufferedAmount` is watched before queueing, IMPLEMENTATION.md: "ws buffers
    without limit... above a threshold drop ghost frames first and never
    receipts". There are no ghost frames yet, so the half that applies is: do
    not add to a socket already backed up; the ticks stay held.

MEASURED THE SAME WAY B WAS - real node, the real built player over HTTP, a
real browser - with the node taken away ENTIRELY for 25 seconds, not just the
socket terminated:

  playing            batches 119  marks 11  receipts 11
  node down          batches 119  marks 11  receipts 11   (nothing published,
                     which is right - there is nobody to publish to)
  node back, same port and same store
  the page said      "resumed at tick 773 after 4 try(s), 119 batches and 11
                     behind us"
  after              batches 140  marks 13  receipts 13
                     x-ticks 1628, transcript hash d00c13f0309ec82b...
                     mark ticks 120, 180 ... 720, then 1560, 1620

Four retries is the backoff working: 1 + 2 + 4 + 8 covers the 25 seconds the
node was gone. Before this the first try would have failed and the session
would have read `error` for the rest of the round. The transcript reaching
1628 contiguous ticks is the proof the backlog drained in order - the node
accepts no gap - and the 21 batches after the return are the chunked drain.

AND THE NODE CAN NOW BE CLOSED. `close()` waited on `http.close`, which waits
for open connections to end, and a play socket does not end on its own: the
harness hung and the page kept publishing to a server that was supposed to be
gone. It terminates its sockets first now. That is also what made a suite run
hang for three hours earlier today - a test waiting on an answer from a socket
that had gone quiet, with no timeout on the runner.

TESTS. core 80/80 with the determinism guard 19 clean, protocol 78/78 with the
money guard 7 clean, blwp-node 37/37, blwp-client 19/19. No C# changed in this
piece - the jslib and the node's server only - so PlayMode stays 213 / 189
green / 11 red / 13 skipped and EditMode 185 / 181 green / 1 red / 3 skipped
from the run at 7b4caea.


## 2026-09-07 17:20  M2.1 backpressure: the hold is bounded and one publish is in flight

WHAT THE PATH ACTUALLY DID, read before changing it. `net.publish` sliced a
chunk off the hold and appended a link to a promise chain on every sixth tick
whether or not the one before had finished, and `net.mark` did the same every
sixtieth. So a slow node grew a QUEUE OF LINKS, one per six ticks, each holding
its words - and the `bufferedAmount` check added earlier sat INSIDE a link,
which defers work without bounding anything. The hold was not the unbounded
thing; the queue was, and nothing counted it.

It also lived in the jslib, which is the one place in this project that cannot
be tested. So the rules moved into `@blwp/client`, where they are measured
against a real node, and the page and the tests now run one set of rules rather
than two that look alike.

THE THREE RULES, and none of the bounds is invented:

  the hold is bounded by the ROUND. `blockTicks` is the round's own length off
  its contract; inputs for more ticks than the round HAS are inputs for a round
  that is over, and the node already refuses a batch longer than it. Past the
  bound a tick is COUNTED, not silently dropped - `dropped` is what makes a
  stall visible.

  one publish in flight, so there is no queue to grow. What is not sent yet is
  still held, where it is counted.

  a mark is skipped rather than queued. Ticks are the transcript and must not
  be lost - unpublished inputs cannot be replayed and cost the player the run -
  but a checkpoint says where the world was AT A TICK, and one that could not
  go out while its moment passed is not that moment. Skipping is also what
  stops a slow link turning into a flood of marks the instant it clears.
  `marksSkipped` counts them.

MEASURED against a real node with a deliberately slow LINK (the node and the
client share one event loop, so a slow handler would stall the client too and
measure nothing):

  the hold           1800 ticks offered into a 600-tick round
                     before: it would have kept all 1800
                     after:  held 600, dropped 1200, counted
  two in flight      600 ticks at 40 ms a message
                     before: a link per six ticks, unbounded
                     after:  worst concurrent publishes 1
  a flood of marks   six marks due while one is going, 60 ms a message
                     before: six queued and sent when the link cleared
                     after:  1 sent, 5 skipped and counted

  mutants: unbound the hold, allow two publishes, queue the marks - each turns
  exactly one of the three red.

AND END TO END, the same node-down cycle as before, with the client's rules
now driving the page:

  playing            batches 102  marks 18  receipts 18
  node down          batches 102  marks 18  receipts 18
  the page said      "resumed at tick 1018 after 5 try(s), 102 batches and 18
                     behind us"
  after              batches 106  marks 19  receipts 19, x-ticks 1534
                     mark ticks 60, 120 ... 1080, then 1560

18 marks by the drop where the old shape managed 11 over a longer run: the
cadence holds now because nothing is queued behind a slow answer. 1534
contiguous ticks is the proof the backlog drained in order, since the node
accepts no gap.

A STALL IS NOT AN ESCAPE HATCH, and it is worth saying why plainly: what a
stalling player achieves is an unpublished transcript, and section 11 is
explicit that a transcript whose inputs were never published cannot be replayed
and therefore cannot be finalized as a win. Withholding is never an advantage.
The counts - `dropped`, `marksSkipped`, `drops`, `tries` - are on the status
line so a stall is visible rather than silent.

TESTS. blwp-client 19 -> 22, three new in `backpressure.test.js`. blwp-node
37/37, core 80/80 with the determinism guard 19 clean, protocol 78/78 with the
money guard 7 clean. No C# changed - the jslib, the client and the node's
server only - so PlayMode stays 213 / 189 green / 11 red / 13 skipped and
EditMode 185 / 181 green / 1 red / 3 skipped from the run at 7b4caea.

TWO THINGS NAMED ON THIS PATH, one accepted as untested and one that is a hole.

  `bufferedAmount` IS UNTESTED, and deliberately. The guard is in `drain` and
  a real node cannot produce a socket that reports a backed-up buffer without
  faking the socket - the node answers as fast as the loopback allows, and the
  buffer never fills. Daniel's pick: leave it, do not open a fake-socket hunt.
  The backpressure that is measured is the hold, the single flight and the
  skip-not-queue rule; this guard is a second line behind those three.

  A DROPPED TICK MISLABELS THE TRANSCRIPT. Read off the code rather than
  measured, and it is a code fact rather than a suspicion:

    `Client.batch` numbers a batch `firstTick: this.nextTick`, and `nextTick`
    advances by `ticks.length` on acceptance - a COUNT of published ticks.
    `record` drops a tick when the hold is full and counts it.
    The page gives a mark the REAL tick, `net.seen`.

  So the moment `dropped` is not zero the two clocks part. The batch chain goes
  on numbering 600, 601, 602 while those words are the inputs from tick 1800
  onwards, and a mark says 1800 while the transcript it names has only reached
  600. A verifier replaying that transcript lands in a different world from the
  one the player was in, which is the one thing the money law does not allow -
  identical inputs must produce identical results.

  WHEN IT TRIGGERS: only once the hold has filled, which takes an outage as
  long as the whole round - 9000 ticks is 150 s at 60 Hz. By then the run
  cannot be completed. So the share of runs reaching it is small; what makes it
  worth fixing is the SHAPE of the failure. A run that is over should look
  over; this one keeps publishing a stream that reads as a valid transcript and
  is not one.

  THE FIX IS NOT A BOUND, it is an ending: once a tick has been dropped the
  session should stop publishing and say the run is lost, rather than carry on
  with a mislabelled chain. That is a decision about what a client does when it
  can no longer be honest, so it is named here rather than taken.


## 2026-09-07 18:05  M2.1: a dropped tick ends the run instead of minting a false transcript

Daniel's pick, and the reasoning is his: BLWP needs a transcript independent
nodes can replay and agree on. Relabelling batches from the real tick would
still emit a stream that looks like a valid transcript with a hole in it.
Honesty is the client's job - one that can no longer produce a contiguous input
tape must say so and stop.

THE ENDING IS VOID. Not DELIVERED, because nothing was. Not PLAYER_LOST, which
would claim a completed simulation nobody has. A slow node filling the hold
must not become a house win, and a player cannot use it as a way out either:
the answer is the same whoever caused it, because an incomplete tape can be
neither a win nor a certified loss.

  on the first dropped tick   publishing freezes, the socket is closed, the run
                              is VOID with a reason that names the tick
  nextTick never moves        for a tick that was not published - it only ever
                              advanced on an accepted batch, and it does not
                              advance now either
  a second line               `nextTick + held` must equal `offered` before any
                              batch leaves. Every tick a client accepts is
                              either published or still held; if those part, a
                              batch would name ticks it does not carry, and it
                              does not go
  a reconnect is untouched    `resume` reconciles `offered` with the tick the
                              node is owed, so carrying on after a dropped
                              SOCKET does not read as a dropped TICK

MEASURED on the hold-full path, a 600-tick round, printed rather than
described:

  published a round    batches 1  nextTick 600  held   0  offered  600  dropped 0  marks 1  ending -
  hold full, +1 tick   batches 1  nextTick 600  held 600  offered 1201  dropped 1  marks 1  ending VOID
  asked to publish     batches 1  nextTick 600  held 600  offered 1201  dropped 1  marks 1  ending VOID
  reason: "a tick was dropped at 1201: the hold was full at 600, so no
           transcript from here can be replayed"
  what a verifier can fetch afterwards: x-ticks 600, marks 1

  Before this the same sequence would have gone on publishing: the batch chain
  would have numbered 600, 601, 602 while carrying the inputs from tick 1201
  onward, and the marks would have said 1800 - a plausible-but-wrong tape. Now
  the publish count is frozen at 1, the tick numbering at 600, and what the
  node can hand a verifier is exactly the part that was honest.

MUTANTS, four, and the second found a test that was not testing:
  a dropped tick only counts                    2 red
  publishing is not frozen after the end        SURVIVED. On the dropped-tick
                                                path the run ends AND the
                                                numbers part in the same
                                                instant, so `drain` refused for
                                                the second reason whether or
                                                not it looked at the first. A
                                                case where the run has ended
                                                and the counts still agree
                                                tells them apart; the mutant
                                                then goes red.
  the numbers are not checked before a batch    1 red
  the ending is a player defeat                 3 red

TESTS. blwp-client 22 -> 26, four new. blwp-node 37/37, core 80/80 with the
determinism guard 19 clean, protocol 78/78 with the money guard 7 clean. No C#
changed - the client, its bundle and the template copy - so PlayMode stays
213 / 189 green / 11 red / 13 skipped and EditMode 185 / 181 green / 1 red / 3
skipped from the run at 7b4caea.

Still parked by decision: `bufferedAmount` known-untested, and the session key
lasting the run so a page reload ends it.

A RELOAD IS AN ESCAPE HATCH, AND IT IS LISTED RATHER THAN PARKED.

Asked whether reload-as-VOID lets the operator profit. It does not - it is the
other direction, and that is worse for the pool than for the house.

  the key lasts the run, so a reload ends the ability to sign for that entry.
  The transcript stops wherever it stopped. Section 11 says a transcript whose
  inputs were never published cannot be replayed and cannot be finalized as a
  win, so a reload can never MAKE a player win.
  But it can unmake a loss. A player who is doing badly, sixty seconds into a
  round, presses F5. There is now no complete tape, and if a partial tape
  settles to VOID with a refund then the reload is a free undo: the stake comes
  back, and every honest entrant's pool is the poorer for it.

The operator is not the winner here and neither is the player exactly - what is
broken is that a run can be abandoned at no cost. Where it is decided is not
this letter: it is the settlement rule for a partial tape, which is section 13C
territory (no quorum, VOID and refund) and needs the committee that does not
exist yet.

WHAT WOULD CLOSE IT, named so it is not rediscovered: a partial tape must not
settle to a refund by default. Either the entry forfeits after the challenge
window when no complete transcript was published, or the session key survives a
reload so the run can be resumed and the tape completed. Those are opposite
answers and only one of them can be right; the first keeps the key ephemeral as
the spec asks, the second contradicts it.

Not a hole in backpressure, and not fixable inside M2.1's client: a client
cannot decide what its own abandonment is worth. Listed here so the settlement
work inherits it rather than meets it.


## 2026-09-07 18:50  M2.1 step 4: a node stores nothing for a round nobody funded

MEASURED FIRST, on a real file-backed node, because "it costs disk" is a claim
and not a number:

  an empty node          4096 bytes   rounds 0    entries 0
  200 unfunded opens     4096 bytes   rounds 200  entries 0   answered 201 x200
  one unfunded entry     4096 bytes   rounds 200  entries 1   answered 201

  The file sat at one 4 KB page throughout, which is why the row counts are the
  measurement at this scale and the page count is what is asserted in the test
  rather than a stat: a page count moves where a stat does not.

THE RULE, from IMPLEMENTATION.md: "A funded entry is required before the node
stores one byte of transcript. Disk is spent only on stakes that exist - the
main anti-DoS lever."

WHAT THE NODE CANNOT DO IS DECIDE IT. A stake is a hold invoice on Lightning
and there is no payment layer here yet. Inventing a funding message would be
inventing the payment protocol, which is not this step's to write. So the
daemon REFUSES until something the operator trusts says otherwise, and the
default is `NOTHING_IS_FUNDED` - a daemon that assumed funding would be the
flood lever rather than the guard against it, and a default of yes is the kind
of thing nobody notices until the disk is full.

  POST /round   402 "this node stores nothing for a round nobody has funded"
  POST /entry   402 "this node stores nothing for an entry nobody has funded"
  both asked BEFORE anything reaches the database, so a refusal costs a parse

AFTER, the same stranger:

  an empty node          4096 bytes   rounds 0  entries 0
  200 unfunded opens     4096 bytes   rounds 0  entries 0   answered 402 x200
  one unfunded entry     4096 bytes   rounds 0  entries 0   answered 402

  200 rows -> 0 rows. And with nothing funded there is nowhere to send a tape:
  a batch on the socket is refused by name and batches, checkpoints and
  receipts all stay at zero - measured rather than reasoned about, because
  "the socket needs the round to exist" is true until somebody adds a door.

VOID STAYS VOID. Nothing on this path turns a technical failure into
PLAYER_LOST or DELIVERED: a refusal is a 402 before any round exists, so there
is no run to lose or deliver. And the client still decides nothing about
funding - it asks, and is told.

MUTANTS, three:
  the default is yes                    2 red
  the round door is not gated           2 red
  the entry door is not gated           1 red

TESTS. blwp-node 37 -> 41: four new in `quota.test.js`, and the five existing
`serve()` calls in the node's and the client's suites now say `funded: () =>
true`, because they are rounds somebody paid for and a test that means to play
one has to say so. blwp-client 26/26, core 80/80 with the determinism guard 19
clean, protocol 78/78 with the money guard 7 clean. No C# changed - the node
and its tests only - so PlayMode stays 213 / 189 green / 11 red / 13 skipped
and EditMode 185 / 181 green / 1 red / 3 skipped from 7b4caea.

WHAT IS NOT DONE HERE, named rather than implied: who supplies that yes. The
oracle is an argument to `serve`, and until there is a payment layer the honest
answer for a live daemon is that it refuses everything. Wiring a real funding
source is the payment work, not this step.


## 2026-09-07 19:40  M2.1 step 5b: an endpoint is read off Bitcoin, not taken from a page

MEASURED FIRST, what a client knows today and where from:

  a round        the page names it - and that is CORRECT. Section 25 opens
                 "Finding a ROUND is not authoritative: project website,
                 community sites, a direct link, a QR code, or a copied
                 round_id", and its table says step 1 "carries nothing".
                 Nothing to do there.
  which nodes    `census.js` encodes bond entries and roots them, `buildCensus`
                 applies confirmations - steps 2 and 3 of 25.1's table exist.
  the committee  `sortition.js` computes it from the seed. Arithmetic, as the
                 spec requires. Also exists.
  the endpoint   `BLWP_NODE`, a page global. A stranger has to take whoever
                 wrote the page at their word, and a census entry carries NO
                 endpoint field at all. That is the hosted directory 25.1
                 forbids, and it is the whole of what was missing.

  Nothing in `packages/*/src` mentioned NodeAdvertisement, BOND_MARKER, a
  Bitcoin merkle proof or a block header before this. `TAG.advert` had been
  reserved and never used.

WHY THE VERIFIERS COME BEFORE THE FETCH. 25.1 is normative: "A client MUST
verify every census entry against block headers it obtained independently. It
MUST NOT take a census, a committee or an endpoint on the word of any API,
including one operated by the same party that ships the client." And it says
why that is normative rather than advisory - the failure has no symptom: such
a client "behaves exactly like one that verifies - same screens, same rounds,
same results - right up until the API returns a census that suits whoever runs
it". Writing the fetch first would build exactly that and then retrofit the
guard, which the same paragraph says never happens.

WHAT LANDED, protocol package only, no network anywhere in it:

  advert.js   NodeAdvertisement - 5A.1's fields, encode/decode, `advertId` on
              the reserved tag, signature BESIDE the body because the bond
              output commits to a body that is fixed when the funding
              transaction is built.
  chain.js    `provesTransaction` (a Bitcoin merkle proof against a header's
              root - not the census tree), `mostWork` over header chains, and
              `acceptAdvert`, which needs both halves: the transaction really
              in the block, and the output really committing to THIS body.
  BOND_MARKER named, and NULL. It is part of the network's identity like
              `genesis_parameters`: fixing it late makes every earlier bond
              unfindable. Writing a plausible address into a source file would
              be settling it by accident, so `bondMarker()` throws instead. A
              bond search that quietly found none would look exactly like a
              network with no nodes in it.

MEASURED against real mainnet data, fetched once and written into the test so
it needs no network: block 100000, header
0100000050120119...4c86041b0f2b5710, and the merkle proof for the second
transaction in it.

  the genuine transaction        verifies, and rebuilds the header's own root
  one bit flipped in the branch  fails
  the same branch at position 0  fails - the position is part of the claim
  a different txid, same proof   fails
  the txid in DISPLAY order      fails. Byte order is the trap: a txid is
                                 printed reversed from the way it is hashed,
                                 so a caller who passes what an API prints
                                 gets a refusal rather than a wrong answer.
  block 100000's id              000000000003ba27aa200b1cecaad478d2b00432346c3f1f3986da1afd33e506
  the endpoint swapped           refused, "commits to a different advertisement"
  a chain that does not link     not in the running at all, and with nothing
                                 else there is no answer rather than a bad one

MUTANTS, five: the branch side not read from the position (2 red), the
commitment not compared (1), the proof not required (1), a broken chain still
counted (1), a single hash instead of the double (4).

THE MONEY-BEARING ENCODINGS DID NOT MOVE, and that is checked rather than
asserted: of the nine vector files only `index.json` changed, by one line
adding "advert". `census.json`, `contracts.json`, `sortition.json` and the rest
are byte-identical, so `encodeEntry`, the census leaf hash and `censusRoot` are
exactly what they were.

TESTS. protocol 78 -> 87, nine new. core 80/80 with the determinism guard 19
clean, blwp-node 41/41, blwp-client 26/26, money guard 7 clean. No C# changed -
protocol only - so PlayMode stays 213 / 189 green / 11 red / 13 skipped and
EditMode 185 / 181 green / 1 red / 3 skipped from 7b4caea.

WHAT IS NOT DONE, named: nothing FETCHES yet. 5c is the half that asks two
providers, cross-checks and answers omission - these are the primitives it will
stand on. And BOND_MARKER has no value, which is a decision for whoever settles
the genesis parameters, not for this slice.

## M2.1 step 5b, second half: the client takes the endpoint off the chain

THE HOLE IN THE FIRST HALF, found on re-reading it. `acceptAdvert` took
`commitment` and `txid` as ARGUMENTS. Whoever handed over the advertisement
handed those over too, so the proof was theatre. Measured against the code at
7e37b27, using real mainnet block 100000:

  a page writes its own advertisement, its own endpoint,
  its own commitment over it, and a real block's real proof

    ok: true, endpoint: wss://the-address-the-page-preferred:443

That is the whole of what 5b exists to stop, and it passed. Now both are
computed: the txid by hashing the transaction, the commitment by reading its
outputs. The only things a caller supplies are bytes whose hashes it does not
choose.

WHERE THE ENDPOINT CAME FROM, BEFORE AND AFTER.

  before   `BLWP_NODE`, a global in the page. Every stranger reached whatever
           address whoever shipped the page had written there, and nothing in
           the client could tell a bonded node from any other server.
  after    a bond transaction, a merkle branch and a header chain. The page
           may still carry the bytes - it cannot choose them. Grep for
           BLWP_NODE in the client path returns one line, a comment saying
           what it used to be.

THE PARSER, measured against Bitcoin's own answers - three real mainnet
transactions, fetched once and written into the test:

  block 500000 coinbase   2157b554...0ecc1dd6   segwit, 2 outputs, OP_RETURN
  block 500000 index 1    fe6c48bb...1961c69f   segwit spend
  block 100000 index 1    fff2525b...f79702c4   pre-segwit
  the coinbase's OP_RETURN  aa21a9ed10109f4b...05727a4, 36 bytes
  a witness byte flipped    the txid does not move. That is what segwit is,
                            and it is why a body in the witness is worth
                            nothing until an output commits to it.
  block 500000's coinbase, proven, advertises nothing: refused as "commits to
  a different advertisement" - which is what almost every transaction is.

THE CLIENT PATH, driven against a real node process on a real port with a
decoy `BLWP_NODE` set for the whole file to http://127.0.0.1:1 - if the global
were read anywhere, every test in that file would reach the decoy:

  reached from the advertisement   base http://127.0.0.1:<port>, and a real
                                   round opens on it
  the endpoint swapped             throws "no proven endpoint: the bond output
                                   commits to a different advertisement"
  the honest body, same page       taken. The page is a courier.
  a header not in the chain        "not in any block of that chain". Being
                                   handed a header is not being handed a block.
  headers that do not link         not a chain, however many
  no chain at all                  no address. There is no fallback, because
                                   any fallback is the page's word again.
  no file in blwp-client/src       names BLWP_NODE, window, globalThis or
                                   location

MUTANTS, six, and one of them survived first: txid over the whole transaction
including the witness (4 red), a length written the long way accepted (1), the
offered body taken unchecked (2 protocol + 2 client), the proof not required
(1 + 1), a header list treated as a chain (1). The survivor was "any output is
a commitment" - 0 red, because the real transactions above happen to hold
outputs whose pushes do not fill the script. A P2TR output does not: `OP_1`
and a 32-byte push is byte for byte the shape of a commitment to a 32-byte
hash, and a bond output IS P2TR. Test added, mutant now 1 red.

THE BUNDLER now refuses two top-level names in one scope, not only two
exported ones: `chain.js` and `transcript.js` each had a private `same`, which
in one scope is a `const` redeclaration and would have thrown when the page
loaded. Verified by adding a duplicate on purpose: exit 1, named both files.

TESTS. protocol 87 -> 100, core 85/85 untouched, blwp-node 41/41,
blwp-client 26 -> 32. Determinism guard 19 clean; money guard 7 -> 9 files,
`chain.js` and `tx.js` added to it - a float literal where a txid is computed
would be silent and total. No test-vector file changed at all this slice, so
every money-bearing encoding is byte-identical. No C# changed, so PlayMode
stays 213 / 189 green / 11 red / 13 skipped and EditMode 185 / 181 green /
1 red / 3 skipped from 7b4caea. Nothing deployed; the daily stays 0.0.567.

NOT DONE, named. BOND_MARKER is still null, so a light client can prove a bond
it has been shown but cannot FIND one - `tools/bond.js` builds a transaction
without the dust output 25.1 requires, and says so. That is a genesis
parameter. And nothing fetches: one header chain cannot be weighed against
another, which is 5c.

A SPEC TENSION, found and not decided. 5A.1 makes `bond_outpoint` MANDATORY in
the advertisement, and 25.1 puts the advertisement in the witness of the
transaction whose output commits to it. The txid is therefore not knowable
when the body is signed, and the two cannot both be had as written. An
all-zero `bondTxid` is read as "the bond is an output of the transaction
carrying me", because it is the only value expressible; a non-zero one must
still equal the proven txid. Named here rather than settled.

## M2.1 step 5b, last piece: step 4 reads step 3's answer

THE HOLE, and it was mine to find twice. The endpoint was proven and then the
node it named was not looked at. `directory.js` returned `nodePubkey` and
`Client.at` dropped it; the committee was consulted only when a RECEIPT came
back - `client.js` refuses a receipt from a key not on the committee, and by
then the entry contract and the opening batches are already on that node's
disk. Section 11 makes publishing the client's duty; it is not something a
client can take back. Section 25.1 is four steps and step 3, "which are on the
committee?", is computed from the round's own contract - step 4 was not
reading it.

WHAT IS REFUSED NOW, and where. `Client.at` is the door and everything is
refused there, before `openRound`, before `join`, before a byte of section 11:

  a bonded stranger, proven and signed   "the advertisement is for <key>, which
                                         is not on this round's committee"
  and on the stranger's own node         /round -> 404, /transcript -> x-ticks 0
                                         and zero batches. Measured by asking
                                         that node, not by trusting the client.
  a committee member, same proof         opens, and a real round is opened on it
  an absent or empty committee           refused. The version that takes an
                                         empty list and shrugs is the version
                                         that ships.

THE ENDPOINT IS A STRING SOMEBODY COMMITTED TO, NOT A URL. Committing it on
chain makes it theirs; it does not make it an address, and the client used to
`replace(/^ws/, 'http')` whatever was there and dial it. Refused now, each by
name: http://, https://, a bare host:port, `wss:/` one slash short,
`javascript:`, the empty string, and ws:// to any host that is not loopback -
a plaintext socket to somewhere else is the one thing a committed endpoint
must not be able to ask a player for. `wss://` anywhere; `ws://` only for
127.0.0.1, localhost or [::1], because a test node on this machine has no
certificate and refusing it would mean the tests could not drive the real door.

THE ADVERTISEMENT'S OWN SIGNATURE, 5A.1's last field, is verified. A body now
ARRIVES signed - 64 bytes beside it or it is not an advertisement - and
`acceptAdvert` hands the signature back rather than pretending to check it,
because this package carries no curve on purpose. Three refusals measured:
signed by another key, signed by the right key over a different body, and 64
zero bytes. It signs the TAGGED id, like every other signature here, so it can
never be replayed as a signature over another object.

WHERE THE ASYNC LINE FALLS, said plainly. Verifying is asynchronous in a
browser and C# asks for the address once, at scene start, so `endpointFor` is a
synchronous GATE - proof, commitment, committee, socket address - and
`Client.at` is the asynchronous DOOR, which repeats all of that and adds the
signature. Nothing is sent by the gate; the first thing that leaves the client
is `openRound`, and that is inside the door.

MUTANTS, six, all red: the committee not read (2 - and that mutant IS 606f54d),
an absent committee tolerated (1), any string an address (1), ws to any host
(1), the advertisement signature unchecked (1), an unsigned body accepted (1).
The last one survived its first build because the extra push sat inside a try
whose earlier line already threw; rebuilt, it is 1 red.

TESTS. protocol 100 -> 101, blwp-client 32 -> 35, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed,
so every money-bearing encoding is byte-identical. No C#; PlayMode and EditMode
stand from 7b4caea. Nothing deployed; the daily stays 0.0.567.

THE JSLIB was not built this turn - no Unity run, no deploy - so this is source,
not a measured artefact. `$blwpDiscovery` is declared on both users with
`__deps`, which is how Emscripten keeps a library helper it would otherwise
eliminate.

## M2.1 step 5b, the round-id binding: "this round" stops meaning "whatever the page wrote"

WHY IT WAS NEEDED. The committee check landed at e43710a and was circular. The
page writes the contract, so the page writes `nodes`, so the page picks the
committee that its own advertisement then satisfies - honestly, with a real
bond, a real merkle proof and a real signature. Every check in the door passes.
What does not pass is the arithmetic: an id here is the tagged hash OF the
object, so changing one node in that list changes the round.

WHAT IS CHECKED, and it is first. `Client.at` refuses unless `roundId(contract)`
equals a 32-byte id the PLAYER supplied. Section 25.1 step 1 is "a link, QR,
copied round_id - carries nothing", and carrying nothing is exactly why it is
enough. In the page the id comes off `window.location.search`, which is the one
input in this whole path the page's own script did not write.

  a page naming its own node, everything else valid
                              "the page offered round 6f4a..., which is not the
                              round 8c11... you were given"
  on that node afterwards     /round 404 for BOTH ids, /transcript x-ticks 0,
                              zero batches. Asked, not assumed.
  no id, null, 31 bytes, a hex STRING
                              all refused: "nothing to check the page's
                              contract against". Required, not optional - a
                              player who arrived with no id has nothing to
                              check and there is no safe way to guess one.
  a matching id               the existing door still runs in full: committee
                              membership, proven endpoint, header chain,
                              advertisement signature, and a real round opens

MUTANTS, three killed: the id not compared (2 red), a missing id tolerated (1),
and the endpoint refusal moved ahead of the id refusal (1) - so the player is
told they are on the wrong round rather than given a chain complaint that
buries it.

AND ONE THAT COULD NOT BE KILLED, written down rather than counted. Moving the
`reach` CALL either side of the id check changes nothing observable, because
`reach` is pure: it sends no byte, opens no socket and touches no state. The
property that matters is not the order of two computations but that nothing
leaves the client first, and that is measured on the stranger's own node above.
The test comment was corrected to claim the thing it actually pins.

ONE READER STILL. `BLWP_ADVERT` is read in exactly one place, `$blwpDiscovery`,
used by both the gate and the door. The round id is a different input from a
different place - the address bar - and is read in `net.open` only.

TESTS. blwp-client 35 -> 37, protocol 101/101, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
No C#; PlayMode and EditMode stand from 7b4caea. The jslib is still source, not
a built artefact - no Unity run this turn. Nothing deployed; daily 0.0.567.

## M2.1 5b - closed, and the three leftovers it does not cover

The door is three things, measured: the endpoint comes from a bond transaction
proven against a block header, a node this round's contract does not name is
refused, and a contract that does not hash to the round id in the address bar
is refused before anything is sent. Nothing in the live path talks before
`Client.at`.

These three are NOT bugs against that door and no code on this letter touches
them. They are written down so they are not rediscovered as surprises.

1. A LIMIT, not a bug. The round id is read from `location.search` when
   `net.open` runs, not at first paint, so a page that rewrote its own address
   bar first would be checked against its own rewrite. What the check buys is
   therefore precise and worth stating exactly: the id the player CAN STILL SEE
   is the one that is checked. That is not fixable from inside the client, and
   pretending otherwise would be worse than naming it.

2. WHICH OF THE SEVEN. The page chooses which named committee member receives
   the entry and the opening transcript. All seven are named by the round, so
   5b is satisfied; what is left is that one member sees it first, and that is
   LIVENESS AND PRIVACY, not standing: liveness because the one asked may be
   the one that is down, privacy because that member sees a player's inputs
   before anyone else does. It belongs with 13C's quorum receipts - at least
   five - and the gossip that spreads them, not here.

3. THE SAME SHAPE ONE LAYER UP, AND IT IS WHERE THE MONEY IS. `BLWP_ENTRY` -
   `stakeMsat`, `feeMsat`, `donationMsat`, `playerPubkey` - is still written by
   the page and bound to nothing the player supplied. The round-id bind fixed
   "which round"; nothing yet fixes "what am I paying". A LATER NAMED ITEM ON
   M2.1, deliberately not implemented now.

## Deployability, recorded rather than investigated  -  at d54adba

NOT DEPLOYABLE. Four reasons, in order of weight, and none of them is new work:

  the jslib has not been Emscripten-linked since 606f54d. It parses as
  JavaScript and `$blwpDiscovery` is declared on both users with `__deps`,
  which is the mechanism that keeps such a helper - but that is reasoning
  about a build, not a build.

  the player path has not been driven in a browser since 7b4caea. Everything
  in 606f54d, e43710a and 54ce8e9 is measured in Node against a real node
  process. Real, and not a player.

  a deploy today still ships no session: nothing supplies `BLWP_ADVERT`, and
  the URL now needs `?round=<id>`. Not a regression - `BLWP_NODE` was unset on
  the daily, so the shipping default was already no session - and not a
  demonstration that any of this works either.

  Unity still carries the known reds: the retired C# army group (tanks and
  soldiers "not found", the three `VehicleTests` nulls, `CombatFx` reading a
  `Shot` event that no longer fires) and the `TheGogglesAnimate` load flake.

A GREEN JS SUITE IS NOT A PLAYER, and that is the whole of it. What would
change the answer is a WebGL build with no short timeout and a browser drive
against a real node with a fixture advertisement and a real `?round=` id.
Neither was started; this turn is journal only.

## M2.1 5c slice 1: the chain is asked of two providers, or there is no chain

WHERE THE CHAIN CAME FROM BEFORE. Nowhere. Measured: the only `fetch` in
`packages/*/src` was the three round/entry/transcript calls to the node, and no
source file had ever asked for a header. `reach` took `chains` as an argument
and the page supplied it, so a player's whole belief about Bitcoin was the
page's word - which is what 25.1 calls the failure with no symptom.

WHAT DECIDES, AND WHAT FETCHES, ARE SEPARATE. A provider is a FUNCTION handed
in, like `sign`, `verify` and the core are. `headersOverHttp(url)` is the only
transport, and the CALLER gives the whole URL: no host and no path is written
into `src`, because this protocol has no chain API of its own and a default
address would be one the player never chose. What a real provider's URLs look
like is a separate question and is not answered here.

THE RULES, and each is refused by name.

  fewer than two providers   refused BEFORE anyone is asked. Not because one
                             source is probably lying but because nothing it
                             says can be weighed: a short chain, and a chain
                             with a block hidden, are the same bytes.
  a chain that does not link  that source is discarded and named; the others
                             still answer
  fewer than two SURVIVE      refused, and the refusals are handed back
  most work wins              Bitcoin's rule, not a vote
  a shorter chain             CARRIED, not refused. Omission is the expected
                             case - "omission is answered by asking a second
                             one" - and refusing would stop a client every time
                             one source lagged, which is every day.
  a fork                      REFUSED rather than resolved, and the stray block
                             is named. Most work is the right rule for a node
                             holding the whole chain; here a fork means at
                             least one provider is lying or broken, and taking
                             the heavier one is guessing which.
  500, or no answer at all    counted and named, not waited for. A silent
                             provider must not stop the ones that answered.

MEASURED, real mainnet headers 499998-500000 served over local HTTP:

  three headers                240 bytes, 80 each
  work, each                   8045049515748916497043
  work, the three together      24135148547246749491129
  the two-header source        16090099031497832994086, and it loses
  tip                          00000000000000000024fb37364cbf81fd49cc2d51c09c75c35433c3a1945d04
  two agreeing providers       ok, agreed 2, refused []
  one whole and one short      ok, from 1, three headers
  a fork                       refused, "providers 0 and 1 do not agree"
  one provider alone           refused, and 0 calls went out
  2 good + 1 unlinked          ok, agreed 2, the broken one named
  1 good + 1 unlinked          refused, "only 1 of 2 providers gave a chain"
  a 500 and a silent one       ok on the other two; "no answer in 50 ms"
  120 bytes                    "not a whole number of headers"

MUTANTS, six, and one survived first. One source enough (0 red at first - the
later count refuses it anyway, so the verdict was identical; the property the
early guard actually buys is that NOBODY IS ASKED, since a request would tell a
provider which round a player is looking at for an answer that was never going
to be used. Test now counts the calls: 1 red). One good answer enough (2), a
fork resolved by weight (1), the lighter chain winning (1), an unlinked chain
accepted (1), a ragged body padded (1).

NOT WIRED YET, deliberately. `Client.at` still takes `chains` from the caller
and the page still supplies them in the live path; nothing is in the bundle.
Wiring waits for slice 2, where a bond transaction and its merkle proof are
fetched and checked against these headers - otherwise the client would have a
verified chain and still take the transaction on the page's word.

TESTS. blwp-client 37 -> 44, protocol 101/101, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
No network in any test: every provider is a `node:http` server on 127.0.0.1.
No C#, no Unity, nothing deployed; daily 0.0.567.

LEFTOVERS PARKED NEXT TO BOND_MARKER, named so they are not rediscovered:
checkpoint-or-genesis (a shipped checkpoint header is a trust anchor and a
constant somebody must settle; syncing from genesis is ~4 MB and real work in a
browser) and the beacon - 5A.5 puts the committee seed in drand at
`committee_time`, which is neither Bitcoin nor the page, and it is not 5c.

## M2.1 5c, the hole in slice 1: the work was never checked to have been done

WHAT WAS WRONG. `chainWork` summed `workOf`, which reads the difficulty out of
bytes 72..76 - four bytes WRITTEN BY WHOEVER HANDS THE HEADER OVER. Nothing
asked whether the hash met the target it claimed. The comment in headers.js
said "forging is already impossible... the work is arithmetic over bytes nobody
can choose", and that sentence was simply wrong.

BEFORE, measured on the code at 54f41d2:

  mainnet 499998-500000, work    24135148547246749491129
  one fabricated header, work    57896044618658097711785492504343953926634992
                                 332820282019728792003956564819968

Thirty-two orders of magnitude, from four bytes and no mining at all.

The fork rule masked it in the obvious case - the fake chain won on work, the
honest blocks were not in it, refused - but that is a denial of service, not a
defence: one provider could make every client refuse forever. And it did NOT
mask the real attack. A provider serving the HONEST chain plus one header of
his own on the end is a SUPERSET, so every honest provider's blocks are in his,
there is no stray and nothing disagrees:

  accepted: true, from provider 1, headers 4
  winning tip   803e37e66daab4b5025b2a4231d43b46232af6396b4506aae8c8f9a453ba163a
  merkle root   bbbbbbbb...bbbbbbbb, his to choose

That merkle root is exactly what slice 2's bond proof would have been checked
against.

AFTER, the same header and the same claimed work:

  fabricated header hash        803e37e66daab4b5025b2a4231d43b46232af6396b45...
  meets its claimed target      false
  claimed work of his chain     578960446186580977117854925043439539266349923
                                32820282043863940551203314311097
  honest work                   24135148547246749491129
  two providers (one his)       refused: "only 1 of 2 providers gave a chain",
                                and provider 1 is named "this header was not
                                mined: its hash does not meet the target it
                                claims"
  three providers (two honest)  ok, agreed 2, headers 3 - his chain is
                                discarded, not obeyed, and the fabricated
                                header is not in the answer

WHAT LANDED. `targetOf` and `meetsTarget` in `protocol/src/chain.js`, and
`chainWork` refuses a header that does not meet its target BEFORE adding its
work. The byte order is the usual trap and is now written down: a block hash is
stored reversed from the way it is read as a number, so the comparison is
against the reversed bytes. A mantissa with its high bit set is a negative
target and is no target at all.

REAL HEADERS PROVE IT IS NOT JUST REFUSING EVERYTHING: mainnet 100000 and
500000 both meet their targets, and the three-header chain still weighs
24135148547246749491129.

THE FIXTURES NOW MINE. `blockOf` grinds the nonce until the hash meets the
target, because a fixture that could not be refused measures nothing. The
default bits are 0x207fffff - a target just under 2^255, so roughly every
second nonce works - since mining at mainnet difficulty in a test is not
possible. Nothing else in the suites had to change: 101 -> 104 protocol and
44 -> 46 client, with every existing fork and agreement test untouched.

MUTANTS, four, all red: the hash not compared to the target (2 protocol +
2 client), an unmined header still counted (2 + 2), a negative target treated
as a target (1), and the hash compared in display order rather than as a
number (3 + 7).

STILL ON THIS LETTER, not parked and not slice 2: the question needs a range,
so two honest providers serving different ranges are not read as a fork; one
origin counted twice must not read as two sources; the HTTP body needs a bound;
and a timed-out fetch should abort its socket.

A LIMIT, named. There is no network minimum difficulty here, so a chain of very
easy headers is accepted - it simply carries almost no work and cannot outweigh
a real chain. Enforcing a minimum, and the retarget schedule with it, is a
network-parameter decision and sits with checkpoint-or-genesis.

TESTS. protocol 101 -> 104, blwp-client 44 -> 46, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
No C#, no Unity, nothing deployed.

## M2.1 5c, the four leftovers on the same letter

ONE SERVER LISTED TWICE WAS TWO SOURCES, and the old test said so as if it were
a feature: `agreedChain([only.get, only.get])` answered ok, agreed 2, from one
machine. That is the worst kind of wrong - it looks exactly like the thing it
is not. `httpProvider(url)` now tags a provider with its origin and a repeated
tag is refused BEFORE anyone is asked: "providers 0 and 1 are the same source,
http://127.0.0.1:NNNNN", 0 calls out. Independence itself is NOT checkable -
two hostnames can be one machine and nothing in a client can tell - so this
catches a mistake and proves nothing, and an untagged provider is counted as
distinct because there is nothing else to do with it. Both halves are tests.

DIFFERENT RANGES WERE READ AS A FORK. Two honest providers whose answers share
no block were refused with the word used for a provider that is lying. They are
told apart now: "answered about different parts of the chain and share no
block, so neither can be weighed against the other". Still no answer - nothing
was weighed - but a different fact, and the caller is told which. The question
is also handed to the provider now (`agreedChain(providers, { ask })`), so an
honest pair CAN be asked the same thing; what a provider does with the ask is
the caller's business, and `httpProvider` takes a function of it for a provider
whose URL carries the range.

THE BODY IS BOUNDED, in both shapes a provider can send it, and the two are
different refusals on purpose:

  content-length declared    "the provider offered 320080 bytes, more than the
                             320000 this client reads" - before a byte of body
                             is pulled off the wire
  chunked, no length         "the provider sent more than the 320000 bytes this
                             client reads" - counted while reading, because
                             that header is the provider's word like the rest
  under the cap              4001 headers read, both ways

THE READ IS ABORTED, not abandoned. A provider that sends headers and then
never finishes the body used to keep a socket for the rest of the run; the
timeout now aborts it and the server sees the request aborted.

MUTANTS, six, all red: one server twice counted as two (1), disjoint ranges
read as a fork (1), the streaming cap removed (1), content-length taken at its
word (1), the abort removed (1), the question not passed on (1).

TWO THINGS THE MUTANTS TAUGHT, both about the tests rather than the code.
The content-length mutant survived at first because the streaming cap catches
it anyway - the verdict was identical, only the WORDS differed - so the test
now asserts each message against the transfer shape that produces it. And the
abort mutant made the suite HANG rather than fail, because the test left a
socket open: a hang is not a measurement, it is a test that cannot report, so
the fixture destroys its connections rather than only closing the server.

TESTS. blwp-client 46 -> 50, protocol 104/104, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
No network beyond 127.0.0.1. No C#, no Unity, nothing deployed; daily 0.0.567.

## M2.1 5c slice 2: the bond is proven into a block somebody mined

WHAT WAS LEFT. 25.1's third line - "verify: proof against header,
H(advertisement) against the bond output's commitment". The second half has
been true since the endpoint stopped coming off the page. The first half was
only ever as good as the header it was checked against, and `reach` weighed
whatever list of chains its caller handed over: mined since 969370c, but never
AGREED.

THE ATTACK, END TO END, on the same fabricated header as the last cut. He does
not need to break a hash. He needs a block whose merkle root is the one his own
proof rebuilds, and he can simply write it down:

  his block hash    6fe1215659d8493cbee898bfb8738ae75c8efdb61d7364b07092b6f8c97e499f
  his merkle root   897e0cc60ac26b827f221353a7ef2f552393f454fbfd61198eff537fff1a368f
  does his proof rebuild it?   TRUE - the merkle arithmetic passes completely
  was his block mined?         false
  provenBond                   "that is not a mined chain: this header was not
                               mined: its hash does not meet the target it
                               claims"

Before the target was checked, that same block proved his bond and his endpoint.
Hanging it off an honest block does not help either: a chain carrying it is not
a chain.

WHAT LANDED. `blwp-client/src/bond.js`. `provenBond({chain, transaction, branch,
position})` re-checks the chain rather than taking it on the caller's word - one
pass over headers already in hand, and the difference between "a block" and "80
bytes somebody handed me" - computes the txid from the transaction, and finds
the block the proof lands in. `reach` now takes `chain`, the chain two
providers already agreed on, as well as the old `chains` list, and re-checks
either.

ONE PROVIDER IS ENOUGH HERE, AND TWO ARE NEEDED FOR HEADERS. Not a preference
and worth saying plainly: the weight of a chain means nothing except in
comparison, so headers need agreement; a bond proof carries its own proof and
cannot be forged at any price, so the only lie available is silence - and
"omission is answered by asking a second one" is a search, not a vote.
`askForBond` asks in turn, keeps every refusal, and stops at the first proof.

MEASURED:

  an honest bond            proven into the mined block, header = chain[1]
  the fabricated block      refused, alone and hung off an honest one
  the right proof, position 1   "is not proven into any block of that chain"
  a chain that does not hold it refused
  bytes that are not a transaction  "not a transaction"
  three providers, two useless  proven by provider 2, both refusals kept
  a silent provider         "no answer in 50 ms", not waited for
  over real HTTP            proven, block hash matches chain[1]
  the door with an agreed chain ok, endpoint read
  the door with his block   "not a mined chain"

FIVE MUTANTS, all red: the chain taken on the caller's word (1), the proof not
checked against the header (4), the txid taken from the caller rather than
hashed (4), a refusing provider ending the search (1), an agreed chain not
re-checked in the door (1).

THE ENVELOPE IS THE TEST'S, NOT THE CLIENT'S. A bond provider is a function,
like a header provider is: the shape a chain API puts a merkle proof in is
nobody's standard, and writing one API's field names into the client would be
adopting a second protocol without saying so. The test speaks one over local
HTTP; mapping a real API onto it is not done.

NOT WIRED, and bond.js is deliberately not in the bundle: the live path still
takes `chains` from the page. Wiring is the next thing on this letter.

THE REMAINING HOLE, named and NOT opened: `agreedChain` weighs only the chains
it is handed, and nothing anchors the winner to Bitcoin. A client whose whole
provider list belongs to one operator - two hostnames, one machine, which the
origin tag catches only when it is obvious - accepts a cheaply mined chain
because there is nothing heavier to compare it with. That is
checkpoint-or-genesis, and it accounts for essentially all of what is still
missing.

TESTS. blwp-client 50 -> 57, protocol 104/104, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
No network beyond 127.0.0.1. No C#, no Unity, nothing deployed; daily 0.0.567.

## M2.1 5c slice 3: the winner has to be Bitcoin's chain, not a chain

WHAT AGREEMENT AND MINING DID NOT BUY. Together they prove only that a set of
headers is a chain of SOMETHING. Mining a short chain at trivial difficulty
costs almost nothing, so a client whose whole provider list belongs to one
operator - two hostnames, one machine, which the origin tag catches only when
it is obvious - took that operator's fork by default: there was nothing heavier
to weigh it against.

THE ANCHOR IS REQUIRED AND MAY NOT COME FROM THE PAGE. An anchor an attacker
supplies is no anchor, because he would name a block of his own fork. It is a
caller's argument, brought by the client.

  no anchor                 refused, and this is the measured "before": two
                            providers agreeing perfectly on a four-header
                            chain he mined himself, every header meeting its
                            target, and nothing to refuse him with
  his chain, with an anchor  "only 0 of 2 providers gave a chain", both named
                            "this chain does not contain ..., the block this
                            client is anchored to". It is not weighed at all -
                            it is an answer to a different question.
  the honest chain          accepted, 3 headers, work 24135148547246749491129
  the fabricated header     still refused, unchanged from 969370c

`BITCOIN_MAINNET_GENESIS` is in `protocol/src/chain.js`, hashing order, and the
test checks it displays as
000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f. It is not a
parameter and not a choice: that number IS mainnet, anyone can check it, it
cannot go stale, and no operator can change it.

THE SPEC'S OWN NUMBER IS WRONG, and it decides checkpoint-vs-genesis. 25.1 says
"80 bytes a block; under 4 MB for all of history". Measured: 500,000 headers is
38.1 MB, 800,000 is 61.0 MB, 900,000 is 68.7 MB - seventeen times the figure in
the spec. No browser will fetch that to open a round, so a deployment will
anchor on a later block instead, which is a constant somebody must choose and
keep fresh. WHICH block is not decided here; that there must be one is.

A BRANCH DELETED RATHER THAN LEFT UNREACHABLE. The "answers about different
parts of the chain" refusal from the last cut cannot happen any more: every
chain that gets weighed contains the anchor, so any two of them share at least
that block. Keeping it would have been a branch no test and no mutant could
reach. The same fact is said earlier now, per source, by name.

MUTANTS, four, all red: the anchor made optional (2), a chain not required to
contain it (2), the anchor checked only on the winner rather than per source
(2), and the genesis constant changed by one byte (1).

WHAT SHARE THIS CLOSES. The chain source had one hole left after headers, PoW
and the bond, and this is it: the anchor accounts for essentially all of the
remaining chain-source gap. What is left is not the chain source.

LEFTOVERS OF THIS SLICE, not a new letter: the merkle-proof envelope is still
the test's rather than a real API's; `bond.js` is not in the bundle; the live
path still takes `chains` from the page, so the door is not yet fed by
`agreedChain`; and which block a deployment anchors on - genesis at 68.7 MB or
a shipped checkpoint that must be kept fresh - is a constant nobody has chosen.

TESTS. blwp-client 57 -> 59, protocol 104/104, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
No network beyond 127.0.0.1. No C#, no Unity, nothing deployed; daily 0.0.567.

## M2.1 5c slice 4: the door asks for the chain instead of being handed one

WHAT WAS WRONG, AND IT WAS THE WHOLE POINT OF 5C. Everything measured in the
four cuts before this was a library nothing used. Grepped, not remembered:
neither `client.js` nor `directory.js` nor the jslib called `agreedChain`,
`askForBond` or `provenBond`, and the jslib handed `transaction`, `branch` and
`chains` straight off `BLWP_ADVERT`. `reach` verified whatever it was given -
which proves a chain and a proof agree WITH EACH OTHER and nothing whatever
about Bitcoin, because a page that wrote both wrote a consistent pair. 25.1 is
normative about what a CLIENT does, so until the door asks, the chain source
was not the client's chain source.

WHAT LANDED. `discover()` in `directory.js`: two provider functions for
headers, weighed and anchored; then bond providers asked in turn until one
proves a bond into that chain; then the endpoint read out of it. `Client.at`
calls it, and REFUSES a ready-made chain or proof rather than verifying one -
`chain`, `chains`, `transaction`, `branch` and `position` are each named:
"must come from a provider, not from whoever opened the page: two things that
agree with each other are not Bitcoin".

MEASURED THROUGH THE DOOR, not through the library:

  a perfect bundle handed over    reach(raw) accepts it - said out loud in the
                                  test so the refusal cannot be mistaken for
                                  the bundle being bad - and Client.at refuses
                                  all five keys by name
  the same bytes, asked for       the round opens, base https://node.example:443
  one provider                    "no chain: 1 providers is fewer than the 2"
  no anchor                       "no chain: no anchor"
  an anchor the chain lacks       "no chain: only 0 of 2 providers gave a chain"
  no bond provider                "no bond: no providers to ask for the bond"
  a proof landing nowhere         "no bond: no provider proved that bond into
                                  the chain" - provenBond, on the live path
  the attacker's whole world      his own mined chain, his own bond in it, his
                                  own signed advertisement, served by two
                                  providers that agree completely: accepted
                                  when anchored on his own first block, and
                                  "only 0 of 2 providers gave a chain" when
                                  anchored on a block this client knows

THE CLIENT SPEAKS BITCOIN'S SHAPES AND NOBODY'S JSON: 80-byte headers back to
back, and a merkle branch of 32-byte hashes with an index. No explorer schema
and no host or path is in the package. Translating a real API into these
functions is an adapter that lives on the page or the node, where it can be
changed without touching anything that decides.

THE JSLIB. `$blwpDiscovery` now reads `BLWP_CHAIN.headers`, `.bonds` and
`.anchor` and REFUSES a page still carrying `chains`, `chain`, `transaction` or
`branch` - a page on the old path is told so rather than quietly taken at its
word. It also refuses fewer than two header providers, no bond provider, and a
missing anchor, each by name.

`BlwpNetNodeUrl` can no longer answer with an address: the address is now read
off a bond proven into a chain two providers agreed on, and every step of that
is a fetch. What C# does with the answer is ask whether it is empty, so it
answers whether a session is worth opening - "the chain", or empty for none -
and the address is resolved in `net.open`, before a byte is sent. Renaming the
C# side is C# and was out of scope.

`bond.js` and `headers.js` are in the bundle now, which follows from the import
rather than being arranged: 15 modules -> 17, 102.9 KB -> 120.3 KB.

MUTANTS, five red: a handed chain verified rather than refused (1), the agreed
chain not the one `reach` checks (7), a refused chain still opening a session
(2), a refused bond still opening one (1), the bond's position not carried
through (7). A sixth was written badly - `bond.branch = bond.branch` changes
nothing - and is not counted.

ONE TEST FIXTURE FAULT FOUND AND FIXED, not a rule loosened: two tests said
`reach({ ...fixture, chains: X })` while the fixture had grown a `chain` key,
which takes precedence, so the override was silently ignored. They now offer
the chain they mean to.

TESTS. blwp-client 59 -> 62, protocol 104/104, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
No network beyond 127.0.0.1. No C#; the jslib is source, not a built artefact.
Nothing deployed; daily 0.0.567.

LEFTOVERS AFTER THIS SLICE: which block a deployment anchors on is still
nobody's decision (genesis at 68.7 MB, or a checkpoint kept fresh); no page yet
defines BLWP_CHAIN, so a deploy still opens no session; and the jslib has not
been Emscripten-linked since 606f54d.

## M2.1 5c slice 5: the client brings the anchor, and a page that offers one is refused

THE HOLE, AND IT WAS MINE. dd18cca wired the door to providers and then took
the anchor off `BLWP_CHAIN`. `directory.js` said, in a comment I had written
myself, "It is a caller's argument rather than a page's value on purpose. An
anchor an attacker supplies is no anchor - he would name a block of his own
fork"; the jslib said "The anchor is the page's to CARRY" and did exactly what
the first comment forbids. Weighing, mining and the bond proof were all honest,
and the block they were all anchored TO arrived from the page.

So the headline of that cut did not hold on the live path. The attacker's world
was refused only when anchored on a block the client knew, and through the
jslib he supplied that too.

WHAT LANDED. `discover` anchors on `BITCOIN_MAINNET_GENESIS`, always, and a
supplied `anchor` is refused by name rather than used - the same shape as the
five handed keys: "the anchor is the client's own and may not be supplied: a
block chosen by whoever handed over the chain is not a block the client knows".
The jslib no longer reads `BLWP_CHAIN.anchor` and the comment that said it
should is gone.

`BITCOIN_MAINNET_GENESIS_HEADER` - the eighty bytes, not only the hash - is in
`protocol/src/chain.js` so a chain can START at Bitcoin's first block. Nothing
about it is taken on trust: the test hashes it and gets
000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f, and that is
the only reason to believe either the header or the hash constant beside it.
The fixtures were rebuilt on it, so an honest chain contains the block the
client knows because it IS that block, not because a fixture said so.

MEASURED THROUGH THE LIVE SHAPE:

  his whole world, every field a page can give
      his own mined first block, his bond in the next, his signed
      advertisement for a node on this round's committee, two providers
      agreeing completely
    the library, handed his chain      ACCEPTS it - asserted, so the refusal
                                       cannot be mistaken for a bad bundle
    the door                           "no chain: only 0 of 2 providers gave a
                                       chain" - his chain does not contain
                                       genesis
    him offering his own anchor        "the anchor is the client's own and may
                                       not be supplied"
  an honest chain rooted at genesis    opens, base https://node.example:443
  genesis header                       hashes to the block everybody knows;
                                       80 bytes; matches the hash constant

MUTANTS. Two red: a page-supplied anchor used rather than refused (2), the
genesis header changed by one byte (9). A third - adding `anchor ||` in front
of the constant - killed nothing and is NOT counted: the guard above refuses a
supplied anchor first, so the fallback is unreachable and the mutation changes
nothing observable. Same shape as the reach-ordering non-mutant recorded
earlier.

TESTS. blwp-client 62 -> 63, protocol 104/104, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
Bundle 120.3 -> 122.0 KB, still 17 modules. No network beyond 127.0.0.1. No C#;
the jslib is source, not a built artefact. Nothing deployed; daily 0.0.567.

LEFT, AND NOT THIS LETTER: which block a deployment anchors on if it will not
carry 68.7 MB of headers to genesis - a constant, a decision, (a2); no page
defines BLWP_CHAIN so a deploy opens no session; the jslib has not been
Emscripten-linked since 606f54d; and `reach`/`endpointFor` remain exported from
the bundle and will verify a chain handed to them - named on the record, not a
boundary, since a hostile page can ignore the client entirely.

## M2.1 5c slice 6: the two-provider floor is the client's, not a page setting

THE HOLE, FOUND BY WALKING THE DOOR PATH AGAINST THE LIBRARY PATH. `discover`
took `least` and `timeoutMs` from its caller, and `Client.at` spreads the
page's own object into it. Measured through `Client.at` before the fix, on a
chain honestly rooted at genesis:

  least default, ONE provider   refused: "1 providers is fewer than the 2 it
                                takes to weigh one against another"
  page sets least: 1            https://one-provider.example:443   -- OPENS

So the first clause of 5c's goal - "asks two providers" - was not true on the
live path: one field turned "several independent sources, most work wins" into
one source, and a short chain and a chain with a block hidden are the same
bytes. It is the same fault as the anchor, in the same function, and I did not
catch it while fixing the anchor.

WHAT LANDED. `PROVIDERS_NEEDED = 2` and `PROVIDER_WAIT_MS = 10000` are named
constants in `directory.js`, and `discover` refuses a supplied `least` or
`timeoutMs` by name - the same shape as the anchor and the five handed keys:
"least is the client's own and may not be supplied: how many providers must
agree, and how long to wait for them, are not settings for whoever handed over
the providers".

`ask` is deliberately NOT refused. It names which range of chain to fetch, and
a lie about it can only omit - which is the one lie a second provider answers.
A test asserts it still reaches both header providers and the bond provider.

MEASURED THROUGH `Client.at`:

  one provider, nothing supplied     "no chain: 1 providers is fewer than the 2"
  least: 1, one provider             "least is the client's own and may not be
                                     supplied"
  least: 1 with two providers        same refusal - it is refused for being
                                     offered, not for the number
  least: 5                           same refusal
  timeoutMs 0, 1, 60000, 999999999   "timeoutMs is the client's own and may not
                                     be supplied", each one
  nothing of the client's supplied   opens, base https://node.example:443
  ask: { from: 0, count: 2 }         reaches both header providers and the bond
                                     provider, unchanged

MUTANTS, four, all red: a supplied `least` used (1), a supplied `timeoutMs`
used (1), the floor lowered to one (2), the floor not passed to `agreedChain`
(2).

TESTS. blwp-client 63 -> 65, protocol 104/104, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
Bundle 122.0 -> 123.6 KB, 17 modules. No network beyond 127.0.0.1. No C#, no
Unity, nothing deployed; daily 0.0.567.

STILL PARKED, untouched this cut: the deployment anchor (a2), no page defines
BLWP_CHAIN, the jslib unlinked since 606f54d, and `reach`/`endpointFor`
exported and willing to verify a handed chain.

## M2.1 5c slice 7: two providers means two sources, not two calls

THE HOLE. The origin tag existed and only `httpProvider` set it, so it never
fired where it matters. On the live path the PAGE writes the provider
functions, and they carry nothing:

  two untagged providers, same function   tag is undefined

so `[f, f]` - one server, listed twice - counted as two sources and the
two-provider floor counted CALLS. Same shape as `least`: a rule that held in
the library and never fired at the door.

WHAT LANDED. `discover` refuses a provider that does not declare a source, and
refuses two that declare the same one, before anyone is asked. Header and bond
providers are one class with one rule; splitting them would have been a second
kind of provider with quieter rules.

  two raw functions           "header provider 0 does not say which source it
                              is: a provider must carry a tag, or two calls to
                              one server count as two sources"
  one tagged, one not         "header provider 1 does not say which source it is"
  two with the same tag       "header providers 0 and 1 are the same source,
                              one.example: one server listed twice is not two"
  an untagged bond provider   "bond provider 0 does not say which source it is"
  two distinct tags           two providers, and the round opens on
                              https://node.example:443

THE LIMIT, MEASURED RATHER THAN ASSUMED AWAY, because writing "independence is
not checkable" into this file and closing would have made "two providers" mean
"two calls":

  one server behind two names   accepted, and `calls` counts 2 - one machine
                                answered twice and the client could not tell

There is nothing to read. Two honest providers on the same chain return the
same bytes, so agreement is exactly what an honest pair looks like, and a
browser has no network identity to check a name against. A tag is a
DECLARATION, not a proof. What it buys is that the obvious case is refused and
that a lie has to be written down as a lie instead of being the default.

MUTANTS, three, all red: an untagged provider accepted (1), the same tag twice
treated as two sources (1), only header providers required to declare (1).

ONE FIXTURE FIXED, not a rule loosened: the lying bond provider in "the door
will not open on one provider" was untagged and started failing for the tag
instead of the proof. It now declares a source, so the claim it makes -
`provenBond` runs on the live path - is the claim it tests.

TESTS. blwp-client 65 -> 67, protocol 104/104, blwp-node 41/41, core 85/85.
Determinism guard 19 clean, money guard 9 clean. No test-vector file changed.
Bundle 123.6 -> 125.2 KB, 17 modules. `agreedChain` is unchanged and
headers.test.js untouched - the requirement is the door's, where the page
reaches. No network beyond 127.0.0.1. No C#, nothing deployed; daily 0.0.567.

STILL PARKED: `reach`/`endpointFor` exported and willing to verify a handed
chain - a recorded foot-gun, not on the session path; the deployment anchor
(a2); no page defines BLWP_CHAIN; the jslib unlinked since 606f54d.

## M2.1 5c CLOSED  -  the chain source, measured against its own sentence

The sentence was: the client asks two providers for headers, checks the work,
anchors on a block it already knows, and asks for the bond; a chain handed to
the door is refused. Every clause, and why it is true:

  two providers      PROVIDERS_NEEDED = 2 is the client's, a supplied `least`
                     is refused, and every provider must declare a source -
                     two calls to one server are not two providers
  checks the work    a header is refused before its work is counted: "this
                     header was not mined: its hash does not meet the target
                     it claims"
  a block it knows   BITCOIN_MAINNET_GENESIS, the client's own; a page-supplied
                     anchor is refused by name
  asks for the bond  askForBond over declared providers, and provenBond
                     requires it into the agreed mined chain
  a handed chain     chain, chains, transaction, branch and position each
                     refused at Client.at, not verified

Everything `discover` still takes from its caller is the page's by right
(`headers`, `bonds`, `ask`, `signedAdvert`), overridden by the round contract
(`committee`), or refused (`anchor`, `least`, `timeoutMs`). Walking that list
is what found `least` and then the tags, and it now turns up nothing further.

SEVEN CUTS, and each one existed because the cut before it was not enough:

  54f41d2  two providers, link-checked, most work wins, a fork refused
  969370c  and the work has to have been DONE - one fabricated header claimed
           thirty-two orders of magnitude more than mainnet
  665029a  one origin twice is one source; a provider cannot flood or stall
  81c08e1  the bond proven into a mined block of that chain
  894754d  the chain must hold a block the client already knows
  dd18cca  the door asks instead of being handed
  24f07c1  the anchor is the client's, not the page's
  7ac843b  and so is the two-provider floor
  ecd5822  and two providers means two declared sources, not two calls

COUNTS AT CLOSE. blwp-client 67/67, protocol 104/104, blwp-node 41/41, core
85/85 - 297 tests, no red, none skipped. Determinism guard 19 files clean,
money guard 9 files clean. Bundle 125.2 KB, 17 modules. PlayMode 213/189/11/13
and EditMode 185/181/1/3 as last measured at 7b4caea; no C# has moved since.

NOT DEPLOYABLE, and the reasons are no longer about the chain source: no page
defines BLWP_CHAIN so a deploy opens no session, the jslib has not been
Emscripten-linked since 606f54d, nothing has been driven in a browser since
7b4caea, and the Unity reds stand. Daily 0.0.567.

NEXT ON M2.1 is the quorum rule in step 3 - `receiptCount` answers how many
committee members have receipted a mark and 13C's threshold is five, but
whether a count is enough, and what happens when it is not, needs the other six
daemons.
