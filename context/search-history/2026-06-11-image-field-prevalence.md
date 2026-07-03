# Image Field Prevalence

Tables/files searched:
- `DestinyInventoryItemDefinition`
- `DestinyActivityDefinition`
- Manifest-wide `Destiny*Definition` image path scan from `static/testiny`, excluding `profile.json`

Useful queries:
- `pnpm exec task json_search --params --table DestinyInventoryItemDefinition --where "!!displayProperties?.icon" --count`
- `pnpm exec task json_search --params --table DestinyInventoryItemDefinition --where "!!screenshot" --count`
- `pnpm exec task json_search --params --table DestinyInventoryItemDefinition --where "!!iconWatermark || !!iconWatermarkShelved" --count`
- `pnpm exec task json_search --params --table DestinyActivityDefinition --where "!!pgcrImage || !!displayProperties?.icon" --columns "hash,displayProperties.name,displayProperties.icon,pgcrImage" --limit 5`
- `pnpm exec task json_search --params --table DestinyVendorDefinition --where "record.mapIcon" --count`
- `pnpm exec task json_search --params --table DestinyVendorDefinition --where "displayProperties?.mapIcon" --count`
- `pnpm exec task json_search --params --table DestinyActivityModeDefinition --where "pgcrImage" --columns "hash,displayProperties.name,pgcrImage" --limit 3`

Useful pattern:
- Inventory items have many image-bearing fields: 36,717 definitions with `displayProperties.icon`, 13,912 with `screenshot`, and 19,884 with `iconWatermark` or `iconWatermarkShelved`.
- Activities commonly mix small icon paths with larger `pgcrImage` paths, including placeholder or missing-icon cases.
- Manifest-wide scan found 190 current Bungie definition image path tuples; strict categorisation covered all 190 with no uncategorised paths.
- Current vendor image fields use `displayProperties.mapIcon` and `locations.[].backgroundImagePath`; top-level `mapIcon` and `background` were not present in current `DestinyVendorDefinition`.
- `ItemIcon` and `Iconography` share the same 165 discovered icon source paths; `Iconography` is narrowed by image-analysis constraints for white-on-transparent square-ish icons.

Helper fit:
- This is reference evidence for image path extraction/categorisation, not enough on its own for a safe `is.*` semantic helper.
