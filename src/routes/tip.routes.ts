
import express from 'express';
import controller from '../controllers/tip.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: tip
 *     description: Operations for tip
 */

/**
 * @openapi
 * /api/tip:
 *   get:
 *     tags:
 *       - tip
 *     summary: Get all tip
 *     responses:
 *       200:
 *         description: list of tip
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/tip/{id}:
 *   get:
 *     tags:
 *       - tip
 *     summary: Get a single tip by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a tip object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/tip:
 *   post:
 *     tags:
 *       - tip
 *     summary: Create a new tip
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
 * /api/tip/{id}:
 *   put:
 *     tags:
 *       - tip
 *     summary: Update a tip
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
 * /api/tip/{id}:
 *   delete:
 *     tags:
 *       - tip
 *     summary: Delete a tip
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
