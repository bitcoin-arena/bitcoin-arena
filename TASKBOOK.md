# Task book

Measurements, comments, done tests, letter notes.
Not the status board. Status lives in PRIORITIES.md.

Date convention: when a number is measured, write it here with the commit.

THE TWELVE RED TESTS, ONE LINE EACH. Named at f103f71, counted again at
5c81a7a - the same twelve, in suites that have grown since. Not one is on the
deploy path: eleven reach for the C# army that (e) does not build, and the
twelfth needs a graphics device this machine has not got. None can go green
here, and none may be loosened.

    EditMode   1 of 136 red
      CombatFxTests.RifleFireProducesAFlashAndATracer
        builds `new Army(3)` and steps the RETIRED C# army for 20 s. Its
        sibling TankFireProducesABlast has the same shape and passes, so it
        is the C# rifle path, not the harness. Depends on: reviving the C#
        army, which is forbidden.

    PlayMode  11 of 180 red, 10 skipped
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

    Rotating twelfth, one of the two, never both in a run:
      PostOfficeTests.TheGogglesAnimate  and
      RampReadyTests.TheRealTransactionsReplaceTheStandInsWhileNothingIsLoaded
        item 1's load flake; which one appears changes between runs of the
        same tree. Depends on: the suite's own load, not on any code here.

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
