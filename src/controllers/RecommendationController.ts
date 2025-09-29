import type { Response } from "express"
import db from "../config/db"
import type { AuthRequest } from "../middleware/auth"

// Recommendation algorithms
class RecommendationEngine {
  // Content-based filtering: recommend based on user's past interactions
  static async getContentBasedRecommendations(userId: number, limit = 10) {
    // Get user's review history to understand preferences
    const userReviews = await db("reviews")
      .select("businessId", "rating", "businesses.category", "businesses.tags")
      .join("businesses", "reviews.businessId", "businesses.id")
      .where("reviews.userId", userId)
      .where("reviews.rating", ">=", 4) // Only consider positive reviews

    if (userReviews.length === 0) {
      return this.getPopularRecommendations(limit)
    }

    // Extract preferred categories and tags
    const categoryPreferences: { [key: string]: number } = {}
    const tagPreferences: { [key: string]: number } = {}

    userReviews.forEach((review) => {
      // Weight by rating
      const weight = review.rating / 5

      // Count category preferences
      if (review.category) {
        categoryPreferences[review.category] = (categoryPreferences[review.category] || 0) + weight
      }

      // Count tag preferences
      if (review.tags) {
        const tags = review.tags.split(",")
        tags.forEach((tag: string) => {
          const cleanTag = tag.trim().toLowerCase()
          tagPreferences[cleanTag] = (tagPreferences[cleanTag] || 0) + weight
        })
      }
    })

    // Get top categories and tags
    const topCategories = Object.entries(categoryPreferences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    const topTags = Object.entries(tagPreferences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)

    // Find businesses matching preferences that user hasn't reviewed
    const reviewedBusinessIds = userReviews.map((r) => r.businessId)

    let query = db("businesses")
      .select(
        "businesses.*",
        db.raw("AVG(reviews.rating) as averageRating"),
        db.raw("COUNT(reviews.id) as reviewCount"),
        db.raw("0 as recommendationScore"), // Will be calculated
      )
      .leftJoin("reviews", "businesses.id", "reviews.businessId")
      .where("businesses.isActive", true)
      .whereNotIn("businesses.id", reviewedBusinessIds)
      .groupBy("businesses.id")
      .having("averageRating", ">=", 3.5)

    if (topCategories.length > 0) {
      query = query.whereIn("businesses.category", topCategories)
    }

    const recommendations = await query.orderBy("averageRating", "desc").limit(limit * 2) // Get more to filter

    // Score recommendations based on tag matching
    const scoredRecommendations = recommendations.map((business: any) => {
      let score = Number.parseFloat(business.averageRating) || 0

      if (business.tags) {
        const businessTags = business.tags.toLowerCase().split(",")
        const matchingTags = businessTags.filter((tag: string) => topTags.includes(tag.trim()))
        score += matchingTags.length * 0.5 // Bonus for tag matches
      }

      return { ...business, recommendationScore: score }
    })

    return scoredRecommendations.sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, limit)
  }

  // Collaborative filtering: recommend based on similar users
  static async getCollaborativeRecommendations(userId: number, limit = 10) {
    // Find users with similar rating patterns
    const userRatings = await db("reviews").select("businessId", "rating").where("userId", userId)

    if (userRatings.length < 3) {
      return this.getContentBasedRecommendations(userId, limit)
    }

    const userBusinessIds = userRatings.map((r) => r.businessId)

    // Find users who rated the same businesses
    const similarUsers = await db("reviews")
      .select("userId")
      .count("* as commonRatings")
      .whereIn("businessId", userBusinessIds)
      .where("userId", "!=", userId)
      .groupBy("userId")
      .having("commonRatings", ">=", 2)
      .orderBy("commonRatings", "desc")
      .limit(20)

    if (similarUsers.length === 0) {
      return this.getContentBasedRecommendations(userId, limit)
    }

    const similarUserIds = similarUsers.map((u: any) => u.userId)

    // Get highly rated businesses from similar users that current user hasn't reviewed
    const recommendations = await db("reviews")
      .select(
        "businesses.*",
        db.raw("AVG(reviews.rating) as averageRating"),
        db.raw("COUNT(reviews.id) as reviewCount"),
      )
      .join("businesses", "reviews.businessId", "businesses.id")
      .whereIn("reviews.userId", similarUserIds)
      .whereNotIn("businesses.id", userBusinessIds)
      .where("reviews.rating", ">=", 4)
      .where("businesses.isActive", true)
      .groupBy("businesses.id")
      .orderBy("averageRating", "desc")
      .limit(limit)

    return recommendations
  }

  // Popular recommendations for new users
  static async getPopularRecommendations(limit = 10) {
    return await db("businesses")
      .select(
        "businesses.*",
        db.raw("AVG(reviews.rating) as averageRating"),
        db.raw("COUNT(reviews.id) as reviewCount"),
      )
      .join("reviews", "businesses.id", "reviews.businessId")
      .where("businesses.isActive", true)
      .groupBy("businesses.id")
      .having("reviewCount", ">=", 5)
      .orderBy("averageRating", "desc")
      .orderBy("reviewCount", "desc")
      .limit(limit)
  }

  // Location-based recommendations
  static async getLocationBasedRecommendations(
    userId: number,
    latitude: number,
    longitude: number,
    radiusKm = 10,
    limit = 10,
  ) {
    // Get user's reviewed businesses to exclude
    const reviewedBusinessIds = await db("reviews").select("businessId").where("userId", userId)
    const excludeIds = reviewedBusinessIds.map((r: any) => r.businessId)

    // Find nearby businesses using Haversine formula
    const recommendations = await db("businesses")
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
          [latitude, longitude, latitude],
        ),
      )
      .leftJoin("reviews", "businesses.id", "reviews.businessId")
      .where("businesses.isActive", true)
      .whereNotNull("businesses.latitude")
      .whereNotNull("businesses.longitude")
      .whereNotIn("businesses.id", excludeIds.length > 0 ? excludeIds : [0])
      .groupBy("businesses.id")
      .having("distance", "<=", radiusKm)
      .orderBy("averageRating", "desc")
      .orderBy("distance", "asc")
      .limit(limit)

    return recommendations
  }
}

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const { type = "mixed", limit = 10, latitude, longitude, radius = 10 } = req.query

    const userId = req.user?.id
    const limitNum = Math.min(Number(limit), 50) // Max 50 recommendations

    let recommendations: any[] = []

    if (!userId) {
      // For non-authenticated users, return popular recommendations
      recommendations = await RecommendationEngine.getPopularRecommendations(limitNum)
    } else {
      switch (type) {
        case "content":
          recommendations = await RecommendationEngine.getContentBasedRecommendations(userId, limitNum)
          break

        case "collaborative":
          recommendations = await RecommendationEngine.getCollaborativeRecommendations(userId, limitNum)
          break

        case "location":
          if (!latitude || !longitude) {
            return res.status(400).json({
              success: false,
              message: "Latitude and longitude are required for location-based recommendations",
            })
          }
          recommendations = await RecommendationEngine.getLocationBasedRecommendations(
            userId,
            Number.parseFloat(latitude as string),
            Number.parseFloat(longitude as string),
            Number.parseFloat(radius as string),
            limitNum,
          )
          break

        case "popular":
          recommendations = await RecommendationEngine.getPopularRecommendations(limitNum)
          break

        case "mixed":
        default:
          // Mix different recommendation types
          const contentRecs = await RecommendationEngine.getContentBasedRecommendations(userId, Math.ceil(limitNum / 2))
          const collaborativeRecs = await RecommendationEngine.getCollaborativeRecommendations(
            userId,
            Math.floor(limitNum / 2),
          )

          // Combine and deduplicate
          const combinedRecs = [...contentRecs, ...collaborativeRecs]
          const uniqueRecs = combinedRecs.filter((rec, index, self) => index === self.findIndex((r) => r.id === rec.id))

          recommendations = uniqueRecs.slice(0, limitNum)
          break
      }
    }

    res.json({
      success: true,
      data: {
        recommendations,
        type,
        count: recommendations.length,
      },
    })
  } catch (error: any) {
    console.error("Get recommendations error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const generateRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const { preferences, location, categories, tags } = req.body
    const userId = req.user?.id

    // Build query based on preferences
    let query = db("businesses")
      .select(
        "businesses.*",
        db.raw("AVG(reviews.rating) as averageRating"),
        db.raw("COUNT(reviews.id) as reviewCount"),
      )
      .leftJoin("reviews", "businesses.id", "reviews.businessId")
      .where("businesses.isActive", true)
      .groupBy("businesses.id")

    // Apply filters
    if (categories && categories.length > 0) {
      query = query.whereIn("businesses.category", categories)
    }

    if (tags && tags.length > 0) {
      query = query.where(function () {
        tags.forEach((tag: string, index: number) => {
          if (index === 0) {
            this.where("businesses.tags", "like", `%${tag}%`)
          } else {
            this.orWhere("businesses.tags", "like", `%${tag}%`)
          }
        })
      })
    }

    if (location) {
      query = query.where("businesses.location", "like", `%${location}%`)
    }

    // Exclude user's reviewed businesses if authenticated
    if (userId) {
      const reviewedBusinessIds = await db("reviews").select("businessId").where("userId", userId)
      const excludeIds = reviewedBusinessIds.map((r: any) => r.businessId)
      if (excludeIds.length > 0) {
        query = query.whereNotIn("businesses.id", excludeIds)
      }
    }

    const recommendations = await query.orderBy("averageRating", "desc").limit(20)

    // Store user preferences for future recommendations
    if (userId && preferences) {
      await db("user_preferences")
        .insert({
          userId,
          preferences: JSON.stringify(preferences),
          categories: categories ? categories.join(",") : null,
          tags: tags ? tags.join(",") : null,
          location,
          createdAt: new Date(),
        })
        .onConflict("userId")
        .merge({
          preferences: JSON.stringify(preferences),
          categories: categories ? categories.join(",") : null,
          tags: tags ? tags.join(",") : null,
          location,
          updatedAt: new Date(),
        })
    }

    res.json({
      success: true,
      message: "Recommendations generated successfully",
      data: {
        recommendations,
        count: recommendations.length,
      },
    })
  } catch (error: any) {
    console.error("Generate recommendations error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getInteractions = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, type } = req.query
    const userId = req.user?.id

    const offset = (Number(page) - 1) * Number(limit)

    let query = db("user_interactions")
      .select("user_interactions.*", "businesses.name as businessName")
      .leftJoin("businesses", "user_interactions.businessId", "businesses.id")
      .where("user_interactions.userId", userId)

    if (type) {
      query = query.where("user_interactions.type", type)
    }

    const interactions = await query.orderBy("user_interactions.createdAt", "desc").limit(Number(limit)).offset(offset)

    // Get total count
    const totalQuery = db("user_interactions").where("userId", userId)
    if (type) totalQuery.where("type", type)
    const [{ count: total }] = await totalQuery.count("* as count")

    res.json({
      success: true,
      data: {
        interactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total),
          pages: Math.ceil(Number(total) / Number(limit)),
        },
      },
    })
  } catch (error: any) {
    console.error("Get interactions error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const recordInteraction = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, type, metadata } = req.body
    const userId = req.user?.id

    // Validation
    if (!businessId || !type) {
      return res.status(400).json({
        success: false,
        message: "Business ID and interaction type are required",
      })
    }

    const validTypes = ["view", "click", "share", "save", "call", "directions", "website_visit"]
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interaction type",
      })
    }

    // Check if business exists
    const business = await db("businesses").where({ id: businessId }).first()
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      })
    }

    // Record interaction
    await db("user_interactions").insert({
      userId,
      businessId,
      type,
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdAt: new Date(),
    })

    res.status(201).json({
      success: true,
      message: "Interaction recorded successfully",
    })
  } catch (error: any) {
    console.error("Record interaction error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getRecommendationStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id

    // Get user's interaction stats
    const [interactionStats] = await db("user_interactions")
      .select(
        db.raw("COUNT(*) as totalInteractions"),
        db.raw("COUNT(DISTINCT businessId) as uniqueBusinesses"),
        db.raw("COUNT(DISTINCT DATE(createdAt)) as activeDays"),
      )
      .where("userId", userId)

    // Get interaction type breakdown
    const interactionTypes = await db("user_interactions")
      .select("type")
      .count("* as count")
      .where("userId", userId)
      .groupBy("type")
      .orderBy("count", "desc")

    // Get user preferences
    const userPreferences = await db("user_preferences").where("userId", userId).first()

    // Get recommendation performance (if we track clicks/conversions)
    const [recommendationPerformance] = await db("user_interactions")
      .select(
        db.raw("COUNT(*) as totalRecommendationClicks"),
        db.raw("COUNT(DISTINCT businessId) as uniqueRecommendedBusinesses"),
      )
      .where("userId", userId)
      .where("type", "click")
      .whereNotNull("metadata") // Assuming metadata indicates it was from recommendations

    res.json({
      success: true,
      data: {
        interactionStats,
        interactionTypes,
        userPreferences,
        recommendationPerformance,
      },
    })
  } catch (error: any) {
    console.error("Get recommendation stats error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
