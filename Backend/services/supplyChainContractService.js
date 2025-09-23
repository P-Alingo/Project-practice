const blockchainService = require("./blockchainService")
const logger = require("../utils/logger")

class SupplyChainContractService {
  async registerBatch(batchData) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("supplyChain")

      const { batchNumber, drugName, manufacturerWallet, productionTimestamp, expiryTimestamp, quantity } = batchData

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "registerBatch", [
        batchNumber,
        drugName,
        manufacturerWallet,
        productionTimestamp,
        expiryTimestamp,
        quantity,
      ])

      // Execute transaction
      const tx = await contract.registerBatch(
        batchNumber,
        drugName,
        manufacturerWallet,
        productionTimestamp,
        expiryTimestamp,
        quantity,
        {
          gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
        },
      )

      logger.info("Batch registration transaction sent:", {
        txHash: tx.hash,
        batchNumber,
        manufacturerWallet,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          batchNumber,
          gasUsed: receipt.gasUsed.toString(),
        }
      } else {
        throw new Error("Batch registration transaction failed")
      }
    } catch (error) {
      logger.error("Batch registration on blockchain failed:", error)
      throw error
    }
  }

  async transferBatch(batchNumber, fromWallet, toWallet, location) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("supplyChain")

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "transferBatch", [
        batchNumber,
        fromWallet,
        toWallet,
        location,
      ])

      // Execute transaction
      const tx = await contract.transferBatch(batchNumber, fromWallet, toWallet, location, {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
      })

      logger.info("Batch transfer transaction sent:", {
        txHash: tx.hash,
        batchNumber,
        fromWallet,
        toWallet,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          batchNumber,
        }
      } else {
        throw new Error("Batch transfer transaction failed")
      }
    } catch (error) {
      logger.error("Batch transfer on blockchain failed:", error)
      throw error
    }
  }

  async updateBatchStatus(batchNumber, status, updaterWallet) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("supplyChain")

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "updateBatchStatus", [
        batchNumber,
        status,
        updaterWallet,
      ])

      // Execute transaction
      const tx = await contract.updateBatchStatus(batchNumber, status, updaterWallet, {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
      })

      logger.info("Batch status update transaction sent:", {
        txHash: tx.hash,
        batchNumber,
        status,
        updaterWallet,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          batchNumber,
          status,
        }
      } else {
        throw new Error("Batch status update transaction failed")
      }
    } catch (error) {
      logger.error("Batch status update on blockchain failed:", error)
      throw error
    }
  }

  async getBatchInfo(batchNumber) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("supplyChain")

      const batchInfo = await contract.getBatch(batchNumber)

      return {
        batchNumber: batchInfo.batchNumber,
        drugName: batchInfo.drugName,
        manufacturerWallet: batchInfo.manufacturerWallet,
        currentOwner: batchInfo.currentOwner,
        currentLocation: batchInfo.currentLocation,
        productionTimestamp: batchInfo.productionTimestamp.toString(),
        expiryTimestamp: batchInfo.expiryTimestamp.toString(),
        quantity: batchInfo.quantity.toString(),
        status: batchInfo.status,
        isActive: batchInfo.isActive,
      }
    } catch (error) {
      logger.error("Error fetching batch info from blockchain:", error)
      throw error
    }
  }

  async getBatchHistory(batchNumber) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("supplyChain")

      const transfers = await contract.getBatchTransfers(batchNumber)

      return transfers.map((transfer) => ({
        fromWallet: transfer.fromWallet,
        toWallet: transfer.toWallet,
        location: transfer.location,
        timestamp: transfer.timestamp.toString(),
        transactionHash: transfer.transactionHash,
      }))
    } catch (error) {
      logger.error("Error fetching batch history from blockchain:", error)
      throw error
    }
  }

  async getBatchesByManufacturer(manufacturerWallet) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("supplyChain")

      const batchNumbers = await contract.getBatchesByManufacturer(manufacturerWallet)

      const batches = await Promise.all(batchNumbers.map((batchNumber) => this.getBatchInfo(batchNumber)))

      return batches
    } catch (error) {
      logger.error("Error fetching manufacturer batches from blockchain:", error)
      throw error
    }
  }

  async verifyBatchAuthenticity(batchNumber) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("supplyChain")

      const isAuthentic = await contract.verifyBatch(batchNumber)

      if (isAuthentic) {
        const batchInfo = await this.getBatchInfo(batchNumber)
        return {
          isAuthentic: true,
          batchInfo,
        }
      } else {
        return {
          isAuthentic: false,
          message: "Batch not found or invalid",
        }
      }
    } catch (error) {
      logger.error("Error verifying batch authenticity:", error)
      throw error
    }
  }
}

module.exports = new SupplyChainContractService()
