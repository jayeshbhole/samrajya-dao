// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./GovernanceToken.sol";

// Samrajya contract is the treasury of the Chess DAO and release funds to proposed addresses
contract Samrajya is Ownable {
    uint256 private value;
    ERC20 private _USDC;

    uint256 public _treasuryBalance = 0;
    GovernanceToken public _govToken;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);
    event Donated(uint256 _amount);

    constructor(address _USDCAddress, address _govTokenAddress) {
        _USDC = ERC20(_USDCAddress);
        _govToken = GovernanceToken(_govTokenAddress);
    }

    // Stores a new value in the contract
    function store(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

    function donate(uint256 _amount) public {
        _USDC.transferFrom(msg.sender, address(this), _amount);
        _govToken.transfer(msg.sender, _amount);
        emit Donated(_amount);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
