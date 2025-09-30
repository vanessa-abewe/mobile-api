
import express from 'express';
import controller from '../controllers/serviceGroup.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: service_group
 *     description: Operations for service_group
 */

/**
 * @openapi
 * /api/service_group:
 *   get:
 *     tags:
 *       - service_group
 *     summary: Get all service_group
 *     responses:
 *       200:
 *         description: list of service_group
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/service_group/{id}:
 *   get:
 *     tags:
 *       - service_group
 *     summary: Get a single service_group by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a service_group object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/service_group:
 *   post:
 *     tags:
 *       - service_group
 *     summary: Create a new service_group
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
 * /api/service_group/{id}:
 *   put:
 *     tags:
 *       - service_group
 *     summary: Update a service_group
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
 * /api/service_group/{id}:
 *   delete:
 *     tags:
 *       - service_group
 *     summary: Delete a service_group
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
