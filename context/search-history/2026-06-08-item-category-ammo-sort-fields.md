# Item Category, Bucket, And Ammo Sort Fields

- Searched `DestinyInventoryItemDefinition` with `json_search --help --path itemCategoryHashes --docs-depth 1` and `json_search --help --path equippingBlock --docs-depth 1`.
- Searched `DestinyInventoryItemDefinition` with weapon bucket predicates and `equippingBlock.ammoType`; searched `DestinyInventoryBucketDefinition` with `match.name(/weapon/i)` and `record.category === 3`.
- Useful fields: `itemCategoryHashes` is Bungie's volatile category membership list; `equippingBlock.ammoType` indicates weapon ammo type when present.
- Bucket evidence: named weapon buckets are `953998645` Power Weapons, `1498876634` Kinetic Weapons, and `2465295065` Energy Weapons, but `record.category === 3` is broader than weapons.
- Caveats found: 6 records in the three weapon buckets lack `equippingBlock.ammoType`; these are non-equippable `itemType: 20` quest/key/dummy-like items, including recent-looking entries such as `Rohan's Passkey` and `Dyadic Prism`.
- `record.equippable && record.equippingBlock?.ammoType` returns 2128 records. Adding the three weapon buckets to that rule still returns 2128 records, so `equippingBlock.ammoType` plus `equippable` is the cleaner raw-table weapon signal in this data.
- Pattern: sorting/filtering code should prefer the normalized conduit item fields. For raw `DestinyInventoryItemDefinition`, `record.equippable && record.equippingBlock?.ammoType` is stronger evidence than bucket-only.
- Exhaustiveness: bucket-only is not exhaustive enough for a safe `is.weapon` helper. `is.weapon` now uses `record.equippable && record.equippingBlock?.ammoType`, with bucket checks reserved for auditing exceptions rather than primary classification.
