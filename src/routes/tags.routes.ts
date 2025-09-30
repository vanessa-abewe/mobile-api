
import express from 'express';
import controller from '../controllers/tags.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: tags
 *     description: Operations for tags
 */

/**
 * @openapi
 * /api/tags:
 *   get:
 *     tags:
 *       - tags
 *     summary: Get all tags
 *     responses:
 *       200:
 *         description: list of tags
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/tags/{id}:
 *   get:
 *     tags:
 *       - tags
 *     summary: Get a single tags by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a tags object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/tags:
 *   post:
 *     tags:
 *       - tags
 *     summary: Create a new tags
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
 * /api/tags/{id}:
 *   put:
 *     tags:
 *       - tags
 *     summary: Update a tags
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
 * /api/tags/{id}:
 *   delete:
 *     tags:
 *       - tags
 *     summary: Delete a tags
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
