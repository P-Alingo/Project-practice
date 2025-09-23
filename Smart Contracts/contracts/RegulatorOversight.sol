// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./UserManagement.sol";

contract RegulatorOversight {
    // Storage Variables
    UserManagement public userManagement;
    
    struct FlaggedBatch {
        uint batchId;
        string reason;
        address regulator;
        uint256 timestamp;
        bool resolved;
    }
    
    mapping(uint => FlaggedBatch) public flaggedBatches;
    uint[] public flaggedBatchIds;
    uint public flaggedBatchCounter;
    
    // Events
    event BatchFlagged(uint batchId, address regulator, string reason);
    event BatchUnflagged(uint batchId, address regulator);
    
    // Modifiers
    modifier onlyRegulator() {
        require(userManagement.isRegulator(msg.sender), "Only regulators can perform this action");
        _;
    }
    
    constructor(address _userManagementAddress) {
        userManagement = UserManagement(_userManagementAddress);
        flaggedBatchCounter = 0;
    }
    
    // Functions
    function flagBatch(uint batchId, string memory reason) public onlyRegulator {
        require(batchId > 0, "Invalid batch ID");
        require(bytes(reason).length > 0, "Reason cannot be empty");
        require(flaggedBatches[batchId].batchId == 0, "Batch already flagged");
        
        flaggedBatches[batchId] = FlaggedBatch({
            batchId: batchId,
            reason: reason,
            regulator: msg.sender,
            timestamp: block.timestamp,
            resolved: false
        });
        
        flaggedBatchIds.push(batchId);
        flaggedBatchCounter++;
        
        emit BatchFlagged(batchId, msg.sender, reason);
    }
    
    function unflagBatch(uint batchId) public onlyRegulator {
        require(flaggedBatches[batchId].batchId != 0, "Batch not flagged");
        require(!flaggedBatches[batchId].resolved, "Batch already resolved");
        
        flaggedBatches[batchId].resolved = true;
        
        emit BatchUnflagged(batchId, msg.sender);
    }
    
    function getFlaggedBatch(uint batchId) public view returns (
        uint id,
        string memory reason,
        address regulator,
        uint256 timestamp,
        bool resolved
    ) {
        require(flaggedBatches[batchId].batchId != 0, "Batch not flagged");
        
        FlaggedBatch memory flagged = flaggedBatches[batchId];
        return (
            flagged.batchId,
            flagged.reason,
            flagged.regulator,
            flagged.timestamp,
            flagged.resolved
        );
    }
    
    function auditLogs() public view returns (uint[] memory) {
        return flaggedBatchIds;
    }
    
    function getAllFlaggedBatches() public view returns (FlaggedBatch[] memory) {
        FlaggedBatch[] memory allFlagged = new FlaggedBatch[](flaggedBatchIds.length);
        
        for (uint i = 0; i < flaggedBatchIds.length; i++) {
            allFlagged[i] = flaggedBatches[flaggedBatchIds[i]];
        }
        
        return allFlagged;
    }
    
    function isBatchFlagged(uint batchId) public view returns (bool) {
        return flaggedBatches[batchId].batchId != 0 && !flaggedBatches[batchId].resolved;
    }
}
