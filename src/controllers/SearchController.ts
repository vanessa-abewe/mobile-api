import type { Request, Response } from "express"
import db from "../config/db"

export const universalSearch = async (req: Request, res: Response) => {
  try {
    const { q, type = "all", page = 1, limit = 20, location, category, rating } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    const searchQuery = q as string
    const limitNum = Math.min(Number(limit), 100)
    const offset = (Number(page) - 1) * limitNum

    const results: any = {
      businesses: [],
      users: [],
      reviews: [],
      total: 0,
    }

    // Search businesses
    if (type === "all" || type === "businesses") {
      let businessQuery = db("businesses")
        .select(
          "businesses.*",
          db.raw("AVG(reviews.rating) as averageRating"),
          db.raw("COUNT(reviews.id) as reviewCount"),
          db.raw("'business' as resultType"),
        )
        .leftJoin("reviews", "businesses.id", "reviews.businessId")
        .where("businesses.isActive", true)
        .where(function () {
          this.where("businesses.name", "like", `%${searchQuery}%`)
            .orWhere("businesses.description", "like", `%${searchQuery}%`)
            .orWhere("businesses.tags", "like", `%${searchQuery}%`)
            .orWhere("businesses.category", "like", `%${searchQuery}%`)
        })
        .groupBy("businesses.id")

      // Apply filters
      if (location) {
        businessQuery = businessQuery.where("businesses.location", "like", `%${location}%`)
      }

      if (category) {
        businessQuery = businessQuery.where("businesses.category", category)
      }

      if (rating) {
        businessQuery = businessQuery.having("averageRating", ">=", Number(rating))
      }

      const businesses = await businessQuery.orderBy("averageRating", "desc").limit(limitNum)

      results.businesses = businesses
    }

    // Search users
    if (type === "all" || type === "users") {
      const users = await db("users")
        .select(
          "id",
          "firstName",
          "lastName",
          "avatar",
          "bio",
          "location",
          db.raw("'user' as resultType"),
          db.raw("CONCAT(firstName, ' ', lastName) as fullName"),
        )
        .where("isActive", true)
        .where(function () {
          this.where("firstName", "like", `%${searchQuery}%`)
            .orWhere("lastName", "like", `%${searchQuery}%`)
            .orWhere(db.raw("CONCAT(firstName, ' ', lastName)"), "like", `%${searchQuery}%`)
            .orWhere("bio", "like", `%${searchQuery}%`)
        })
        .limit(limitNum)

      results.users = users
    }

    // Search reviews
    if (type === "all" || type === "reviews") {
      const reviews = await db("reviews")
        .select(
          "reviews.*",
          "users.firstName",
          "users.lastName",
          "businesses.name as businessName",
          db.raw("'review' as resultType"),
        )
        .join("users", "reviews.userId", "users.id")
        .join("businesses", "reviews.businessId", "businesses.id")
        .where("reviews.comment", "like", `%${searchQuery}%`)
        .orderBy("reviews.createdAt", "desc")
        .limit(limitNum)

      results.reviews = reviews
    }

    // Calculate total results
    results.total = results.businesses.length + results.users.length + results.reviews.length

    // If searching all, combine and sort results
    if (type === "all") {
      const allResults = [...results.businesses, ...results.users, ...results.reviews]

      // Sort by relevance (simplified scoring)
      allResults.sort((a, b) => {
        const aScore = calculateRelevanceScore(a, searchQuery)
        const bScore = calculateRelevanceScore(b, searchQuery)
        return bScore - aScore
      })

      results.combined = allResults.slice(offset, offset + limitNum)
    }

    res.json({
      success: true,
      data: {
        query: searchQuery,
        type,
        ...results,
        pagination: {
          page: Number(page),
          limit: limitNum,
          total: results.total,
          pages: Math.ceil(results.total / limitNum),
        },
      },
    })
  } catch (error: any) {
    console.error("Universal search error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Simple relevance scoring function
const calculateRelevanceScore = (item: any, query: string): number => {
  let score = 0
  const queryLower = query.toLowerCase()

  // Exact matches get higher scores
  if (item.name && item.name.toLowerCase().includes(queryLower)) {
    score += item.name.toLowerCase() === queryLower ? 10 : 5
  }

  if (item.fullName && item.fullName.toLowerCase().includes(queryLower)) {
    score += item.fullName.toLowerCase() === queryLower ? 10 : 5
  }

  if (item.businessName && item.businessName.toLowerCase().includes(queryLower)) {
    score += 3
  }

  // Partial matches
  if (item.description && item.description.toLowerCase().includes(queryLower)) {
    score += 2
  }

  if (item.comment && item.comment.toLowerCase().includes(queryLower)) {
    score += 2
  }

  if (item.bio && item.bio.toLowerCase().includes(queryLower)) {
    score += 2
  }

  // Boost popular items
  if (item.averageRating) {
    score += Number.parseFloat(item.averageRating) * 0.5
  }

  if (item.reviewCount) {
    score += Math.log(Number.parseInt(item.reviewCount) + 1) * 0.1
  }

  return score
}

export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    const searchQuery = q as string
    const limitNum = Math.min(Number(limit), 20)

    // Get business name suggestions
    const businessSuggestions = await db("businesses")
      .select("name")
      .where("isActive", true)
      .where("name", "like", `%${searchQuery}%`)
      .orderBy("name")
      .limit(limitNum)

    // Get category suggestions
    const categorySuggestions = await db("businesses")
      .select("category")
      .distinct("category")
      .where("isActive", true)
      .where("category", "like", `%${searchQuery}%`)
      .orderBy("category")
      .limit(limitNum)

    // Get location suggestions
    const locationSuggestions = await db("businesses")
      .select("location")
      .distinct("location")
      .where("isActive", true)
      .where("location", "like", `%${searchQuery}%`)
      .orderBy("location")
      .limit(limitNum)

    // Combine and format suggestions
    const suggestions = [
      ...businessSuggestions.map((item: any) => ({ text: item.name, type: "business" })),
      ...categorySuggestions.map((item: any) => ({ text: item.category, type: "category" })),
      ...locationSuggestions.map((item: any) => ({ text: item.location, type: "location" })),
    ]

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions
      .filter((item, index, self) => index === self.findIndex((s) => s.text === item.text))
      .slice(0, limitNum)

    res.json({
      success: true,
      data: {
        query: searchQuery,
        suggestions: uniqueSuggestions,
      },
    })
  } catch (error: any) {
    console.error("Get search suggestions error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getPopularSearches = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query
    const limitNum = Math.min(Number(limit), 50)

    // Get popular categories
    const popularCategories = await db("businesses")
      .select("category")
      .count("* as count")
      .where("isActive", true)
      .groupBy("category")
      .orderBy("count", "desc")
      .limit(limitNum)

    // Get popular locations
    const popularLocations = await db("businesses")
      .select("location")
      .count("* as count")
      .where("isActive", true)
      .groupBy("location")
      .orderBy("count", "desc")
      .limit(limitNum)

    // Get trending businesses (most reviewed recently)
    const trendingBusinesses = await db("businesses")
      .select("businesses.name", "businesses.category", db.raw("COUNT(reviews.id) as recentReviews"))
      .join("reviews", "businesses.id", "reviews.businessId")
      .where("businesses.isActive", true)
      .where("reviews.createdAt", ">=", db.raw("DATE_SUB(NOW(), INTERVAL 30 DAY)"))
      .groupBy("businesses.id", "businesses.name", "businesses.category")
      .orderBy("recentReviews", "desc")
      .limit(limitNum)

    res.json({
      success: true,
      data: {
        popularCategories,
        popularLocations,
        trendingBusinesses,
      },
    })
  } catch (error: any) {
    console.error("Get popular searches error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
