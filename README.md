# CTO Faucet (Standalone UI)

This app hosts a public faucet page and forwards requests to your backend faucet API.

## Run locally

```bash
npm install
npm start
```

## Required env

- `FAUCET_API_BASE_URL` - backend API base URL
- `FAUCET_API_PATH` - default `/api/v1/public/faucet/solana-usdc`
- `FAUCET_API_KEY` - optional shared secret header `x-faucet-key`

## Deploy on Coolify

- Build Pack: `Nixpacks` (Node)
- Start command: `npm start`
- Port: `3000`
- Domain: `faucet.ctomarketplace.com`

## DNS

Create `A` record:
- Host: `faucet`
- Value: `84.54.23.80`