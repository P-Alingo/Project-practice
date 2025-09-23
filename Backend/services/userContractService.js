const blockchainService = require("./blockchainService")
const logger = require("../utils/logger")

class UserContractService {
  async registerUser(userData) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("userManagement")

      const { walletAddress, role, licenseNumber, institutionName } = userData

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "registerUser", [
        walletAddress,
        role,
        licenseNumber || "",
        institutionName || "",
      ])

      // Execute transaction
      const tx = await contract.registerUser(walletAddress, role, licenseNumber || "", institutionName || "", {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100), // Add 20% buffer
      })

      logger.info("User registration transaction sent:", {
        txHash: tx.hash,
        walletAddress,
      })

      // Wait for confirmation
      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        logger.info("User registered on blockchain:", {
          txHash: tx.hash,
          walletAddress,
          blockNumber: receipt.blockNumber,
        })

        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
        }
      } else {
        throw new Error("Transaction failed")
      }
    } catch (error) {
      logger.error("User registration on blockchain failed:", error)
      throw error
    }
  }

  async verifyUser(walletAddress, isVerified) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("userManagement")

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "verifyUser", [walletAddress, isVerified])

      // Execute transaction
      const tx = await contract.verifyUser(walletAddress, isVerified, {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
      })

      logger.info("User verification transaction sent:", {
        txHash: tx.hash,
        walletAddress,
        isVerified,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
        }
      } else {
        throw new Error("Verification transaction failed")
      }
    } catch (error) {
      logger.error("User verification on blockchain failed:", error)
      throw error
    }
  }

  async getUserInfo(walletAddress) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("userManagement")

      const userInfo = await contract.getUser(walletAddress)

      return {
        walletAddress: userInfo.walletAddress,
        role: userInfo.role,
        isVerified: userInfo.isVerified,
        licenseNumber: userInfo.licenseNumber,
        institutionName: userInfo.institutionName,
        registrationTimestamp: userInfo.registrationTimestamp,
      }
    } catch (error) {
      logger.error("Error fetching user info from blockchain:", error)
      throw error
    }
  }

  async isUserVerified(walletAddress) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("userManagement")

      return await contract.isVerified(walletAddress)
    } catch (error) {
      logger.error("Error checking user verification status:", error)
      throw error
    }
  }
}

module.exports = new UserContractService()
