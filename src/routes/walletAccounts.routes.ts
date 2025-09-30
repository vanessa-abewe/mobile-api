
import express from 'express';
import controller from '../controllers/walletAccounts.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: wallet_accounts
 *     description: Operations for wallet_accounts
 */

/**
 * @openapi
 * /api/wallet_accounts:
 *   get:
 *     tags:
 *       - wallet_accounts
 *     summary: Get all wallet_accounts
 *     responses:
 *       200:
 *         description: list of wallet_accounts
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/wallet_accounts/{id}:
 *   get:
 *     tags:
 *       - wallet_accounts
 *     summary: Get a single wallet_accounts by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a wallet_accounts object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/wallet_accounts:
 *   post:
 *     tags:
 *       - wallet_accounts
 *     summary: Create a new wallet_accounts
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
 * /api/wallet_accounts/{id}:
 *   put:
 *     tags:
 *       - wallet_accounts
 *     summary: Update a wallet_accounts
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
 * /api/wallet_accounts/{id}:
 *   delete:
 *     tags:
 *       - wallet_accounts
 *     summary: Delete a wallet_accounts
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
