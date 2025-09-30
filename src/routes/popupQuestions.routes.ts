
import express from 'express';
import controller from '../controllers/popupQuestions.controller';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: popup_questions
 *     description: Operations for popup_questions
 */

/**
 * @openapi
 * /api/popup_questions:
 *   get:
 *     tags:
 *       - popup_questions
 *     summary: Get all popup_questions
 *     responses:
 *       200:
 *         description: list of popup_questions
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /api/popup_questions/{id}:
 *   get:
 *     tags:
 *       - popup_questions
 *     summary: Get a single popup_questions by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a popup_questions object
 *       404:
 *         description: not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/popup_questions:
 *   post:
 *     tags:
 *       - popup_questions
 *     summary: Create a new popup_questions
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
 * /api/popup_questions/{id}:
 *   put:
 *     tags:
 *       - popup_questions
 *     summary: Update a popup_questions
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
 * /api/popup_questions/{id}:
 *   delete:
 *     tags:
 *       - popup_questions
 *     summary: Delete a popup_questions
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
