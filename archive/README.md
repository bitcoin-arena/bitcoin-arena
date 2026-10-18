# archive/

Code that nothing references any more (kanban #469, Daniel 2026-10-18: "find unused code that is no longer referenced and archive it").
Moved here with `git mv`, so its history stays (`git log --follow archive/<path>`), and kept out of the active tree.

A file is here only when **nothing names it**: no import from any test, tool, seat entry, bundle or page; no other tracked file
(script, page, package.json, doc); no systemd unit, host script or env file on the testnet4 hosts. Each path below `archive/` is
its old path in the repo. To bring one back: `git mv archive/<path> <path>`.

**Never archive a file under a core's hashed root** (a game's `src/`, `frozen/<hash>/`): a core's hash covers every file there, so
moving one out changes the core and the node then refuses its own game. Measured 2026-10-18: moving `nextblock/src/rules/terrain.js`
and `noise.js` here moved nextblock's core from 68e2b3d6 to 41108145 and a seat from main refused to start ("core 41108145 is installed
for it, and its manifest lists no such core"); both went back.
