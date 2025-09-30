
import express from 'express';
import controller from '../controllers/changeRequest.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: change_request
 *     description: Operations for change_request
 */

/**
 * @openapi
 * /api/change_request:
 *   get:
 *     tags:
 *       - change_request
 *     summary: Get all change_request
 *     responses:
 *       200:
 *         description: list of change_request
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/change_request/{id}:
 *   get:
 *     tags:
 *       - change_request
 *     summary: Get a single change_request by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a change_request object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/change_request:
 *   post:
 *     tags:
 *       - change_request
 *     summary: Create a new change_request
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
 * /api/change_request/{id}:
 *   put:
 *     tags:
 *       - change_request
 *     summary: Update a change_request
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
 * /api/change_request/{id}:
 *   delete:
 *     tags:
 *       - change_request
 *     summary: Delete a change_request
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
