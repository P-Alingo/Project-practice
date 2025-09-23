const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")

module.exports = buildModule("PrescriptionModule", (m) => {
  const { userManagement } = m.useModule(require("./UserManagementModule"))

  const prescription = m.contract("Prescription", [userManagement])

  return { prescription, userManagement }
})
