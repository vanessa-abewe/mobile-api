
import express from 'express';
import controller from '../controllers/ratingAssets.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: rating_assets
 *     description: Operations for rating_assets
 */

/**
 * @openapi
 * /api/rating_assets:
 *   get:
 *     tags:
 *       - rating_assets
 *     summary: Get all rating_assets
 *     responses:
 *       200:
 *         description: list of rating_assets
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/rating_assets/{id}:
 *   get:
 *     tags:
 *       - rating_assets
 *     summary: Get a single rating_assets by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a rating_assets object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/rating_assets:
 *   post:
 *     tags:
 *       - rating_assets
 *     summary: Create a new rating_assets
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
 * /api/rating_assets/{id}:
 *   put:
 *     tags:
 *       - rating_assets
 *     summary: Update a rating_assets
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
 * /api/rating_assets/{id}:
 *   delete:
 *     tags:
 *       - rating_assets
 *     summary: Delete a rating_assets
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
