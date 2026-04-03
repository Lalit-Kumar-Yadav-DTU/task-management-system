import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';

const app: Application = express();

// 1. Standard Middleware
app.use(express.json());
app.use(cookieParser());

// 2. Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://task-management-frontend-g9vb.onrender.com'
];

// 3. CORS Configuration
// This middleware automatically handles OPTIONS (preflight) requests for you
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

/**
 * FIX: We removed the app.options('*') and app.options('/(.*)') 
 * because cors() above already handles this. 
 * 
 * If you ever need a catch-all in Express 5, the new syntax is:
 * app.all('/:path*', (req, res) => { ... })
 */

// 4. API Routes
app.use('/api', routes);

// 5. Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Task Management API is running...');
});

export default app;





