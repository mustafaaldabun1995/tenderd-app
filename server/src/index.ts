import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vehicleRoutes from './routes/vehicleRoutes';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db, sqlite } from './db';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/vehicles', vehicleRoutes);

const initializeDatabase = async () => {
  try {
    const migrationsFolder = path.join(process.cwd(), 'drizzle');
    migrate(db, { migrationsFolder });
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Database migration error:', error);
  }
};

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Using SQLite database: ${path.join(process.cwd(), 'fleet-management.db')}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

const gracefulShutdown = () => {
  sqlite.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
