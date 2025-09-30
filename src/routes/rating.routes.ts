
import express from 'express';
import controller from '../controllers/rating.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: rating
 *     description: Operations for rating
 */

/**
 * @openapi
 * /api/rating:
 *   get:
 *     tags:
 *       - rating
 *     summary: Get all rating
 *     responses:
 *       200:
 *         description: list of rating
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/rating/{id}:
 *   get:
 *     tags:
 *       - rating
 *     summary: Get a single rating by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a rating object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/rating:
 *   post:
 *     tags:
 *       - rating
 *     summary: Create a new rating
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
 * /api/rating/{id}:
 *   put:
 *     tags:
 *       - rating
 *     summary: Update a rating
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
 * /api/rating/{id}:
 *   delete:
 *     tags:
 *       - rating
 *     summary: Delete a rating
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
