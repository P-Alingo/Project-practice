// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./UserManagement.sol";

contract DrugSupplyChain {
    // Storage Variables
    uint public batchCounter;
    UserManagement public userManagement;
    
    struct Batch {
        uint id;
        string drugName;
        string ipfsHash;
        address manufacturer;
        address currentOwner;
        string status;
        uint256 timestamp;
    }
    
    mapping(uint => Batch) public batches;
    mapping(uint => address[]) public batchHistory; // Track ownership history
    
    // Events
    event BatchRegistered(uint batchId, address manufacturer);
    event BatchTransferred(uint batchId, address from, address to);
    
    // Modifiers
    modifier onlyManufacturer() {
        require(userManagement.isManufacturer(msg.sender), "Only manufacturers can perform this action");
        _;
    }

    modifier validBatch(uint batchId) {
        require(batchId > 0 && batchId <= batchCounter, "Invalid batch ID");
        _;
    }
    
    modifier onlyCurrentOwner(uint batchId) {
        require(batches[batchId].currentOwner == msg.sender, "Only current owner can transfer batch");
        _;
    }
    
    constructor(address _userManagementAddress) {
        userManagement = UserManagement(_userManagementAddress);
        batchCounter = 0;
    }
    
    // Functions
    function registerBatch(string memory drugName, string memory ipfsHash) public onlyManufacturer {
        require(bytes(drugName).length > 0, "Drug name cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        batchCounter++;
        
        batches[batchCounter] = Batch({
            id: batchCounter,
            drugName: drugName,
            ipfsHash: ipfsHash,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            status: "Manufactured",
            timestamp: block.timestamp
        });
        
        batchHistory[batchCounter].push(msg.sender);
        
        emit BatchRegistered(batchCounter, msg.sender);
    }
    
    function transferBatch(uint batchId, address newOwner) 
        public 
        validBatch(batchId) 
        onlyCurrentOwner(batchId) 
    {
        require(newOwner != address(0), "Invalid new owner address");
        require(newOwner != batches[batchId].currentOwner, "Cannot transfer to current owner");
        
        address previousOwner = batches[batchId].currentOwner;
        batches[batchId].currentOwner = newOwner;
        
        // Update status based on new owner role
        if (userManagement.isPharmacist(newOwner)) {
            batches[batchId].status = "At Pharmacy";
        } else {
            batches[batchId].status = "In Transit";
        }
        
        batchHistory[batchId].push(newOwner);
        
        emit BatchTransferred(batchId, previousOwner, newOwner);
    }
    
    function trackBatch(uint batchId) 
        public 
        view 
        validBatch(batchId) 
        returns (
            uint id,
            string memory drugName,
            string memory ipfsHash,
            address manufacturer,
            address currentOwner,
            string memory status,
            address[] memory history
        ) 
    {
        Batch memory batch = batches[batchId];
        return (
            batch.id,
            batch.drugName,
            batch.ipfsHash,
            batch.manufacturer,
            batch.currentOwner,
            batch.status,
            batchHistory[batchId]
        );
    }
    
    function getBatch(uint batchId) 
        public 
        view 
        validBatch(batchId) 
        returns (Batch memory) 
    {
        return batches[batchId];
    }
}
