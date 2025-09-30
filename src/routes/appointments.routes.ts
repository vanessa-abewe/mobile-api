
import express from 'express';
import controller from '../controllers/appointments.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: appointments
 *     description: Operations for appointments
 */

/**
 * @openapi
 * /api/appointments:
 *   get:
 *     tags:
 *       - appointments
 *     summary: Get all appointments
 *     responses:
 *       200:
 *         description: list of appointments
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/appointments/{id}:
 *   get:
 *     tags:
 *       - appointments
 *     summary: Get a single appointments by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a appointments object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/appointments:
 *   post:
 *     tags:
 *       - appointments
 *     summary: Create a new appointments
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
 * /api/appointments/{id}:
 *   put:
 *     tags:
 *       - appointments
 *     summary: Update a appointments
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
 * /api/appointments/{id}:
 *   delete:
 *     tags:
 *       - appointments
 *     summary: Delete a appointments
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
