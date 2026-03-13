# Project Rules

## Data Fetching
- All data fetching functions live in `src/actions/` (global actions folder).
- Page components import from `src/actions/` — no direct Payload/DB calls inside page or UI components.

## Component Structure
- One component per page file (the default export). Sub-components needed only by that page go in the same file if they are small; otherwise extract to `src/components/`.
- Max **300 lines** per `.tsx` / `.jsx` file.

## TypeScript
- **No `any`** type anywhere. Use `unknown` and narrow, or derive proper types.
- All shared types live in `src/types/` (global types folder).
- No inline `interface` or `type` declarations at the top of component files — import from `src/types/`.

## Testing
- Running `next build` is **not** a complete test. After any change, verify the affected page renders correctly in the browser with `next dev` and navigate to the route.
- For data-dependent pages, confirm real data loads (not just a 200 response with an error boundary swallowing the crash).
