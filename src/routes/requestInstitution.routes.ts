
import express from 'express';
import controller from '../controllers/requestInstitution.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: request_institution
 *     description: Operations for request_institution
 */

/**
 * @openapi
 * /api/request_institution:
 *   get:
 *     tags:
 *       - request_institution
 *     summary: Get all request_institution
 *     responses:
 *       200:
 *         description: list of request_institution
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/request_institution/{id}:
 *   get:
 *     tags:
 *       - request_institution
 *     summary: Get a single request_institution by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a request_institution object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/request_institution:
 *   post:
 *     tags:
 *       - request_institution
 *     summary: Create a new request_institution
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
 * /api/request_institution/{id}:
 *   put:
 *     tags:
 *       - request_institution
 *     summary: Update a request_institution
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
 * /api/request_institution/{id}:
 *   delete:
 *     tags:
 *       - request_institution
 *     summary: Delete a request_institution
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
