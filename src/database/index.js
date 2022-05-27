import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env' });

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default db;
