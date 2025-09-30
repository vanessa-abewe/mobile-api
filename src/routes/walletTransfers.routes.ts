
import express from 'express';
import controller from '../controllers/walletTransfers.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: wallet_transfers
 *     description: Operations for wallet_transfers
 */

/**
 * @openapi
 * /api/wallet_transfers:
 *   get:
 *     tags:
 *       - wallet_transfers
 *     summary: Get all wallet_transfers
 *     responses:
 *       200:
 *         description: list of wallet_transfers
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/wallet_transfers/{id}:
 *   get:
 *     tags:
 *       - wallet_transfers
 *     summary: Get a single wallet_transfers by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a wallet_transfers object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/wallet_transfers:
 *   post:
 *     tags:
 *       - wallet_transfers
 *     summary: Create a new wallet_transfers
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
 * /api/wallet_transfers/{id}:
 *   put:
 *     tags:
 *       - wallet_transfers
 *     summary: Update a wallet_transfers
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
 * /api/wallet_transfers/{id}:
 *   delete:
 *     tags:
 *       - wallet_transfers
 *     summary: Delete a wallet_transfers
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
