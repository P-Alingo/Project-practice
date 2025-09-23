const express = require("express")
const prisma = require("../config/database")
const { authenticateToken } = require("../middleware/authMiddleware")
const { requireRole, rolePermissions } = require("../middleware/roleMiddleware")
const logger = require("../utils/logger")

const router = express.Router()

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        role: true,
        firstName: true,
        lastName: true,
        licenseNumber: true,
        institutionName: true,
        isVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
      },
    })

    res.json(user)
  } catch (error) {
    logger.error("Get profile error:", error)
    res.status(500).json({ error: "Failed to fetch profile" })
  }
})

// Admin: Get all users pending verification
router.get("/pending-verification", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: { isVerified: false },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        role: true,
        firstName: true,
        lastName: true,
        licenseNumber: true,
        institutionName: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    res.json(pendingUsers)
  } catch (error) {
    logger.error("Get pending users error:", error)
    res.status(500).json({ error: "Failed to fetch pending users" })
  }
})

// Admin: Verify user
router.patch("/verify/:userId", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { userId } = req.params
    const { isVerified } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
      },
    })

    // Log verification action
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: isVerified ? "USER_VERIFIED" : "USER_UNVERIFIED",
        details: {
          targetUserId: userId,
          targetUserEmail: updatedUser.email,
        },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      },
    })

    logger.info(`User ${isVerified ? "verified" : "unverified"}:`, {
      adminId: req.user.id,
      targetUserId: userId,
    })

    res.json({
      message: `User ${isVerified ? "verified" : "unverified"} successfully`,
      user: updatedUser,
    })
  } catch (error) {
    logger.error("User verification error:", error)
    res.status(500).json({ error: "Failed to update user verification status" })
  }
})

module.exports = router
