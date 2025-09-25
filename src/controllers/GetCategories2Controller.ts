import { Request, Response } from "express";
import db from "../config/dbLoader";

export const getCategories2 = async (req: Request, res: Response) => {
  try {
    const categories2 = await db("categories2").select("*");
    res.json({ Categories2: categories2 });
  } catch (err: any) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
