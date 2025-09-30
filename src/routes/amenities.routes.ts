import express from "express"
import controller from "../controllers/amenities.controller"

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: amenities
 *     description: Operations for amenities
 */

/**
 * @openapi
 * /api/amenities:
 *   get:
 *     tags:
 *       - amenities
 *     summary: Get all amenities
 *     responses:
 *       200:
 *         description: list of amenities
 */
router.get("/", controller.getAll)

/**
 * @openapi
 * /api/amenities/{id}:
 *   get:
 *     tags:
 *       - amenities
 *     summary: Get a single amenity by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: an amenity object
 *       404:
 *         description: not found
 */
router.get("/:id", controller.getById)

/**
 * @openapi
 * /api/amenities:
 *   post:
 *     tags:
 *       - amenities
 *     summary: Create a new amenity
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
 * /api/amenities/{id}:
 *   put:
 *     tags:
 *       - amenities
 *     summary: Update an amenity
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
 * /api/amenities/{id}:
 *   delete:
 *     tags:
 *       - amenities
 *     summary: Delete an amenity
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
