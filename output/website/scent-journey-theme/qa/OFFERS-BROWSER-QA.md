# Shipping and price offers QA

PASS: 129/129 checks; 0 failures.

Six focused responsive route samples cover home, collection, PDP, Scent Finder, Our Story and cart at 1440, 390 and 320 pixels across Light/Dark. All six PDPs and collection cards verify native ₱799 PHP, displayed reference ₱998.75 PHP and 20% OFF. Shared native Liquid fixtures cover known/unknown handles, changed price/currency, varying prices and selected variants. Currency formatting in isolated fixtures is a test filter; native preview formatting is tested separately.

Header/footer checks include exact terms, locale-local Shipping details link, 44px link targets, measured 4.5:1 contrast, text/page overflow, nav and bag interaction. Finder result and empty bag callout are checked. All browser requests are read-only; no cart/checkout mutations. Populated cart quantities 0/1/2/5 renders are covered by the separate nine-scenario purchase integration check and were not duplicated here.

Screenshots: [offers](screenshots/offers). Detailed results: [JSON](OFFERS-BROWSER-QA.json).



Independent visual inspection passed for the 320px Light header, 320px Dark footer and desktop purchase panel: offer conditions, price reference and discount are clear and unclipped.
