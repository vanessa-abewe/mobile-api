
import express from 'express';
import controller from '../controllers/institutionServiceTracking.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: institution_service_tracking
 *     description: Operations for institution_service_tracking
 */

/**
 * @openapi
 * /api/institution_service_tracking:
 *   get:
 *     tags:
 *       - institution_service_tracking
 *     summary: Get all institution_service_tracking
 *     responses:
 *       200:
 *         description: list of institution_service_tracking
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/institution_service_tracking/{id}:
 *   get:
 *     tags:
 *       - institution_service_tracking
 *     summary: Get a single institution_service_tracking by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a institution_service_tracking object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/institution_service_tracking:
 *   post:
 *     tags:
 *       - institution_service_tracking
 *     summary: Create a new institution_service_tracking
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
 * /api/institution_service_tracking/{id}:
 *   put:
 *     tags:
 *       - institution_service_tracking
 *     summary: Update a institution_service_tracking
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
 * /api/institution_service_tracking/{id}:
 *   delete:
 *     tags:
 *       - institution_service_tracking
 *     summary: Delete a institution_service_tracking
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
