# json_search Handoff

This note captures footguns found while using `pnpm exec task json_search --params ...`.

## Immediate Usage Guidance

- Prefer `record.<field>` for broad optional fields:
  - Safer: `record.itemCategoryHashes?.includes(1)`
  - Risky: `itemCategoryHashes?.includes(1)`
- Bare field access is convenient, but if a record does not contain the field, the current `with (record)` predicate wrapper can fall through to outer scope and throw `ReferenceError`.
- Do not assume an `is.*` helper exists. If the helper is not implemented, it may currently evaluate as falsy instead of failing loudly.
- `--count` is intentionally incompatible with `--columns`; run count and projection as separate queries.

## Footguns Observed

1. Missing bare fields can throw.

   Example:

   ```powershell
   pnpm exec task json_search --params --table DestinyInventoryItemDefinition --where "itemCategoryHashes?.includes(1)" --count
   ```

   This can throw when a record lacks `itemCategoryHashes`.

   Prefer:

   ```powershell
   pnpm exec task json_search --params --table DestinyInventoryItemDefinition --where "record.itemCategoryHashes?.includes(1)" --count
   ```

2. Unknown semantic helpers can silently return no matches.

   Example:

   ```powershell
   pnpm exec task json_search --params --table DestinyInventoryItemDefinition --where "is.weapon" --count
   ```

   If `is.weapon` is not implemented, the result can look like valid evidence instead of a query error.

## Recommended Tool Fixes

1. Wrap the record used by `with (record)` in a Proxy that returns `undefined` for missing record fields while preserving access to globals such as `Math`, `Date`, `Number`, and `String`.

2. Wrap `SemanticIs` in a Proxy so unknown `is.*` predicates throw `UnsupportedSemanticPredicateError`.

3. Include table and record key context when predicate evaluation throws.

4. Add focused tests or sample task assertions for:
   - missing optional bare fields,
   - unknown semantic predicates,
   - supported semantic predicates still failing closed on unsupported tables,
   - `record.<field>` access continuing to work.

## Relevant Files

- `task/utility/search/JsonSearch.ts`
- `task/json_search.ts`
- `AGENTS.md`
