
import express from 'express';
import controller from '../controllers/categories.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: categories
 *     description: Operations for categories
 */

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - categories
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: list of categories
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - categories
 *     summary: Get a single categories by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a categories object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     tags:
 *       - categories
 *     summary: Create a new categories
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
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - categories
 *     summary: Update a categories
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
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - categories
 *     summary: Delete a categories
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
