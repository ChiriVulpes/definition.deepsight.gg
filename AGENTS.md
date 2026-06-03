This repository maintains the generator for `definition.deepsight.gg`: Destiny 2 / Bungie API data is fetched, reshaped, augmented with deepsight-specific definitions, versioned, and published as static JSON/types plus the `deepsight.gg` definitions package.

## Philosophy
Large changes, hard paths, and broad refactors are all acceptable directions when they are discussed with the user first.

"Useful" and "easy" over "perfect". Bungie API data sucks, as they are clearly working with heuristics and years of tech debt, so "perfect" is not a realistic goal.

## Context
- `main` is the source branch for the generator and task code.
- `definitions` is the published definitions/package branch.
- `generated` is the generated static-site payload branch.
- `deploy` is the GitHub Pages output branch.
- `task/` contains the TypeScript tasks and most hand-maintained generation logic. Tasks can be run with `pnpm run task <task-name>`. Most are not registered as package.json scripts.
- `task/manifest/` contains curated deepsight definition builders, manifest helpers, drop table data, plug/socket categorisation, enum helpers, and related source logic.
- `static/definitions/` contains seed/public definition files used by the generator. Some files there are intentionally maintained, but many are generated or refreshed by tasks.
- `static/testiny/` is cached Bungie manifest data.
- `docs/` is generated/static output.

Those are not hard rules. If a task calls for changing output-like files or reshaping the pipeline, explain the intent and coordinate with the user.

### deepsight.gg definition docs
For a catalog of the deepsight definitions, see wiki snapshot at `wiki/Home.md`.
Use `pnpm exec task save_wiki` if the `wiki` folder is not present or seems old, which will download the latest wiki snapshot.

### Bungie API data docs
The bungie-api-ts dependency contains almost all of the Bungie API documentation in JSDoc form.

## Validation
Do validation in this order:
- Use typechecks as the first line of defense.
- Use `pnpm exec task manifest` to rerun the build against the current data.
- If there is new Bungie API data, the `manifest` task will regenerate enums. If there isn't new data, but you've changed the enum generation code, run `$env:ENUMS_NEED_UPDATE='true' pnpm exec task generate_enums` to force enum regeneration. 

For Bungie defs updates and enum-reference compatibility work, validate behavior at the generated output layer via the `definition_diff` task, which compares local `docs/definitions` against the CI/output branch data with stable pretty JSON diffing:

- Use `pnpm exec task definition_diff` for a compact Git diff & summary.
- Use `pnpm exec task definition_diff --params --file <DefinitionName>.json --full` to inspect one suspicious definition file in detail.
- Treat enum declaration diffs as supporting context only. They show name churn, not whether curated deepsight definition output stayed intentional.
- If the diff is broad because Bungie data legitimately changed, summarize which generated definition files changed and call out unexpected removals, remaps, or key movement.

## JSON data querying
Use `pnpm exec task json_search --params ...` for fast questions about large JSON data shapes and manifest records.

Core flags:
- `--table <name>` loads `static/testiny/<name>.json`.
- `--load` loads the last saved selection from `.query/last.json`.
- `--using name=source` exposes another table, file, or saved selection in the predicate scope.
- `--where "<js predicate>"` filters records. The current record is available as `record`, its fields are available as bare names, and semantic helpers are available as `is`.
- `--count` prints only the result count and is incompatible with `--columns`.
- `--columns "a,b.c"` prints selected fields from matched records.
- `--raw` prints only the selected data payload instead of the selection envelope.
- `--save` writes the selection envelope to `.query/last.json` without changing normal output.

Examples:
- `pnpm exec task json_search --params --table DestinyInventoryItemDefinition --where "is.fragment && is.stasis && is.hunter" --count --save`
- `pnpm exec task json_search --params --load --columns "hash,displayProperties.name,plug.plugCategoryIdentifier,itemTypeDisplayName"`

Semantic helpers must fail closed. Each broad `is.*` predicate must be implemented with table-specific `switch (context.table)` branches and must throw for unsupported tables. Do not add broad semantic predicates unless the rule is exhaustive for every supported table; use a narrower name or an explicit `--where` condition instead.
