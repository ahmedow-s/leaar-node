// api/index.js - Vercel entry: export a handler function that forwards to Express app
const app = require('../app');

// Vercel expects a function (req, res). Forward requests to the Express app.
module.exports = (req, res) => {
	return app(req, res);
};
