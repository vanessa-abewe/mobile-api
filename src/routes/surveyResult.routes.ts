
import express from 'express';
import controller from '../controllers/surveyResult.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: survey_result
 *     description: Operations for survey_result
 */

/**
 * @openapi
 * /api/survey_result:
 *   get:
 *     tags:
 *       - survey_result
 *     summary: Get all survey_result
 *     responses:
 *       200:
 *         description: list of survey_result
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/survey_result/{id}:
 *   get:
 *     tags:
 *       - survey_result
 *     summary: Get a single survey_result by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a survey_result object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/survey_result:
 *   post:
 *     tags:
 *       - survey_result
 *     summary: Create a new survey_result
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
 * /api/survey_result/{id}:
 *   put:
 *     tags:
 *       - survey_result
 *     summary: Update a survey_result
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
 * /api/survey_result/{id}:
 *   delete:
 *     tags:
 *       - survey_result
 *     summary: Delete a survey_result
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
