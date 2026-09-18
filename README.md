# calcurrency

A currency converter with live reference rates from Frankfurter and a local fallback when rates are unavailable.

## Development

```bash
pnpm install
pnpm dev
```

The app uses Next.js 16. The converter UI lives in `app/_components`, while browser preferences and rate loading live in `hooks`. The rates API uses `queries/currency-rates.ts`; sample fallback rates and currency names live in `data/currency.ts`.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm format:check
```

Run `pnpm build` before a deployment.
