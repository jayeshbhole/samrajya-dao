// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// LAY is an ERC20 stable coin for demonstration purposes of this project.
// LAY can be burned and minted by liquidators and borrowers.

contract USDC is ERC20, Ownable {
    constructor() ERC20("LAYs", "LAY") {
        _mint(msg.sender, 1000000000 * 10**decimals());
    }

    // 6 decimals
    function decimals() public pure override returns (uint8) {
        return 8;
    }
}
