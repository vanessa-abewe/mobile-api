import { Request, Response } from "express";
import db from "../config/dbLoader";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = db.getUsers
      ? await db.getUsers()          // mock
      : await db("users").select("*"); // real
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
