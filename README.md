# Cloudflare Dev Team

Monorepo for the MCP orchestrator demo. This repository contains a Cloudflare Worker
that exposes a simple MCP-compatible API and acts as an MCP tool at the edge.

## Deployment

1. Install dependencies with `pnpm install`.
2. Apply database migrations:

```bash
pnpm --filter worker run migrate
```

3. Build the worker and start local development. The dev script runs a
   watcher that regenerates Worker types whenever `wrangler.toml` changes.

```bash
pnpm --filter worker run build
pnpm --filter worker run dev
```

4. Deploy to Cloudflare. Pre- and post-deploy hooks automatically run
   database migrations and unit tests:

```bash
pnpm --filter worker run deploy
```

## Testing

Run the unit tests with:

```bash
pnpm --filter worker test
```

Run tests in the Worker runtime with:

```bash
pnpm --filter worker test:worker
```
