
import express from 'express';
import controller from '../controllers/qmsTicket.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: qms_ticket
 *     description: Operations for qms_ticket
 */

/**
 * @openapi
 * /api/qms_ticket:
 *   get:
 *     tags:
 *       - qms_ticket
 *     summary: Get all qms_ticket
 *     responses:
 *       200:
 *         description: list of qms_ticket
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/qms_ticket/{id}:
 *   get:
 *     tags:
 *       - qms_ticket
 *     summary: Get a single qms_ticket by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a qms_ticket object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/qms_ticket:
 *   post:
 *     tags:
 *       - qms_ticket
 *     summary: Create a new qms_ticket
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
 * /api/qms_ticket/{id}:
 *   put:
 *     tags:
 *       - qms_ticket
 *     summary: Update a qms_ticket
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
 * /api/qms_ticket/{id}:
 *   delete:
 *     tags:
 *       - qms_ticket
 *     summary: Delete a qms_ticket
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
