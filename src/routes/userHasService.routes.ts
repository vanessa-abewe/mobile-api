import express from "express"
import controller from "../controllers/userHasService.controller"

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: userHasService
 *     description: Operations for user-service relationships
 */

/**
 * @openapi
 * /api/user_has_service:
 *   get:
 *     tags:
 *       - userHasService
 *     summary: Get all user-service relationships
 *     responses:
 *       200:
 *         description: list of user-service relationships
 */
router.get("/", controller.getAll)

/**
 * @openapi
 * /api/user_has_service/{id}:
 *   get:
 *     tags:
 *       - userHasService
 *     summary: Get a single user-service relationship by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a user-service relationship object
 *       404:
 *         description: not found
 */
router.get("/:id", controller.getById)

/**
 * @openapi
 * /api/user_has_service:
 *   post:
 *     tags:
 *       - userHasService
 *     summary: Create a new user-service relationship
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
 * /api/user_has_service/{id}:
 *   put:
 *     tags:
 *       - userHasService
 *     summary: Update a user-service relationship
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
 * /api/user_has_service/{id}:
 *   delete:
 *     tags:
 *       - userHasService
 *     summary: Delete a user-service relationship
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
