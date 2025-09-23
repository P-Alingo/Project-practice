const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")

module.exports = buildModule("RegulatorOversightModule", (m) => {
  const { userManagement } = m.useModule(require("./UserManagementModule"))

  const regulatorOversight = m.contract("RegulatorOversight", [userManagement])

  return { regulatorOversight, userManagement }
})
