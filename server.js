import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const port = Number(process.env.PORT || 3000);

const faucetApiBaseUrl = process.env.FAUCET_API_BASE_URL;
const faucetApiPath = process.env.FAUCET_API_PATH || '/api/v1/public/faucet/solana-usdc';
const faucetApiKey = process.env.FAUCET_API_KEY || '';

if (!faucetApiBaseUrl) {
  console.error('Missing FAUCET_API_BASE_URL');
  process.exit(1);
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '64kb' }));
app.use(express.static('public'));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

app.post('/api/faucet/request', async (req, res) => {
  const { walletAddress } = req.body ?? {};

  if (typeof walletAddress !== 'string' || walletAddress.trim().length < 32) {
    return res.status(400).json({ message: 'Invalid wallet address' });
  }

  try {
    const response = await fetch(`${faucetApiBaseUrl}${faucetApiPath}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(faucetApiKey ? { 'x-faucet-key': faucetApiKey } : {}),
      },
      body: JSON.stringify({ walletAddress: walletAddress.trim() }),
    });

    const payload = await response.json().catch(() => ({}));
    const normalized = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
    return res.status(response.status).json(normalized);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upstream request failed';
    return res.status(502).json({ message });
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Faucet UI listening on ${port}`);
});
