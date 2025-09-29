import { Router } from "express"
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  getUserActivity,
} from "../controllers/UserController"
import { authenticateToken, optionalAuth } from "../middleware/auth"

const router = Router()

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile with statistics
 *       404:
 *         description: User not found
 */
router.get("/:id", optionalAuth, getUserProfile)

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               preferences:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Not authorized to update this profile
 *       404:
 *         description: User not found
 */
router.put("/:id", authenticateToken, updateUserProfile)

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Password is incorrect
 *       403:
 *         description: Not authorized to delete this account
 *       404:
 *         description: User not found
 */
router.delete("/:id", authenticateToken, deleteUserAccount)

/**
 * @openapi
 * /api/users/{id}/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect or validation error
 *       403:
 *         description: Not authorized to change this password
 *       404:
 *         description: User not found
 */
router.put("/:id/change-password", authenticateToken, changePassword)

/**
 * @openapi
 * /api/users/{id}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User followed successfully
 *       400:
 *         description: Cannot follow yourself
 *       404:
 *         description: User not found
 *       409:
 *         description: Already following this user
 */
router.post("/:id/follow", authenticateToken, followUser)

/**
 * @openapi
 * /api/users/{id}/unfollow:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       404:
 *         description: Not following this user
 */
router.delete("/:id/unfollow", authenticateToken, unfollowUser)

/**
 * @openapi
 * /api/users/{id}/followers:
 *   get:
 *     summary: Get user followers
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: List of user followers with pagination
 */
router.get("/:id/followers", getUserFollowers)

/**
 * @openapi
 * /api/users/{id}/following:
 *   get:
 *     summary: Get users that this user is following
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: List of users being followed with pagination
 */
router.get("/:id/following", getUserFollowing)

/**
 * @openapi
 * /api/users/{id}/activity:
 *   get:
 *     summary: Get user activity feed
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [reviews, businesses]
 *     responses:
 *       200:
 *         description: User activity feed
 *       403:
 *         description: Can only view your own activity
 */
router.get("/:id/activity", authenticateToken, getUserActivity)

export default router
