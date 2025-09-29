import { Router } from "express"
import { getNearbyBusinesses, getDirections, geocodeAddress } from "../controllers/LocationController"

const router = Router()

/**
 * @openapi
 * /api/locations/nearby:
 *   get:
 *     summary: Find nearby businesses
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 10
 *         description: Search radius in kilometers
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of nearby businesses with distances
 *       400:
 *         description: Latitude and longitude are required
 */
router.get("/nearby", getNearbyBusinesses)

/**
 * @openapi
 * /api/locations/directions:
 *   get:
 *     summary: Get directions between two points
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: fromLat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: fromLng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: toLat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: toLng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [walking, driving, cycling, transit]
 *           default: driving
 *     responses:
 *       200:
 *         description: Direction information with steps and estimated time
 *       400:
 *         description: From and to coordinates are required
 */
router.get("/directions", getDirections)

/**
 * @openapi
 * /api/locations/geocode:
 *   get:
 *     summary: Convert address to coordinates or coordinates to address
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Address to convert to coordinates (forward geocoding)
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: Latitude for reverse geocoding
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: Longitude for reverse geocoding
 *     responses:
 *       200:
 *         description: Geocoding results
 *       400:
 *         description: Either address or coordinates are required
 *       404:
 *         description: Address not found
 */
router.get("/geocode", geocodeAddress)

export default router
