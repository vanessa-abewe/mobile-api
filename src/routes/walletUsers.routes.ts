
import express from 'express';
import controller from '../controllers/walletUsers.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: wallet_users
 *     description: Operations for wallet_users
 */

/**
 * @openapi
 * /api/wallet_users:
 *   get:
 *     tags:
 *       - wallet_users
 *     summary: Get all wallet_users
 *     responses:
 *       200:
 *         description: list of wallet_users
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/wallet_users/{id}:
 *   get:
 *     tags:
 *       - wallet_users
 *     summary: Get a single wallet_users by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a wallet_users object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/wallet_users:
 *   post:
 *     tags:
 *       - wallet_users
 *     summary: Create a new wallet_users
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
 * /api/wallet_users/{id}:
 *   put:
 *     tags:
 *       - wallet_users
 *     summary: Update a wallet_users
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
 * /api/wallet_users/{id}:
 *   delete:
 *     tags:
 *       - wallet_users
 *     summary: Delete a wallet_users
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
