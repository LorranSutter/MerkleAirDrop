// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Generic ERC20 token
/// @author Lorran Sutter
contract Token is ERC20 {

    /// @author Lorran Sutter
    /// @param name Token name
    /// @param symbol Token symbol
    /// @param totalSupply Initiate fixed total supply
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) public ERC20(name, symbol) {
        super._totalSupply = totalSupply;
    }
}
