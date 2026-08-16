// Application entry point applies the security middlewar mounts the movie
// routes, handles unknown routes and starts the server (HTTP by default or
// HTTPS if USE_HTTPS is switched on in .env).

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');

const movieRoutes = require('./routes/movieRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 4000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Drop the X Powered By header 
app.disable('x-powered-by');

// Security headers plus a content security policy that limits where the browser
// is allowed to load resources from.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", CLIENT_ORIGIN],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginResourcePolicy: { policy: 'same-site' }
  })
);

// Only let the configured frontend call the API rather than opening it to any origin
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Parse JSON bodies and cap their size so an oversized payload can't tie us up
app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    app: process.env.APP_NAME || 'SecureAPI',
    message: 'API is running securely'
  });
});

// Simple liveness check that also reports which protocol is in use
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    protocol: USE_HTTPS ? 'HTTPS' : 'HTTP'
  });
});

app.use('/api/movies', movieRoutes);

// Reached only when none of the routes above matched
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Registered last so it catches any error thrown further up the chain
app.use(errorHandler);

if (USE_HTTPS) {
  const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, 'certs', 'localhost-key.pem');
  const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, 'certs', 'localhost-cert.pem');

  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
  });
}
