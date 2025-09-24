import knex, { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const db: Knex = knex({
  client: "pg", // or "mysql2"
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "mobile_db"
  },
  pool: { min: 2, max: 10 }
});

export default db;
