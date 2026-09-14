const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // 👈 1. ADD THIS IMPORT AT THE TOP

const config = require('./config');
const authRoutes = require('./routes/auth.routes');
const booksRoutes = require('./routes/books.routes');

const app = express();

const allowedOrigins = [
  'https://story-versev0.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(cleanOrigin) || config.frontendOrigin === '*') {
      return callback(null, true);
    }
    if (config.frontendOrigin && cleanOrigin === config.frontendOrigin.replace(/\/$/, '')) {
      return callback(null, true);
    }
    // Allow vercel preview / main deployments
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // book responses carry base64 images, keep this generous

// 👈 2. ADD THIS STATIC MIDDLEWARE LINE HERE
// This exposes the physical 'public/images' folder to the internet at http://localhost:PORT/images/filename.png
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/books', booksRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

async function start() {
  try {
    if (config.databaseUrl) {
      await mongoose.connect(config.databaseUrl);
      console.log('MongoDB connected');
    } else {
      console.warn('No DATABASE_URL set — DB calls will fail until you add one to .env');
    }

    const server = app.listen(config.port, () => {
      console.log(`Storyverse backend running on port ${config.port}`);
      if (!config.geminiApiKey || !config.cloudflareAccountId || !config.cloudflareApiToken) {
        console.warn(
          'Warning: GEMINI_API_KEY / CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN not fully set — ' +
          'auth routes will work, but POST /books/generate will fail until these are added to .env'
        );
      }
    });

    // /books/generate can legitimately take up to ~2 min for a 12-page book
    // (storyService.js timeout matches this). Raise Node's server-level
    // timeouts well past that so nothing cuts the request off early.
    server.timeout = 150_000; // 2.5 min
    server.keepAliveTimeout = 155_000;
    server.headersTimeout = 156_000;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();