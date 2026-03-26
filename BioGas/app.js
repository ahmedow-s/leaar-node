const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const swaggerSpec = require('./src/config/swagger');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const rateLimiter = require('./src/middleware/rateLimiter');
const morgan = require('morgan');
const path = require('path');
const swaggerUiDist = require('swagger-ui-dist');

const app = express();

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(
  helmet({
    contentSecurityPolicy: false // отключаем CSP, так как Swagger UI загружается локально и может нарушать политику безопасности
  })
);

app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimiter);

connectDB();

const swaggerUiDist = require('swagger-ui-dist');
app.use('/swagger-ui', express.static(swaggerUiDist.getAbsoluteFSPath()));


app.get('/api-docs', (req, res) => {
  const html = `<!Doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BioGas API Docs</title>
  <link rel="stylesheet" href="/swagger-ui/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/swagger-ui/swagger-ui-bundle.js"></script>
  <script src="/swagger-ui/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout',
        validatorUrl: null
      });
      window.ui = ui;
    };
  </script>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BioGas Backend is running', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: '🔐 BioGas Authentication Backend',
    version: '1.0.0',
    documentation: `/api-docs`,
    health: `/health`,
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found', path: req.path, method: req.method });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal server error' });
});

module.exports = app;
