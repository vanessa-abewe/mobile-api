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
    const { email, phone, password } = req.body

    // Validation - require either email or phone + password
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone, and password are required",
      })
    }

    if (email && phone) {
      return res.status(400).json({
        success: false,
        message: "Please use either email or phone for signup, not both",
      })
    }

    // Check if user already exists with email or phone
    let existingUser;
    if (email) {
      existingUser = await db("user").where({ email }).first()
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User already exists with this email",
        })
      }
    } else if (phone) {
      existingUser = await db("user").where({ phone }).first()
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User already exists with this phone",
        })
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY)

    // Create user with only email/phone and password 
    const userData: any = {
      password: hashedPassword,
      otp,
      otp_expiry: otpExpiry, 
      is_verified: false,    
      created_at: new Date(), 
      updated_at: new Date(), 
    }

    if (email) {
      userData.email = email
    } else if (phone) {
      userData.phone = phone
    }

    const [userId] = await db("user").insert(userData)

    // In production, send OTP via SMS/Email service
    console.log(`OTP for ${email || phone}: ${otp}`)

    res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your account with OTP.",
      data: {
        userId,
        [email ? 'email' : 'phone']: email || phone,
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
    const { email, phone, password } = req.body

    // Validation - require either email or phone + password
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone, and password are required",
      })
    }

    if (email && phone) {
      return res.status(400).json({
        success: false,
        message: "Please use either email or phone for login, not both",
      })
    }

    // Find user by email or phone
    let user;
    if (email) {
      user = await db("user").where({ email }).first()
    } else if (phone) {
      user = await db("user").where({ phone }).first()
    }

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
    if (!user.is_verified) { 
      return res.status(403).json({
        success: false,
        message: "Please verify your account first",
      })
    }

    // Generate token
    const token = generateToken(user.id)

    // Update last login 
    await db("user").where({ id: user.id }).update({
      last_login: new Date(), 
      updated_at: new Date(), 
    })

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          isVerified: user.is_verified, 
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
    const { email, phone, otp } = req.body

    // Validation - require either email or phone + OTP
    if ((!email && !phone) || !otp) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone, and OTP are required",
      })
    }

    if (email && phone) {
      return res.status(400).json({
        success: false,
        message: "Please use either email or phone for verification, not both",
      })
    }

    // Find user by email or phone
    let user;
    if (email) {
      user = await db("user").where({ email }).first()
    } else if (phone) {
      user = await db("user").where({ phone }).first()
    }

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
    if (new Date() > new Date(user.otp_expiry)) { 
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      })
    }

    // Verify user - using snake_case
    await db("user").where({ id: user.id }).update({
      is_verified: true, 
      otp: null,
      otp_expiry: null, 
      updated_at: new Date(), 
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
    const { email, phone } = req.body

    // Validation - require either email or phone
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone is required",
      })
    }

    if (email && phone) {
      return res.status(400).json({
        success: false,
        message: "Please use either email or phone for password reset, not both",
      })
    }

    // Find user by email or phone
    let user;
    if (email) {
      user = await db("user").where({ email }).first()
    } else if (phone) {
      user = await db("user").where({ phone }).first()
    }

    if (!user) {
      
      return res.json({
        success: true,
        message: "If the account exists, a password reset OTP has been sent",
      })
    }

    // Generate reset token and OTP
    const resetToken = crypto.randomBytes(32).toString("hex")
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY)

    // Update user with reset token and OTP 
    await db("user").where({ id: user.id }).update({
      reset_token: resetToken, 
      otp,
      otp_expiry: otpExpiry, 
      updated_at: new Date(), 
    })

    // In production, send OTP via SMS/Email service
    console.log(`Password reset OTP for ${email || phone}: ${otp}`)

    res.json({
      success: true,
      message: "If the account exists, a password reset OTP has been sent",
      data: {
        resetToken, 
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
    const user = await db("user").where({ reset_token: resetToken }).first() 
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
    if (new Date() > new Date(user.otp_expiry)) { 
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    
    await db("user").where({ id: user.id }).update({
      password: hashedPassword,
      reset_token: null, 
      otp: null,
      otp_expiry: null, 
      updated_at: new Date(), 
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