# Working order

Kept in the repo rather than in a conversation, because a plan that lives
only in chat is re-derived from scratch every session. Top item first;
each is finished and deployed before the next is started.

Every item carries the milestone it serves. Two of them serve none: they
are worth doing and they buy no progress towards shipping, so they wait
until something that does is finished.

    1  clear the red tests            M1   done
    2  the army into the core         M1   in progress  <- the last one
    3  three post office buildings    M1   done
    4  hover overlays                 -    small
    5  prune the streamed bundles     -    small
    6  bundler: private name check    -    small

Everything for M2 and beyond is further down, under "The milestones", and
none of it should be started while item 2 is open. M2 needs stage 3
(`blwp-node`) before it can begin at all, and starting a lobby on top of
a simulation that still disagrees with the game is work built on sand.

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

## 2. The army into the core  -  M1  -  IN PROGRESS

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
  e. Delete the C# army; Unity renders from core state only - NOT STARTED.
     LAST, and deliberately: it deletes the instrument. `ArmyReferenceTests`
     and `GunshipReferenceTests` go with `Army.cs`, and no quantity can be
     recorded from the C# afterwards.

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
  l. Why the core's riflemen kill half what the C#'s do - NOT STARTED.
     Like for like, both air-on: 8-18 a round against 16-37.
  i. The reload stagger - NOT STARTED.
  j. Courier fire: tanks, at 34 m - NOT STARTED. Found by (f) and not
     foreseen when the order was set. 99% of what the army does to the
     truck is tank fire the core does not have. See "The truck is shot by
     tanks" below.

  Order: f, g, h, k, l, j, i, then e.

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

### The truck is shot by tanks, and the core does not know it

The courier pass parks a truck at x=0, z=0 and leaves it there for ninety
seconds. Cumulative, at the core's establishment:

                        C# recording        core
    tank hits             163                 none, ever
    tank damage          1271.7               -
    rifle hits              6                  every unit inside 26 m
    rifle damage           13.9                one flat point a hit
    tanks within 34 m     7 - 18 per sample
    riflemen within 26 m  0 - 36 per sample

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

## 4. Hover overlays  -  no milestone  -  small

Transaction details on the loading ramp, and the full figure behind each
bar on the miner's histogram. Polish: it makes the live chain data
readable, and it moves nothing towards a milestone.

## 5. Prune the streamed bundles  -  no milestone  -  small

`ServerData/` keeps every version ever built - five post office bundles,
40.9 MB copied into each build. Nothing serves the old ones and they are
uploaded on every deploy. Housekeeping, and it grows every time a model
changes.

## 6. Bundler: the private name check  -  no milestone  -  small

`tools/bundle.js` refuses duplicate EXPORTED names and does not look at
private ones, and the bundle is one scope. Two `const`s of the same name
throw at bundle time, which is the loud case; two `var`s or two
`function`s would not, and the bundle would ship a different program from
the modules with only `bundle.test.js` hashing to catch it. Widen the
check to every top-level declaration. Written up under item 2.

---

# The milestones

Items 1 to 5 above are the work in front of us. This is what that work is
FOR. After item 2 closes, the next list is drawn from M2 - and its first
entry will be stage 3, the node daemon, because nothing else in M2 can
start without it.

Four of them, and the numbers are cumulative sessions from the estimate
in IMPLEMENTATION.md section 15. That estimate has held so far, which is
some reason to trust the rest of it.

Playability comes long before money. Each milestone is something you can
put in front of a person, not an internal checkpoint.

## M1 - core-driven single player          11-18 sessions

**What you can do:** exactly today's game, in a browser, as it plays now.
The difference is invisible from the outside: the truck's position, the
damage it takes, the enemies and the delivery all come from the
deterministic JavaScript core instead of from PhysX. No network, no
money, no other players.

**Why it is the one to steer for.** It is not merely early - it retires
the two largest risks in the whole undertaking:

  - *does determinism hold?* Four JavaScript engines, several versions of
    each, three processor architectures. If it does not, everything
    downstream is impossible. Stage 0 answered this: identical across V8,
    SpiderMonkey and JavaScriptCore, across four V8 versions, and across
    arm64, x86-64 and big-endian s390x.
  - *does the fixed-point model still DRIVE well?* The feel behind the
    handbrake, the grip and the camera is WheelCollider behaviour that has
    to be derived again from scratch. That is iteration with a person at
    the wheel, not a mechanical port - and the way it was actually done
    was to record the PhysX truck and hold the core to the recording.

**Where we are:** stages 0 and 2 are finished, stage 1 is most of the way.
What is left is the army, which is item 2 above.

## M2 - play-money multiplayer             23-33 sessions

**What you can do:** the whole experience with other people, without
sats. A lobby. Everyone starting the same round at the same time on the
same map. Joining late and catching up. Ghosts of the other trucks on
your screen. A leaderboard. And - the part that matters - results that
seven independent nodes have each replayed and agreed on.

**Why it is a milestone and not a feature.** This is where determinism
stops being a claim and starts being load-bearing. Seven machines replay
the same recorded inputs and must arrive at the same score, byte for
byte, or the round does not settle. Everything about the core - the
integer arithmetic, the banned float, the committed trig table, the
draw order being part of the protocol - exists for this moment.

**What has to be built first:** stage 3, `blwp-node` - an HTTP and
WebSocket daemon over `node:sqlite` holding entries, checkpoints and
transcripts. Then stage 4: the replay pool, five-of-seven finality,
objection handling, what happens when a node equivocates or no quorum is
reached. M2 cannot begin before that daemon exists.

## M3 - testnet sats                       31-45 sessions

**What you can do:** play for real Lightning payments, on testnet, where
the coins are worthless and the mechanics are not.

Hold invoices, so a stake can be committed without being spent. Verifiable
secret sharing, so no single node ever holds the key that releases the
pot. FROST threshold signatures, so a payout needs several nodes to agree
and no one of them can steal it.

**Why testnet first:** every one of those mechanisms fails in ways that
cost money on mainnet and cost nothing here. The settlement state machine
is the part of this project where a bug is not a bad round but a lost
stake.

**What has to be built first:** stage 5, reading bonds off the chain and
publishing a committee from them, on regtest. Stage 6, the Unity bridge
and a wallet. Stage 7, the settlement itself.

## M4 - mainnet, lowest bracket            36-52 sessions

**What you can do:** play for real sats, in the smallest stake bracket
there is.

**What is different from M3:** not much code - bonds and arbitration move
on-chain, and there are load tests. The real difference is that it is
reviewed by someone outside this project before it opens. A system that
holds other people's money and has only ever been read by the person who
wrote it is not finished, however green its tests are.

---

## What the milestones are NOT

They are not a schedule. The session counts are effort, not calendar, and
the two risky ones are M1 (does it drive well) and M3 (does the money
move correctly). The rest is work, not uncertainty.

They are also not independent. Nothing after M1 is worth starting while
the core still disagrees with the game about anything: every hour spent
on a lobby is an hour spent on top of a simulation that has not yet been
proven to reproduce the thing it replaced.


---

# The work for M2, in order

Written down now so the order is decided once rather than argued each
time. Each entry can only start when the ones above it are done, and the
reason is given where it is not obvious - most of these dependencies are
not preference, they are "this cannot be tested without that".

Nothing here starts while item 2 above is open.

## M2.1  The node daemon                            stage 3

  1. **A round on one node.** HTTP and WebSocket over `node:sqlite`: open
     a round, accept an entry, take input batches, close it. One process,
     one player, no verification. This is the smallest thing that can
     hold a game and everything else attaches to it.
  2. **Transcripts.** Every input batch stored tick-numbered and
     idempotent, so a repeat is harmless and a gap is visible. A round
     that cannot be replayed from its own transcript is worthless later,
     so this comes before anything that would rely on it.
  3. **Checkpoints.** The state hash written at agreed ticks. Cheap now,
     and it is what makes a disagreement findable rather than merely
     detectable - without them a divergence is "somewhere in ninety
     seconds".
  4. **Entry quotas.** A funded entry before the node stores a byte.
     Comes before opening a port to anyone else, not after.
  5. **Backpressure and reconnection.** `ws` buffers without limit; watch
     `bufferedAmount`. Batches are tick-numbered so a reconnecting client
     re-sends and the node ignores what it already has.

## M2.2  Many players in one round                  stage 3

  6. **The Round Contract.** Map, duration `T_run`, seed, and the score
     parameters section 18A.7 requires it to pin: `E_reference`, the
     corridor half width, the clamps on `T`, `min_score`, `K` and `r`.
     Agreed before anyone moves. This is NOT a shared physics state -
     see the next item - it is a shared set of rules.

  7. **A private world per player** (spec 0.10). This is the one that
     changes the shape of everything:

         financial_world(p) =
           deterministic_sim(RoundContract, map, player_seed, player_inputs)

     There is no giant synchronised physics state, and there is not meant
     to be. Alice's physics cannot change Bob's result. Each player's
     enemies react only to that player's own truck. This is what lets the
     round hold sixty players without sixty trucks in one simulation.

  8. **Ghosts, with NO collision** (spec 0.9). Other trucks are drawn
     from their transcripts and are never inputs to the local
     simulation. A player must not be able to change my odds by ramming
     me, blocking a road, pulling enemies onto me or sacrificing
     themselves for me. Ghost snapshots are presentation only.

     They are also the first place a determinism failure becomes
     something you can SEE rather than something a test reports: a ghost
     that drifts from what that player actually did is a divergence in
     the open.

  9. **Late join** (spec 0.8). NOT a catch-up replay - I had this wrong
     until reading the spec. Entry stays open while the round runs, and
     every accepted entrant gets the same `T_run` from their own start,
     so wall-clock starts differ by design. There is nothing to catch up
     to, because there is no shared world to be behind in.

 10. **The leaderboard**, from signed final results. Presentation, not
     authority (spec 0.11).

## M2.3  Verification across nodes                  stage 4

 11. **A replay pool.** Worker threads, each importing `@blwp/core` once.
     Priority: objected runs first, then top-ranked, then the rest.
     Capacity is MEASURED, not assumed.
 12. **Five-of-seven finality on the RESULT.** Seven nodes replay a
     player's run and five must agree. Needs the pool, and needs
     checkpoints (3) to say WHERE they disagree rather than merely that
     they do.
 13. **The payout table** (spec 20). Once entry closes, membership is
     known and every accepted player has a FINAL result:

         PayoutTable = F(RoundContract, Membership, FinalResults)

     Deterministic. Nodes sign its hash and 5-of-7 makes it final. A node
     signing a table that is not `F(...)` of its own published inputs is
     slashable - which is only enforceable because the function is
     deterministic, which is the whole point of the core.

 14. **Role separation** (spec 21). `--roles game_verify` stores
     transcripts, replays, signs results and the payout table, and MOVES
     NO FUNDS. `--roles settlement` verifies the contract and the 5-of-7
     and moves funds. Built as separate roles from the start, because
     retrofitting a separation of powers is how it ends up not being one.

 15. **Objection.** A node that disagrees says so, with the checkpoint it
     diverged at, and the pool re-runs at priority.
 16. **Equivocation and no-quorum.** What happens when a node signs two
     different results, and what happens when five cannot be found. Last,
     because they cannot be provoked until everything above exists.

## M2 is done when

Seven local nodes independently replay a round played by several people,
agree byte for byte on every result AND on the payout table, and a
deliberately corrupted node is caught by the other six.

## What the spec rules out, and it is worth knowing before building

  - **No house** (spec 19). No bankroll, no RTP promise, no server-funded
    multiplier, no central balance. `payouts <= validly collected stakes`.
    Bots may outbid humans; they cannot create liability, because there
    is nobody to be liable.
  - **No shared physics.** Ghosts never touch the simulation. Any design
    that has one authoritative world with everyone in it is the wrong
    design for this protocol, however normal it looks.
  - **The leaderboard is not authority.** It presents signed results; it
    does not produce them.

---

# The work for M3, in order

Money. Every step here is one where a bug costs a stake rather than a
round, which is why testnet comes first and why the order is stricter.

## M3.1  The chain, on regtest                      stage 5

  1. **Bond construction** (spec 5A.3B). A P2TR output with three spend
     paths, and the shape matters:

         key path     MuSig2(node_key, arbitration_aggregate_key)
                      cooperative release or slash - one signature,
                      indistinguishable on chain
         script A     node_key, after bond_maturity (CLTV) - unilateral
         script B     k-of-m arbitration keys, before maturity - the slash

     Path A is the one to get right: `bond_maturity` exists so that
     **arbitration can never freeze a bond forever**. If arbitration
     disappears, the node gets its money back on its own. A design where
     someone else's silence costs you your bond is not one anybody should
     post a bond to.

  2. **Bond verification.** Read a bond output and prove it is what it
     claims. Nothing about a committee means anything until this works.

  3. **Census by verification, not scanning** (spec 6.1, 5A.2, 5A.4).
     Sorted by `(txid, vout)`, NOT by a hash of the pubkey - a hash can be
     ground until it sorts where you want it, a txid cannot.

  4. **Eligibility** (5A.3) - objective criteria only, and the minimum
     census size and stake ceiling (5A.10). A committee drawn from too
     small a census is not a committee.

  5. **The committee seed from a FUTURE randomness beacon** (5A.5). This
     one closes a complete exploit and must not be simplified:

         committee_seed = H(census_root_gv || census_root_settle
                            || round_id || round_randomness)
         round_randomness = drand.round(committee_time)

     The beacon value **does not exist yet** when `round_id` is published.
     The contract commits to WHICH beacon round will be used, never to its
     value.

     Why it cannot be done the obvious way: if the randomness is already
     known when the creator picks `round_id`, committee selection is a
     pure function of a value the attacker controls. Grinding round_ids
     offline until both committees are your own nodes is trivial and
     undetectable - and the "committee cannot be overwritten" check
     (5A.11) passes, because nothing was overwritten.

  6. **The `committee_time` window** (5A.5, 4.6.1). Between publication
     and `start_time`, and it is not a policy choice: the preimage shares
     are encrypted TO the settlement committee (23.1), so the committee
     must exist before an entry can be constructed at all. Selecting at
     `start_time` and allowing commitment before that is impossible, not
     merely unwise.

  7. **Player-node separation** (5A.13). A selected node may not sign
     anything for a round its operator is playing in:

       - every advertisement declares an `operator_id`; nodes sharing one
         are siblings for all conflict rules
       - a conflicted node's result signatures, payout-table signatures
         and settlement participation are INVALID and it earns no fee
       - signing anyway is slashable with a one-artifact proof
       - if conflicts drop a committee below threshold, the affected
         entries are `ENTRY_VOID` and refunded rather than settled by a
         compromised committee
       - the client MUST show, before commitment, whether any selected
         node's operator is playing

     Without this an operator with a moderate share of the census can
     sign himself wins in the rounds he is selected for, and nothing else
     in the protocol forbids it.

  8. **Committee publication.** Sortition with LINEAR weight, comparing
     `ticket_a * weight_b` against `ticket_b * weight_a` - never
     dividing, because a division is a rounding rule and a rounding rule
     is an attack surface. Plus 5A.11: selection cannot be overwritten.

  9. **Role separation between committees** (5A.9). Game/verify and
     settlement are drawn separately.

## M3.2  The client and the wallet                  stage 6

  4. **The Unity bridge**, hardened for real sessions - it exists already
     for single player.
  5. **`@blwp/client`.** The session flow: enter, pay, play, settle.
  6. **NWC wallet.** Comes after the client because the client defines
     what the wallet is asked to do.

## M3.3  Settlement                                 stage 7

  7. **Hold invoices.** A stake committed without being spent. Everything
     else in settlement assumes this works.
  8. **The state machine** (section 9.4), persisted and crash-safe:

         AWAITING_INVOICE -> HELD -> (result FINAL)
            qualifying: CANCEL_REQUESTED -> CANCELLED -> PAYOUT_QUEUED -> PAID
            losing:     SHARES_REQUESTED -> PREIMAGE_READY -> SETTLE_REQUESTED -> SETTLED
            void:       EXPIRED

     Every transition written to SQLite BEFORE the external call, and
     reconciled against the backend on startup. Lightning operations must
     be assumed to be interrupted mid-flight. The saving invariant is
     that a repeated settle with the same preimage is harmless.
  9. **VSS custody of the stake preimage.** No single node ever holds it.
     After the state machine, because the machine defines when a share is
     asked for.
 10. **FROST.** Threshold signatures so a payout needs several nodes and
     no one of them can steal. Implemented against the RFC with its test
     vectors, which is why it is comparatively low risk despite sounding
     like the hardest part.
 11. **Backends.** LND first, others after.

 12. **The node fee** (spec "Node fee"). 2% of gross round volume, split
     1% to the seven game/verify slots and 1% to the seven settlement
     slots, so each slot earns about 0.1429% for its role. An operator
     selected for both earns both, because it does both jobs.

     Three details that are easy to get wrong and expensive to get wrong:
       - a slot earns its share only if it performed the contract-defined
         minimum service - receipts, replay and signing for game/verify,
         participation in the settlement window for settlement
       - a conflicted node (5A.13) never qualifies
       - unearned shares are redistributed pro rata among the other
         eligible nodes in the SAME role pool, keeping the total at 2%
       - remainders in millisatoshis: floor each base share, then
         distribute the remaining msat in ascending
         `H(round_id || node_pubkey)` order

     The same shape as the player payout, and for the same reason: every
     node must compute the identical table from the same inputs.

## What is honestly not trustless

Spec 5A.3B says it plainly rather than hiding it, and so should we: the
arbitration quorum can slash a bond, and arbitration is a set of keys
held by people. `bond_maturity` bounds the damage - arbitration can never
freeze a bond forever - but it does not remove the trust. Anyone posting
a bond is trusting that quorum not to collude against them within the
window. Say so in the client, before someone posts one.

## M3 is done when

A round is played for testnet sats, the stake is held rather than spent,
the winners are paid by a threshold signature no single node could have
produced, and a node killed mid-settlement recovers to the right state on
restart.

---

# M4

Bonds and arbitration move on-chain, load tests, and external review
before it opens. Little new code and the highest stakes: a system holding
other people's money that has only been read by the person who wrote it
is not finished, however green its tests are.
