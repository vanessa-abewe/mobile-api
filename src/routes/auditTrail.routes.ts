
import express from 'express';
import controller from '../controllers/auditTrail.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: audit_trail
 *     description: Operations for audit_trail
 */

/**
 * @openapi
 * /api/audit_trail:
 *   get:
 *     tags:
 *       - audit_trail
 *     summary: Get all audit_trail
 *     responses:
 *       200:
 *         description: list of audit_trail
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/audit_trail/{id}:
 *   get:
 *     tags:
 *       - audit_trail
 *     summary: Get a single audit_trail by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a audit_trail object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/audit_trail:
 *   post:
 *     tags:
 *       - audit_trail
 *     summary: Create a new audit_trail
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
 * /api/audit_trail/{id}:
 *   put:
 *     tags:
 *       - audit_trail
 *     summary: Update a audit_trail
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
 * /api/audit_trail/{id}:
 *   delete:
 *     tags:
 *       - audit_trail
 *     summary: Delete a audit_trail
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
