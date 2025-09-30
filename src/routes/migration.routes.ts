
import express from 'express';
import controller from '../controllers/migration.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: migration
 *     description: Operations for migration
 */

/**
 * @openapi
 * /api/migration:
 *   get:
 *     tags:
 *       - migration
 *     summary: Get all migration
 *     responses:
 *       200:
 *         description: list of migration
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/migration/{id}:
 *   get:
 *     tags:
 *       - migration
 *     summary: Get a single migration by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a migration object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/migration:
 *   post:
 *     tags:
 *       - migration
 *     summary: Create a new migration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: created
 */
router.post('/', controller.create);

/**
 * @openapi
 * /api/migration/{id}:
 *   put:
 *     tags:
 *       - migration
 *     summary: Update a migration
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: updated
 *       404:
 *         description: not found
 */
router.put('/:id', controller.update);

/**
 * @openapi
 * /api/migration/{id}:
 *   delete:
 *     tags:
 *       - migration
 *     summary: Delete a migration
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: deleted
 *       404:
 *         description: not found
 */
router.delete('/:id', controller.remove);

export default router;
