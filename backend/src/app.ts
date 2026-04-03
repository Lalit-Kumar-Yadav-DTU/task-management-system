import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend
  credentials: true,               // CRITICAL: Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes
app.use('/api', routes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Task Management API is running...');
});

export default app;