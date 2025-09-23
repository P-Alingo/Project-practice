const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")

module.exports = buildModule("DrugSupplyChainModule", (m) => {
  const { userManagement } = m.useModule(require("./UserManagementModule"))

  const drugSupplyChain = m.contract("DrugSupplyChain", [userManagement])

  return { drugSupplyChain, userManagement }
})
