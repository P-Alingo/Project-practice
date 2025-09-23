const express = require("express")
const PrescriptionController = require("../controllers/prescriptionController")
const { authenticateToken } = require("../middleware/authMiddleware")
const { requireRole, rolePermissions } = require("../middleware/roleMiddleware")

const router = express.Router()

// Doctor routes
router.post("/", authenticateToken, requireRole(["DOCTOR"]), PrescriptionController.issuePrescription)

router.get(
  "/doctor/:doctorId?",
  authenticateToken,
  requireRole(rolePermissions.MEDICAL_STAFF),
  PrescriptionController.getDoctorPrescriptions,
)

// Pharmacist routes
router.post("/verify", authenticateToken, requireRole(["PHARMACIST"]), PrescriptionController.verifyPrescription)

router.patch(
  "/:prescriptionId/dispense",
  authenticateToken,
  requireRole(["PHARMACIST"]),
  PrescriptionController.dispensePrescription,
)

// Patient routes
router.get(
  "/patient/:patientId",
  authenticateToken,
  requireRole(rolePermissions.ALL_VERIFIED),
  PrescriptionController.getPatientPrescriptions,
)

// General routes
router.get(
  "/:prescriptionId",
  authenticateToken,
  requireRole(rolePermissions.ALL_VERIFIED),
  PrescriptionController.getPrescriptionDetails,
)

module.exports = router
