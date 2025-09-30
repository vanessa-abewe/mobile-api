
import express from 'express';
import controller from '../controllers/reports.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: reports
 *     description: Operations for reports
 */

/**
 * @openapi
 * /api/reports:
 *   get:
 *     tags:
 *       - reports
 *     summary: Get all reports
 *     responses:
 *       200:
 *         description: list of reports
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/reports/{id}:
 *   get:
 *     tags:
 *       - reports
 *     summary: Get a single reports by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a reports object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/reports:
 *   post:
 *     tags:
 *       - reports
 *     summary: Create a new reports
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
 * /api/reports/{id}:
 *   put:
 *     tags:
 *       - reports
 *     summary: Update a reports
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
 * /api/reports/{id}:
 *   delete:
 *     tags:
 *       - reports
 *     summary: Delete a reports
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
