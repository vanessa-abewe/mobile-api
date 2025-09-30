
import express from 'express';
import controller from '../controllers/notification.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: notification
 *     description: Operations for notification
 */

/**
 * @openapi
 * /api/notification:
 *   get:
 *     tags:
 *       - notification
 *     summary: Get all notification
 *     responses:
 *       200:
 *         description: list of notification
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/notification/{id}:
 *   get:
 *     tags:
 *       - notification
 *     summary: Get a single notification by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a notification object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/notification:
 *   post:
 *     tags:
 *       - notification
 *     summary: Create a new notification
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
 * /api/notification/{id}:
 *   put:
 *     tags:
 *       - notification
 *     summary: Update a notification
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
 * /api/notification/{id}:
 *   delete:
 *     tags:
 *       - notification
 *     summary: Delete a notification
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
