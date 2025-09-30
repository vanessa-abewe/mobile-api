
import express from 'express';
import controller from '../controllers/subscriptionPlans.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: subscription_plans
 *     description: Operations for subscription_plans
 */

/**
 * @openapi
 * /api/subscription_plans:
 *   get:
 *     tags:
 *       - subscription_plans
 *     summary: Get all subscription_plans
 *     responses:
 *       200:
 *         description: list of subscription_plans
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/subscription_plans/{id}:
 *   get:
 *     tags:
 *       - subscription_plans
 *     summary: Get a single subscription_plans by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a subscription_plans object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/subscription_plans:
 *   post:
 *     tags:
 *       - subscription_plans
 *     summary: Create a new subscription_plans
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
 * /api/subscription_plans/{id}:
 *   put:
 *     tags:
 *       - subscription_plans
 *     summary: Update a subscription_plans
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
 * /api/subscription_plans/{id}:
 *   delete:
 *     tags:
 *       - subscription_plans
 *     summary: Delete a subscription_plans
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
