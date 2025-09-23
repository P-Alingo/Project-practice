const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")

module.exports = buildModule("UserManagementModule", (m) => {
  const userManagement = m.contract("UserManagement")

  return { userManagement }
})
