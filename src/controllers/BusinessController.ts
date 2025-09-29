import type { Request, Response } from "express"
import db from "../config/db"
import type { AuthRequest } from "../middleware/auth"

export const getBusinesses = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      location,
      rating,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query

    const offset = (Number(page) - 1) * Number(limit)

    let query = db("businesses")
      .select(
        "businesses.*",
        db.raw("AVG(reviews.rating) as averageRating"),
        db.raw("COUNT(reviews.id) as reviewCount"),
      )
      .leftJoin("reviews", "businesses.id", "reviews.businessId")
      .groupBy("businesses.id")

    // Apply filters
    if (category) {
      query = query.where("businesses.category", category)
    }

    if (location) {
      query = query.where("businesses.location", "like", `%${location}%`)
    }

    if (rating) {
      query = query.having("averageRating", ">=", Number(rating))
    }

    if (search) {
      query = query.where(function () {
        this.where("businesses.name", "like", `%${search}%`)
          .orWhere("businesses.description", "like", `%${search}%`)
          .orWhere("businesses.tags", "like", `%${search}%`)
      })
    }

    // Apply sorting
    const validSortFields = ["name", "createdAt", "averageRating", "reviewCount"]
    const sortField = validSortFields.includes(sortBy as string) ? sortBy : "createdAt"
    query = query.orderBy(sortField as string, sortOrder as "asc" | "desc")

    // Get total count for pagination
    const totalQuery = db("businesses")
    if (category) totalQuery.where("category", category)
    if (location) totalQuery.where("location", "like", `%${location}%`)
    if (search) {
      totalQuery.where(function () {
        this.where("name", "like", `%${search}%`)
          .orWhere("description", "like", `%${search}%`)
          .orWhere("tags", "like", `%${search}%`)
      })
    }

    const [{ count: total }] = await totalQuery.count("* as count")

    // Get paginated results
    const businesses = await query.limit(Number(limit)).offset(offset)

    res.json({
      success: true,
      data: {
        businesses,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total),
          pages: Math.ceil(Number(total) / Number(limit)),
        },
      },
    })
  } catch (error: any) {
    console.error("Get businesses error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const createBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      location,
      address,
      phone,
      email,
      website,
      hours,
      tags,
      images,
      latitude,
      longitude,
    } = req.body

    // Validation
    if (!name || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category, and location are required",
      })
    }

    // Create business
    const [businessId] = await db("businesses").insert({
      name,
      description,
      category,
      location,
      address,
      phone,
      email,
      website,
      hours: JSON.stringify(hours),
      tags: Array.isArray(tags) ? tags.join(",") : tags,
      images: JSON.stringify(images || []),
      latitude: latitude ? Number.parseFloat(latitude) : null,
      longitude: longitude ? Number.parseFloat(longitude) : null,
      ownerId: req.user?.id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Get created business
    const business = await db("businesses").where({ id: businessId }).first()

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      data: business,
    })
  } catch (error: any) {
    console.error("Create business error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getBusinessById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const business = await db("businesses")
      .select(
        "businesses.*",
        db.raw("AVG(reviews.rating) as averageRating"),
        db.raw("COUNT(reviews.id) as reviewCount"),
      )
      .leftJoin("reviews", "businesses.id", "reviews.businessId")
      .where("businesses.id", id)
      .groupBy("businesses.id")
      .first()

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      })
    }

    // Get recent reviews
    const recentReviews = await db("reviews")
      .select("reviews.*", "users.firstName", "users.lastName")
      .join("users", "reviews.userId", "users.id")
      .where("reviews.businessId", id)
      .orderBy("reviews.createdAt", "desc")
      .limit(5)

    res.json({
      success: true,
      data: {
        ...business,
        recentReviews,
      },
    })
  } catch (error: any) {
    console.error("Get business by ID error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const updateBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const {
      name,
      description,
      category,
      location,
      address,
      phone,
      email,
      website,
      hours,
      tags,
      images,
      latitude,
      longitude,
      isActive,
    } = req.body

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
        message: "You can only update your own businesses",
      })
    }

    // Update business
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (name) updateData.name = name
    if (description) updateData.description = description
    if (category) updateData.category = category
    if (location) updateData.location = location
    if (address) updateData.address = address
    if (phone) updateData.phone = phone
    if (email) updateData.email = email
    if (website) updateData.website = website
    if (hours) updateData.hours = JSON.stringify(hours)
    if (tags) updateData.tags = Array.isArray(tags) ? tags.join(",") : tags
    if (images) updateData.images = JSON.stringify(images)
    if (latitude) updateData.latitude = Number.parseFloat(latitude)
    if (longitude) updateData.longitude = Number.parseFloat(longitude)
    if (typeof isActive === "boolean") updateData.isActive = isActive

    await db("businesses").where({ id }).update(updateData)

    // Get updated business
    const updatedBusiness = await db("businesses").where({ id }).first()

    res.json({
      success: true,
      message: "Business updated successfully",
      data: updatedBusiness,
    })
  } catch (error: any) {
    console.error("Update business error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const deleteBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

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
        message: "You can only delete your own businesses",
      })
    }

    // Soft delete - mark as inactive
    await db("businesses").where({ id }).update({
      isActive: false,
      updatedAt: new Date(),
    })

    res.json({
      success: true,
      message: "Business deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete business error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getBusinessCategories = async (req: Request, res: Response) => {
  try {
    const categories = await db("businesses")
      .select("category")
      .count("* as count")
      .groupBy("category")
      .orderBy("count", "desc")

    res.json({
      success: true,
      data: categories,
    })
  } catch (error: any) {
    console.error("Get business categories error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
