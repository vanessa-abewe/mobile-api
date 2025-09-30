
import express from 'express';
import controller from '../controllers/qmsCustomer.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: qms_customer
 *     description: Operations for qms_customer
 */

/**
 * @openapi
 * /api/qms_customer:
 *   get:
 *     tags:
 *       - qms_customer
 *     summary: Get all qms_customer
 *     responses:
 *       200:
 *         description: list of qms_customer
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/qms_customer/{id}:
 *   get:
 *     tags:
 *       - qms_customer
 *     summary: Get a single qms_customer by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a qms_customer object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/qms_customer:
 *   post:
 *     tags:
 *       - qms_customer
 *     summary: Create a new qms_customer
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
 * /api/qms_customer/{id}:
 *   put:
 *     tags:
 *       - qms_customer
 *     summary: Update a qms_customer
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
 * /api/qms_customer/{id}:
 *   delete:
 *     tags:
 *       - qms_customer
 *     summary: Delete a qms_customer
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
