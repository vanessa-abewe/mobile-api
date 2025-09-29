import type { Request, Response } from "express"
import db from "../config/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const OTP_EXPIRY = 10 * 60 * 1000 // 10 minutes

// Generate OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Generate JWT token
const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" })
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Email, password, firstName, and lastName are required",
      })
    }

    // Check if user already exists
    const existingUser = await db("users").where({ email }).first()
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY)

    // Create user
    const [userId] = await db("users").insert({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      otp,
      otpExpiry,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // In production, send OTP via SMS/Email service
    console.log(`OTP for ${email}: ${otp}`)

    res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your account with OTP.",
      data: {
        userId,
        email,
        firstName,
        lastName,
        isVerified: false,
      },
    })
  } catch (error: any) {
    console.error("Signup error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Find user
    const user = await db("users").where({ email }).first()
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first",
      })
    }

    // Generate token
    const token = generateToken(user.id)

    // Update last login
    await db("users").where({ id: user.id }).update({
      lastLogin: new Date(),
      updatedAt: new Date(),
    })

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          isVerified: user.isVerified,
        },
      },
    })
  } catch (error: any) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      })
    }

    // Find user
    const user = await db("users").where({ email }).first()
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })
    }

    // Check OTP expiry
    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      })
    }

    // Verify user
    await db("users").where({ id: user.id }).update({
      isVerified: true,
      otp: null,
      otpExpiry: null,
      updatedAt: new Date(),
    })

    // Generate token
    const token = generateToken(user.id)

    res.json({
      success: true,
      message: "Account verified successfully",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          isVerified: true,
        },
      },
    })
  } catch (error: any) {
    console.error("Verify OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    // Find user
    const user = await db("users").where({ email }).first()
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: "If the email exists, a password reset OTP has been sent",
      })
    }

    // Generate reset token and OTP
    const resetToken = crypto.randomBytes(32).toString("hex")
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY)

    // Update user with reset token and OTP
    await db("users").where({ id: user.id }).update({
      resetToken,
      otp,
      otpExpiry,
      updatedAt: new Date(),
    })

    // In production, send OTP via SMS/Email service
    console.log(`Password reset OTP for ${email}: ${otp}`)

    res.json({
      success: true,
      message: "If the email exists, a password reset OTP has been sent",
      data: {
        resetToken, // In production, don't send this in response
      },
    })
  } catch (error: any) {
    console.error("Forgot password error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, otp, newPassword } = req.body

    // Validation
    if (!resetToken || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token, OTP, and new password are required",
      })
    }

    // Find user with reset token
    const user = await db("users").where({ resetToken }).first()
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      })
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })
    }

    // Check OTP expiry
    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password and clear reset fields
    await db("users").where({ id: user.id }).update({
      password: hashedPassword,
      resetToken: null,
      otp: null,
      otpExpiry: null,
      updatedAt: new Date(),
    })

    res.json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error: any) {
    console.error("Reset password error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
