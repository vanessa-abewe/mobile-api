
import express from 'express';
import controller from '../controllers/mmsFile.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: mms_file
 *     description: Operations for mms_file
 */

/**
 * @openapi
 * /api/mms_file:
 *   get:
 *     tags:
 *       - mms_file
 *     summary: Get all mms_file
 *     responses:
 *       200:
 *         description: list of mms_file
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/mms_file/{id}:
 *   get:
 *     tags:
 *       - mms_file
 *     summary: Get a single mms_file by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a mms_file object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/mms_file:
 *   post:
 *     tags:
 *       - mms_file
 *     summary: Create a new mms_file
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
 * /api/mms_file/{id}:
 *   put:
 *     tags:
 *       - mms_file
 *     summary: Update a mms_file
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
 * /api/mms_file/{id}:
 *   delete:
 *     tags:
 *       - mms_file
 *     summary: Delete a mms_file
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
