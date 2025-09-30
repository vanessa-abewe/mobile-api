import express from "express"
import controller from "../controllers/images.controller"

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: images
 *     description: Operations for images
 */

/**
 * @openapi
 * /api/images:
 *   get:
 *     tags:
 *       - images
 *     summary: Get all images
 *     responses:
 *       200:
 *         description: list of images
 */
router.get("/", controller.getAll)

/**
 * @openapi
 * /api/images/{id}:
 *   get:
 *     tags:
 *       - images
 *     summary: Get a single image by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: an image object
 *       404:
 *         description: not found
 */
router.get("/:id", controller.getById)

/**
 * @openapi
 * /api/images:
 *   post:
 *     tags:
 *       - images
 *     summary: Create a new image
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
 * /api/images/{id}:
 *   put:
 *     tags:
 *       - images
 *     summary: Update an image
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
 * /api/images/{id}:
 *   delete:
 *     tags:
 *       - images
 *     summary: Delete an image
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
