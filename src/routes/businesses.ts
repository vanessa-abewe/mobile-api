import { Router } from "express"
import {
  getBusinesses,
  createBusiness,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getBusinessCategories,
} from "../controllers/BusinessController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

/**
 * @openapi
 * /api/businesses:
 *   get:
 *     summary: Get businesses with filtering and pagination
 *     tags: [Businesses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, averageRating, reviewCount]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of businesses with pagination
 */
router.get("/", getBusinesses)

/**
 * @openapi
 * /api/businesses:
 *   post:
 *     summary: Create new business
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               hours:
 *                 type: object
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Business created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post("/", authenticateToken, createBusiness)

/**
 * @openapi
 * /api/businesses/categories:
 *   get:
 *     summary: Get business categories with counts
 *     tags: [Businesses]
 *     responses:
 *       200:
 *         description: List of categories with business counts
 */
router.get("/categories", getBusinessCategories)

/**
 * @openapi
 * /api/businesses/{id}:
 *   get:
 *     summary: Get business details by ID
 *     tags: [Businesses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Business details with recent reviews
 *       404:
 *         description: Business not found
 */
router.get("/:id", getBusinessById)

/**
 * @openapi
 * /api/businesses/{id}:
 *   put:
 *     summary: Update business
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               hours:
 *                 type: object
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       403:
 *         description: Not authorized to update this business
 *       404:
 *         description: Business not found
 */
router.put("/:id", authenticateToken, updateBusiness)

/**
 * @openapi
 * /api/businesses/{id}:
 *   delete:
 *     summary: Delete business (soft delete)
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Business deleted successfully
 *       403:
 *         description: Not authorized to delete this business
 *       404:
 *         description: Business not found
 */
router.delete("/:id", authenticateToken, deleteBusiness)

export default router
