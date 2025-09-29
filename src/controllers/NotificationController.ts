import type { Response } from "express"
import db from "../config/db"
import type { AuthRequest } from "../middleware/auth"

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, type, isRead } = req.query
    const userId = req.user?.id

    const offset = (Number(page) - 1) * Number(limit)

    let query = db("notifications").select("*").where("userId", userId)

    // Apply filters
    if (type) {
      query = query.where("type", type)
    }

    if (typeof isRead === "string") {
      query = query.where("isRead", isRead === "true")
    }

    // Get total count for pagination
    const totalQuery = db("notifications").where("userId", userId)
    if (type) totalQuery.where("type", type)
    if (typeof isRead === "string") totalQuery.where("isRead", isRead === "true")

    const [{ count: total }] = await totalQuery.count("* as count")

    // Get paginated results
    const notifications = await query.orderBy("createdAt", "desc").limit(Number(limit)).offset(offset)

    // Get unread count
    const [{ count: unreadCount }] = await db("notifications").count("* as count").where({ userId, isRead: false })

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount: Number(unreadCount),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total),
          pages: Math.ceil(Number(total) / Number(limit)),
        },
      },
    })
  } catch (error: any) {
    console.error("Get notifications error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, type, title, message, data, actionUrl } = req.body

    // Validation
    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "User ID, type, title, and message are required",
      })
    }

    const validTypes = [
      "review_reply",
      "business_update",
      "follow",
      "recommendation",
      "system",
      "promotion",
      "reminder",
      "achievement",
    ]

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification type",
      })
    }

    // Check if target user exists
    const targetUser = await db("users").where({ id: userId }).first()
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      })
    }

    // Create notification
    const [notificationId] = await db("notifications").insert({
      userId,
      type,
      title,
      message,
      data: data ? JSON.stringify(data) : null,
      actionUrl,
      isRead: false,
      createdAt: new Date(),
    })

    // Get created notification
    const notification = await db("notifications").where({ id: notificationId }).first()

    // In a real implementation, you would send push notifications here
    console.log(`[NOTIFICATION] ${type} notification sent to user ${userId}: ${title}`)

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    })
  } catch (error: any) {
    console.error("Create notification error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Check if notification exists and belongs to user
    const notification = await db("notifications").where({ id, userId }).first()

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Mark as read
    await db("notifications").where({ id }).update({
      isRead: true,
      readAt: new Date(),
    })

    res.json({
      success: true,
      message: "Notification marked as read",
    })
  } catch (error: any) {
    console.error("Mark notification as read error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id

    // Mark all unread notifications as read
    const updatedCount = await db("notifications").where({ userId, isRead: false }).update({
      isRead: true,
      readAt: new Date(),
    })

    res.json({
      success: true,
      message: `${updatedCount} notifications marked as read`,
      data: { updatedCount },
    })
  } catch (error: any) {
    console.error("Mark all notifications as read error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Check if notification exists and belongs to user
    const notification = await db("notifications").where({ id, userId }).first()

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Delete notification
    await db("notifications").where({ id }).del()

    res.json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete notification error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getNotificationSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id

    // Get user notification settings
    const settings = await db("notification_settings").where({ userId }).first()

    if (!settings) {
      // Return default settings
      const defaultSettings = {
        userId,
        emailNotifications: true,
        pushNotifications: true,
        reviewReplies: true,
        businessUpdates: true,
        follows: true,
        recommendations: true,
        promotions: false,
        reminders: true,
        achievements: true,
      }

      res.json({
        success: true,
        data: defaultSettings,
      })
    } else {
      res.json({
        success: true,
        data: settings,
      })
    }
  } catch (error: any) {
    console.error("Get notification settings error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const updateNotificationSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const {
      emailNotifications,
      pushNotifications,
      reviewReplies,
      businessUpdates,
      follows,
      recommendations,
      promotions,
      reminders,
      achievements,
    } = req.body

    const settingsData = {
      userId,
      emailNotifications: emailNotifications ?? true,
      pushNotifications: pushNotifications ?? true,
      reviewReplies: reviewReplies ?? true,
      businessUpdates: businessUpdates ?? true,
      follows: follows ?? true,
      recommendations: recommendations ?? true,
      promotions: promotions ?? false,
      reminders: reminders ?? true,
      achievements: achievements ?? true,
      updatedAt: new Date(),
    }

    // Upsert notification settings
    await db("notification_settings")
      .insert({ ...settingsData, createdAt: new Date() })
      .onConflict("userId")
      .merge(settingsData)

    // Get updated settings
    const updatedSettings = await db("notification_settings").where({ userId }).first()

    res.json({
      success: true,
      message: "Notification settings updated successfully",
      data: updatedSettings,
    })
  } catch (error: any) {
    console.error("Update notification settings error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
