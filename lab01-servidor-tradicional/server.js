const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config/database');
const database = require('./database/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(helmet());
app.use(rateLimit(config.rateLimit));
app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
	next();
});

app.get('/', (req, res) => {
	res.json({
		service: 'Task Management API',
		version: '1.0.0',
		architecture: 'Traditional Client-Server',
		endpoints: {
			auth: ['POST /api/auth/register', 'POST /api/auth/login'],
			tasks: ['GET /api/tasks', 'POST /api/tasks', 'PUT /api/tasks/:id', 'DELETE /api/tasks/:id']
		}
	});
});

app.get('/health', (req, res) => {
	res.json({
		status: 'healthy',
		timestamp: new Date().toISOString(),
		uptime: process.uptime()
	});
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: 'Endpoint nao encontrado'
	});
});

app.use((error, req, res, next) => {
	console.error('Erro:', error);
	res.status(500).json({
		success: false,
		message: 'Erro interno do servidor'
	});
});

async function startServer() {
	try {
		await database.init();

		app.listen(config.port, () => {
			console.log('=================================');
			console.log(`Servidor iniciado na porta ${config.port}`);
			console.log(`URL: http://localhost:${config.port}`);
			console.log(`Health: http://localhost:${config.port}/health`);
			console.log('=================================');
		});
	} catch (error) {
		console.error('Falha na inicializacao:', error);
		process.exit(1);
	}
}

if (require.main === module) {
	startServer();
}

module.exports = app;
