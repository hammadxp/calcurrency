# calcurrency

A currency converter with live reference rates from Frankfurter and a local fallback when rates are unavailable.

Enter an amount in the first currency row to convert it across the whole list. Add currencies below the list, drag the handle or use its arrow keys to reorder, and use each row's menu to change its color, make it the base, or remove it. The calculator accepts keyboard operators and has on-screen controls on desktop and mobile. Currency order and colors are saved in this browser.

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
