# What these two files are  —  HARD (Daniel 2026-09-05)

PRIORITIES.md = milestones and status. Short. Readable.
TASKBOOK.md   = measurements, comments, done tests, letter notes.

Do not put probe numbers, commit essays, or test dumps in this file.
Put them in TASKBOOK.md.

# HARD (Daniel 2026-09-05)

Every step, every fix: git commit AND git push origin
phase0-deterministic-core. PRIORITIES, TASKBOOK, models, screens, code.
Nothing stays local. Claude commits as claude after each measured change.

# Working order

Top item first. Finish and deploy before starting the next.

    1  clear the red tests            M1   done
    2  the army into the core         M1   done
    3  three post office buildings    M1   done
    4  hover overlays                 -    done
    5  prune the streamed bundles     -    done
    6  bundler: private name check    -    later (Daniel: start M2)
    8  M2.1 checkpoints               M2   parked — after M1 is closed
    9  M1 liquidation picture         M1   open

HARD (Daniel 2026-09-05 13:25): finish M1 before M2. Stop checkpoint
work. Back to M1.a13. Do not start M2 until item 9 is closed.

HARD (Daniel 2026-09-05 16:48): do not start M1.a14 until M1.a13 is
closed. a13 was not finished; a14 jumped the queue. Back to a13.

HARD (Daniel 2026-09-05 16:52): finish the current letter before starting
a new one. Then update PRIORITIES.
If current is a13 and a14 does not exist, the new item is a14.
If a14 already exists, the new item becomes a14 and the old a14 slides
to a15 (and so on). Do not start the new letter until the current one
is closed.

HARD (Daniel 2026-09-05 09:04): when M1.a13 bullets are done, stay on
M1 until the picture letter is closed. Then M2. Parked a8/a11/a12/d/e
stay parked unless they block a13.

HARD (Daniel 2026-09-05 09:24): every letter and every bullet is marked
done or not done. Claude updates the mark when it changes. iOS audio
was worked today and is still not done — he must go back to it.

Twelve red tests: none on the deploy path. List in TASKBOOK.md.

## M1

Liquidation picture — OPEN. Truck drives *into* the crater.
Details: TASKBOOK.md. Next letter: M1.a15.

M1.a8: not done (parked) — coin-margined Binance probed.

M1.a11: not done — strike voice built, needs Daniel's ear.

M1.a12: not done (parked) — five extra venues, no public stream.

M1.a13: 2026-09-05 morning picture. Claude updates each line.
- iOS audio — done (Daniel 2026-09-05 13:47: audible on iPhone)
- camera look-back — done on the machine, unheard on the phone. Yaw off the
  nose 8.7 deg to 3.8; roll 5.4 to 0; a tap moves the view 0.00 deg where it
  moved 0.69; the look returns under 0.5 deg 3.07 s after a 2.5 s hold.
  Residual: the dead zone is one degree of aim, 2.9 px at 640 wide, and a
  real thumb may wander further - only Daniel's tap can say. Looking while
  driving still needs multi-touch, which is not this bullet.
- real mushroom mesh — not done (GLB on disk, not in the blast yet)
- HUD: which liquidation, which exchange — not done
- SIM toggle under PRACTICE — not done
- tanks along the front, not in a heap — not done
- late-run truck/tanks not under the ground — not done
- no numbers on mining bars — not done
- whitepaper fits the frame — not done
- crater twice as deep — not done
- wipe in crater radius, no wrecks — not done

M1.a14: parked until a13 is closed — wheels in the ground at the depot / on the model.
  Standing bury is fixed (0.178 m to 0.000, 3bd4208): the wheel was seated on
  the collider's 0.550 m while the mesh reaches 0.728 m. Craters and the
  core/terrain surfaces were both cleared by measurement, not argument.
  Still open when it resumes: the driving bury, 0.12-0.21 m, which cannot be
  told from bounding-box inflation until that model is made readable.
- happens more often after round 1 or 2, reproducible then
- not always; usually fine
- write a test that plays 5–10 rounds and checks wheels vs ground
- not done

M1.d: not done — mushroom cap not seen from the driving camera.

M1.f: not started — a second finger cannot look around while a thumb
holds a driving pad. `Input.GetMouseButton(0)` follows the FIRST touch,
so the pad owns the pointer for the whole gesture. Needs real
multi-touch input, not a camera change.

M1.e: not done (harmless) — first truck spawn from Unity relief.

DONE: 1–5, a–a7, a9, a10, b, c. Names and commits in TASKBOOK.md.

---

# The milestones

Items 1 to 7 above are the work in front of us. This is what that work is
FOR. After item 2 closes, the next list is drawn from M2 - and its first
entry will be stage 3, the node daemon, because nothing else in M2 can
start without it.

Five of them, and the numbers are cumulative sessions from the estimate
in IMPLEMENTATION.md section 15. That estimate has held so far, which is
some reason to trust the rest of it - with one correction: it never
carried the frontend at all, which is why MF is now counted separately
instead of being absorbed silently into whichever milestone happened to
need a screen.

**MF is the odd one.** M1 to M4 are sequential; MF is gated and runs
alongside them, because a protocol nobody can watch is a protocol nobody
can debug. Its gates say which milestone each part unblocks.

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

**Where we are:** M1 is closed as a set of rules and DEPLOYED. It was
announced closed once and reopened the same day, because a tank drove
sideways - its heading was a random walk and the hull on screen faced 90.5
degrees away from its own travel. That is (x), fixed and proved in a browser.

The suites are not green and will not become green: eleven of the twelve
reds drive the retired C# engine, which (e) deliberately does not build,
and the twelfth needs a graphics device this machine does not have. Each
of the twelve is listed by name with its failure text and its cause under
item 7. None of them asserts anything the core does in the browser, so
none of them is evidence about the thing being deployed. That is the
decision on the record: a red that cannot go green without reviving PhysX
is not a deploy gate, and a red that needs an X server is not one either.

DEPLOYED 2026-09-03 from 2d4e6f2 plus this note, build 19.1 MB:

    btc-logistics-core.pages.dev       daily      HTTP 200
    btc-logistics-core-m1.pages.dev    M1 freeze  HTTP 200
    btc-logistics-war.pages.dev        UNTOUCHED  serves its own older page

Proved on the DEPLOYED freeze, not on a local server and not by argument -
the core's own state buffer read out of the live page:

    at the start   tick 16   x -100.400  z 10.200  heading 90  speed 0.000  hp 100
    20 s throttle  tick 272  x  -70.319  z 10.200  heading 90  speed 12.885  hp 100
    travelled      30.08 m in 256 ticks

The truck's position, its heading and its speed all come out of the core's
buffer in a browser with no editor anywhere near it. Photographed too:
both armies on the field, the road, a gunship overhead, the HUD.

Two things named rather than glossed. The page logs "ERROR: Shader" twice
under headless SwiftShader; it has done so in every browser run this
session and the scene renders regardless - it is the software rasteriser,
not the build. And the build hung once before this one: an earlier attempt
to run the suite WITHOUT `-nographics` died on the missing X display and
left its licensing client behind, and the next build then sat on
`futex_wait` for 40 minutes with 59 seconds of CPU. Killing the orphan
cleared it; the rebuild took 6m09s. Worth knowing before someone waits
another forty minutes.

The rules themselves: Stages 0, 1 and 2 are finished, and the
army - item 2 above - is in the core with the picture proved in a browser
rather than argued: the truck's position, the damage it takes, the enemies
and the delivery all have a named core reader with no C# gate in front of
it, and the recording lies inside the core's envelope on all 78
quantities it publishes.

STALE UNTIL NOW, AND IT CONTRADICTED ITEM 2. This paragraph used to say
(s), the infantryman's halt, was the one comparison of the seventy-eight
still outside, that it cost a layout word (`U_WORDS` 8 -> 9, every offset
after it, every golden vector and `BlwpLayout.cs`), and that it stayed NOT
STARTED. All three are wrong now. (s) is DONE, it cost NO layout word - the
halt is drawn from a hash of the man's index and the cycle number, so it
carries no state - and the count is 78 of 78, which is what the item 2
heading has said since (s) closed.

## MF - the client                          14-20 sessions

**What you can do:** see, test and finish everything the other milestones
build. MF is not a phase that happens after them - it is the milestone
whose absence makes them unverifiable.

**Why it is separate.** The frontend was invisible in this plan: M2's
description promised a lobby, ghosts and a leaderboard while M2's work
list contained none of them, and one sentence about the Unity bridge was
the only screen work anywhere. Assumed work is unestimated work.

**Why it is not simply last.** A protocol you cannot watch is a protocol
you cannot debug. Seven nodes disagreeing byte-for-byte is a log line;
seven nodes disagreeing where you can SEE which truck went where is a
bug you can fix in an afternoon. So MF is gated, not sequential:

    MF-a   before M2 can be tested at all
    MF-b   before M3 can be tested at all
    MF-c   finishing - what makes it shippable rather than demonstrable

Build each gate when the milestone it unblocks begins, and track the
whole thing as one milestone so it stays estimated.

**All of it is new.** The single-player build has no concept of another
player, of money, or of an outcome somebody else decided.

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

Item 2 is closed. Daniel 2026-09-03: start M2. Current letter is M2.1.

## M2.1  The node daemon                            stage 3  -  OPEN

  1. **A round on one node.** DONE. `packages/blwp-node`: HTTP opens a
     round, reads it and takes an entry; a WebSocket carries input batches
     and the close. `node:sqlite`, one process, one player, no
     verification, and the node does not step - a test asserts no file in
     `src/` reaches for the core.

     The ids are the protocol's: `roundId(contract)` and
     `entryId(contract)`, tagged hashes checked against `@blwp/protocol`
     over the wire. Bodies are the protocol's own bytes, so the contract
     that crosses the wire is the contract that is hashed.

     IDEMPOTENCE IS IN THE SCHEMA, at every level. A tick is keyed
     `(round, entry, tick)`, so a repeat is a no-op the database performs
     rather than a check a caller can forget; and because the ids are
     hashes OF the contracts, opening or joining twice is the same round
     and the same player, not a `UNIQUE constraint failed`. Measured on a
     running process:

       90 ticks accepted                        90
       the same message again                    0
       ten more at tick 200                     10
       on disk, over the range 0..209      100 rows, a gap of 110
       a liquidation sent twice          stored once
       open twice / join twice        one row, one id, each
       reopened from the file       found by its own roundId, entry intact
       close, then close again        "closed", then "already closed"

     `TYPE_INPUT_BATCH = 0x08` is the one message it needed: round, entry,
     first tick, the five words `step` takes, and the sparse `[tick, size]`
     liquidations - without those a transcript replays a round with no
     strike, no crater and no fallout in it. `batch.js` is on the money
     guard's list because it carries Q16.16 words bound for the core.

     Node 12/12, protocol 40/40, money guard 6 files clean - the guard had
     never been installable here, `packages/protocol` declaring no
     devDependencies at all. Unity untouched.

  2. **Transcripts.** DONE. The round as one chained object, and the proof
     that replaying it lands where the inputs did. `previous_hash` was
     missing from the batch (spec section 11); with it `TYPE_TRANSCRIPT =
     0x09` carries round, entry and batches in chain order, `GET
     /transcript` hands the object over with its hash, and the node checks
     the chain before it serves.

     Proved across a real process boundary: 300 ticks in five batches with
     one liquidation, fetched as 6622 bytes, replayed by
     `core/tools/replay.js` in a second process reading nothing else, to
     `1e3eb491...330a870b` - the digest the inputs produced directly. One
     flipped bit and it stops with "the chain is broken at batch 1".

     Three holes the close-out found, all shut: the node took a batch it
     could not later hand over, because a tick gap passed the chain check -
     contiguity is checked at intake now, where the client can still fix
     it, and the refusal names the due tick; `flatten` handed back absolute
     liquidation ticks while every consumer walks the array from zero, so a
     round beginning at tick 50 would have put a strike nowhere - it
     rebases; and enforcing those made the node demand a start at tick 0,
     which contradicts `joinTick`, so it reads that off the contract the
     player signed.

     Core 67/67 and determinism guard 19 clean, protocol 50/50 and money
     guard 7 clean, node 13/13. Unity untouched.

  3. **Checkpoints.** OPEN. The state hash written at agreed ticks, which is
     what makes a disagreement findable rather than merely detectable -
     without them a divergence is "somewhere in ninety seconds".

     Unsigned slice CLOSED: the object, the table keyed (round, entry, tick),
     ingest on /play and GET /checkpoints, with equivocation, a monotonic
     tick and the named input chain each refused by name.
     Signatures CLOSED: the session key signs the tagged id, the signature
     rides beside the object. Numbers in TASKBOOK.md.
     CheckpointReceipt: the OBJECT exists - type, tag, encode/decode,
     vectors - but nothing issues one, because a node signs with its own key
     and the daemon has no identity yet. That waits on step 5b.
     Still open here: issuing receipts, receipt gossip, and a client that
     computes a state hash and sends one. M2.1 is not finished.
  4. **Entry quotas.** A funded entry before the node stores a byte.
     Comes before opening a port to anyone else, not after.
  5. **Backpressure and reconnection.** Inbound DONE: the socket caps a frame
     at the longest message the protocol can encode, and a batch may not be
     longer than the round's own `blockTicks`. Still open: watching outbound
     `bufferedAmount`, and a resume point a reconnecting client can ask for.

  5b. **Discovery: read it off the chain** (spec 25.1). A node's address
     is in its own bond funding transaction, so there is no directory to
     run and nothing to keep alive. Two parts:

       - **`BOND_MARKER`.** Every bond pays a dust output to one fixed
         protocol address. Without it the census is unfindable in
         practice - a P2TR output is a 32-byte key like any other, and
         BIP158 filters exclude `OP_RETURN` - so nothing would be
         searchable. One marked output makes every bond findable by any
         light client.
       - **The advertisement in the witness** of the same transaction, so
         the transaction that proves the bond also carries the endpoint.

  5c. **The chain source: our own mempool.space, verified not trusted.**

     Run our own instances - that buys availability, and only that. For a
     stranger, an API we operate is worth exactly what our website is
     worth, so it is redundancy and not a security argument.

     The security comes from verifying, and it is ONE task with the
     above, not a later hardening pass:

         block headers      from several independent sources, most work
                            wins. 80 bytes a block, under 4 MB for all of
                            history, far less from a checkpoint
         bond transaction   plus a merkle proof, from the API
         verify             proof against header, H(advertisement)
                            against the bond output's commitment

     Then the API can **omit** but not **forge**, and omission is answered
     by asking another. Without it, whoever controls the API controls
     which census the client sees and therefore which committee it
     believes legitimate.

     Built in from the start deliberately. Retrofitted it never happens:
     by then it works, and nobody touches something that works.

## M2.2  Many players in one round                  stage 3

  5d. **`network_id`, and the fields that must exist before they are
     used** (spec 27A.4). Cheap now, a breaking change later.

     Anything the Round Contract carries has to be in its FIRST version,
     because adding a field to something signed is a format break. Three
     of them are not needed until M3 and must be there from the start:

       - `network_id` itself. Contracts carry it, nodes reject foreign
         ones, and it is what makes a fork that changes the donation
         addresses a different network rather than a theft.
       - the donation set field. It may be empty for all of M2 - there is
         no Lightning yet - but the field and its hash must be in the
         contract.
       - `required_protocol_version`, against the
         `supported_protocol_versions` already in the advertisement.
       - **`config_hash`** (27A.7.5). The `game_config` the round runs
         under, so a round created before an activation keeps its own
         rules to the end. Nothing uses it until M3.1B and it cannot be
         added afterwards.

     > **Decide `genesis_parameters` and generate the donation authority
     > and recovery keypairs before the first daemon runs, and put the
     > recovery key in cold storage the same day.**
     >
     > ```
     > network_id = H( genesis_parameters
     >              || authority_pubkey || recovery_pubkey
     >              || predecessor            // 0 at genesis
     >              || fork_certificate_hash ) // 0 at genesis
     > ```
     >
     > Introducing any of it later changes the network identity - and
     > every bond posted before that becomes worthless, its capital
     > timelocked and its census entry void. None of it is *used* before
     > M3. All of it must *exist* in M2.1.

     `genesis_parameters` is a block, not a word (27A.6), and settling it
     means settling all of: `chain`, committee slots and thresholds per
     role, `census_min_nodes`, `census_confirmations`, `bond_maturity`,
     `notice_period`, the bracket table, `bond_marker`,
     `randomness_source`, and `genesis_config_hash` - the opening
     `game_config` with its damage table, timings and `node_fee_bps`.

     That last one is the trap: the network's opening fee and opening
     difficulty are part of its identity, so "we will tune it later" means
     "we will fork later". Tune it in M2, where nothing is committed yet.

     This is exactly the kind of thing discovered in month four.

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

     Deterministic. Nodes sign its hash and the role's threshold makes it
     final - `genesis_parameters`, not the literal 5-of-7 (M3.1 item 0). A node
     signing a table that is not `F(...)` of its own published inputs is
     slashable - which is only enforceable because the function is
     deterministic, which is the whole point of the core.

 14. **Role separation** (spec 21). `--roles game_verify` stores
     transcripts, replays, signs results and the payout table, and MOVES
     NO FUNDS. `--roles settlement` verifies the contract and the
     settlement threshold and moves funds. Built as separate roles from the start, because
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
  - **No node holds player funds between rounds** (spec 30.9, 24A.3).
    Money is in flight during a round and nowhere else. Session balances,
    deposits, stored payout addresses, credit and any other resting float
    are out of scope permanently - not deferred, not optional, not behind
    a flag. The design was written out once and removed; 24A.3 keeps it so
    it is not reinvented as a fresh idea.
  - **Governance changes numbers, never funds.** Even a hard fork at
    51/66 reaches the rules and nothing else: in-flight rounds bind to the
    `network_id` and `config_hash` they were created under, stakes settle
    against a committee whose keys a successor does not hold, and bonds
    are timelocked outputs a fork does not rewrite (27A.8.5).
  - **No pause button, anywhere.** Not for the admin key, not for a
    broken config, not for a bad fork. The recovery path is always that
    nodes decline to serve and rounds find no committee (27A.7.6).

---

# The work for M3, in order

Money. Every step here is one where a bug costs a stake rather than a
round, which is why testnet comes first and why the order is stricter.

## M3.1  The chain, on regtest                      stage 5

  0. **Network parameters first** (27A.6). Everything below depends on
     which network it is running on, so `genesis_parameters` is loaded
     before anything else and **nothing in this section reads a literal**
     for committee slots, thresholds, minimum census, confirmation depth,
     `bond_maturity`, `notice_period` or the governance schedule.

     Regtest is 2 slots and 2-of-2 with one confirmation and a 100-block
     maturity, which is what makes the whole of M3 runnable on a laptop.
     Mainnet is 7 and 5-of-7 with 6 confirmations and 30 days. A hardcoded
     7 anywhere means the section cannot be tested at all.

     The safety property is worth knowing while writing it: the committee
     shape lives in `genesis_parameters`, which `network_id` commits to,
     so a 2-of-2 network **cannot** be mistaken for mainnet - a mainnet
     client rejects the contract because it names another network, not
     because a flag was checked. There is no threshold switch to set
     wrongly in production, and there must never be one.

     And what regtest does not prove, so a green run is not over-read:
     at 2-of-2 one node down is no quorum, so it fails where mainnet
     would not; the 13B overlap argument is vacuous with one possible
     subset; and 5A.13 voids entries the moment either operator plays.
     All three are correct behaviour, not bugs to configure away.

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

     `randomness_source` is a genesis parameter (27A.6), so read the
     beacon from it and never call drand directly. Regtest uses
     `mock:<seed>` with `H(seed || committee_time)`: drand's whole value
     is being unpredictable, which is worth nothing in a test and costly
     as a dependency - an external service every run must reach, and a
     seed nobody can fix, so no test can select a known committee twice.
     With a mock a test asserts WHICH nodes were selected rather than
     only that selection terminated.

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

## M3.1B  Governance                                stage 5

 9a. **100% coverage is the entry condition for this whole section**, not
     a follow-up task. Nothing in M3.1B ships on partial coverage, and
     "it works on regtest" is not evidence - regtest is two nodes that
     agree, which is the case that never fails.

     Full branch coverage on: the median, the tally, turnout and approval
     arithmetic, every phase boundary, proposal validation, `parent`
     chaining, deposit and its cap, re-affirmation, and certificate-chain
     walking.

     The adversarial cases are tests, each one named for what it prevents:

     - a vote arriving one block after the window closes
     - a vote from a bond created after `vote_census_height`
     - two votes from one bond in the same block (lower txid wins)
     - a changed vote at the last height (last wins)
     - abstentions counting for turnout and not for approval
     - turnout met, approval missed, and the reverse
     - exactly on each threshold, and one weight either side of it
     - two proposals with the same `parent`, both passing
     - a proposal activating with a stale `parent`
     - `activation_height` before the cooldown ends
     - a repeal whose config is not byte-identical to an ancestor
     - a fork certificate with a vote proof that is not in a block
     - a certificate chain that does not reach the client's built-in root
     - a bond that never re-affirmed, counted in the successor census

     Property tests where the shape allows it: the tally is a pure
     function of chain state, so the same height must always give the
     same result, and no ordering of the same votes may change it.

 9b. **Bond-weighted median for the self-binding scalars** (spec 27A.2):
     `bond_min` per bracket and `proposal_deposit_sats` - the latter
     **capped** at `bond_min(lowest bracket) / 100` (27A.7.2), because
     the median is bond-weighted and without a cap the largest holders
     set the price of proposing: a million sats is nothing to them and
     total exclusion for a small operator. The cap makes the right to
     propose follow from the right to participate. **Not** the node
     fee and not the bracket set - those moved to the ballot in v4.6.2,
     because a fee paid by players and declared by its recipients is a
     take rate, not a discovered price.

     No proposals, no voting window, no quorum, no tally. Each node
     declares its preference in its advertisement and the value in force
     is the median over the census, weighted by bond. A pure function of
     chain state, so every participant computes the same one.

     Needs the census, so it cannot come before M3.1. Nothing to build in
     M2: without bonds there is no weight.

 9c. **`bond_min` notice period and operator escalation** (27A.3, 5A.10B).
     A rise takes effect only after `notice_period`; a fall immediately.
     Affected nodes escalate at T-30d, T-14d, T-3d and T+0.

     The reason it cannot be immediate is worth keeping in front of
     whoever implements it: **a bond cannot be topped up.** It is one
     timelocked output, so an operator warned on the day they drop a
     bracket cannot respond for thirty days. Also allow several bond
     outputs summing to one weight, or the warning has no answer.

 9d. **Config proposals and the ballot** (27A.7). The proposal object
     carrying the FULL config and its `parent` (never a diff - two diffs
     passing in one window merge into something nobody voted on),
     `OP_RETURN` votes signed by the bond key, the chain-state tally,
     activation, and `config_hash` on the Round Contract so a running
     round keeps its own rules to the end.

     Every number, so the spec does not have to be open to build it:

         class     turnout  approval  review  voting  cooldown
         DESIGN      30%      >50%     1008    1440    2016
         MONEY       40%      >=66%    1008    1440    2016
         UPGRADE     51%      >=66%    2016    2016    4320

     Turnout is of ALL bonded capital; approval is of the weight that did
     not abstain. All of it comes from `genesis_parameters`, so regtest
     runs 1/6/1 and a full cycle takes under a minute.

     **Repeal** is part of this item, not a later one: review 0, voting
     720, cooldown 0, and only for a config byte-identical to a live
     ancestor. It can go back, never forward - which is what stops it
     being a fast path for new changes. A mechanism with no exercised
     undo is a mechanism whose undo does not work.

     Build the tally as a **pure function of (chain height) -> result**
     with no I/O in it. That is what makes 9a's property tests possible
     at all, and it is far harder to retrofit than to start with.

 9e. **Hard forks** (27A.8). The fork certificate, `network_id` as a
     chain, UPGRADE at 51/66 on 2016/2016/4320, opt-in bond
     re-affirmation, and the client walking a certificate chain back to
     its compiled-in root.

     Do this on regtest with two networks, ancestor and successor, both
     running - because the property that matters is that the ancestor
     **keeps working** for an operator who refused the fork, and a test
     that only checks the successor cannot see it.

 9f. **The operator UI** (27A.7.7) - a separate app, and the one place
     the frontend touches keys. It is a client of the operator's OWN
     node, paired by a `blwp-operator:` URI, with scoped tokens; the node
     builds and signs and **no key ever leaves it**. Worst case of a
     stolen token is a wrong vote, never a bond, and that property is
     what makes a convenient web UI defensible at all - build it so that
     stays true.

## M3.2  The client and the wallet                  stage 6

  4. **The Unity bridge**, hardened for real sessions - it exists already
     for single player.
  5. **`@blwp/client`.** The session flow: enter, pay, play, settle.
  6. **NWC wallet.** Comes after the client because the client defines
     what the wallet is asked to do.

  6a. **Budgeted play** (24A.1). A two-minute round means a wallet
     approval every two minutes, which is the thing that makes people
     stop playing. An NWC budget - granted once, time-boxed - removes
     every approval after the first while changing **nothing** about
     settlement: each round still has its own hold invoice, its own
     `payment_hash` and its own expiry refund, and no node holds a
     balance because there is no balance.

     This is the whole answer to approval fatigue, which is why 6c can be
     a prohibition rather than a trade-off.

  6b. **Donations paid, and the authority that points them** (27A.4).
     The set is a list of LNURLs with basis-point shares summing to
     10000, signed by the authority key generated back in M2.1, and each
     recipient is paid its share as a separate Lightning payment.

     Two rules that will be tempting to break:
       - a failed payment to one recipient MUST NOT be redistributed to
         the others. An unreachable endpoint would otherwise quietly
         redirect other people's money.
       - nothing but the player's own choice decides the percentage, and
         zero is valid. No node, lobby or creator may rewrite it.
       - the donation is **inclusive** in the round amount, exactly like
         the node fee: it comes out of the stake, never on top of it, and
         the player approves one number with the split shown.

     Rotation via the cold recovery key is part of this task, not a later
     one: a key with no exercised revocation path is a key whose
     revocation does not work.

  6c. **No session balances, ever** (24A.3). Specified once and removed.
     If it comes back as a request: money is in flight during a round and
     nowhere else. A resting balance has no unilateral exit at these
     sizes - once a deposit settles the sats are in someone else's
     Lightning node, an on-chain escrow costs more than a 100 sat stake,
     and slashing punishes an absent operator without returning a sat.
     6a already fixes the approval fatigue that motivated it.

  6d. **Where a payout goes** (24A.2). The player supplies a destination
     and the protocol keeps none: LNURL-withdraw, or a BOLT11 invoice
     they provide at claim time. Nothing is stored between rounds and no
     address is remembered, because a remembered payout address is a
     resting relationship with a player and the beginning of an account.

     A payout unclaimed inside `claim_window` follows the existing
     expiry path. It does not become a balance.

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

 12. **The node fee** (spec "Node fee", 27A.7). `node_fee_bps` - opening
     value 200, so 2% - split evenly between the game/verify and the
     settlement pool, each slot earning its role's half divided by the
     slot count. An operator selected for both earns both, because it
     does both jobs.

     Two things that were true in an earlier draft and are not now:
       - the fee is **INCLUSIVE** in the round amount, not charged on top
         of it. 100 sats staked with a 2% fee and a 2% donation is 96 sats
         reaching the pot, and the player is shown that breakdown before
         approving.
       - it is **not a constant and not a median**. It is a MONEY-class
         ballot value (27A.2, 27A.7) starting from `genesis_config_hash`,
         so read it from the round's `config_hash` and never from a
         literal. The slot counts likewise come from `genesis_parameters`
         - hardcoding seven means the code cannot run on regtest.

     Three details that are easy to get wrong and expensive to get wrong:
       - a slot earns its share only if it performed the contract-defined
         minimum service - receipts, replay and signing for game/verify,
         participation in the settlement window for settlement
       - a conflicted node (5A.13) never qualifies
       - unearned shares are redistributed pro rata among the other
         eligible nodes in the SAME role pool, keeping the total at
         `node_fee_bps` - the pool never shrinks and never grows
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

# The work for MF, in order

**When each piece is actually needed.** The gates above are coarse; this
is the interleaving, and the surprise in it is that the lobby comes late.

(Item numbers are MF's own, 1 to 19. The numbering inside M3.1, M3.2 and
M3.3 overlaps because each follows its own stage in IMPLEMENTATION.md -
left as it is rather than churned, but read section-first.)

| After | Build | Because |
|---|---|---|
| M2.1 node daemon | *nothing* | A daemon is tested with curl and tests. No screen earns its keep yet. |
| M2.2 many players | **9** harness, **2** ghosts | You cannot verify "several people in one round" without seeing them. Joining is a `round_id` in a URL at this stage - crude on purpose. |
| M2.3 verification | **7** observer, **8** transcript player | This is where byte-level disagreement appears, and it is the moment a screen stops being a convenience. |
| M2.3 verification | **1** lobby, **4** results, **3** late join, **5** objection, **6** reconnect | Now rounds exist, are joinable and have signed outcomes - so there is something to list and something to show. |
| M3.1 chain | **9f** operator UI | Once bonds and votes exist, an operator needs to see them. Separate app. |
| M3.2 client | **10-15** money screens | After per-round settlement works. |
| M3.3 settlement | **16** settlement inspector | Its failures are invisible from the game screen. |
| M4 | **17-19** mobile, errors, unattended flow | Shippable, not demonstrable. |

**Why the lobby is not first.** A lobby lists rounds and lets you join
them, so it needs rounds that exist, are enterable and have outcomes -
all of M2.2 and most of M2.3. Building it earlier means building a list
of nothing, then rebuilding it when entry, committees and results arrive.
The crude `round_id` URL is not a shortcut being paid for later; it is
the right interface until there is more than one round to choose from.


## MF-a  Before M2 can be tested                    stage 4

M2 is a daemon and a protocol, and **none of it is visible**. These are
the items without which "seven nodes agreed" is a log line rather than
something anybody can check.

  1. **The lobby.** Rounds open for entry, their stake, their map, how
     many have joined, and a countdown to `committee_time`. Before that
     moment the committee is genuinely unknown, so the lobby says
     "committee pending" rather than showing an empty list - the wait is
     a security property (§5A.5) and should read as one.

  2. **Ghosts.** Other trucks on your screen, interpolated from their
     checkpoints, visibly not collidable. They must never be able to
     affect your world - that is spec 0.10, and a ghost that pushes you
     is not a rendering bug but a protocol violation you can see.

  3. **Joining late.** Catching up from the transcript with the world
     already moving, without a loading screen that makes it feel broken.

  4. **The results table.** Every player's score and rank, and WHICH
     nodes signed it. Showing the signers is not a detail: it is the only
     moment the player sees that no single party decided the outcome.

  5. **Objection and disagreement, on screen.** When a node objects or
     the committee cannot reach threshold, the player must see what is
     happening and what it means for their round. Silence during a
     dispute reads as a hang, and a hang reads as theft.

  6. **Reconnect.** The disconnect rule (spec 15) exists; the interface
     for it does not. What the player sees while dropped, and on return.


  7. **The observer view.** Watch a round from outside: every player,
     every checkpoint, every node's opinion of the score side by side.
     This is a testing instrument, not a feature, and it is the one that
     turns a byte-level disagreement into something with a location.

  8. **The transcript player.** Load a recorded round and replay it in
     the renderer at any speed, scrubbing back and forth. The core is
     deterministic precisely so this is possible; not building it means
     debugging replays by reading numbers.

  9. **A local multi-client harness.** N browser clients against local
     nodes in one command. Testing "many players in one round" by opening
     tabs by hand does not survive the tenth time.

## MF-b  Before M3 can be tested                    stage 7

 10. **The entry screen.** One number the player approves, with the
     breakdown under it: stake, node fee, donation, net to the pot. Fees
     are INCLUSIVE (24A, 27A), so 100 sats staked is not 100 sats played,
     and the first time a player discovers that must not be after paying.

 11. **The donation control.** The player's own choice, zero valid, cap
     enforced (`donation_bps_max`), and every recipient shown before
     approval. Nothing may preselect a number on their behalf.

 12. **Conflict disclosure** (5A.13). Before commitment, whether any
     selected node declared a conflict - and what a self-declaration is
     worth, stated plainly rather than implied by a green tick.

 13. **The payout claim.** LNURL-withdraw or the player's own BOLT11
     invoice (24A.2), the claim window counting down, and no address
     remembered afterwards.

 14. **Waiting for settlement.** Held stake, threshold signing, refund on
     expiry. The player is waiting on other people's machines and must be
     told so, with the refund path visible the whole time - that is the
     property that makes the wait tolerable rather than frightening.

 15. **The budget screen** (24A.1). What was granted, what is left, what
     it was spent on, and when it lapses. A budget the player cannot
     inspect is worse than approving each round.


 16. **The settlement inspector.** Which state every entry is in
     (`HELD`, `SETTLE_REQUESTED`, `EXPIRED`...), which node holds which
     VSS share, and what the timers are. Settlement fails in ways that
     are invisible from the game screen, and a node killed mid-payout is
     a state machine question that a UI answers in seconds.

## MF-c  Finishing                                  stage 8

 17. **Mobile.** The single-player build already runs there; nothing
     above assumes a phone. The lobby, the entry breakdown and the claim
     screen are the ones that will not fit.

 18. **Error states, everywhere.** Node unreachable, chain source
     disagreeing, budget exhausted, claim window expired, committee
     pending forever. Every one of these currently reads as a hang, and
     a hang in a money application reads as theft.

 19. **The whole flow, unattended.** Someone who has never seen it opens
     the page, joins a round, plays, is paid, and plays again - without
     being told anything. Until that works, everything else is a demo.

## MF is done when

A person who did not build it can play a paid round on a phone, see who
signed their result, and be paid - and a developer can take a
disagreement between two nodes and find where the trucks diverged without
reading a transcript by hand.

---

# M4

Bonds and arbitration move on-chain, load tests, and external review
before it opens. Little new code and the highest stakes: a system holding
other people's money that has only been read by the person who wrote it
is not finished, however green its tests are.
