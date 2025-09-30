
import express from 'express';
import controller from '../controllers/apps.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: apps
 *     description: Operations for apps
 */

/**
 * @openapi
 * /api/apps:
 *   get:
 *     tags:
 *       - apps
 *     summary: Get all apps
 *     responses:
 *       200:
 *         description: list of apps
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/apps/{id}:
 *   get:
 *     tags:
 *       - apps
 *     summary: Get a single apps by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a apps object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/apps:
 *   post:
 *     tags:
 *       - apps
 *     summary: Create a new apps
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
 * /api/apps/{id}:
 *   put:
 *     tags:
 *       - apps
 *     summary: Update a apps
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
 * /api/apps/{id}:
 *   delete:
 *     tags:
 *       - apps
 *     summary: Delete a apps
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
