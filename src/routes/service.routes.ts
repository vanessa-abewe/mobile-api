
import express from 'express';
import controller from '../controllers/service.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: service
 *     description: Operations for service
 */

/**
 * @openapi
 * /api/service:
 *   get:
 *     tags:
 *       - service
 *     summary: Get all service
 *     responses:
 *       200:
 *         description: list of service
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/service/{id}:
 *   get:
 *     tags:
 *       - service
 *     summary: Get a single service by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a service object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/service:
 *   post:
 *     tags:
 *       - service
 *     summary: Create a new service
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
 * /api/service/{id}:
 *   put:
 *     tags:
 *       - service
 *     summary: Update a service
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
 * /api/service/{id}:
 *   delete:
 *     tags:
 *       - service
 *     summary: Delete a service
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
