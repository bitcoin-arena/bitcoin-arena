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
  l. Why the core's riflemen kill half what the C#'s do - OPEN, on ONE
     term, with seven causes ruled OUT by measurement rather than by
     argument. Like for like, both air-on: 8-18 a round against 16-37.
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
     The 19 men now have a MEASURED CAUSE and it is a named rule
     difference: `Army.Spawn` draws a squadOffsetZ = Rand(-5,5) per man
     and the core's `riflePost` returns an X offset only, so the core's
     squads are 58 m deep where C#'s are 10, they interpenetrate, and a
     third of the core's bombs reach 2-4 squads at once and carry 54% of
     the covered men. Capping a bomb at one squad removes 26.1 men a
     round where the excess is 19.0. See "The 19 men" below. NOT fixed:
     that is a spawn rule change and its own step.
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
     windows. It is therefore NOT a candidate for the slope residual. The
     fix is a rule change and is not made yet. See "The 0.0199 was an
     integer overflow" below, and "The squads measured against Army.Spawn",
     "What a bomb is worth, taken apart", "The depth, air-off against
     air-off", "What a bomb finds, per detonation", "The slope", "Where
     the bombs land, and when" and "The rifle line divided by the
     meeting" below.
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
> So the 19 men remain OPEN with the anchors ruled out. What is left unread in
> the infantry's arrangement is small and named: C# gives each man a lifelong
> `drift = Rand(-1,1)` applied as `s.x += toward + s.drift * 0.7f * dt`
> (`Army.cs:681`) which the core does not have - but `toward` snaps him onto
> his post each tick, so the equilibrium offset is `drift * 0.7 / 60` <= 0.012 m
> and it cannot carry 19 men. It is recorded here as read, not as a candidate.

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
