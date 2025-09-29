import { Router } from "express"
import { getAnalytics, getBusinessAnalytics, getUserAnalytics } from "../controllers/AnalyticsController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

/**
 * @openapi
 * /api/analytics:
 *   get:
 *     summary: Get platform analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [overview, business, user, reviews, categories, locations, all]
 *           default: overview
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *       - in: query
 *         name: businessId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Platform analytics data
 */
router.get("/", getAnalytics)

/**
 * @openapi
 * /api/analytics/business/{id}:
 *   get:
 *     summary: Get business analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Business analytics including reviews, interactions, and trends
 *       403:
 *         description: Can only view analytics for your own businesses
 *       404:
 *         description: Business not found
 */
router.get("/business/:id", authenticateToken, getBusinessAnalytics)

/**
 * @openapi
 * /api/analytics/user/{id}:
 *   get:
 *     summary: Get user analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: User analytics including activity, reviews, and preferences
 *       403:
 *         description: Can only view your own analytics
 */
router.get("/user/:id", authenticateToken, getUserAnalytics)

export default router
