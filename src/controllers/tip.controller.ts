
import { Request, Response, NextFunction } from 'express';
import db from '../config/db';

const tableName = 'tip';
const idColumn = 'id';

const controller = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db(tableName).select('*');
      return res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const row = await db(tableName).where({ [idColumn]: id }).first();
      if (!row) return res.status(404).json({ message: 'Not found' });
      return res.json(row);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const result = await db(tableName).insert(payload);
      // result for MySQL is an array with the inserted id at result[0]
      const insertId = Array.isArray(result) ? result[0] : result;
      const created = await db(tableName).where({ [idColumn]: insertId }).first();
      return res.status(201).json(created || { [idColumn]: insertId });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const payload = req.body;
      const affected = await db(tableName).where({ [idColumn]: id }).update(payload);
      if (!affected) return res.status(404).json({ message: 'Not found' });
      const updated = await db(tableName).where({ [idColumn]: id }).first();
      return res.json(updated || { message: 'Updated' });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const deleted = await db(tableName).where({ [idColumn]: id }).del();
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      next(err);
    }
  },
};

export default controller;
