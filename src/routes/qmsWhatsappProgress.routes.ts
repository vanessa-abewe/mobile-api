
import express from 'express';
import controller from '../controllers/qmsWhatsappProgress.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: qms_whatsApp_progress
 *     description: Operations for qms_whatsApp_progress
 */

/**
 * @openapi
 * /api/qms_whatsApp_progress:
 *   get:
 *     tags:
 *       - qms_whatsApp_progress
 *     summary: Get all qms_whatsApp_progress
 *     responses:
 *       200:
 *         description: list of qms_whatsApp_progress
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/qms_whatsApp_progress/{id}:
 *   get:
 *     tags:
 *       - qms_whatsApp_progress
 *     summary: Get a single qms_whatsApp_progress by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a qms_whatsApp_progress object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/qms_whatsApp_progress:
 *   post:
 *     tags:
 *       - qms_whatsApp_progress
 *     summary: Create a new qms_whatsApp_progress
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
 * /api/qms_whatsApp_progress/{id}:
 *   put:
 *     tags:
 *       - qms_whatsApp_progress
 *     summary: Update a qms_whatsApp_progress
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
 * /api/qms_whatsApp_progress/{id}:
 *   delete:
 *     tags:
 *       - qms_whatsApp_progress
 *     summary: Delete a qms_whatsApp_progress
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
