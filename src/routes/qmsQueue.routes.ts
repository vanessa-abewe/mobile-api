
import express from 'express';
import controller from '../controllers/qmsQueue.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: qms_queue
 *     description: Operations for qms_queue
 */

/**
 * @openapi
 * /api/qms_queue:
 *   get:
 *     tags:
 *       - qms_queue
 *     summary: Get all qms_queue
 *     responses:
 *       200:
 *         description: list of qms_queue
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/qms_queue/{id}:
 *   get:
 *     tags:
 *       - qms_queue
 *     summary: Get a single qms_queue by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a qms_queue object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/qms_queue:
 *   post:
 *     tags:
 *       - qms_queue
 *     summary: Create a new qms_queue
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
 * /api/qms_queue/{id}:
 *   put:
 *     tags:
 *       - qms_queue
 *     summary: Update a qms_queue
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
 * /api/qms_queue/{id}:
 *   delete:
 *     tags:
 *       - qms_queue
 *     summary: Delete a qms_queue
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
