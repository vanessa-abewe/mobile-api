
import express from 'express';
import controller from '../controllers/qmsCounter.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: qms_counter
 *     description: Operations for qms_counter
 */

/**
 * @openapi
 * /api/qms_counter:
 *   get:
 *     tags:
 *       - qms_counter
 *     summary: Get all qms_counter
 *     responses:
 *       200:
 *         description: list of qms_counter
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/qms_counter/{id}:
 *   get:
 *     tags:
 *       - qms_counter
 *     summary: Get a single qms_counter by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a qms_counter object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/qms_counter:
 *   post:
 *     tags:
 *       - qms_counter
 *     summary: Create a new qms_counter
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
 * /api/qms_counter/{id}:
 *   put:
 *     tags:
 *       - qms_counter
 *     summary: Update a qms_counter
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
 * /api/qms_counter/{id}:
 *   delete:
 *     tags:
 *       - qms_counter
 *     summary: Delete a qms_counter
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
