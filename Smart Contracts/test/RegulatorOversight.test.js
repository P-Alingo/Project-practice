const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("RegulatorOversight", () => {
  let userManagement, regulatorOversight
  let admin, regulator, regulator2, unauthorized

  beforeEach(async () => {
    ;[admin, regulator, regulator2, unauthorized] = await ethers.getSigners()

    // Deploy UserManagement first
    const UserManagement = await ethers.getContractFactory("UserManagement")
    userManagement = await UserManagement.deploy()
    await userManagement.waitForDeployment()

    // Register users
    await userManagement.registerUser(regulator.address, "regulator")
    await userManagement.registerUser(regulator2.address, "regulator")

    // Deploy RegulatorOversight contract
    const RegulatorOversight = await ethers.getContractFactory("RegulatorOversight")
    regulatorOversight = await RegulatorOversight.deploy(await userManagement.getAddress())
    await regulatorOversight.waitForDeployment()
  })

  describe("Deployment", () => {
    it("Should set the correct UserManagement address", async () => {
      expect(await regulatorOversight.userManagement()).to.equal(await userManagement.getAddress())
    })

    it("Should initialize flagged batch counter to 0", async () => {
      expect(await regulatorOversight.flaggedBatchCounter()).to.equal(0)
    })
  })

  describe("Batch Flagging", () => {
    it("Should allow regulators to flag batches", async () => {
      await expect(regulatorOversight.connect(regulator).flagBatch(1, "Quality concerns"))
        .to.emit(regulatorOversight, "BatchFlagged")
        .withArgs(1, regulator.address, "Quality concerns")

      expect(await regulatorOversight.flaggedBatchCounter()).to.equal(1)
    })

    it("Should store flagged batch data correctly", async () => {
      await regulatorOversight.connect(regulator).flagBatch(1, "Quality concerns")

      const flaggedData = await regulatorOversight.getFlaggedBatch(1)
      expect(flaggedData.id).to.equal(1)
      expect(flaggedData.reason).to.equal("Quality concerns")
      expect(flaggedData.regulator).to.equal(regulator.address)
      expect(flaggedData.resolved).to.be.false
    })

    it("Should reject invalid batch ID", async () => {
      await expect(regulatorOversight.connect(regulator).flagBatch(0, "Quality concerns")).to.be.revertedWith(
        "Invalid batch ID",
      )
    })

    it("Should reject empty reason", async () => {
      await expect(regulatorOversight.connect(regulator).flagBatch(1, "")).to.be.revertedWith("Reason cannot be empty")
    })

    it("Should reject flagging already flagged batch", async () => {
      await regulatorOversight.connect(regulator).flagBatch(1, "Quality concerns")
      await expect(regulatorOversight.connect(regulator).flagBatch(1, "Another reason")).to.be.revertedWith(
        "Batch already flagged",
      )
    })

    it("Should only allow regulators to flag batches", async () => {
      await expect(regulatorOversight.connect(unauthorized).flagBatch(1, "Quality concerns")).to.be.revertedWith(
        "Only regulators can perform this action",
      )
    })
  })

  describe("Batch Unflagging", () => {
    beforeEach(async () => {
      await regulatorOversight.connect(regulator).flagBatch(1, "Quality concerns")
    })

    it("Should allow regulators to unflag batches", async () => {
      await expect(regulatorOversight.connect(regulator2).unflagBatch(1))
        .to.emit(regulatorOversight, "BatchUnflagged")
        .withArgs(1, regulator2.address)

      const flaggedData = await regulatorOversight.getFlaggedBatch(1)
      expect(flaggedData.resolved).to.be.true
    })

    it("Should reject unflagging non-flagged batch", async () => {
      await expect(regulatorOversight.connect(regulator).unflagBatch(999)).to.be.revertedWith("Batch not flagged")
    })

    it("Should reject unflagging already resolved batch", async () => {
      await regulatorOversight.connect(regulator).unflagBatch(1)
      await expect(regulatorOversight.connect(regulator).unflagBatch(1)).to.be.revertedWith("Batch already resolved")
    })

    it("Should only allow regulators to unflag batches", async () => {
      await expect(regulatorOversight.connect(unauthorized).unflagBatch(1)).to.be.revertedWith(
        "Only regulators can perform this action",
      )
    })
  })

  describe("Audit Functions", () => {
    beforeEach(async () => {
      await regulatorOversight.connect(regulator).flagBatch(1, "Quality concerns")
      await regulatorOversight.connect(regulator).flagBatch(2, "Packaging issues")
      await regulatorOversight.connect(regulator).unflagBatch(1)
    })

    it("Should return audit logs", async () => {
      const auditLogs = await regulatorOversight.auditLogs()
      expect(auditLogs).to.deep.equal([1n, 2n])
    })

    it("Should return all flagged batches", async () => {
      const allFlagged = await regulatorOversight.getAllFlaggedBatches()
      expect(allFlagged.length).to.equal(2)
      expect(allFlagged[0].batchId).to.equal(1)
      expect(allFlagged[1].batchId).to.equal(2)
    })

    it("Should correctly identify flagged status", async () => {
      expect(await regulatorOversight.isBatchFlagged(1)).to.be.false // resolved
      expect(await regulatorOversight.isBatchFlagged(2)).to.be.true // still flagged
      expect(await regulatorOversight.isBatchFlagged(3)).to.be.false // never flagged
    })
  })

  describe("Data Retrieval", () => {
    it("Should reject getting non-flagged batch", async () => {
      await expect(regulatorOversight.getFlaggedBatch(999)).to.be.revertedWith("Batch not flagged")
    })
  })
})
