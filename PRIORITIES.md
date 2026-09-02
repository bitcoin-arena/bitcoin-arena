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

  d. Reinforcement, gunships and bombs - NOT STARTED, and reinforcement
     is now the next thing to build. It is not a garnish on the army; it
     is what holds the front up. Without it the first exchange decides
     the round and the survivors stand still for the remaining sixty
     seconds. Order within (d): reinforcement, then gunships, then bombs.
  e. Delete the C# army; Unity renders from core state only - NOT STARTED.

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

### Newly red, and it is ours

`npm run guard` fails on two lines, both from this item's own work:

    rules/army.js:165  operator '%' outside an arithmetic file
    sim.js:384         operator '/' outside an arithmetic file

`squad = (index >> 3) % SQUADS` and the damage roll's `/ 100 | 0`. Both
are safe as written - a non-negative index, and a truncating divide of a
positive int32 - but the guard is the rule that keeps the core portable
and it is red at HEAD. It goes first, before (d).

Also newly red and caused by this work: `SafeRouteScoresNearNothing`
banks 0.077 where it wants 0.1. Squads concentrate the danger, so a run
down the seam meets less of it than it used to. Decide whether the score
reference or the army is the thing that moved.

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
