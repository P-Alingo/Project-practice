const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Prescription", () => {
  let userManagement, prescription
  let admin, doctor, pharmacist, patient, unauthorized

  beforeEach(async () => {
    ;[admin, doctor, pharmacist, patient, unauthorized] = await ethers.getSigners()

    // Deploy UserManagement first
    const UserManagement = await ethers.getContractFactory("UserManagement")
    userManagement = await UserManagement.deploy()
    await userManagement.waitForDeployment()

    // Register users
    await userManagement.registerUser(doctor.address, "doctor")
    await userManagement.registerUser(pharmacist.address, "pharmacist")
    await userManagement.registerUser(patient.address, "patient")

    // Deploy Prescription contract
    const Prescription = await ethers.getContractFactory("Prescription")
    prescription = await Prescription.deploy(await userManagement.getAddress())
    await prescription.waitForDeployment()
  })

  describe("Deployment", () => {
    it("Should set the correct UserManagement address", async () => {
      expect(await prescription.userManagement()).to.equal(await userManagement.getAddress())
    })

    it("Should initialize prescription counter to 0", async () => {
      expect(await prescription.prescriptionCounter()).to.equal(0)
    })
  })

  describe("Prescription Creation", () => {
    it("Should allow doctors to create prescriptions", async () => {
      await expect(
        prescription.connect(doctor).createPrescription(patient.address, "Paracetamol 500mg", "QmTestHash123"),
      )
        .to.emit(prescription, "PrescriptionCreated")
        .withArgs(1, doctor.address, patient.address)

      expect(await prescription.prescriptionCounter()).to.equal(1)
    })

    it("Should store prescription data correctly", async () => {
      await prescription.connect(doctor).createPrescription(patient.address, "Paracetamol 500mg", "QmTestHash123")

      const prescriptionData = await prescription.getPrescription(1)
      expect(prescriptionData.id).to.equal(1)
      expect(prescriptionData.doctor).to.equal(doctor.address)
      expect(prescriptionData.patient).to.equal(patient.address)
      expect(prescriptionData.drugDetails).to.equal("Paracetamol 500mg")
      expect(prescriptionData.ipfsHash).to.equal("QmTestHash123")
      expect(prescriptionData.verified).to.be.false
    })

    it("Should reject invalid patient address", async () => {
      await expect(
        prescription.connect(doctor).createPrescription(ethers.ZeroAddress, "Paracetamol 500mg", "QmTestHash123"),
      ).to.be.revertedWith("Invalid patient address")
    })

    it("Should reject empty drug details", async () => {
      await expect(
        prescription.connect(doctor).createPrescription(patient.address, "", "QmTestHash123"),
      ).to.be.revertedWith("Drug details cannot be empty")
    })

    it("Should reject empty IPFS hash", async () => {
      await expect(
        prescription.connect(doctor).createPrescription(patient.address, "Paracetamol 500mg", ""),
      ).to.be.revertedWith("IPFS hash cannot be empty")
    })

    it("Should only allow doctors to create prescriptions", async () => {
      await expect(
        prescription.connect(pharmacist).createPrescription(patient.address, "Paracetamol 500mg", "QmTestHash123"),
      ).to.be.revertedWith("Only doctors can perform this action")
    })
  })

  describe("Prescription Verification", () => {
    beforeEach(async () => {
      await prescription.connect(doctor).createPrescription(patient.address, "Paracetamol 500mg", "QmTestHash123")
    })

    it("Should allow pharmacists to verify prescriptions", async () => {
      await expect(prescription.connect(pharmacist).verifyPrescription(1))
        .to.emit(prescription, "PrescriptionVerified")
        .withArgs(1, pharmacist.address)

      const prescriptionData = await prescription.getPrescription(1)
      expect(prescriptionData.verified).to.be.true
    })

    it("Should reject verification of invalid prescription ID", async () => {
      await expect(prescription.connect(pharmacist).verifyPrescription(999)).to.be.revertedWith(
        "Invalid prescription ID",
      )
    })

    it("Should reject double verification", async () => {
      await prescription.connect(pharmacist).verifyPrescription(1)
      await expect(prescription.connect(pharmacist).verifyPrescription(1)).to.be.revertedWith(
        "Prescription already verified",
      )
    })

    it("Should only allow pharmacists to verify prescriptions", async () => {
      await expect(prescription.connect(doctor).verifyPrescription(1)).to.be.revertedWith(
        "Only pharmacists can perform this action",
      )
    })
  })

  describe("Prescription Retrieval", () => {
    it("Should reject invalid prescription ID", async () => {
      await expect(prescription.getPrescription(999)).to.be.revertedWith("Invalid prescription ID")
    })
  })
})
