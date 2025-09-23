const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("DrugSupplyChain", () => {
  let userManagement, drugSupplyChain
  let admin, manufacturer, pharmacist, distributor, unauthorized

  beforeEach(async () => {
    ;[admin, manufacturer, pharmacist, distributor, unauthorized] = await ethers.getSigners()

    // Deploy UserManagement first
    const UserManagement = await ethers.getContractFactory("UserManagement")
    userManagement = await UserManagement.deploy()
    await userManagement.waitForDeployment()

    // Register users
    await userManagement.registerUser(manufacturer.address, "manufacturer")
    await userManagement.registerUser(pharmacist.address, "pharmacist")

    // Deploy DrugSupplyChain contract
    const DrugSupplyChain = await ethers.getContractFactory("DrugSupplyChain")
    drugSupplyChain = await DrugSupplyChain.deploy(await userManagement.getAddress())
    await drugSupplyChain.waitForDeployment()
  })

  describe("Deployment", () => {
    it("Should set the correct UserManagement address", async () => {
      expect(await drugSupplyChain.userManagement()).to.equal(await userManagement.getAddress())
    })

    it("Should initialize batch counter to 0", async () => {
      expect(await drugSupplyChain.batchCounter()).to.equal(0)
    })
  })

  describe("Batch Registration", () => {
    it("Should allow manufacturers to register batches", async () => {
      await expect(drugSupplyChain.connect(manufacturer).registerBatch("Paracetamol", "QmBatchHash123"))
        .to.emit(drugSupplyChain, "BatchRegistered")
        .withArgs(1, manufacturer.address)

      expect(await drugSupplyChain.batchCounter()).to.equal(1)
    })

    it("Should store batch data correctly", async () => {
      await drugSupplyChain.connect(manufacturer).registerBatch("Paracetamol", "QmBatchHash123")

      const batch = await drugSupplyChain.getBatch(1)
      expect(batch.id).to.equal(1)
      expect(batch.drugName).to.equal("Paracetamol")
      expect(batch.ipfsHash).to.equal("QmBatchHash123")
      expect(batch.manufacturer).to.equal(manufacturer.address)
      expect(batch.currentOwner).to.equal(manufacturer.address)
      expect(batch.status).to.equal("Manufactured")
    })

    it("Should reject empty drug name", async () => {
      await expect(drugSupplyChain.connect(manufacturer).registerBatch("", "QmBatchHash123")).to.be.revertedWith(
        "Drug name cannot be empty",
      )
    })

    it("Should reject empty IPFS hash", async () => {
      await expect(drugSupplyChain.connect(manufacturer).registerBatch("Paracetamol", "")).to.be.revertedWith(
        "IPFS hash cannot be empty",
      )
    })

    it("Should only allow manufacturers to register batches", async () => {
      await expect(
        drugSupplyChain.connect(pharmacist).registerBatch("Paracetamol", "QmBatchHash123"),
      ).to.be.revertedWith("Only manufacturers can perform this action")
    })
  })

  describe("Batch Transfer", () => {
    beforeEach(async () => {
      await drugSupplyChain.connect(manufacturer).registerBatch("Paracetamol", "QmBatchHash123")
    })

    it("Should allow current owner to transfer batch", async () => {
      await expect(drugSupplyChain.connect(manufacturer).transferBatch(1, distributor.address))
        .to.emit(drugSupplyChain, "BatchTransferred")
        .withArgs(1, manufacturer.address, distributor.address)

      const batch = await drugSupplyChain.getBatch(1)
      expect(batch.currentOwner).to.equal(distributor.address)
      expect(batch.status).to.equal("In Transit")
    })

    it("Should update status to 'At Pharmacy' when transferred to pharmacist", async () => {
      await drugSupplyChain.connect(manufacturer).transferBatch(1, pharmacist.address)

      const batch = await drugSupplyChain.getBatch(1)
      expect(batch.currentOwner).to.equal(pharmacist.address)
      expect(batch.status).to.equal("At Pharmacy")
    })

    it("Should track ownership history", async () => {
      await drugSupplyChain.connect(manufacturer).transferBatch(1, distributor.address)
      await drugSupplyChain.connect(distributor).transferBatch(1, pharmacist.address)

      const trackingData = await drugSupplyChain.trackBatch(1)
      expect(trackingData.history).to.deep.equal([manufacturer.address, distributor.address, pharmacist.address])
    })

    it("Should reject invalid batch ID", async () => {
      await expect(drugSupplyChain.connect(manufacturer).transferBatch(999, distributor.address)).to.be.revertedWith(
        "Invalid batch ID",
      )
    })

    it("Should reject invalid new owner address", async () => {
      await expect(drugSupplyChain.connect(manufacturer).transferBatch(1, ethers.ZeroAddress)).to.be.revertedWith(
        "Invalid new owner address",
      )
    })

    it("Should reject transfer to current owner", async () => {
      await expect(drugSupplyChain.connect(manufacturer).transferBatch(1, manufacturer.address)).to.be.revertedWith(
        "Cannot transfer to current owner",
      )
    })

    it("Should only allow current owner to transfer", async () => {
      await expect(drugSupplyChain.connect(pharmacist).transferBatch(1, distributor.address)).to.be.revertedWith(
        "Only current owner can transfer batch",
      )
    })
  })

  describe("Batch Tracking", () => {
    beforeEach(async () => {
      await drugSupplyChain.connect(manufacturer).registerBatch("Paracetamol", "QmBatchHash123")
    })

    it("Should return complete tracking information", async () => {
      const trackingData = await drugSupplyChain.trackBatch(1)
      expect(trackingData.id).to.equal(1)
      expect(trackingData.drugName).to.equal("Paracetamol")
      expect(trackingData.ipfsHash).to.equal("QmBatchHash123")
      expect(trackingData.manufacturer).to.equal(manufacturer.address)
      expect(trackingData.currentOwner).to.equal(manufacturer.address)
      expect(trackingData.status).to.equal("Manufactured")
      expect(trackingData.history).to.deep.equal([manufacturer.address])
    })

    it("Should reject invalid batch ID", async () => {
      await expect(drugSupplyChain.trackBatch(999)).to.be.revertedWith("Invalid batch ID")
    })
  })
})
