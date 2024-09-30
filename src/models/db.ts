import pg from "pg";
const { Pool } = pg;
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database");
});

export default pool;
