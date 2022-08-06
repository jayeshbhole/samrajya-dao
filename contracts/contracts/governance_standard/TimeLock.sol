// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "../GovernanceToken.sol";

contract TimeLock is TimelockController {
    // minDelay is how long you have to wait before executing
    // proposers is the list of addresses that can propose
    // executors is the list of addresses that can execute
    ERC20 private _USDC;

    uint256 public treasuryBalance = 0;
    GovernanceToken public _govToken;

    event ValueChanged(uint256 newValue);
    event Donated(uint256 _amount, address _owner);

    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address _USDCAddress
    ) TimelockController(minDelay, proposers, executors) {
        _USDC = ERC20(_USDCAddress);
    }

    function donate(uint256 _amount) public {
        _USDC.transferFrom(msg.sender, address(this), _amount);
        _govToken.mint(msg.sender, _amount);
        treasuryBalance += _amount;
        emit Donated(_amount, msg.sender);
    }

    function sponsor(address _receiver, uint256 _amount) public {
        // require receiver to be whitelisted

        _USDC.transfer(_receiver, _amount);
        treasuryBalance -= _amount;
    }
}
