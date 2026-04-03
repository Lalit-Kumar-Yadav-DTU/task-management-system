import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Updated CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000', // Local development
    'https://task-manager-frontend-g9vb.onrender.com' // Your live Render frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes
app.use('/api', routes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Task Management API is running...');
});

export default app;