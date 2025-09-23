const jwt = require("jsonwebtoken")
const prisma = require("../config/database")
const logger = require("../utils/logger")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Fetch user from database to ensure they still exist and are verified
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        walletAddress: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        twoFactorEnabled: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: "User account not verified" })
    }

    req.user = user
    next()
  } catch (error) {
    logger.error("Authentication error:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" })
    }

    return res.status(500).json({ error: "Authentication failed" })
  }
}

module.exports = { authenticateToken }
