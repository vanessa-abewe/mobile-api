import type { Request, Response } from "express"
import db from "../config/db"
import bcrypt from "bcrypt"
import type { AuthRequest } from "../middleware/auth"

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const requestingUserId = req.user?.id

    // Get user profile
    const user = await db("users")
      .select(
        "id",
        "email",
        "firstName",
        "lastName",
        "phone",
        "avatar",
        "bio",
        "location",
        "dateOfBirth",
        "preferences",
        "isVerified",
        "createdAt",
        "lastLogin",
      )
      .where({ id })
      .first()

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Get user statistics
    const [reviewStats] = await db("reviews")
      .select(
        db.raw("COUNT(*) as totalReviews"),
        db.raw("AVG(rating) as averageRating"),
        db.raw("SUM(helpfulCount) as totalHelpful"),
      )
      .where({ userId: id })

    const [businessStats] = await db("businesses")
      .select(db.raw("COUNT(*) as totalBusinesses"))
      .where({ ownerId: id, isActive: true })

    // Check if requesting user follows this user (if different users)
    let isFollowing = false
    if (requestingUserId && requestingUserId !== Number.parseInt(id)) {
      const followRecord = await db("user_follows").where({ followerId: requestingUserId, followingId: id }).first()
      isFollowing = !!followRecord
    }

    // Get follower/following counts
    const [followerCount] = await db("user_follows").count("* as count").where({ followingId: id })

    const [followingCount] = await db("user_follows").count("* as count").where({ followerId: id })

    res.json({
      success: true,
      data: {
        ...user,
        stats: {
          ...reviewStats,
          ...businessStats,
          followers: followerCount.count,
          following: followingCount.count,
        },
        isFollowing,
      },
    })
  } catch (error: any) {
    console.error("Get user profile error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { firstName, lastName, phone, avatar, bio, location, dateOfBirth, preferences } = req.body

    // Check if user can update this profile
    if (req.user?.id !== Number.parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      })
    }

    // Check if user exists
    const user = await db("users").where({ id }).first()
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update user profile
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (phone) updateData.phone = phone
    if (avatar) updateData.avatar = avatar
    if (bio) updateData.bio = bio
    if (location) updateData.location = location
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth)
    if (preferences) updateData.preferences = JSON.stringify(preferences)

    await db("users").where({ id }).update(updateData)

    // Get updated user
    const updatedUser = await db("users")
      .select(
        "id",
        "email",
        "firstName",
        "lastName",
        "phone",
        "avatar",
        "bio",
        "location",
        "dateOfBirth",
        "preferences",
        "isVerified",
        "createdAt",
        "lastLogin",
      )
      .where({ id })
      .first()

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    })
  } catch (error: any) {
    console.error("Update user profile error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { currentPassword, newPassword } = req.body

    // Check if user can change this password
    if (req.user?.id !== Number.parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: "You can only change your own password",
      })
    }

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      })
    }

    // Get user
    const user = await db("users").where({ id }).first()
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await db("users").where({ id }).update({
      password: hashedPassword,
      updatedAt: new Date(),
    })

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error: any) {
    console.error("Change password error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const deleteUserAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { password } = req.body

    // Check if user can delete this account
    if (req.user?.id !== Number.parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own account",
      })
    }

    // Validation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
      })
    }

    // Get user
    const user = await db("users").where({ id }).first()
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      })
    }

    // Soft delete - anonymize user data
    await db.transaction(async (trx) => {
      // Anonymize user data
      await trx("users")
        .where({ id })
        .update({
          email: `deleted_user_${id}@deleted.com`,
          firstName: "Deleted",
          lastName: "User",
          phone: null,
          avatar: null,
          bio: null,
          location: null,
          dateOfBirth: null,
          preferences: null,
          isActive: false,
          deletedAt: new Date(),
          updatedAt: new Date(),
        })

      // Deactivate user's businesses
      await trx("businesses").where({ ownerId: id }).update({
        isActive: false,
        updatedAt: new Date(),
      })
    })

    res.json({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete user account error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const followerId = req.user?.id

    // Can't follow yourself
    if (followerId === Number.parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      })
    }

    // Check if target user exists
    const targetUser = await db("users").where({ id }).first()
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if already following
    const existingFollow = await db("user_follows").where({ followerId, followingId: id }).first()

    if (existingFollow) {
      return res.status(409).json({
        success: false,
        message: "You are already following this user",
      })
    }

    // Create follow relationship
    await db("user_follows").insert({
      followerId,
      followingId: id,
      createdAt: new Date(),
    })

    res.json({
      success: true,
      message: "User followed successfully",
    })
  } catch (error: any) {
    console.error("Follow user error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const followerId = req.user?.id

    // Remove follow relationship
    const deleted = await db("user_follows").where({ followerId, followingId: id }).del()

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "You are not following this user",
      })
    }

    res.json({
      success: true,
      message: "User unfollowed successfully",
    })
  } catch (error: any) {
    console.error("Unfollow user error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getUserFollowers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 20 } = req.query

    const offset = (Number(page) - 1) * Number(limit)

    // Get followers
    const followers = await db("user_follows")
      .select(
        "users.id",
        "users.firstName",
        "users.lastName",
        "users.avatar",
        "users.bio",
        "user_follows.createdAt as followedAt",
      )
      .join("users", "user_follows.followerId", "users.id")
      .where("user_follows.followingId", id)
      .orderBy("user_follows.createdAt", "desc")
      .limit(Number(limit))
      .offset(offset)

    // Get total count
    const [{ count: total }] = await db("user_follows").count("* as count").where({ followingId: id })

    res.json({
      success: true,
      data: {
        followers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total),
          pages: Math.ceil(Number(total) / Number(limit)),
        },
      },
    })
  } catch (error: any) {
    console.error("Get user followers error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getUserFollowing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 20 } = req.query

    const offset = (Number(page) - 1) * Number(limit)

    // Get following
    const following = await db("user_follows")
      .select(
        "users.id",
        "users.firstName",
        "users.lastName",
        "users.avatar",
        "users.bio",
        "user_follows.createdAt as followedAt",
      )
      .join("users", "user_follows.followingId", "users.id")
      .where("user_follows.followerId", id)
      .orderBy("user_follows.createdAt", "desc")
      .limit(Number(limit))
      .offset(offset)

    // Get total count
    const [{ count: total }] = await db("user_follows").count("* as count").where({ followerId: id })

    res.json({
      success: true,
      data: {
        following,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total),
          pages: Math.ceil(Number(total) / Number(limit)),
        },
      },
    })
  } catch (error: any) {
    console.error("Get user following error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getUserActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 20, type } = req.query

    // Check if user can view this activity
    if (req.user?.id !== Number.parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own activity",
      })
    }

    const offset = (Number(page) - 1) * Number(limit)

    // Get user activity (reviews, businesses created, etc.)
    let activities: any[] = []

    if (!type || type === "reviews") {
      const reviews = await db("reviews")
        .select(
          db.raw("'review' as type"),
          "reviews.id",
          "reviews.rating",
          "reviews.comment",
          "reviews.createdAt",
          "businesses.name as businessName",
          "businesses.id as businessId",
        )
        .join("businesses", "reviews.businessId", "businesses.id")
        .where("reviews.userId", id)
        .orderBy("reviews.createdAt", "desc")
        .limit(Number(limit))
        .offset(offset)

      activities = [...activities, ...reviews]
    }

    if (!type || type === "businesses") {
      const businesses = await db("businesses")
        .select(db.raw("'business' as type"), "id", "name", "description", "category", "createdAt")
        .where({ ownerId: id, isActive: true })
        .orderBy("createdAt", "desc")
        .limit(Number(limit))
        .offset(offset)

      activities = [...activities, ...businesses]
    }

    // Sort all activities by date
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Limit to requested amount
    activities = activities.slice(0, Number(limit))

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
        },
      },
    })
  } catch (error: any) {
    console.error("Get user activity error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
