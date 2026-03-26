require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000 || 3000 || 'https://bio-gas-backend.vercel.app'; // добавляем 3000 для локальной разработки

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;