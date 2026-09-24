# COD popup handoff QA

17/17 checks passed; 0 failed.

Mocked DOM, prepare and verify only. Zero network requests, storage writes, real orders or deployment. This verifies the theme handoff contract; it does not claim vendor-side order creation or actual popup appearance.

Source SHA-256: `156e1804b98204399f6ef4751ad277be2d0c42cd7f470ce056fff02098ba12dc`

- PASS: Missing EasySell form rejects before prepare or any mutation
- PASS: Missing official EasySell opener rejects before prepare or any mutation
- PASS: Existing commerce operation rejects before prepare or any mutation
- PASS: Existing shared bridge operation rejects before prepare or any mutation
- PASS: Exact selection is prepared before official opener; verification follows visible popup
- PASS: Same native variant quantities 2 + 1 coalesce to 3 before EasySell opens
- PASS: Concurrent calls remain blocked through preparation and post-open verification
- PASS: Collection handoff without a primary variant does not rewrite native PDP quantity
- PASS: Verification waits for popup geometry instead of merely waiting for opener click
- PASS: Post-open cart mismatch closes EasySell and propagates the original failure
- PASS: Prepare failure cannot open or verify and releases handoff for a retry
- PASS: Popup not opening times out at 8 seconds without verification or order success
- PASS: Readiness recheck after prepare fails closed when opener removed
- PASS: Readiness recheck after prepare fails closed when form removed
- PASS: Readiness recheck after prepare fails closed when commerce becomes busy
- PASS: Missing shared namespace leaves script inert
- PASS: All cases remain isolated with zero network and storage attempts
