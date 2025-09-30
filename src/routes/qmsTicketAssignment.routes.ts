
import express from 'express';
import controller from '../controllers/qmsTicketAssignment.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: qms_ticket_assignment
 *     description: Operations for qms_ticket_assignment
 */

/**
 * @openapi
 * /api/qms_ticket_assignment:
 *   get:
 *     tags:
 *       - qms_ticket_assignment
 *     summary: Get all qms_ticket_assignment
 *     responses:
 *       200:
 *         description: list of qms_ticket_assignment
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/qms_ticket_assignment/{id}:
 *   get:
 *     tags:
 *       - qms_ticket_assignment
 *     summary: Get a single qms_ticket_assignment by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a qms_ticket_assignment object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/qms_ticket_assignment:
 *   post:
 *     tags:
 *       - qms_ticket_assignment
 *     summary: Create a new qms_ticket_assignment
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
 * /api/qms_ticket_assignment/{id}:
 *   put:
 *     tags:
 *       - qms_ticket_assignment
 *     summary: Update a qms_ticket_assignment
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
 * /api/qms_ticket_assignment/{id}:
 *   delete:
 *     tags:
 *       - qms_ticket_assignment
 *     summary: Delete a qms_ticket_assignment
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
