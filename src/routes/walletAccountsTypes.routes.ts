
import express from 'express';
import controller from '../controllers/walletAccountsTypes.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: wallet_accounts_types
 *     description: Operations for wallet_accounts_types
 */

/**
 * @openapi
 * /api/wallet_accounts_types:
 *   get:
 *     tags:
 *       - wallet_accounts_types
 *     summary: Get all wallet_accounts_types
 *     responses:
 *       200:
 *         description: list of wallet_accounts_types
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/wallet_accounts_types/{id}:
 *   get:
 *     tags:
 *       - wallet_accounts_types
 *     summary: Get a single wallet_accounts_types by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a wallet_accounts_types object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/wallet_accounts_types:
 *   post:
 *     tags:
 *       - wallet_accounts_types
 *     summary: Create a new wallet_accounts_types
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
 * /api/wallet_accounts_types/{id}:
 *   put:
 *     tags:
 *       - wallet_accounts_types
 *     summary: Update a wallet_accounts_types
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
 * /api/wallet_accounts_types/{id}:
 *   delete:
 *     tags:
 *       - wallet_accounts_types
 *     summary: Delete a wallet_accounts_types
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
