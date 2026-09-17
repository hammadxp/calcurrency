# calcurrency

A currency converter with live reference rates from Frankfurter and a local fallback when rates are unavailable.

## Development

```bash
pnpm install
pnpm dev
```

The app uses Next.js 16. Currency data is fetched by `app/api/rates/route.ts`. Converter state and browser preferences live in `components/converter` and `hooks`; static fallback data lives in `lib/currency-data.ts`.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm test
```

Run `pnpm build` before a deployment.
