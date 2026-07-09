# features/

Each feature (e.g. `routes-safety`, `reports`, `journey`, `women-safety-index`)
gets its own folder here once business logic starts, following this shape:

```
features/
  <feature-name>/
    components/   # feature-only UI, not reused elsewhere
    hooks/        # feature-only hooks
    api/          # React Query hooks + service calls for this feature
    types.ts      # feature-only types
    index.ts      # public exports other code should import from
```

Rules:

- Cross-feature UI belongs in `src/components/ui` or `src/components/shared`, not here.
- Only import a feature's internals through its `index.ts` — never reach into
  `features/<name>/components/SomeInternal.tsx` from outside the feature.
- Page components in `src/pages` compose features; they should stay thin.

Phase 1 intentionally leaves this folder empty — no business logic has been
implemented yet.
