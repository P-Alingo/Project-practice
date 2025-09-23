const blockchainService = require("./blockchainService")
const logger = require("../utils/logger")

class RegulatorContractService {
  async flagSuspiciousBatch(batchNumber, reason, regulatorWallet) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("regulator")

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "flagBatch", [
        batchNumber,
        reason,
        regulatorWallet,
      ])

      // Execute transaction
      const tx = await contract.flagBatch(batchNumber, reason, regulatorWallet, {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
      })

      logger.info("Batch flagging transaction sent:", {
        txHash: tx.hash,
        batchNumber,
        reason,
        regulatorWallet,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          batchNumber,
          reason,
        }
      } else {
        throw new Error("Batch flagging transaction failed")
      }
    } catch (error) {
      logger.error("Batch flagging on blockchain failed:", error)
      throw error
    }
  }

  async recallBatch(batchNumber, reason, regulatorWallet) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("regulator")

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "recallBatch", [
        batchNumber,
        reason,
        regulatorWallet,
      ])

      // Execute transaction
      const tx = await contract.recallBatch(batchNumber, reason, regulatorWallet, {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
      })

      logger.info("Batch recall transaction sent:", {
        txHash: tx.hash,
        batchNumber,
        reason,
        regulatorWallet,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          batchNumber,
          reason,
        }
      } else {
        throw new Error("Batch recall transaction failed")
      }
    } catch (error) {
      logger.error("Batch recall on blockchain failed:", error)
      throw error
    }
  }

  async auditPrescription(prescriptionId, findings, regulatorWallet) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("regulator")

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "auditPrescription", [
        prescriptionId,
        findings,
        regulatorWallet,
      ])

      // Execute transaction
      const tx = await contract.auditPrescription(prescriptionId, findings, regulatorWallet, {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
      })

      logger.info("Prescription audit transaction sent:", {
        txHash: tx.hash,
        prescriptionId,
        regulatorWallet,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          prescriptionId,
          findings,
        }
      } else {
        throw new Error("Prescription audit transaction failed")
      }
    } catch (error) {
      logger.error("Prescription audit on blockchain failed:", error)
      throw error
    }
  }

  async getFlaggedBatches() {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("regulator")

      const flaggedBatches = await contract.getFlaggedBatches()

      return flaggedBatches.map((batch) => ({
        batchNumber: batch.batchNumber,
        reason: batch.reason,
        flaggedBy: batch.flaggedBy,
        timestamp: batch.timestamp.toString(),
        isResolved: batch.isResolved,
      }))
    } catch (error) {
      logger.error("Error fetching flagged batches from blockchain:", error)
      throw error
    }
  }

  async getRecalledBatches() {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("regulator")

      const recalledBatches = await contract.getRecalledBatches()

      return recalledBatches.map((batch) => ({
        batchNumber: batch.batchNumber,
        reason: batch.reason,
        recalledBy: batch.recalledBy,
        timestamp: batch.timestamp.toString(),
      }))
    } catch (error) {
      logger.error("Error fetching recalled batches from blockchain:", error)
      throw error
    }
  }

  async getAuditedPrescriptions() {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("regulator")

      const auditedPrescriptions = await contract.getAuditedPrescriptions()

      return auditedPrescriptions.map((audit) => ({
        prescriptionId: audit.prescriptionId.toString(),
        findings: audit.findings,
        auditedBy: audit.auditedBy,
        timestamp: audit.timestamp.toString(),
      }))
    } catch (error) {
      logger.error("Error fetching audited prescriptions from blockchain:", error)
      throw error
    }
  }

  async generateComplianceReport(startTimestamp, endTimestamp) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("regulator")

      const report = await contract.generateComplianceReport(startTimestamp, endTimestamp)

      return {
        totalPrescriptions: report.totalPrescriptions.toString(),
        totalBatches: report.totalBatches.toString(),
        flaggedBatches: report.flaggedBatches.toString(),
        recalledBatches: report.recalledBatches.toString(),
        auditedPrescriptions: report.auditedPrescriptions.toString(),
        reportTimestamp: report.reportTimestamp.toString(),
      }
    } catch (error) {
      logger.error("Error generating compliance report from blockchain:", error)
      throw error
    }
  }
}

module.exports = new RegulatorContractService()
