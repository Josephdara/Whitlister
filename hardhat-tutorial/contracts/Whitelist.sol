//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Whitelist{
    uint8 public maxWhitelistAllowed;
    uint8 public addressesWhitelisted;

    mapping(address => bool) public whitelisted;
    constructor(uint8 _maxWhitelistAllowed){
        maxWhitelistAllowed = _maxWhitelistAllowed;
    }
    function whitelistAnAddress() public{
        require(!whitelisted[msg.sender], "Already Whitelisted");
        require(addressesWhitelisted < maxWhitelistAllowed, "Max Whitelist Reached");
        whitelisted[msg.sender] = true;
        addressesWhitelisted += 1;
    }

}