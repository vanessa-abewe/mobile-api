import express from "express"
import controller from "../controllers/institutionFollow.controller"

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: institutionFollow
 *     description: Operations for institution follows
 */

/**
 * @openapi
 * /api/institution_follow:
 *   get:
 *     tags:
 *       - institutionFollow
 *     summary: Get all institution follows
 *     responses:
 *       200:
 *         description: list of institution follows
 */
router.get("/", controller.getAll)

/**
 * @openapi
 * /api/institution_follow/{id}:
 *   get:
 *     tags:
 *       - institutionFollow
 *     summary: Get a single institution follow by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: an institution follow object
 *       404:
 *         description: not found
 */
router.get("/:id", controller.getById)

/**
 * @openapi
 * /api/institution_follow:
 *   post:
 *     tags:
 *       - institutionFollow
 *     summary: Create a new institution follow
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
router.post("/", controller.create)

/**
 * @openapi
 * /api/institution_follow/{id}:
 *   put:
 *     tags:
 *       - institutionFollow
 *     summary: Update an institution follow
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
router.put("/:id", controller.update)

/**
 * @openapi
 * /api/institution_follow/{id}:
 *   delete:
 *     tags:
 *       - institutionFollow
 *     summary: Delete an institution follow
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
router.delete("/:id", controller.remove)

export default router
