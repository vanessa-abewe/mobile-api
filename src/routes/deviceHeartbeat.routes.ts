// Auto-generated TypeScript routes for table: device_heartbeat
import express from 'express';
import controller from '../controllers/deviceHeartbeat.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: device_heartbeat
 *     description: Operations for device_heartbeat
 */

/**
 * @openapi
 * /api/device_heartbeat:
 *   get:
 *     tags:
 *       - device_heartbeat
 *     summary: Get all device_heartbeat
 *     responses:
 *       200:
 *         description: list of device_heartbeat
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/device_heartbeat/{id}:
 *   get:
 *     tags:
 *       - device_heartbeat
 *     summary: Get a single device_heartbeat by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a device_heartbeat object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/device_heartbeat:
 *   post:
 *     tags:
 *       - device_heartbeat
 *     summary: Create a new device_heartbeat
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
 * /api/device_heartbeat/{id}:
 *   put:
 *     tags:
 *       - device_heartbeat
 *     summary: Update a device_heartbeat
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
 * /api/device_heartbeat/{id}:
 *   delete:
 *     tags:
 *       - device_heartbeat
 *     summary: Delete a device_heartbeat
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
