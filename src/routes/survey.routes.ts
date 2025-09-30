
import express from 'express';
import controller from '../controllers/survey.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: survey
 *     description: Operations for survey
 */

/**
 * @openapi
 * /api/survey:
 *   get:
 *     tags:
 *       - survey
 *     summary: Get all survey
 *     responses:
 *       200:
 *         description: list of survey
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/survey/{id}:
 *   get:
 *     tags:
 *       - survey
 *     summary: Get a single survey by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a survey object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/survey:
 *   post:
 *     tags:
 *       - survey
 *     summary: Create a new survey
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
 * /api/survey/{id}:
 *   put:
 *     tags:
 *       - survey
 *     summary: Update a survey
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
 * /api/survey/{id}:
 *   delete:
 *     tags:
 *       - survey
 *     summary: Delete a survey
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
