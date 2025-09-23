const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")

module.exports = buildModule("DeployAllModule", (m) => {
  // Deploy UserManagement first
  const { userManagement } = m.useModule(require("./UserManagementModule"))

  // Deploy other contracts that depend on UserManagement
  const { prescription } = m.useModule(require("./PrescriptionModule"))
  const { drugSupplyChain } = m.useModule(require("./DrugSupplyChainModule"))
  const { regulatorOversight } = m.useModule(require("./RegulatorOversightModule"))

  return {
    userManagement,
    prescription,
    drugSupplyChain,
    regulatorOversight,
  }
})
