import knex, { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const db: Knex = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 23306,
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "murakoze_secret",
    database: process.env.DB_NAME || "murakoze"
  },
  pool: { min: 2, max: 10 }
});

export default db;
