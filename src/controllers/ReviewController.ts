import type { Request, Response } from "express"
import db from "../config/db"
import type { AuthRequest } from "../middleware/auth"

// Simple sentiment analysis function
const analyzeSentiment = (text: string): "positive" | "negative" | "neutral" => {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "love",
    "best",
    "perfect",
    "awesome",
  ]
  const negativeWords = ["bad", "terrible", "awful", "horrible", "worst", "hate", "disappointing", "poor", "disgusting"]

  const words = text.toLowerCase().split(/\s+/)
  let positiveCount = 0
  let negativeCount = 0

  words.forEach((word) => {
    if (positiveWords.some((pw) => word.includes(pw))) positiveCount++
    if (negativeWords.some((nw) => word.includes(nw))) negativeCount++
  })

  if (positiveCount > negativeCount) return "positive"
  if (negativeCount > positiveCount) return "negative"
  return "neutral"
}

export const getReviews = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      businessId,
      userId,
      rating,
      sentiment,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query

    const offset = (Number(page) - 1) * Number(limit)

    let query = db("reviews")
      .select("reviews.*", "users.firstName", "users.lastName", "businesses.name as businessName")
      .join("users", "reviews.userId", "users.id")
      .join("businesses", "reviews.businessId", "businesses.id")

    // Apply filters
    if (businessId) {
      query = query.where("reviews.businessId", businessId)
    }

    if (userId) {
      query = query.where("reviews.userId", userId)
    }

    if (rating) {
      query = query.where("reviews.rating", rating)
    }

    if (sentiment) {
      query = query.where("reviews.sentiment", sentiment)
    }

    // Apply sorting
    const validSortFields = ["createdAt", "rating", "helpfulCount"]
    const sortField = validSortFields.includes(sortBy as string) ? sortBy : "createdAt"
    query = query.orderBy(`reviews.${sortField}`, sortOrder as "asc" | "desc")

    // Get total count for pagination
    const totalQuery = db("reviews")
    if (businessId) totalQuery.where("businessId", businessId)
    if (userId) totalQuery.where("userId", userId)
    if (rating) totalQuery.where("rating", rating)
    if (sentiment) totalQuery.where("sentiment", sentiment)

    const [{ count: total }] = await totalQuery.count("* as count")

    // Get paginated results
    const reviews = await query.limit(Number(limit)).offset(offset)

    // Get replies for each review
    const reviewIds = reviews.map((r: any) => r.id)
    const replies =
      reviewIds.length > 0
        ? await db("review_replies")
            .select("review_replies.*", "users.firstName", "users.lastName")
            .join("users", "review_replies.userId", "users.id")
            .whereIn("review_replies.reviewId", reviewIds)
            .orderBy("review_replies.createdAt", "asc")
        : []

    // Group replies by review ID
    const repliesByReview = replies.reduce((acc: any, reply: any) => {
      if (!acc[reply.reviewId]) acc[reply.reviewId] = []
      acc[reply.reviewId].push(reply)
      return acc
    }, {})

    // Add replies to reviews
    const reviewsWithReplies = reviews.map((review: any) => ({
      ...review,
      replies: repliesByReview[review.id] || [],
    }))

    res.json({
      success: true,
      data: {
        reviews: reviewsWithReplies,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total),
          pages: Math.ceil(Number(total) / Number(limit)),
        },
      },
    })
  } catch (error: any) {
    console.error("Get reviews error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, rating, comment, images } = req.body

    // Validation
    if (!businessId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Business ID and rating (1-5) are required",
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

    // Check if user already reviewed this business
    const existingReview = await db("reviews").where({ businessId, userId: req.user?.id }).first()

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this business",
      })
    }

    // Analyze sentiment
    const sentiment = comment ? analyzeSentiment(comment) : "neutral"

    // Create review
    const [reviewId] = await db("reviews").insert({
      businessId,
      userId: req.user?.id,
      rating,
      comment: comment || null,
      images: JSON.stringify(images || []),
      sentiment,
      helpfulCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Get created review with user info
    const review = await db("reviews")
      .select("reviews.*", "users.firstName", "users.lastName", "businesses.name as businessName")
      .join("users", "reviews.userId", "users.id")
      .join("businesses", "reviews.businessId", "businesses.id")
      .where("reviews.id", reviewId)
      .first()

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    })
  } catch (error: any) {
    console.error("Create review error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { rating, comment, images } = req.body

    // Check if review exists and user owns it
    const review = await db("reviews").where({ id }).first()
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    if (review.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      })
    }

    // Update review
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        })
      }
      updateData.rating = rating
    }

    if (comment !== undefined) {
      updateData.comment = comment
      updateData.sentiment = comment ? analyzeSentiment(comment) : "neutral"
    }

    if (images) {
      updateData.images = JSON.stringify(images)
    }

    await db("reviews").where({ id }).update(updateData)

    // Get updated review
    const updatedReview = await db("reviews")
      .select("reviews.*", "users.firstName", "users.lastName", "businesses.name as businessName")
      .join("users", "reviews.userId", "users.id")
      .join("businesses", "reviews.businessId", "businesses.id")
      .where("reviews.id", id)
      .first()

    res.json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    })
  } catch (error: any) {
    console.error("Update review error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    // Check if review exists and user owns it
    const review = await db("reviews").where({ id }).first()
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    if (review.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      })
    }

    // Delete review and its replies
    await db.transaction(async (trx) => {
      await trx("review_replies").where({ reviewId: id }).del()
      await trx("reviews").where({ id }).del()
    })

    res.json({
      success: true,
      message: "Review deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete review error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const markReviewHelpful = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    // Check if review exists
    const review = await db("reviews").where({ id }).first()
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    // Check if user already marked this review as helpful
    const existingHelpful = await db("review_helpful").where({ reviewId: id, userId: req.user?.id }).first()

    if (existingHelpful) {
      return res.status(409).json({
        success: false,
        message: "You have already marked this review as helpful",
      })
    }

    // Add helpful mark and increment count
    await db.transaction(async (trx) => {
      await trx("review_helpful").insert({
        reviewId: id,
        userId: req.user?.id,
        createdAt: new Date(),
      })
      await trx("reviews").where({ id }).increment("helpfulCount", 1)
    })

    res.json({
      success: true,
      message: "Review marked as helpful",
    })
  } catch (error: any) {
    console.error("Mark review helpful error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const replyToReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { comment } = req.body

    // Validation
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      })
    }

    // Check if review exists
    const review = await db("reviews").where({ id }).first()
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    // Create reply
    const [replyId] = await db("review_replies").insert({
      reviewId: id,
      userId: req.user?.id,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Get created reply with user info
    const reply = await db("review_replies")
      .select("review_replies.*", "users.firstName", "users.lastName")
      .join("users", "review_replies.userId", "users.id")
      .where("review_replies.id", replyId)
      .first()

    res.status(201).json({
      success: true,
      message: "Reply created successfully",
      data: reply,
    })
  } catch (error: any) {
    console.error("Reply to review error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getReviewStats = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params

    // Get rating distribution
    const ratingStats = await db("reviews")
      .select("rating")
      .count("* as count")
      .where({ businessId })
      .groupBy("rating")
      .orderBy("rating", "desc")

    // Get sentiment distribution
    const sentimentStats = await db("reviews")
      .select("sentiment")
      .count("* as count")
      .where({ businessId })
      .groupBy("sentiment")

    // Get overall stats
    const [overallStats] = await db("reviews")
      .select(
        db.raw("COUNT(*) as totalReviews"),
        db.raw("AVG(rating) as averageRating"),
        db.raw("SUM(helpfulCount) as totalHelpful"),
      )
      .where({ businessId })

    res.json({
      success: true,
      data: {
        overall: overallStats,
        ratingDistribution: ratingStats,
        sentimentDistribution: sentimentStats,
      },
    })
  } catch (error: any) {
    console.error("Get review stats error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
