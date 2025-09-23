const jwt = require("jsonwebtoken")
const { ethers } = require("ethers")
const prisma = require("../config/database")
const SecurityUtils = require("../utils/securityUtils")
const logger = require("../utils/logger")

class AuthController {
  // Traditional email/password registration
  static async register(req, res) {
    try {
      const { email, password, walletAddress, role, firstName, lastName, licenseNumber, institutionName } = req.body

      // Input validation
      if (!email || !SecurityUtils.validateEmail(email)) {
        return res.status(400).json({ error: "Valid email is required" })
      }

      if (!password || password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" })
      }

      if (!walletAddress || !SecurityUtils.validateWalletAddress(walletAddress)) {
        return res.status(400).json({ error: "Valid wallet address is required" })
      }

      if (!["DOCTOR", "PHARMACIST", "MANUFACTURER", "DISTRIBUTOR"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" })
      }

      // Validate license number for medical professionals
      if (["DOCTOR", "PHARMACIST"].includes(role)) {
        if (!licenseNumber || !SecurityUtils.validateLicenseNumber(licenseNumber, role)) {
          return res.status(400).json({ error: "Valid license number is required" })
        }
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { walletAddress: walletAddress }],
        },
      })

      if (existingUser) {
        return res.status(409).json({ error: "User already exists with this email or wallet address" })
      }

      // Hash password
      const passwordHash = await SecurityUtils.hashPassword(password)

      // Create user
      const user = await prisma.user.create({
        data: {
          email: SecurityUtils.sanitizeInput(email),
          passwordHash,
          walletAddress: walletAddress.toLowerCase(),
          role,
          firstName: SecurityUtils.sanitizeInput(firstName),
          lastName: SecurityUtils.sanitizeInput(lastName),
          licenseNumber: licenseNumber ? SecurityUtils.sanitizeInput(licenseNumber) : null,
          institutionName: institutionName ? SecurityUtils.sanitizeInput(institutionName) : null,
          isVerified: false, // Requires admin verification
        },
      })

      // Log registration
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "USER_REGISTERED",
          details: {
            role: user.role,
            email: user.email,
            walletAddress: user.walletAddress,
          },
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        },
      })

      logger.info("User registered:", { userId: user.id, email: user.email, role: user.role })

      res.status(201).json({
        message: "User registered successfully. Awaiting admin verification.",
        userId: user.id,
      })
    } catch (error) {
      logger.error("Registration error:", error)
      res.status(500).json({ error: "Registration failed" })
    }
  }

  // Email/password login
  static async login(req, res) {
    try {
      const { email, password, twoFactorToken } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" })
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email },
      })

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Verify password
      const isValidPassword = await SecurityUtils.verifyPassword(password, user.passwordHash)
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({ error: "Account not verified. Please contact administrator." })
      }

      // Check 2FA if enabled
      if (user.twoFactorEnabled) {
        if (!twoFactorToken) {
          return res.status(200).json({
            requiresTwoFactor: true,
            message: "Two-factor authentication required",
          })
        }

        const isValidToken = SecurityUtils.verifyTwoFactorToken(twoFactorToken, user.twoFactorSecret)
        if (!isValidToken) {
          return res.status(401).json({ error: "Invalid two-factor authentication code" })
        }
      }

      // Generate JWT
      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          walletAddress: user.walletAddress,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
      )

      // Log successful login
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "USER_LOGIN",
          details: {
            method: "email_password",
            twoFactorUsed: user.twoFactorEnabled,
          },
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        },
      })

      logger.info("User logged in:", { userId: user.id, email: user.email })

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          walletAddress: user.walletAddress,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          institutionName: user.institutionName,
        },
      })
    } catch (error) {
      logger.error("Login error:", error)
      res.status(500).json({ error: "Login failed" })
    }
  }

  // Wallet-based authentication
  static async walletLogin(req, res) {
    try {
      const { walletAddress, signature, message } = req.body

      if (!walletAddress || !signature || !message) {
        return res.status(400).json({ error: "Wallet address, signature, and message are required" })
      }

      // Verify signature
      try {
        const recoveredAddress = ethers.verifyMessage(message, signature)
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          return res.status(401).json({ error: "Invalid signature" })
        }
      } catch (error) {
        return res.status(401).json({ error: "Invalid signature format" })
      }

      // Find user by wallet address
      const user = await prisma.user.findUnique({
        where: { walletAddress: walletAddress.toLowerCase() },
      })

      if (!user) {
        return res.status(401).json({ error: "Wallet not registered" })
      }

      if (!user.isVerified) {
        return res.status(401).json({ error: "Account not verified. Please contact administrator." })
      }

      // Generate JWT
      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          walletAddress: user.walletAddress,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
      )

      // Log successful wallet login
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "USER_LOGIN",
          details: {
            method: "wallet_signature",
            walletAddress: user.walletAddress,
          },
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        },
      })

      logger.info("Wallet login successful:", { userId: user.id, walletAddress: user.walletAddress })

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          walletAddress: user.walletAddress,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          institutionName: user.institutionName,
        },
      })
    } catch (error) {
      logger.error("Wallet login error:", error)
      res.status(500).json({ error: "Wallet authentication failed" })
    }
  }

  // Setup 2FA
  static async setupTwoFactor(req, res) {
    try {
      const userId = req.user.id
      const user = await prisma.user.findUnique({ where: { id: userId } })

      if (user.twoFactorEnabled) {
        return res.status(400).json({ error: "Two-factor authentication already enabled" })
      }

      const secret = SecurityUtils.generateTwoFactorSecret(user.email)

      // Store secret temporarily (user needs to verify before enabling)
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorSecret: secret.base32 },
      })

      res.json({
        secret: secret.base32,
        qrCode: secret.otpauth_url,
        manualEntryKey: secret.base32,
      })
    } catch (error) {
      logger.error("2FA setup error:", error)
      res.status(500).json({ error: "Failed to setup two-factor authentication" })
    }
  }

  // Verify and enable 2FA
  static async verifyTwoFactor(req, res) {
    try {
      const { token } = req.body
      const userId = req.user.id

      const user = await prisma.user.findUnique({ where: { id: userId } })

      if (!user.twoFactorSecret) {
        return res.status(400).json({ error: "Two-factor setup not initiated" })
      }

      const isValid = SecurityUtils.verifyTwoFactorToken(token, user.twoFactorSecret)

      if (!isValid) {
        return res.status(400).json({ error: "Invalid verification code" })
      }

      // Enable 2FA
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true },
      })

      // Log 2FA enablement
      await prisma.auditLog.create({
        data: {
          userId: userId,
          action: "TWO_FACTOR_ENABLED",
          details: {},
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        },
      })

      logger.info("2FA enabled for user:", { userId })

      res.json({ message: "Two-factor authentication enabled successfully" })
    } catch (error) {
      logger.error("2FA verification error:", error)
      res.status(500).json({ error: "Failed to verify two-factor authentication" })
    }
  }
}

module.exports = AuthController
