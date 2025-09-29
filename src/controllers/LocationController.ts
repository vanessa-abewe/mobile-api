import type { Request, Response } from "express"
import db from "../config/db"

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const getNearbyBusinesses = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = 10, category, rating, limit = 20, page = 1 } = req.query

    // Validation
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      })
    }

    const lat = Number.parseFloat(latitude as string)
    const lng = Number.parseFloat(longitude as string)
    const radiusKm = Number.parseFloat(radius as string)
    const limitNum = Math.min(Number(limit), 100)
    const offset = (Number(page) - 1) * limitNum

    // Build query with distance calculation
    let query = db("businesses")
      .select(
        "businesses.*",
        db.raw("AVG(reviews.rating) as averageRating"),
        db.raw("COUNT(reviews.id) as reviewCount"),
        db.raw(
          `
          (6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(latitude))
          )) AS distance
        `,
          [lat, lng, lat],
        ),
      )
      .leftJoin("reviews", "businesses.id", "reviews.businessId")
      .where("businesses.isActive", true)
      .whereNotNull("businesses.latitude")
      .whereNotNull("businesses.longitude")
      .groupBy("businesses.id")
      .having("distance", "<=", radiusKm)

    // Apply filters
    if (category) {
      query = query.where("businesses.category", category)
    }

    if (rating) {
      query = query.having("averageRating", ">=", Number(rating))
    }

    // Get total count for pagination
    const countQuery = db("businesses")
      .whereNotNull("latitude")
      .whereNotNull("longitude")
      .where("isActive", true)
      .whereRaw(
        `
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians(?)) + 
          sin(radians(?)) * sin(radians(latitude))
        )) <= ?
      `,
        [lat, lng, lat, radiusKm],
      )

    if (category) {
      countQuery.where("category", category)
    }

    const [{ count: total }] = await countQuery.count("* as count")

    // Get paginated results
    const businesses = await query.orderBy("distance", "asc").limit(limitNum).offset(offset)

    res.json({
      success: true,
      data: {
        businesses,
        center: { latitude: lat, longitude: lng },
        radius: radiusKm,
        pagination: {
          page: Number(page),
          limit: limitNum,
          total: Number(total),
          pages: Math.ceil(Number(total) / limitNum),
        },
      },
    })
  } catch (error: any) {
    console.error("Get nearby businesses error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getDirections = async (req: Request, res: Response) => {
  try {
    const { fromLat, fromLng, toLat, toLng, mode = "driving" } = req.query

    // Validation
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({
        success: false,
        message: "From and to coordinates are required",
      })
    }

    const from = {
      latitude: Number.parseFloat(fromLat as string),
      longitude: Number.parseFloat(fromLng as string),
    }

    const to = {
      latitude: Number.parseFloat(toLat as string),
      longitude: Number.parseFloat(toLng as string),
    }

    // Calculate straight-line distance
    const distance = calculateDistance(from.latitude, from.longitude, to.latitude, to.longitude)

    // Estimate travel time based on mode
    const speedKmh = {
      walking: 5,
      driving: 50,
      cycling: 15,
      transit: 30,
    }

    const estimatedTime = Math.round((distance / (speedKmh[mode as keyof typeof speedKmh] || 50)) * 60) // in minutes

    // In a real implementation, you would integrate with Google Maps, MapBox, or similar service
    // For now, we'll return basic direction information
    const directions = {
      from,
      to,
      mode,
      distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      estimatedTime,
      steps: [
        {
          instruction: `Head ${to.latitude > from.latitude ? "north" : "south"} on your current road`,
          distance: Math.round(distance * 0.3 * 100) / 100,
          duration: Math.round(estimatedTime * 0.3),
        },
        {
          instruction: `Continue ${to.longitude > from.longitude ? "east" : "west"} toward destination`,
          distance: Math.round(distance * 0.5 * 100) / 100,
          duration: Math.round(estimatedTime * 0.5),
        },
        {
          instruction: "Arrive at destination",
          distance: Math.round(distance * 0.2 * 100) / 100,
          duration: Math.round(estimatedTime * 0.2),
        },
      ],
    }

    res.json({
      success: true,
      data: directions,
      note: "This is a simplified direction service. For production, integrate with Google Maps or similar service.",
    })
  } catch (error: any) {
    console.error("Get directions error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const geocodeAddress = async (req: Request, res: Response) => {
  try {
    const { address, latitude, longitude } = req.query

    if (address) {
      // Forward geocoding: address to coordinates
      // In a real implementation, you would use Google Geocoding API or similar
      // For now, we'll return mock coordinates based on common city names
      const mockCoordinates: { [key: string]: { lat: number; lng: number } } = {
        "new york": { lat: 40.7128, lng: -74.006 },
        "los angeles": { lat: 34.0522, lng: -118.2437 },
        chicago: { lat: 41.8781, lng: -87.6298 },
        houston: { lat: 29.7604, lng: -95.3698 },
        phoenix: { lat: 33.4484, lng: -112.074 },
        philadelphia: { lat: 39.9526, lng: -75.1652 },
        "san antonio": { lat: 29.4241, lng: -98.4936 },
        "san diego": { lat: 32.7157, lng: -117.1611 },
        dallas: { lat: 32.7767, lng: -96.797 },
        "san jose": { lat: 37.3382, lng: -121.8863 },
      }

      const searchKey = (address as string).toLowerCase()
      const coords = mockCoordinates[searchKey]

      if (coords) {
        res.json({
          success: true,
          data: {
            address: address as string,
            latitude: coords.lat,
            longitude: coords.lng,
            formatted_address: `${address}, USA`,
          },
          note: "This is a mock geocoding service. For production, integrate with Google Geocoding API or similar.",
        })
      } else {
        res.status(404).json({
          success: false,
          message: "Address not found in mock database",
        })
      }
    } else if (latitude && longitude) {
      // Reverse geocoding: coordinates to address
      const lat = Number.parseFloat(latitude as string)
      const lng = Number.parseFloat(longitude as string)

      // Mock reverse geocoding
      const mockAddress = {
        formatted_address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        city: "Unknown City",
        state: "Unknown State",
        country: "Unknown Country",
        postal_code: "00000",
      }

      res.json({
        success: true,
        data: {
          latitude: lat,
          longitude: lng,
          ...mockAddress,
        },
        note: "This is a mock reverse geocoding service. For production, integrate with Google Geocoding API or similar.",
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Either address or coordinates (latitude and longitude) are required",
      })
    }
  } catch (error: any) {
    console.error("Geocode error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
