# archive/

Code that nothing references any more (kanban #469, Daniel 2026-10-18: "find unused code that is no longer referenced and archive it").
Moved here with `git mv`, so its history stays (`git log --follow archive/<path>`), and kept out of the active tree.

A file is here only when **nothing names it**: no import from any test, tool, seat entry, bundle or page; no other tracked file
(script, page, package.json, doc); no systemd unit, host script or env file on the testnet4 hosts. Each path below `archive/` is
its old path in the repo. To bring one back: `git mv archive/<path> <path>`.
