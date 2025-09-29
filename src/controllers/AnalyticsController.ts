import type { Request, Response } from "express"
import db from "../config/db"
import type { AuthRequest } from "../middleware/auth"

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { type = "overview", period = "30d", businessId, userId } = req.query

    const periodDays = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    }

    const days = periodDays[period as keyof typeof periodDays] || 30

    const analytics: any = {}

    if (type === "overview" || type === "all") {
      // Platform overview analytics
      const [platformStats] = await db.raw(
        `
        SELECT 
          (SELECT COUNT(*) FROM users WHERE isActive = true) as totalUsers,
          (SELECT COUNT(*) FROM businesses WHERE isActive = true) as totalBusinesses,
          (SELECT COUNT(*) FROM reviews) as totalReviews,
          (SELECT AVG(rating) FROM reviews) as averageRating,
          (SELECT COUNT(*) FROM users WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)) as newUsersThisPeriod,
          (SELECT COUNT(*) FROM businesses WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)) as newBusinessesThisPeriod,
          (SELECT COUNT(*) FROM reviews WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)) as newReviewsThisPeriod
      `,
        [days, days, days],
      )

      analytics.platform = platformStats[0]
    }

    if (type === "business" || type === "all") {
      // Business analytics
      let businessQuery = db("businesses")
        .select(
          "businesses.*",
          db.raw("AVG(reviews.rating) as averageRating"),
          db.raw("COUNT(reviews.id) as reviewCount"),
          db.raw("COUNT(DISTINCT reviews.userId) as uniqueReviewers"),
        )
        .leftJoin("reviews", "businesses.id", "reviews.businessId")
        .where("businesses.isActive", true)
        .groupBy("businesses.id")

      if (businessId) {
        businessQuery = businessQuery.where("businesses.id", businessId)
      }

      const businessAnalytics = await businessQuery.orderBy("reviewCount", "desc").limit(businessId ? 1 : 10)

      // Get business performance over time
      const businessPerformance = await db("reviews")
        .select(
          db.raw("DATE(createdAt) as date"),
          db.raw("COUNT(*) as reviewCount"),
          db.raw("AVG(rating) as averageRating"),
        )
        .where("createdAt", ">=", db.raw(`DATE_SUB(NOW(), INTERVAL ${days} DAY)`))
        .groupBy(db.raw("DATE(createdAt)"))
        .orderBy("date", "asc")

      analytics.business = {
        businesses: businessAnalytics,
        performance: businessPerformance,
      }
    }

    if (type === "user" || type === "all") {
      // User analytics
      let userQuery = db("users")
        .select(
          "users.id",
          "users.firstName",
          "users.lastName",
          "users.createdAt",
          db.raw("COUNT(reviews.id) as reviewCount"),
          db.raw("AVG(reviews.rating) as averageRating"),
          db.raw("COUNT(DISTINCT reviews.businessId) as businessesReviewed"),
        )
        .leftJoin("reviews", "users.id", "reviews.userId")
        .where("users.isActive", true)
        .groupBy("users.id")

      if (userId) {
        userQuery = userQuery.where("users.id", userId)
      }

      const userAnalytics = await userQuery.orderBy("reviewCount", "desc").limit(userId ? 1 : 10)

      // Get user activity over time
      const userActivity = await db("user_interactions")
        .select(
          db.raw("DATE(createdAt) as date"),
          db.raw("COUNT(*) as interactionCount"),
          db.raw("COUNT(DISTINCT userId) as activeUsers"),
        )
        .where("createdAt", ">=", db.raw(`DATE_SUB(NOW(), INTERVAL ${days} DAY)`))
        .groupBy(db.raw("DATE(createdAt)"))
        .orderBy("date", "asc")

      analytics.user = {
        users: userAnalytics,
        activity: userActivity,
      }
    }

    if (type === "reviews" || type === "all") {
      // Review analytics
      const reviewStats = await db("reviews")
        .select("rating", db.raw("COUNT(*) as count"), db.raw("COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage"))
        .groupBy("rating")
        .orderBy("rating", "desc")

      const sentimentStats = await db("reviews")
        .select(
          "sentiment",
          db.raw("COUNT(*) as count"),
          db.raw("COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage"),
        )
        .groupBy("sentiment")

      const reviewTrends = await db("reviews")
        .select(
          db.raw("DATE(createdAt) as date"),
          db.raw("COUNT(*) as reviewCount"),
          db.raw("AVG(rating) as averageRating"),
          db.raw("SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) as positiveCount"),
          db.raw("SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) as negativeCount"),
        )
        .where("createdAt", ">=", db.raw(`DATE_SUB(NOW(), INTERVAL ${days} DAY)`))
        .groupBy(db.raw("DATE(createdAt)"))
        .orderBy("date", "asc")

      analytics.reviews = {
        ratingDistribution: reviewStats,
        sentimentDistribution: sentimentStats,
        trends: reviewTrends,
      }
    }

    if (type === "categories" || type === "all") {
      // Category analytics
      const categoryStats = await db("businesses")
        .select(
          "category",
          db.raw("COUNT(*) as businessCount"),
          db.raw("AVG(reviews.rating) as averageRating"),
          db.raw("COUNT(reviews.id) as totalReviews"),
        )
        .leftJoin("reviews", "businesses.id", "reviews.businessId")
        .where("businesses.isActive", true)
        .groupBy("category")
        .orderBy("businessCount", "desc")

      analytics.categories = categoryStats
    }

    if (type === "locations" || type === "all") {
      // Location analytics
      const locationStats = await db("businesses")
        .select(
          "location",
          db.raw("COUNT(*) as businessCount"),
          db.raw("AVG(reviews.rating) as averageRating"),
          db.raw("COUNT(reviews.id) as totalReviews"),
        )
        .leftJoin("reviews", "businesses.id", "reviews.businessId")
        .where("businesses.isActive", true)
        .groupBy("location")
        .orderBy("businessCount", "desc")
        .limit(20)

      analytics.locations = locationStats
    }

    res.json({
      success: true,
      data: {
        type,
        period,
        periodDays: days,
        ...analytics,
        generatedAt: new Date(),
      },
    })
  } catch (error: any) {
    console.error("Get analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getBusinessAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { period = "30d" } = req.query

    const periodDays = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    }

    const days = periodDays[period as keyof typeof periodDays] || 30

    // Check if business exists and user owns it
    const business = await db("businesses").where({ id }).first()
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      })
    }

    if (business.ownerId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "You can only view analytics for your own businesses",
      })
    }

    // Get business overview stats
    const [overviewStats] = await db.raw(
      `
      SELECT 
        (SELECT COUNT(*) FROM reviews WHERE businessId = ?) as totalReviews,
        (SELECT AVG(rating) FROM reviews WHERE businessId = ?) as averageRating,
        (SELECT COUNT(DISTINCT userId) FROM reviews WHERE businessId = ?) as uniqueReviewers,
        (SELECT COUNT(*) FROM user_interactions WHERE businessId = ?) as totalInteractions,
        (SELECT COUNT(*) FROM reviews WHERE businessId = ? AND createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)) as recentReviews,
        (SELECT COUNT(*) FROM user_interactions WHERE businessId = ? AND createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)) as recentInteractions
    `,
      [id, id, id, id, id, days, id, days],
    )

    // Get review trends
    const reviewTrends = await db("reviews")
      .select(
        db.raw("DATE(createdAt) as date"),
        db.raw("COUNT(*) as reviewCount"),
        db.raw("AVG(rating) as averageRating"),
      )
      .where("businessId", id)
      .where("createdAt", ">=", db.raw(`DATE_SUB(NOW(), INTERVAL ${days} DAY)`))
      .groupBy(db.raw("DATE(createdAt)"))
      .orderBy("date", "asc")

    // Get interaction trends
    const interactionTrends = await db("user_interactions")
      .select(db.raw("DATE(createdAt) as date"), "type", db.raw("COUNT(*) as count"))
      .where("businessId", id)
      .where("createdAt", ">=", db.raw(`DATE_SUB(NOW(), INTERVAL ${days} DAY)`))
      .groupBy(db.raw("DATE(createdAt)"), "type")
      .orderBy("date", "asc")

    // Get rating distribution
    const ratingDistribution = await db("reviews")
      .select("rating", db.raw("COUNT(*) as count"))
      .where("businessId", id)
      .groupBy("rating")
      .orderBy("rating", "desc")

    // Get recent reviews
    const recentReviews = await db("reviews")
      .select("reviews.*", "users.firstName", "users.lastName")
      .join("users", "reviews.userId", "users.id")
      .where("reviews.businessId", id)
      .orderBy("reviews.createdAt", "desc")
      .limit(10)

    res.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.name,
          category: business.category,
        },
        period,
        periodDays: days,
        overview: overviewStats[0],
        reviewTrends,
        interactionTrends,
        ratingDistribution,
        recentReviews,
        generatedAt: new Date(),
      },
    })
  } catch (error: any) {
    console.error("Get business analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getUserAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { period = "30d" } = req.query

    // Check if user can view these analytics
    if (req.user?.id !== Number.parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own analytics",
      })
    }

    const periodDays = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    }

    const days = periodDays[period as keyof typeof periodDays] || 30

    // Get user overview stats
    const [overviewStats] = await db.raw(
      `
      SELECT 
        (SELECT COUNT(*) FROM reviews WHERE userId = ?) as totalReviews,
        (SELECT AVG(rating) FROM reviews WHERE userId = ?) as averageRating,
        (SELECT COUNT(DISTINCT businessId) FROM reviews WHERE userId = ?) as businessesReviewed,
        (SELECT COUNT(*) FROM businesses WHERE ownerId = ? AND isActive = true) as businessesOwned,
        (SELECT COUNT(*) FROM user_interactions WHERE userId = ?) as totalInteractions,
        (SELECT COUNT(*) FROM user_follows WHERE followerId = ?) as following,
        (SELECT COUNT(*) FROM user_follows WHERE followingId = ?) as followers
    `,
      [id, id, id, id, id, id, id],
    )

    // Get activity trends
    const activityTrends = await db("user_interactions")
      .select(db.raw("DATE(createdAt) as date"), "type", db.raw("COUNT(*) as count"))
      .where("userId", id)
      .where("createdAt", ">=", db.raw(`DATE_SUB(NOW(), INTERVAL ${days} DAY)`))
      .groupBy(db.raw("DATE(createdAt)"), "type")
      .orderBy("date", "asc")

    // Get review activity
    const reviewActivity = await db("reviews")
      .select(
        db.raw("DATE(createdAt) as date"),
        db.raw("COUNT(*) as reviewCount"),
        db.raw("AVG(rating) as averageRating"),
      )
      .where("userId", id)
      .where("createdAt", ">=", db.raw(`DATE_SUB(NOW(), INTERVAL ${days} DAY)`))
      .groupBy(db.raw("DATE(createdAt)"))
      .orderBy("date", "asc")

    // Get category preferences (based on reviews)
    const categoryPreferences = await db("reviews")
      .select("businesses.category", db.raw("COUNT(*) as reviewCount"), db.raw("AVG(reviews.rating) as averageRating"))
      .join("businesses", "reviews.businessId", "businesses.id")
      .where("reviews.userId", id)
      .groupBy("businesses.category")
      .orderBy("reviewCount", "desc")

    res.json({
      success: true,
      data: {
        userId: Number.parseInt(id),
        period,
        periodDays: days,
        overview: overviewStats[0],
        activityTrends,
        reviewActivity,
        categoryPreferences,
        generatedAt: new Date(),
      },
    })
  } catch (error: any) {
    console.error("Get user analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
