const bcrypt = require("bcryptjs")
const speakeasy = require("speakeasy")
const crypto = require("crypto")

class SecurityUtils {
  static async hashPassword(password) {
    const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS) || 12
    return await bcrypt.hash(password, saltRounds)
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }

  static generateTwoFactorSecret(userEmail) {
    return speakeasy.generateSecret({
      name: `ePrescription System (${userEmail})`,
      issuer: "ePrescription Kenya",
      length: 32,
    })
  }

  static verifyTwoFactorToken(token, secret) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 2, // Allow 2 time steps (60 seconds) of tolerance
    })
  }

  static generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString("hex")
  }

  static validateWalletAddress(address) {
    // Basic Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    return ethAddressRegex.test(address)
  }

  static sanitizeInput(input) {
    if (typeof input !== "string") return input

    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim()
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validateLicenseNumber(licenseNumber, role) {
    // Kenya medical license validation patterns
    const patterns = {
      DOCTOR: /^MD\/\d{4,6}$/, // Example: MD/12345
      PHARMACIST: /^PH\/\d{4,6}$/, // Example: PH/12345
    }

    return patterns[role] ? patterns[role].test(licenseNumber) : true
  }
}

module.exports = SecurityUtils
