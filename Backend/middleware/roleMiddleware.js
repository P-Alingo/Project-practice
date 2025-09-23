const logger = require("../utils/logger")

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" })
      }

      const userRole = req.user.role

      if (!allowedRoles.includes(userRole)) {
        logger.warn("Unauthorized access attempt:", {
          userId: req.user.id,
          userRole: userRole,
          requiredRoles: allowedRoles,
          endpoint: req.path,
        })

        return res.status(403).json({
          error: "Insufficient permissions",
          required: allowedRoles,
          current: userRole,
        })
      }

      next()
    } catch (error) {
      logger.error("Role authorization error:", error)
      return res.status(500).json({ error: "Authorization failed" })
    }
  }
}

// Predefined role combinations for common use cases
const rolePermissions = {
  MEDICAL_STAFF: ["DOCTOR", "PHARMACIST"],
  SUPPLY_CHAIN: ["MANUFACTURER", "DISTRIBUTOR"],
  OVERSIGHT: ["REGULATOR", "ADMIN"],
  ALL_VERIFIED: ["DOCTOR", "PHARMACIST", "MANUFACTURER", "DISTRIBUTOR", "REGULATOR", "ADMIN"],
}

module.exports = { requireRole, rolePermissions }
