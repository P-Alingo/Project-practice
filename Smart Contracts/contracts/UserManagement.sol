// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UserManagement {
    // Storage Variables
    mapping(address => string) public roles;
    address public admin;
    
    // Events
    event UserRegistered(address user, string role);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        roles[admin] = "admin";
    }
    
    // Functions
    function registerUser(address user, string memory role) public onlyAdmin {
        require(bytes(role).length > 0, "Role cannot be empty");
        require(
            keccak256(bytes(role)) == keccak256(bytes("doctor")) ||
            keccak256(bytes(role)) == keccak256(bytes("pharmacist")) ||
            keccak256(bytes(role)) == keccak256(bytes("patient")) ||
            keccak256(bytes(role)) == keccak256(bytes("regulator")) ||
            keccak256(bytes(role)) == keccak256(bytes("manufacturer")),
            "Invalid role"
        );
        
        roles[user] = role;
        emit UserRegistered(user, role);
    }
    
    function getUserRole(address user) public view returns (string memory) {
        return roles[user];
    }
    
    function isDoctor(address user) public view returns (bool) {
        return keccak256(bytes(roles[user])) == keccak256(bytes("doctor"));
    }
    
    function isPharmacist(address user) public view returns (bool) {
        return keccak256(bytes(roles[user])) == keccak256(bytes("pharmacist"));
    }
    
    function isManufacturer(address user) public view returns (bool) {
        return keccak256(bytes(roles[user])) == keccak256(bytes("manufacturer"));
    }
    
    function isRegulator(address user) public view returns (bool) {
        return keccak256(bytes(roles[user])) == keccak256(bytes("regulator"));
    }
    
    function isPatient(address user) public view returns (bool) {
        return keccak256(bytes(roles[user])) == keccak256(bytes("patient"));
    }
}
