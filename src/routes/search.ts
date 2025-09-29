import { Router } from "express"
import { universalSearch, getSearchSuggestions, getPopularSearches } from "../controllers/SearchController"

const router = Router()

/**
 * @openapi
 * /api/search:
 *   get:
 *     summary: Universal search across businesses, users, and reviews
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, businesses, users, reviews]
 *           default: all
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
 *           maximum: 100
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *     responses:
 *       200:
 *         description: Search results with relevance scoring
 *       400:
 *         description: Search query is required
 */
router.get("/", universalSearch)

/**
 * @openapi
 * /api/search/suggestions:
 *   get:
 *     summary: Get search suggestions and autocomplete
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Partial search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 20
 *     responses:
 *       200:
 *         description: Search suggestions for autocomplete
 *       400:
 *         description: Search query is required
 */
router.get("/suggestions", getSearchSuggestions)

/**
 * @openapi
 * /api/search/popular:
 *   get:
 *     summary: Get popular searches and trending topics
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Popular categories, locations, and trending businesses
 */
router.get("/popular", getPopularSearches)

export default router
