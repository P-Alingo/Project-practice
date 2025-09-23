const blockchainService = require("./blockchainService")
const logger = require("../utils/logger")

class PrescriptionContractService {
  async issuePrescription(prescriptionData) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("prescription")

      const { patientId, doctorWallet, drugName, dosage, quantity, instructions, expiryTimestamp } = prescriptionData

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "issuePrescription", [
        patientId,
        doctorWallet,
        drugName,
        dosage,
        quantity,
        instructions,
        expiryTimestamp,
      ])

      // Execute transaction
      const tx = await contract.issuePrescription(
        patientId,
        doctorWallet,
        drugName,
        dosage,
        quantity,
        instructions,
        expiryTimestamp,
        {
          gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
        },
      )

      logger.info("Prescription issuance transaction sent:", {
        txHash: tx.hash,
        patientId,
        doctorWallet,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        // Extract prescription ID from events
        const prescriptionIssuedEvent = receipt.logs.find(
          (log) => log.topics[0] === contract.interface.getEvent("PrescriptionIssued").topicHash,
        )

        let prescriptionId = null
        if (prescriptionIssuedEvent) {
          const decodedEvent = contract.interface.decodeEventLog(
            "PrescriptionIssued",
            prescriptionIssuedEvent.data,
            prescriptionIssuedEvent.topics,
          )
          prescriptionId = decodedEvent.prescriptionId.toString()
        }

        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          prescriptionId,
          gasUsed: receipt.gasUsed.toString(),
        }
      } else {
        throw new Error("Prescription issuance transaction failed")
      }
    } catch (error) {
      logger.error("Prescription issuance on blockchain failed:", error)
      throw error
    }
  }

  async verifyPrescription(prescriptionId, pharmacistWallet) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("prescription")

      // First check if prescription exists and is valid
      const prescriptionInfo = await this.getPrescriptionInfo(prescriptionId)

      if (!prescriptionInfo.isValid) {
        throw new Error("Prescription is not valid or has expired")
      }

      if (prescriptionInfo.isDispensed) {
        throw new Error("Prescription has already been dispensed")
      }

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "verifyPrescription", [
        prescriptionId,
        pharmacistWallet,
      ])

      // Execute transaction
      const tx = await contract.verifyPrescription(prescriptionId, pharmacistWallet, {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
      })

      logger.info("Prescription verification transaction sent:", {
        txHash: tx.hash,
        prescriptionId,
        pharmacistWallet,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          prescriptionId,
        }
      } else {
        throw new Error("Prescription verification transaction failed")
      }
    } catch (error) {
      logger.error("Prescription verification on blockchain failed:", error)
      throw error
    }
  }

  async dispensePrescription(prescriptionId, pharmacistWallet) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("prescription")

      // Estimate gas
      const gasEstimate = await blockchainService.estimateGas(contract, "dispensePrescription", [
        prescriptionId,
        pharmacistWallet,
      ])

      // Execute transaction
      const tx = await contract.dispensePrescription(prescriptionId, pharmacistWallet, {
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
      })

      logger.info("Prescription dispensing transaction sent:", {
        txHash: tx.hash,
        prescriptionId,
        pharmacistWallet,
      })

      const receipt = await blockchainService.waitForTransaction(tx.hash)

      if (receipt.status === 1) {
        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          prescriptionId,
        }
      } else {
        throw new Error("Prescription dispensing transaction failed")
      }
    } catch (error) {
      logger.error("Prescription dispensing on blockchain failed:", error)
      throw error
    }
  }

  async getPrescriptionInfo(prescriptionId) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("prescription")

      const prescriptionInfo = await contract.getPrescription(prescriptionId)

      return {
        prescriptionId: prescriptionInfo.prescriptionId.toString(),
        patientId: prescriptionInfo.patientId,
        doctorWallet: prescriptionInfo.doctorWallet,
        pharmacistWallet: prescriptionInfo.pharmacistWallet,
        drugName: prescriptionInfo.drugName,
        dosage: prescriptionInfo.dosage,
        quantity: prescriptionInfo.quantity.toString(),
        instructions: prescriptionInfo.instructions,
        issuedTimestamp: prescriptionInfo.issuedTimestamp.toString(),
        expiryTimestamp: prescriptionInfo.expiryTimestamp.toString(),
        isDispensed: prescriptionInfo.isDispensed,
        isValid: prescriptionInfo.isValid,
      }
    } catch (error) {
      logger.error("Error fetching prescription info from blockchain:", error)
      throw error
    }
  }

  async getPrescriptionsByDoctor(doctorWallet) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("prescription")

      const prescriptionIds = await contract.getPrescriptionsByDoctor(doctorWallet)

      // Fetch detailed info for each prescription
      const prescriptions = await Promise.all(prescriptionIds.map((id) => this.getPrescriptionInfo(id.toString())))

      return prescriptions
    } catch (error) {
      logger.error("Error fetching doctor prescriptions from blockchain:", error)
      throw error
    }
  }

  async getPrescriptionsByPatient(patientId) {
    try {
      await blockchainService.ensureInitialized()
      const contract = blockchainService.getContract("prescription")

      const prescriptionIds = await contract.getPrescriptionsByPatient(patientId)

      const prescriptions = await Promise.all(prescriptionIds.map((id) => this.getPrescriptionInfo(id.toString())))

      return prescriptions
    } catch (error) {
      logger.error("Error fetching patient prescriptions from blockchain:", error)
      throw error
    }
  }
}

module.exports = new PrescriptionContractService()
