import dotenv from "dotenv";
dotenv.config();

const useMock = process.env.USE_MOCK_DB === "true";

let db: any;

if (useMock) {
  console.log("⚡ Using MOCK DB");
  db = require("./mockDb").default;
} else {
  console.log("⚡ Using REAL SQL DB");
  db = require("./db").default;
}

export default db;
