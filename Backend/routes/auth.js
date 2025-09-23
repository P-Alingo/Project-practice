const express = require("express")
const AuthController = require("../controllers/authController")
const { authenticateToken } = require("../middleware/authMiddleware")

const router = express.Router()

// Public routes
router.post("/register", AuthController.register)
router.post("/login", AuthController.login)
router.post("/wallet-login", AuthController.walletLogin)

// Protected routes
router.post("/setup-2fa", authenticateToken, AuthController.setupTwoFactor)
router.post("/verify-2fa", authenticateToken, AuthController.verifyTwoFactor)

module.exports = router
