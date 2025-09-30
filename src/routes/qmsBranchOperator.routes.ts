
import express from 'express';
import controller from '../controllers/qmsBranchOperator.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: qms_branch_operator
 *     description: Operations for qms_branch_operator
 */

/**
 * @openapi
 * /api/qms_branch_operator:
 *   get:
 *     tags:
 *       - qms_branch_operator
 *     summary: Get all qms_branch_operator
 *     responses:
 *       200:
 *         description: list of qms_branch_operator
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/qms_branch_operator/{id}:
 *   get:
 *     tags:
 *       - qms_branch_operator
 *     summary: Get a single qms_branch_operator by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a qms_branch_operator object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/qms_branch_operator:
 *   post:
 *     tags:
 *       - qms_branch_operator
 *     summary: Create a new qms_branch_operator
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
 * /api/qms_branch_operator/{id}:
 *   put:
 *     tags:
 *       - qms_branch_operator
 *     summary: Update a qms_branch_operator
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
 * /api/qms_branch_operator/{id}:
 *   delete:
 *     tags:
 *       - qms_branch_operator
 *     summary: Delete a qms_branch_operator
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
