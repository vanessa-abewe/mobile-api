
import express from 'express';
import controller from '../controllers/organisation.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: organisation
 *     description: Operations for organisation
 */

/**
 * @openapi
 * /api/organisation:
 *   get:
 *     tags:
 *       - organisation
 *     summary: Get all organisation
 *     responses:
 *       200:
 *         description: list of organisation
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/organisation/{id}:
 *   get:
 *     tags:
 *       - organisation
 *     summary: Get a single organisation by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a organisation object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/organisation:
 *   post:
 *     tags:
 *       - organisation
 *     summary: Create a new organisation
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
 * /api/organisation/{id}:
 *   put:
 *     tags:
 *       - organisation
 *     summary: Update a organisation
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
 * /api/organisation/{id}:
 *   delete:
 *     tags:
 *       - organisation
 *     summary: Delete a organisation
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
