
import express from 'express';
import controller from '../controllers/institution.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: institution
 *     description: Operations for institution
 */

/**
 * @openapi
 * /api/institution:
 *   get:
 *     tags:
 *       - institution
 *     summary: Get all institution
 *     responses:
 *       200:
 *         description: list of institution
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/institution/{id}:
 *   get:
 *     tags:
 *       - institution
 *     summary: Get a single institution by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a institution object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/institution:
 *   post:
 *     tags:
 *       - institution
 *     summary: Create a new institution
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
 * /api/institution/{id}:
 *   put:
 *     tags:
 *       - institution
 *     summary: Update a institution
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
 * /api/institution/{id}:
 *   delete:
 *     tags:
 *       - institution
 *     summary: Delete a institution
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
