
import express from 'express';
import controller from '../controllers/loginHistory.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: login_history
 *     description: Operations for login_history
 */

/**
 * @openapi
 * /api/login_history:
 *   get:
 *     tags:
 *       - login_history
 *     summary: Get all login_history
 *     responses:
 *       200:
 *         description: list of login_history
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/login_history/{id}:
 *   get:
 *     tags:
 *       - login_history
 *     summary: Get a single login_history by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a login_history object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/login_history:
 *   post:
 *     tags:
 *       - login_history
 *     summary: Create a new login_history
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
 * /api/login_history/{id}:
 *   put:
 *     tags:
 *       - login_history
 *     summary: Update a login_history
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
 * /api/login_history/{id}:
 *   delete:
 *     tags:
 *       - login_history
 *     summary: Delete a login_history
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
