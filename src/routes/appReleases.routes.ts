
import express from 'express';
import controller from '../controllers/appReleases.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: app_releases
 *     description: Operations for app_releases
 */

/**
 * @openapi
 * /api/app_releases:
 *   get:
 *     tags:
 *       - app_releases
 *     summary: Get all app_releases
 *     responses:
 *       200:
 *         description: list of app_releases
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/app_releases/{id}:
 *   get:
 *     tags:
 *       - app_releases
 *     summary: Get a single app_releases by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a app_releases object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/app_releases:
 *   post:
 *     tags:
 *       - app_releases
 *     summary: Create a new app_releases
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
 * /api/app_releases/{id}:
 *   put:
 *     tags:
 *       - app_releases
 *     summary: Update a app_releases
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
 * /api/app_releases/{id}:
 *   delete:
 *     tags:
 *       - app_releases
 *     summary: Delete a app_releases
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
