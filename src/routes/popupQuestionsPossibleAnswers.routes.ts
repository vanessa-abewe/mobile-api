
import express from 'express';
import controller from '../controllers/popupQuestionsPossibleAnswers.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: popup_questions_possible_answers
 *     description: Operations for popup_questions_possible_answers
 */

/**
 * @openapi
 * /api/popup_questions_possible_answers:
 *   get:
 *     tags:
 *       - popup_questions_possible_answers
 *     summary: Get all popup_questions_possible_answers
 *     responses:
 *       200:
 *         description: list of popup_questions_possible_answers
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/popup_questions_possible_answers/{id}:
 *   get:
 *     tags:
 *       - popup_questions_possible_answers
 *     summary: Get a single popup_questions_possible_answers by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a popup_questions_possible_answers object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/popup_questions_possible_answers:
 *   post:
 *     tags:
 *       - popup_questions_possible_answers
 *     summary: Create a new popup_questions_possible_answers
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
 * /api/popup_questions_possible_answers/{id}:
 *   put:
 *     tags:
 *       - popup_questions_possible_answers
 *     summary: Update a popup_questions_possible_answers
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
 * /api/popup_questions_possible_answers/{id}:
 *   delete:
 *     tags:
 *       - popup_questions_possible_answers
 *     summary: Delete a popup_questions_possible_answers
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
