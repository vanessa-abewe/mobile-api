import express from "express"
import controller from "../controllers/businessAmenities.controller"

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: businessAmenities
 *     description: Operations for business amenities
 */

/**
 * @openapi
 * /api/business_amenities:
 *   get:
 *     tags:
 *       - businessAmenities
 *     summary: Get all business amenities
 *     responses:
 *       200:
 *         description: list of business amenities
 */
router.get("/", controller.getAll)

/**
 * @openapi
 * /api/business_amenities/{id}:
 *   get:
 *     tags:
 *       - businessAmenities
 *     summary: Get a single business amenity by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a business amenity object
 *       404:
 *         description: not found
 */
router.get("/:id", controller.getById)

/**
 * @openapi
 * /api/business_amenities:
 *   post:
 *     tags:
 *       - businessAmenities
 *     summary: Create a new business amenity
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
 * /api/business_amenities/{id}:
 *   put:
 *     tags:
 *       - businessAmenities
 *     summary: Update a business amenity
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
 * /api/business_amenities/{id}:
 *   delete:
 *     tags:
 *       - businessAmenities
 *     summary: Delete a business amenity
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
