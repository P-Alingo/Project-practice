const prisma = require("../config/database")
const prescriptionContractService = require("../services/prescriptionContractService")
const SecurityUtils = require("../utils/securityUtils")
const logger = require("../utils/logger")

class PrescriptionController {
  // Doctor: Issue a new prescription
  static async issuePrescription(req, res) {
    try {
      const { patientName, patientId, drugName, dosage, quantity, instructions, expiresAt } = req.body

      // Input validation
      if (!patientName || !patientId || !drugName || !dosage || !quantity || !instructions) {
        return res.status(400).json({ error: "All prescription fields are required" })
      }

      if (quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be greater than 0" })
      }

      const expiryDate = new Date(expiresAt)
      if (expiryDate <= new Date()) {
        return res.status(400).json({ error: "Expiry date must be in the future" })
      }

      // Ensure user is a doctor
      if (req.user.role !== "DOCTOR") {
        return res.status(403).json({ error: "Only doctors can issue prescriptions" })
      }

      // Generate unique prescription ID for blockchain
      const contractId = SecurityUtils.generateSecureToken(16)

      // Issue prescription on blockchain
      const blockchainResult = await prescriptionContractService.issuePrescription({
        patientId: SecurityUtils.sanitizeInput(patientId),
        doctorWallet: req.user.walletAddress,
        drugName: SecurityUtils.sanitizeInput(drugName),
        dosage: SecurityUtils.sanitizeInput(dosage),
        quantity: Number.parseInt(quantity),
        instructions: SecurityUtils.sanitizeInput(instructions),
        expiryTimestamp: Math.floor(expiryDate.getTime() / 1000),
      })

      if (!blockchainResult.success) {
        throw new Error("Failed to issue prescription on blockchain")
      }

      // Generate QR code data
      const qrCodeData = JSON.stringify({
        prescriptionId: blockchainResult.prescriptionId || contractId,
        patientId: patientId,
        doctorWallet: req.user.walletAddress,
        drugName: drugName,
        timestamp: Date.now(),
      })

      // Store prescription in database
      const prescription = await prisma.prescription.create({
        data: {
          blockchainTxHash: blockchainResult.txHash,
          contractId: blockchainResult.prescriptionId || contractId,
          patientName: SecurityUtils.sanitizeInput(patientName),
          patientId: SecurityUtils.sanitizeInput(patientId),
          doctorId: req.user.id,
          drugName: SecurityUtils.sanitizeInput(drugName),
          dosage: SecurityUtils.sanitizeInput(dosage),
          quantity: Number.parseInt(quantity),
          instructions: SecurityUtils.sanitizeInput(instructions),
          qrCodeData: qrCodeData,
          status: "ISSUED",
          expiresAt: expiryDate,
        },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
        },
      })

      // Log prescription issuance
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          prescriptionId: prescription.id,
          action: "PRESCRIPTION_ISSUED",
          details: {
            patientId: patientId,
            drugName: drugName,
            quantity: quantity,
            blockchainTxHash: blockchainResult.txHash,
          },
          blockchainTxHash: blockchainResult.txHash,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        },
      })

      logger.info("Prescription issued:", {
        prescriptionId: prescription.id,
        doctorId: req.user.id,
        patientId: patientId,
        txHash: blockchainResult.txHash,
      })

      res.status(201).json({
        message: "Prescription issued successfully",
        prescription: {
          id: prescription.id,
          contractId: prescription.contractId,
          patientName: prescription.patientName,
          patientId: prescription.patientId,
          drugName: prescription.drugName,
          dosage: prescription.dosage,
          quantity: prescription.quantity,
          instructions: prescription.instructions,
          status: prescription.status,
          qrCodeData: prescription.qrCodeData,
          issuedAt: prescription.issuedAt,
          expiresAt: prescription.expiresAt,
          doctor: prescription.doctor,
          blockchainTxHash: prescription.blockchainTxHash,
        },
      })
    } catch (error) {
      logger.error("Prescription issuance error:", error)
      res.status(500).json({ error: "Failed to issue prescription" })
    }
  }

  // Pharmacist: Verify prescription by QR code
  static async verifyPrescription(req, res) {
    try {
      const { qrCodeData } = req.body

      if (!qrCodeData) {
        return res.status(400).json({ error: "QR code data is required" })
      }

      // Ensure user is a pharmacist
      if (req.user.role !== "PHARMACIST") {
        return res.status(403).json({ error: "Only pharmacists can verify prescriptions" })
      }

      // Parse QR code data
      let qrData
      try {
        qrData = JSON.parse(qrCodeData)
      } catch (error) {
        return res.status(400).json({ error: "Invalid QR code format" })
      }

      // Find prescription in database
      const prescription = await prisma.prescription.findUnique({
        where: { qrCodeData: qrCodeData },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
              walletAddress: true,
            },
          },
        },
      })

      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" })
      }

      // Check if prescription has expired
      if (new Date() > prescription.expiresAt) {
        await prisma.prescription.update({
          where: { id: prescription.id },
          data: { status: "EXPIRED" },
        })
        return res.status(400).json({ error: "Prescription has expired" })
      }

      // Check if already dispensed
      if (prescription.status === "DISPENSED") {
        return res.status(400).json({ error: "Prescription has already been dispensed" })
      }

      // Verify on blockchain
      const blockchainResult = await prescriptionContractService.verifyPrescription(
        prescription.contractId,
        req.user.walletAddress,
      )

      if (!blockchainResult.success) {
        throw new Error("Failed to verify prescription on blockchain")
      }

      // Update prescription status
      const updatedPrescription = await prisma.prescription.update({
        where: { id: prescription.id },
        data: {
          status: "VERIFIED",
          pharmacistId: req.user.id,
        },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
          pharmacist: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
        },
      })

      // Log verification
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          prescriptionId: prescription.id,
          action: "PRESCRIPTION_VERIFIED",
          details: {
            pharmacistWallet: req.user.walletAddress,
            blockchainTxHash: blockchainResult.txHash,
          },
          blockchainTxHash: blockchainResult.txHash,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        },
      })

      logger.info("Prescription verified:", {
        prescriptionId: prescription.id,
        pharmacistId: req.user.id,
        txHash: blockchainResult.txHash,
      })

      res.json({
        message: "Prescription verified successfully",
        prescription: updatedPrescription,
        blockchainTxHash: blockchainResult.txHash,
      })
    } catch (error) {
      logger.error("Prescription verification error:", error)
      res.status(500).json({ error: "Failed to verify prescription" })
    }
  }

  // Pharmacist: Dispense prescription
  static async dispensePrescription(req, res) {
    try {
      const { prescriptionId } = req.params

      if (!prescriptionId) {
        return res.status(400).json({ error: "Prescription ID is required" })
      }

      // Ensure user is a pharmacist
      if (req.user.role !== "PHARMACIST") {
        return res.status(403).json({ error: "Only pharmacists can dispense prescriptions" })
      }

      // Find prescription
      const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
        },
      })

      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" })
      }

      // Check if prescription is verified
      if (prescription.status !== "VERIFIED") {
        return res.status(400).json({ error: "Prescription must be verified before dispensing" })
      }

      // Check if prescription has expired
      if (new Date() > prescription.expiresAt) {
        await prisma.prescription.update({
          where: { id: prescriptionId },
          data: { status: "EXPIRED" },
        })
        return res.status(400).json({ error: "Prescription has expired" })
      }

      // Dispense on blockchain
      const blockchainResult = await prescriptionContractService.dispensePrescription(
        prescription.contractId,
        req.user.walletAddress,
      )

      if (!blockchainResult.success) {
        throw new Error("Failed to dispense prescription on blockchain")
      }

      // Update prescription status
      const updatedPrescription = await prisma.prescription.update({
        where: { id: prescriptionId },
        data: {
          status: "DISPENSED",
          dispensedAt: new Date(),
          pharmacistId: req.user.id,
        },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
          pharmacist: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
        },
      })

      // Log dispensing
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          prescriptionId: prescription.id,
          action: "PRESCRIPTION_DISPENSED",
          details: {
            pharmacistWallet: req.user.walletAddress,
            blockchainTxHash: blockchainResult.txHash,
            dispensedAt: new Date(),
          },
          blockchainTxHash: blockchainResult.txHash,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        },
      })

      logger.info("Prescription dispensed:", {
        prescriptionId: prescription.id,
        pharmacistId: req.user.id,
        txHash: blockchainResult.txHash,
      })

      res.json({
        message: "Prescription dispensed successfully",
        prescription: updatedPrescription,
        blockchainTxHash: blockchainResult.txHash,
      })
    } catch (error) {
      logger.error("Prescription dispensing error:", error)
      res.status(500).json({ error: "Failed to dispense prescription" })
    }
  }

  // Get prescriptions by doctor
  static async getDoctorPrescriptions(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query
      const doctorId = req.user.role === "DOCTOR" ? req.user.id : req.params.doctorId

      // Build where clause
      const where = { doctorId }
      if (status) {
        where.status = status
      }

      const prescriptions = await prisma.prescription.findMany({
        where,
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
          pharmacist: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
        },
        orderBy: { issuedAt: "desc" },
        skip: (Number.parseInt(page) - 1) * Number.parseInt(limit),
        take: Number.parseInt(limit),
      })

      const total = await prisma.prescription.count({ where })

      res.json({
        prescriptions,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / Number.parseInt(limit)),
        },
      })
    } catch (error) {
      logger.error("Get doctor prescriptions error:", error)
      res.status(500).json({ error: "Failed to fetch prescriptions" })
    }
  }

  // Get prescriptions by patient ID
  static async getPatientPrescriptions(req, res) {
    try {
      const { patientId } = req.params
      const { page = 1, limit = 10 } = req.query

      if (!patientId) {
        return res.status(400).json({ error: "Patient ID is required" })
      }

      const prescriptions = await prisma.prescription.findMany({
        where: { patientId },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
          pharmacist: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
            },
          },
        },
        orderBy: { issuedAt: "desc" },
        skip: (Number.parseInt(page) - 1) * Number.parseInt(limit),
        take: Number.parseInt(limit),
      })

      const total = await prisma.prescription.count({ where: { patientId } })

      res.json({
        prescriptions,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / Number.parseInt(limit)),
        },
      })
    } catch (error) {
      logger.error("Get patient prescriptions error:", error)
      res.status(500).json({ error: "Failed to fetch patient prescriptions" })
    }
  }

  // Get single prescription details
  static async getPrescriptionDetails(req, res) {
    try {
      const { prescriptionId } = req.params

      const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
              walletAddress: true,
            },
          },
          pharmacist: {
            select: {
              firstName: true,
              lastName: true,
              licenseNumber: true,
              institutionName: true,
              walletAddress: true,
            },
          },
          auditLogs: {
            select: {
              action: true,
              details: true,
              timestamp: true,
              blockchainTxHash: true,
            },
            orderBy: { timestamp: "desc" },
          },
        },
      })

      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" })
      }

      // Get blockchain info if available
      let blockchainInfo = null
      try {
        if (prescription.contractId) {
          blockchainInfo = await prescriptionContractService.getPrescriptionInfo(prescription.contractId)
        }
      } catch (error) {
        logger.warn("Failed to fetch blockchain info for prescription:", error)
      }

      res.json({
        prescription,
        blockchainInfo,
      })
    } catch (error) {
      logger.error("Get prescription details error:", error)
      res.status(500).json({ error: "Failed to fetch prescription details" })
    }
  }
}

module.exports = PrescriptionController
