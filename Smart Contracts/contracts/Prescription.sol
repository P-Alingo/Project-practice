// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./UserManagement.sol";

contract Prescription {
    // Storage Variables
    uint public prescriptionCounter;
    UserManagement public userManagement;
    
    struct PrescriptionData {
        uint id;
        address doctor;
        address patient;
        string drugDetails;
        string ipfsHash;
        bool verified;
        uint256 timestamp;
    }
    
    mapping(uint => PrescriptionData) public prescriptions;
    
    // Events
    event PrescriptionCreated(uint id, address doctor, address patient);
    event PrescriptionVerified(uint id, address pharmacist);
    
    // Modifiers
    modifier onlyDoctor() {
        require(userManagement.isDoctor(msg.sender), "Only doctors can perform this action");
        _;
    }
    
    modifier onlyPharmacist() {
        require(userManagement.isPharmacist(msg.sender), "Only pharmacists can perform this action");
        _;
    }
    
    constructor(address _userManagementAddress) {
        userManagement = UserManagement(_userManagementAddress);
        prescriptionCounter = 0;
    }
    
    // Functions
    function createPrescription(
        address patient, 
        string memory drugDetails, 
        string memory ipfsHash
    ) public onlyDoctor {
        require(patient != address(0), "Invalid patient address");
        require(bytes(drugDetails).length > 0, "Drug details cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        prescriptionCounter++;
        
        prescriptions[prescriptionCounter] = PrescriptionData({
            id: prescriptionCounter,
            doctor: msg.sender,
            patient: patient,
            drugDetails: drugDetails,
            ipfsHash: ipfsHash,
            verified: false,
            timestamp: block.timestamp
        });
        
        emit PrescriptionCreated(prescriptionCounter, msg.sender, patient);
    }
    
    function verifyPrescription(uint prescriptionId) public onlyPharmacist {
        require(prescriptionId > 0 && prescriptionId <= prescriptionCounter, "Invalid prescription ID");
        require(!prescriptions[prescriptionId].verified, "Prescription already verified");
        
        prescriptions[prescriptionId].verified = true;
        emit PrescriptionVerified(prescriptionId, msg.sender);
    }
    
    function getPrescription(uint prescriptionId) public view returns (
        uint id,
        address doctor,
        address patient,
        string memory drugDetails,
        string memory ipfsHash,
        bool verified,
        uint256 timestamp
    ) {
        require(prescriptionId > 0 && prescriptionId <= prescriptionCounter, "Invalid prescription ID");
        
        PrescriptionData memory prescription = prescriptions[prescriptionId];
        return (
            prescription.id,
            prescription.doctor,
            prescription.patient,
            prescription.drugDetails,
            prescription.ipfsHash,
            prescription.verified,
            prescription.timestamp
        );
    }
}
