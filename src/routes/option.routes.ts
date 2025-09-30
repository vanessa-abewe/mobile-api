
import express from 'express';
import controller from '../controllers/option.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: option
 *     description: Operations for option
 */

/**
 * @openapi
 * /api/option:
 *   get:
 *     tags:
 *       - option
 *     summary: Get all option
 *     responses:
 *       200:
 *         description: list of option
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/option/{id}:
 *   get:
 *     tags:
 *       - option
 *     summary: Get a single option by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a option object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/option:
 *   post:
 *     tags:
 *       - option
 *     summary: Create a new option
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
 * /api/option/{id}:
 *   put:
 *     tags:
 *       - option
 *     summary: Update a option
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
 * /api/option/{id}:
 *   delete:
 *     tags:
 *       - option
 *     summary: Delete a option
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
