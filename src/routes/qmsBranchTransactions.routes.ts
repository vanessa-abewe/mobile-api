
import express from 'express';
import controller from '../controllers/qmsBranchTransactions.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: qms_branch_transactions
 *     description: Operations for qms_branch_transactions
 */

/**
 * @openapi
 * /api/qms_branch_transactions:
 *   get:
 *     tags:
 *       - qms_branch_transactions
 *     summary: Get all qms_branch_transactions
 *     responses:
 *       200:
 *         description: list of qms_branch_transactions
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/qms_branch_transactions/{id}:
 *   get:
 *     tags:
 *       - qms_branch_transactions
 *     summary: Get a single qms_branch_transactions by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a qms_branch_transactions object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/qms_branch_transactions:
 *   post:
 *     tags:
 *       - qms_branch_transactions
 *     summary: Create a new qms_branch_transactions
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
 * /api/qms_branch_transactions/{id}:
 *   put:
 *     tags:
 *       - qms_branch_transactions
 *     summary: Update a qms_branch_transactions
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
 * /api/qms_branch_transactions/{id}:
 *   delete:
 *     tags:
 *       - qms_branch_transactions
 *     summary: Delete a qms_branch_transactions
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
