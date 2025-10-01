import type { Request, Response } from "express"
import db from "../config/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Generate JWT token
const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" })
}

// Generate random verification token (used for account verification & password reset)
const generateTokenString = (): string => {
  return crypto.randomBytes(32).toString("hex")
}

// -------------------- SIGNUP --------------------
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, phone_number, password } = req.body

    // Validation: require either email or phone + password
    if ((!email && !phone_number) || !password) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone_number, and password are required",
      })
    }

    if (email && phone_number) {
      return res.status(400).json({
        success: false,
        message: "Please use either email or phone_number for signup, not both",
      })
    }

    // Check if user already exists
    let existingUser
    if (email) existingUser = await db("device2").where({ email }).first()
    if (phone_number) existingUser = await db("device2").where({ phone_number }).first()

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")


    // Prepare user data
    let userData: any = {
               // auto-generated
      password: hashedPassword,
      status: 0,                 // not verified yet
      verifyToken: verificationToken,
      created_at: new Date(),
      updated_at: new Date(),
    }

    if (email) userData.email = email
    if (phone_number) userData.phone_number = phone_number

    const [userId] = await db("device2").insert(userData)

    // In production, send verification token via email/SMS
    console.log(`Verification token for ${email || phone_number}: ${verificationToken}`)

    res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your account.",
      data: {
        userId,
        [email ? "email" : "phone_number"]: email || phone_number,
      
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


// -------------------- LOGIN --------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, phone_number, password } = req.body

    if ((!email && !phone_number) || !password) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone_number, and password are required",
      })
    }

    if (email && phone_number) {
      return res.status(400).json({
        success: false,
        message: "Please use either email or phone_number for login, not both",
      })
    }

    // Find user
    let user
    if (email) user = await db("device2").where({ email }).first()
    if (phone_number) user = await db("device2").where({ phone_number }).first()

    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" })

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) return res.status(401).json({ success: false, message: "Invalid credentials" })

    // Check if verified
    if (user.status !== 1) {
      return res.status(403).json({ success: false, message: "Please verify your account first" })
    }

    const token = generateToken(user.id)

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
          phone_number: user.phone_number,
          status: user.status,
        },
      },
    })
  } catch (error: any) {
    console.error("Login error:", error)
    res.status(500).json({ success: false, message: "Internal server error", error: error.message })
  }
}

// -------------------- VERIFY ACCOUNT --------------------
export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const { email, phone_number, verificationToken } = req.body

    if ((!email && !phone_number) || !verificationToken) {
      return res.status(400).json({ success: false, message: "Email/phone and verification token are required" })
    }

    if (email && phone_number) {
      return res.status(400).json({ success: false, message: "Use either email or phone_number" })
    }

    let user
    if (email) user = await db("device2").where({ email }).first()
    if (phone_number) user = await db("device2").where({ phone_number }).first()

    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    if (user.verifyToken !== verificationToken)
      return res.status(400).json({ success: false, message: "Invalid verification token" })

    await db("device2").where({ id: user.id }).update({
      status: 1,
      verifyToken: null,
      updated_at: new Date(),
    })

    const token = generateToken(user.id)

    res.json({
      success: true,
      message: "Account verified successfully",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          phone_number: user.phone_number,
          status: 1,
        },
      },
    })
  } catch (error: any) {
    console.error("Verify account error:", error)
    res.status(500).json({ success: false, message: "Internal server error", error: error.message })
  }
}

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, phone_number } = req.body

    if (!email && !phone_number) return res.status(400).json({ success: false, message: "Email or phone required" })
    if (email && phone_number) return res.status(400).json({ success: false, message: "Use either email or phone_number" })

    let user
    if (email) user = await db("device2").where({ email }).first()
    if (phone_number) user = await db("device2").where({ phone_number }).first()

    if (!user) {
      return res.json({ success: true, message: "If account exists, a password reset token has been sent" })
    }

    const resetToken = generateTokenString()
    await db("device2").where({ id: user.id }).update({
      resetPasswordToken: resetToken,
      updated_at: new Date(),
    })

    console.log(`Password reset token for ${email || phone_number}: ${resetToken}`)

    res.json({
      success: true,
      message: "If account exists, a password reset token has been sent",
      data: { resetToken },
    })
  } catch (error: any) {
    console.error("Forgot password error:", error)
    res.status(500).json({ success: false, message: "Internal server error", error: error.message })
  }
}

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body

    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: "Reset token and new password are required" })
    }

    const user = await db("device2").where({ password_reset_token: resetToken }).first()
    if (!user) return res.status(400).json({ success: false, message: "Invalid reset token" })

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db("device2").where({ id: user.id }).update({
      password: hashedPassword,
      resetPasswordToken: null,
      updated_at: new Date(),
    })

    res.json({ success: true, message: "Password reset successfully" })
  } catch (error: any) {
    console.error("Reset password error:", error)
    res.status(500).json({ success: false, message: "Internal server error", error: error.message })
  }
}
