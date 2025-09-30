
import express from 'express';
import controller from '../controllers/ratingQrCodeSessions.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: rating_qr_code_sessions
 *     description: Operations for rating_qr_code_sessions
 */

/**
 * @openapi
 * /api/rating_qr_code_sessions:
 *   get:
 *     tags:
 *       - rating_qr_code_sessions
 *     summary: Get all rating_qr_code_sessions
 *     responses:
 *       200:
 *         description: list of rating_qr_code_sessions
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/rating_qr_code_sessions/{id}:
 *   get:
 *     tags:
 *       - rating_qr_code_sessions
 *     summary: Get a single rating_qr_code_sessions by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a rating_qr_code_sessions object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/rating_qr_code_sessions:
 *   post:
 *     tags:
 *       - rating_qr_code_sessions
 *     summary: Create a new rating_qr_code_sessions
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
 * /api/rating_qr_code_sessions/{id}:
 *   put:
 *     tags:
 *       - rating_qr_code_sessions
 *     summary: Update a rating_qr_code_sessions
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
 * /api/rating_qr_code_sessions/{id}:
 *   delete:
 *     tags:
 *       - rating_qr_code_sessions
 *     summary: Delete a rating_qr_code_sessions
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
