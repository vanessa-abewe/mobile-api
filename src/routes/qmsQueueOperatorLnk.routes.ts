
import express from 'express';
import controller from '../controllers/qmsQueueOperatorLnk.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: qms_queue_operator_lnk
 *     description: Operations for qms_queue_operator_lnk
 */

/**
 * @openapi
 * /api/qms_queue_operator_lnk:
 *   get:
 *     tags:
 *       - qms_queue_operator_lnk
 *     summary: Get all qms_queue_operator_lnk
 *     responses:
 *       200:
 *         description: list of qms_queue_operator_lnk
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/qms_queue_operator_lnk/{id}:
 *   get:
 *     tags:
 *       - qms_queue_operator_lnk
 *     summary: Get a single qms_queue_operator_lnk by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a qms_queue_operator_lnk object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/qms_queue_operator_lnk:
 *   post:
 *     tags:
 *       - qms_queue_operator_lnk
 *     summary: Create a new qms_queue_operator_lnk
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
 * /api/qms_queue_operator_lnk/{id}:
 *   put:
 *     tags:
 *       - qms_queue_operator_lnk
 *     summary: Update a qms_queue_operator_lnk
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
 * /api/qms_queue_operator_lnk/{id}:
 *   delete:
 *     tags:
 *       - qms_queue_operator_lnk
 *     summary: Delete a qms_queue_operator_lnk
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
