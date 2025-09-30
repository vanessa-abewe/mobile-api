import { Router } from "express"
import { signup, login, verifyOTP, forgotPassword, resetPassword } from "../controllers/auth.controller"

const router = Router()

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: User registration with OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Either email or phone is required (but not both)
 *                 example: user@example.com
 *               phone:
 *                 type: string
 *                 description: Either email or phone is required (but not both)
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *       400:
 *         description: Validation error - either email or phone with password required
 *       409:
 *         description: User already exists with this email or phone
 */
router.post("/signup", signup)

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: User authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Either email or phone is required (but not both)
 *                 example: user@example.com
 *               phone:
 *                 type: string
 *                 description: Either email or phone is required (but not both)
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         isVerified:
 *                           type: boolean
 *       400:
 *         description: Either email or phone with password required
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account not verified
 */
router.post("/login", login)

/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     summary: OTP verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Either email or phone is required (but not both)
 *                 example: user@example.com
 *               phone:
 *                 type: string
 *                 description: Either email or phone is required (but not both)
 *                 example: "+1234567890"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         isVerified:
 *                           type: boolean
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post("/verify-otp", verifyOTP)

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Password reset request
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Either email or phone is required (but not both)
 *                 example: user@example.com
 *               phone:
 *                 type: string
 *                 description: Either email or phone is required (but not both)
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Reset OTP sent if account exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     resetToken:
 *                       type: string
 *       400:
 *         description: Either email or phone required
 */
router.post("/forgot-password", forgotPassword)

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - otp
 *               - newPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 example: "a1b2c3d4e5f6..."
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or OTP
 */
router.post("/reset-password", resetPassword)

export default router