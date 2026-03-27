# Copilot Instructions — eessi-pensjon-saksbehandling-ui

## Commands

```bash
npm run test:filtered             # Run selected tests (Jest filtered config file)
npm run build                     # Production build (output: build/)
npm run start                     # Dev server on port 3000
npm run typecheck                 # TypeScript check (tsc --noEmit)
```

## Architecture

This is a React 19 SPA for NAV pension caseworkers (saksbehandlere) working with the EESSI system. It runs on NAIS (NAV's Kubernetes platform).

### Dual context: PESYS and Gjenny

The app serves two entry points — `/` (PESYS) and `/gjenny` (Gjenny) — each representing a different pension system context. Both share the same components but differ in API endpoints and BUC handling. The active context (`pesysContext`) is tracked in Redux and determines which backend URLs are called.

### State management (Redux Toolkit)

- **Store**: `src/store.ts` — exports typed hooks `useAppDispatch` and `useAppSelector`
- **Reducers**: `src/reducers/` — one file per domain (app, buc, person, joark, p5000, etc.), combined in `src/reducers/index.ts`
- **Actions**: `src/actions/` — one file per domain, matching the reducer names
- **Action types**: string constants in `src/constants/actionTypes.ts`, following `DOMAIN/ACTION/PHASE` pattern (e.g., `APP/USERINFO/SUCCESS`)

### Async API pattern with `@navikt/fetch`

All API calls use the `call()` function from `@navikt/fetch`. Each call specifies:
- `url` — the endpoint (often templated with sprintf)
- `type` — an object with `request`, `success`, `failure` (and optionally `forbidden`) action type strings
- `expectedPayload` — mock data used in development/test mode
- `cascadeFailureError` — whether to propagate errors

```typescript
return call({
  url: sprintf(urls.SOME_URL, { param }),
  expectedPayload: mockData,
  type: {
    request: types.THING_REQUEST,
    success: types.THING_SUCCESS,
    failure: types.THING_FAILURE
  }
})
```

### Server-side proxy

`server.mjs` is an Express server that runs in production. It handles Azure AD on-behalf-of token exchange and proxies requests to backend services (`/frontend` → frontend API, `/fagmodul` → fagmodul API).

### URL templating

API URLs are defined in `src/constants/urls.ts` using `%(param)s` sprintf placeholders. They are interpolated at call sites with `sprintf(url, { param: value })`.

## Conventions

### Type declarations

TypeScript interfaces and types live in `src/declarations/*.d.ts` files (e.g., `buc.d.ts`, `person.d.ts`), separate from implementation. These are organized by domain.

### Application structure

SED-type-specific UI lives under `src/applications/` (BUC, P2000, P4000, P5000, P8000), each with their own components, pages, and tests. Shared components are in `src/components/`.

### Testing

- Tests are co-located with source files (e.g., `buc.test.ts` next to `buc.ts`)
- `react-redux` is globally mocked in `src/setupTests.tsx`
- Use `stageSelector(defaultSelector, overrides)` from `src/setupTests` to set up Redux state for component tests
- Action tests mock `@navikt/fetch`'s `call` function and assert it was called with expected URL/type configs
- `src/utils/testSelectorUtils.ts` provides `trackSelectorCalls` / `assertSelectorsAreMemoized` for detecting unmemoized selectors

### Internationalization

i18n uses `react-i18next` with Norwegian Bokmål (`nb`) as default language. Translation files are in `public/locales/{nb,en}/` organized by namespace: `buc`, `message`, `p2000`, `p4000`, `p5000`, `p8000`, `ui`, `validation`. In tests, `useTranslation` is mocked to return the translation key as-is.

### UI components

The app uses NAV's design system: `@navikt/ds-react` for components, `@navikt/ds-css` for styles, and `@navikt/aksel-icons` for icons. Country/flag handling uses `@navikt/land-verktoy`, `@navikt/landvelger`, and `@navikt/flagg-ikoner`.

### Path aliases

`src/*` is aliased to `./src/*` in both tsconfig and Vite config, so imports use `src/actions/buc` rather than relative paths.

## Git Commit Messages — Arlo's Commit Notation (Modified)

All commits in this repository **must** use our modified version of [Arlo's Commit Notation](https://github.com/RefactoringCombos/ArlosCommitNotation). Each commit message starts with an intention prefix, a risk separator, and a short summary.

### Format

```
<intention><risk separator> <Short summary>
```

### Risk separators

| Separator | Meaning | Example |
|-----------|---------|---------|
| ` - ` | Proven safe | `r - Extract method calculatePension` |
| `! - ` | Risky | `R! - Refactor auth flow` |
| `!! ` | Very risky | `F!! Add untested SED editor` |

### Intention prefixes

Use **lowercase** for safe, non-behaviour-changing work. Use **UPPERCASE** for behaviour-impacting or higher-risk work.

| Prefix | Meaning | Description |
|--------|---------|-------------|
| `f/F` | Feature | Changes or extends one aspect of program behaviour |
| `b/B` | Bugfix | Repairs undesirable behaviour without altering others |
| `r/R` | Refactoring | Changes implementation without changing behaviour |
| `d/D` | Documentation | Changes documentation or comments only |
| `e/E` | Environment | **Manual** changes to build, CI, dependencies, or tooling |
| `u/U` | Update | **Automatic** bumps and environment updates (auto-merge, dependency bots) |
| `t/T` | Test | Adds or modifies tests only |

### Examples

```
r - Extract method calculatePension
R! - Refactor EUX controller endpoints to use FrontendResponse
F!! Add untested SED editor
b - Fix null check in country filter
d - Update README with build instructions
e - Upgrade React to v19
u - Auto-bump @navikt/ds-react to 7.2.0
t - Add missing unit tests for buc reducer
```

### Rules

- The prefix and risk separator are **mandatory** on every commit.
- When multiple intentions apply, use the **riskiest** one.
