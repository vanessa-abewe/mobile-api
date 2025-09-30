
import express from 'express';
import controller from '../controllers/user.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: user
 *     description: Operations for user
 */

/**
 * @openapi
 * /api/user:
 *   get:
 *     tags:
 *       - user
 *     summary: Get all user
 *     responses:
 *       200:
 *         description: list of user
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - user
 *     summary: Get a single user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a user object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/user:
 *   post:
 *     tags:
 *       - user
 *     summary: Create a new user
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
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - user
 *     summary: Update a user
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
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - user
 *     summary: Delete a user
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
