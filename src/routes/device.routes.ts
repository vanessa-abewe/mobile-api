
import express from 'express';
import controller from '../controllers/device.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: device
 *     description: Operations for device
 */

/**
 * @openapi
 * /api/device:
 *   get:
 *     tags:
 *       - device
 *     summary: Get all device
 *     responses:
 *       200:
 *         description: list of device
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/device/{id}:
 *   get:
 *     tags:
 *       - device
 *     summary: Get a single device by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a device object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/device:
 *   post:
 *     tags:
 *       - device
 *     summary: Create a new device
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
 * /api/device/{id}:
 *   put:
 *     tags:
 *       - device
 *     summary: Update a device
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
 * /api/device/{id}:
 *   delete:
 *     tags:
 *       - device
 *     summary: Delete a device
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
