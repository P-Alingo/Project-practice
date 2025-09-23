const { ethers } = require("ethers")
const { contractConfig, networkConfig } = require("../config/contracts")
const logger = require("../utils/logger")

class BlockchainService {
  constructor() {
    this.provider = null
    this.wallet = null
    this.contracts = {}
    this.initialized = false
  }

  async initialize() {
    try {
      // Initialize provider
      this.provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl)

      // Initialize wallet
      this.wallet = new ethers.Wallet(networkConfig.privateKey, this.provider)

      // Initialize contracts
      await this.initializeContracts()

      this.initialized = true
      logger.info("Blockchain service initialized successfully")
    } catch (error) {
      logger.error("Failed to initialize blockchain service:", error)
      throw error
    }
  }

  async initializeContracts() {
    try {
      // Initialize each contract
      for (const [contractName, config] of Object.entries(contractConfig)) {
        if (config.address && config.abi.length > 0) {
          this.contracts[contractName] = new ethers.Contract(config.address, config.abi, this.wallet)
          logger.info(`${contractName} contract initialized at ${config.address}`)
        } else {
          logger.warn(`${contractName} contract not configured - missing address or ABI`)
        }
      }
    } catch (error) {
      logger.error("Contract initialization error:", error)
      throw error
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize()
    }
  }

  async getTransactionReceipt(txHash) {
    await this.ensureInitialized()
    try {
      return await this.provider.getTransactionReceipt(txHash)
    } catch (error) {
      logger.error("Error getting transaction receipt:", error)
      throw error
    }
  }

  async waitForTransaction(txHash, confirmations = 1) {
    await this.ensureInitialized()
    try {
      return await this.provider.waitForTransaction(txHash, confirmations)
    } catch (error) {
      logger.error("Error waiting for transaction:", error)
      throw error
    }
  }

  async getGasPrice() {
    await this.ensureInitialized()
    try {
      const feeData = await this.provider.getFeeData()
      return feeData.gasPrice
    } catch (error) {
      logger.error("Error getting gas price:", error)
      throw error
    }
  }

  async estimateGas(contract, methodName, params) {
    await this.ensureInitialized()
    try {
      return await contract[methodName].estimateGas(...params)
    } catch (error) {
      logger.error("Error estimating gas:", error)
      throw error
    }
  }

  getContract(contractName) {
    if (!this.contracts[contractName]) {
      throw new Error(`Contract ${contractName} not initialized`)
    }
    return this.contracts[contractName]
  }
}

// Singleton instance
const blockchainService = new BlockchainService()

module.exports = blockchainService
