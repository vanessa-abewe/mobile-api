import { Router } from "express"
import {
  getRecommendations,
  generateRecommendations,
  getInteractions,
  recordInteraction,
  getRecommendationStats,
} from "../controllers/RecommendationController"
import { authenticateToken, optionalAuth } from "../middleware/auth"

const router = Router()

/**
 * @openapi
 * /api/recommendations:
 *   get:
 *     summary: Get personalized recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [mixed, content, collaborative, location, popular]
 *           default: mixed
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: Required for location-based recommendations
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: Required for location-based recommendations
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 10
 *         description: Radius in kilometers for location-based recommendations
 *     responses:
 *       200:
 *         description: Personalized business recommendations
 *       400:
 *         description: Missing required parameters for location-based recommendations
 */
router.get("/", optionalAuth, getRecommendations)

/**
 * @openapi
 * /api/recommendations:
 *   post:
 *     summary: Generate new recommendations based on preferences
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: object
 *                 description: User preferences object
 *               location:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Recommendations generated successfully
 */
router.post("/", optionalAuth, generateRecommendations)

/**
 * @openapi
 * /api/interactions:
 *   get:
 *     summary: Get user interaction history
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
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
 *           default: 20
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [view, click, share, save, call, directions, website_visit]
 *     responses:
 *       200:
 *         description: User interaction history with pagination
 */
router.get("/interactions", authenticateToken, getInteractions)

/**
 * @openapi
 * /api/interactions:
 *   post:
 *     summary: Record user interaction with business
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessId
 *               - type
 *             properties:
 *               businessId:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [view, click, share, save, call, directions, website_visit]
 *               metadata:
 *                 type: object
 *                 description: Additional interaction data
 *     responses:
 *       201:
 *         description: Interaction recorded successfully
 *       400:
 *         description: Invalid interaction type or missing required fields
 *       404:
 *         description: Business not found
 */
router.post("/interactions", authenticateToken, recordInteraction)

/**
 * @openapi
 * /api/recommendations/stats:
 *   get:
 *     summary: Get recommendation and interaction statistics
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User recommendation and interaction statistics
 */
router.get("/stats", authenticateToken, getRecommendationStats)

export default router
