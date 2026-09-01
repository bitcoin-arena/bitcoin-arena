# Working order

Kept in the repo rather than in a conversation, because a plan that lives
only in chat is re-derived from scratch every session. Top item first;
each is finished and deployed before the next is started.

The rule that has cost the most time here, written down so it is not
learned a fourth time: **when a number does not move across several
attempts, stop forming hypotheses and print what the code is actually
holding.** The whitepaper sat at exactly 22% through four changes; one
Debug.Log showed Fit had been given a 9.4 x 12.2 plate while the test
measured 73.8 x 52.3, because the streamed building swaps the mesh under
a node that keeps its name. Four rounds of guessing, one line to see it.

---

## 1. Clear the red tests  - DONE

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

## 2. The army into the core  (large - the rest of stage 1, and of M1)

The core RECEIVES the army today: Unity simulates it and sends x, z and
kind every tick, which is why danger, collision and score are correct.
M1 asks for enemies that come FROM the core.

About 700 lines in `Army.cs`: squads and their drift, target selection,
firing and reload, retreat when overrun, reinforcement, the gunship
corridor, bombs. Ported to fixed point under the AST guard, the same way
the driving was - and measured against the C# original the same way,
with a reference recording rather than by eye. `PhysxReferenceTests` is
the pattern to copy.

Order within it:
  a. Unit movement - DONE. The C# army is recorded in
     test/vectors/csharp-army.json and the core now closes at its pace:
     armour 6.8 m/s, infantry 2.6, armour arriving first. Both sides hold
     short of the seam on their own side and do not cross.
  b. Firing, damage and death - PART DONE. Armour engages armour inside
     46 m, reloads 1.4-3.2 s, takes 1.1-2.4 hp off a tank that has 6-10.
     Losses now start at t=10-15 as the recording shows and neither side
     is wiped out. Attrition over a minute is still about twice the C#
     army's - 33-67% surviving where it keeps 71-83% - and the remaining
     lever is the stand-off scatter, which is really step (c)'s job.

     Three faults found, all of the same kind - a plausible model that
     produces a decisive winner instead of a front:
       - every tank started with zero reload, so all fired on tick one in
         index order and the side holding the lower indices won every
         exchange before the other had fired
       - sides were assigned by a coin toss per unit, giving sixteen tanks
         against eight; in a lethal exchange an advantage compounds and the
         larger side lost nobody. Forces are even now
       - one stand-off for the whole army is all or nothing: at 9 m the
         lines are 18 apart, permanently in gun range, and both sides are
         ground to a third in a minute; at 25 they are 50 apart and nobody
         ever fires. The spread IS the mechanism
  c. Retreat - IN, and measured. Units back off inside 24 m and fall
     right back when overrun by 14 (Army.OverrunDepth). Units are held to
     |x| < 88 as Unity holds them.

     Where it stands, measured rather than guessed:
       attrition   17-58% surviving at 60 s, C# keeps 71-83%
       z spread    9-12 m, C# holds 20
       in range    0.75 enemies each at t=10, then 0.3-0.4

     The spread is the lever, and the attrition follows it: at spread 9
     both armies arrive on one line at the same moment and half the armour
     dies in the ten seconds after contact, then the survivors separate
     and nothing more happens. C# holds a spread of 20 and gets a steady
     trickle instead.

     The chase coupling was tried and REVERTED. Porting
     goalX = foe.x as part of one movement vector was the obvious way to
     get depth; measured, it made the spread worse (9-12 down to 1.9-11.7)
     and wiped out a side on two seeds, because chasing pulls both armies
     onto the same x and concentrates the fight.

     Then the measurement that overturns all of it. The C# army fights in
     MUCH heavier contact than any two-line model suggests:

       enemies in gun range, per tank   C# 4.0-7.9    core 0.3-0.75
       armour spread along x            C# 36-45 m

     Forty-five metres of x spread across a 176 m front means the two
     sides INTERLEAVE rather than face each other - and it still keeps
     71-83% of its armour. So the fault is not too little contact. It is
     too much lethality per shot, and that is the next thing to chase,
     with numbers: how often does a C# tank actually fire, and how many
     shooters does one tank have on it? Reload and damage were matched to
     the C# constants and the per-hit fraction of max hp is identical, so
     something else is limiting how often those constants are applied.

     Two sign errors cost a round each here and both had the same shape -
     a plausible model that produces no fight at all rather than a wrong
     one. The Bull army spawns at negative z so its side is -1 while its
     Dir is +1; using side for the overrun test made every unit read as
     overrun the moment it reached its own line, and the whole army sat on
     the fall-back line without firing a shot.

  c2. Reinforcement
  d. Gunships and bombs
  e. Delete the C# army; Unity renders from core state only

## 3. Three post office buildings  - DONE, and it was the tests

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

## 4. Hover overlays  (small, and the last thing owed from the old list)

Transaction details on the loading ramp, and the full figure behind each
bar on the miner's histogram.

## 5. Prune the streamed bundles  (small)

`ServerData/` keeps every version ever built - five post office bundles,
40.9 MB copied into each build. Nothing serves the old ones and they are
uploaded on every deploy.

---

## After M1

M2 cannot start before stage 3: a lobby, a shared round start and
verification across seven nodes all need `blwp-node`, which does not
exist yet. M2 is 23-33 sessions in total by the estimate in
IMPLEMENTATION.md section 15, and that estimate has held so far.
