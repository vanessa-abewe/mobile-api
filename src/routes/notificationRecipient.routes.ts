
import express from 'express';
import controller from '../controllers/notificationRecipient.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: notification_recipient
 *     description: Operations for notification_recipient
 */

/**
 * @openapi
 * /api/notification_recipient:
 *   get:
 *     tags:
 *       - notification_recipient
 *     summary: Get all notification_recipient
 *     responses:
 *       200:
 *         description: list of notification_recipient
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/notification_recipient/{id}:
 *   get:
 *     tags:
 *       - notification_recipient
 *     summary: Get a single notification_recipient by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a notification_recipient object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/notification_recipient:
 *   post:
 *     tags:
 *       - notification_recipient
 *     summary: Create a new notification_recipient
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
 * /api/notification_recipient/{id}:
 *   put:
 *     tags:
 *       - notification_recipient
 *     summary: Update a notification_recipient
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
 * /api/notification_recipient/{id}:
 *   delete:
 *     tags:
 *       - notification_recipient
 *     summary: Delete a notification_recipient
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
