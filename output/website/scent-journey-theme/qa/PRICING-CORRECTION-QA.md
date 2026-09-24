# Native pricing correction QA — PASS

39/39 checks passed. Eight native Liquid fixtures, all six PDPs, collection cards, predictive search and the single Finder result were checked.

Current displayed offer: Now ₱799.00, Original ₱1,099.00, Save ₱300.00 and 27.3% OFF. Initial product JS preserves the amount; an isolated no-discount variant clears the reference, percentage and amount, and switching back restores them.

- Read-only local preview. Selected-variant fallback uses a clearly isolated in-memory option; no catalog, cart or checkout mutation.
- Earlier OFFERS-BROWSER-QA report is retained as historical evidence; its old ₱998.75/20% expectations are superseded.


Screenshots: screenshots/pricing-correction/.

The initial run identified missing native compare prices on five current fragrances. The narrow owner-approved reference fallback resolves this; initial failure evidence is retained separately. Desktop Light and mobile Dark price blocks were visually reviewed for value accuracy and overlap.
