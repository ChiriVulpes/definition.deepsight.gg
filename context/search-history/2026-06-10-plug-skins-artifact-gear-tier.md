# Plug Skins, Artifact Actions, And Gear Tier Plugs

- Searched `DestinyInventoryItemDefinition` for uncategorised plug hashes from the manifest warning, including representative `_skins`, `artifact_perks`, `artifact_reset`, and `weapon_tiering.plugs.mods.enhancers` rows.
- `_skins` rows: all 1066 checked entries include item categories `[56, 52, 59]`, and all are weapon ornament plug shapes even when Bungie omits `ItemOrnamentWeapon` traits.
- Artifact rows: named `artifact_perks` items still expose `itemTypeDisplayName: "Artifact Perk"`, but empty artifact plugs and `artifact_reset` use blank item type names and need plug-category fallback classification.
- Gear Tier rows: `weapon_tiering.plugs.mods.enhancers` has five named plugs: `Empty Gear Tier Upgrade` plus Tier 2-5 upgrade actions.
- Pattern: classify dynamic `_skins` categories structurally as weapon ornaments, but model artifact empty/reset and Gear Tier upgrades with explicit deepsight plug types.
- Exhaustiveness: `_skins` is safe as a structural fallback for this table snapshot; artifact and Gear Tier rules should stay tied to their explicit `PlugCategoryHashes`.
