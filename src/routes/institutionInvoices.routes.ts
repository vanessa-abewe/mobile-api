
import express from 'express';
import controller from '../controllers/institutionInvoices.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: institution_invoices
 *     description: Operations for institution_invoices
 */

/**
 * @openapi
 * /api/institution_invoices:
 *   get:
 *     tags:
 *       - institution_invoices
 *     summary: Get all institution_invoices
 *     responses:
 *       200:
 *         description: list of institution_invoices
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/institution_invoices/{id}:
 *   get:
 *     tags:
 *       - institution_invoices
 *     summary: Get a single institution_invoices by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a institution_invoices object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/institution_invoices:
 *   post:
 *     tags:
 *       - institution_invoices
 *     summary: Create a new institution_invoices
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
 * /api/institution_invoices/{id}:
 *   put:
 *     tags:
 *       - institution_invoices
 *     summary: Update a institution_invoices
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
 * /api/institution_invoices/{id}:
 *   delete:
 *     tags:
 *       - institution_invoices
 *     summary: Delete a institution_invoices
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
