import { Request, Response } from "express";
import db from "../config/dbLoader";

interface CreateUserBody {
  name: string;
  email: string;
}

export const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const user = db.insertUser
      ? await db.insertUser(name, email)                     // mock
      : await db("users").insert({ name, email }).returning(["id", "name", "email"]); // real

    res.status(201).json({ message: "User created successfully", user });
  } catch (err: any) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
