require("dotenv").config()

const contractConfig = {
  userManagement: {
    address: process.env.USER_MANAGEMENT_CONTRACT_ADDRESS,
    abi: [], // Will be populated with actual ABI after smart contract compilation
  },
  prescription: {
    address: process.env.PRESCRIPTION_CONTRACT_ADDRESS,
    abi: [], // Will be populated with actual ABI
  },
  supplyChain: {
    address: process.env.SUPPLY_CHAIN_CONTRACT_ADDRESS,
    abi: [], // Will be populated with actual ABI
  },
  regulator: {
    address: process.env.REGULATOR_CONTRACT_ADDRESS,
    abi: [], // Will be populated with actual ABI
  },
}

const networkConfig = {
  rpcUrl: process.env.ETHEREUM_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  network: process.env.NETWORK || "mainnet",
}

module.exports = {
  contractConfig,
  networkConfig,
}
