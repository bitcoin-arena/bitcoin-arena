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

## 1. Clear the red tests  (short)

Two are failing and they make everything after this harder to judge.

- `TheBlockBandIsInEnglishAndNumbered` finds no numbered mined faces.
  First hypothesis, to be MEASURED not assumed: the same streaming swap
  as the whitepaper - the band is wired before the model has finished
  landing, so the plates it wires are not the plates that end up there.
- `TheRealTransactionsReplaceTheStandIns` reports 10 where 2 is
  expected. New, and it appeared alongside the live-histogram work.

`TheGogglesAnimate` is a known flake - it passes alone and depends on a
network fetch plus a two-second animation window. Leave it.

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
  a. Unit movement and squads, measured against a recorded C# run
  b. Firing, damage and death
  c. Reinforcement and retreat
  d. Gunships and bombs
  e. Delete the C# army; Unity renders from core state only

## 3. Hover overlays  (small, and the last thing owed from the old list)

Transaction details on the loading ramp, and the full figure behind each
bar on the miner's histogram.

## 4. Prune the streamed bundles  (small)

`ServerData/` keeps every version ever built - five post office bundles,
40.9 MB copied into each build. Nothing serves the old ones and they are
uploaded on every deploy.

---

## After M1

M2 cannot start before stage 3: a lobby, a shared round start and
verification across seven nodes all need `blwp-node`, which does not
exist yet. M2 is 23-33 sessions in total by the estimate in
IMPLEMENTATION.md section 15, and that estimate has held so far.
