
import express from 'express';
import controller from '../controllers/ratingReply.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: rating_reply
 *     description: Operations for rating_reply
 */

/**
 * @openapi
 * /api/rating_reply:
 *   get:
 *     tags:
 *       - rating_reply
 *     summary: Get all rating_reply
 *     responses:
 *       200:
 *         description: list of rating_reply
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/rating_reply/{id}:
 *   get:
 *     tags:
 *       - rating_reply
 *     summary: Get a single rating_reply by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a rating_reply object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/rating_reply:
 *   post:
 *     tags:
 *       - rating_reply
 *     summary: Create a new rating_reply
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
 * /api/rating_reply/{id}:
 *   put:
 *     tags:
 *       - rating_reply
 *     summary: Update a rating_reply
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
 * /api/rating_reply/{id}:
 *   delete:
 *     tags:
 *       - rating_reply
 *     summary: Delete a rating_reply
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
