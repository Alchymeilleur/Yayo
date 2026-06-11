import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import dotenv from 'dotenv';
import pool from './database/pool';
import { initializeDatabase } from './database/migrations';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
};

app.use(errorHandler);

const startServer = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✓ Database connected');
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Yayo Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;