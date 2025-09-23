const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("UserManagement", () => {
  let userManagement
  let admin, doctor, pharmacist, patient, regulator, manufacturer, unauthorized

  beforeEach(async () => {
    ;[admin, doctor, pharmacist, patient, regulator, manufacturer, unauthorized] = await ethers.getSigners()

    const UserManagement = await ethers.getContractFactory("UserManagement")
    userManagement = await UserManagement.deploy()
    await userManagement.waitForDeployment()
  })

  describe("Deployment", () => {
    it("Should set the deployer as admin", async () => {
      expect(await userManagement.admin()).to.equal(admin.address)
      expect(await userManagement.getUserRole(admin.address)).to.equal("admin")
    })
  })

  describe("User Registration", () => {
    it("Should allow admin to register users with valid roles", async () => {
      await expect(userManagement.registerUser(doctor.address, "doctor"))
        .to.emit(userManagement, "UserRegistered")
        .withArgs(doctor.address, "doctor")

      expect(await userManagement.getUserRole(doctor.address)).to.equal("doctor")
    })

    it("Should register all valid roles", async () => {
      await userManagement.registerUser(doctor.address, "doctor")
      await userManagement.registerUser(pharmacist.address, "pharmacist")
      await userManagement.registerUser(patient.address, "patient")
      await userManagement.registerUser(regulator.address, "regulator")
      await userManagement.registerUser(manufacturer.address, "manufacturer")

      expect(await userManagement.getUserRole(doctor.address)).to.equal("doctor")
      expect(await userManagement.getUserRole(pharmacist.address)).to.equal("pharmacist")
      expect(await userManagement.getUserRole(patient.address)).to.equal("patient")
      expect(await userManagement.getUserRole(regulator.address)).to.equal("regulator")
      expect(await userManagement.getUserRole(manufacturer.address)).to.equal("manufacturer")
    })

    it("Should reject invalid roles", async () => {
      await expect(userManagement.registerUser(doctor.address, "invalid_role")).to.be.revertedWith("Invalid role")
    })

    it("Should reject empty roles", async () => {
      await expect(userManagement.registerUser(doctor.address, "")).to.be.revertedWith("Role cannot be empty")
    })

    it("Should only allow admin to register users", async () => {
      await expect(userManagement.connect(unauthorized).registerUser(doctor.address, "doctor")).to.be.revertedWith(
        "Only admin can perform this action",
      )
    })
  })

  describe("Role Checking Functions", () => {
    beforeEach(async () => {
      await userManagement.registerUser(doctor.address, "doctor")
      await userManagement.registerUser(pharmacist.address, "pharmacist")
      await userManagement.registerUser(patient.address, "patient")
      await userManagement.registerUser(regulator.address, "regulator")
      await userManagement.registerUser(manufacturer.address, "manufacturer")
    })

    it("Should correctly identify doctors", async () => {
      expect(await userManagement.isDoctor(doctor.address)).to.be.true
      expect(await userManagement.isDoctor(pharmacist.address)).to.be.false
    })

    it("Should correctly identify pharmacists", async () => {
      expect(await userManagement.isPharmacist(pharmacist.address)).to.be.true
      expect(await userManagement.isPharmacist(doctor.address)).to.be.false
    })

    it("Should correctly identify patients", async () => {
      expect(await userManagement.isPatient(patient.address)).to.be.true
      expect(await userManagement.isPatient(doctor.address)).to.be.false
    })

    it("Should correctly identify regulators", async () => {
      expect(await userManagement.isRegulator(regulator.address)).to.be.true
      expect(await userManagement.isRegulator(doctor.address)).to.be.false
    })

    it("Should correctly identify manufacturers", async () => {
      expect(await userManagement.isManufacturer(manufacturer.address)).to.be.true
      expect(await userManagement.isManufacturer(doctor.address)).to.be.false
    })
  })
})
