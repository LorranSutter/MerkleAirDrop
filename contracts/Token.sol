// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Capped.sol";

/// @title Generic ERC20 token
/// @author Lorran Sutter
contract Token is ERC20Capped {
    address private owner;

    /// @param name Token name
    /// @param symbol Token symbol
    /// @param cap Define a limit for the total supply
    constructor(
        string memory name,
        string memory symbol,
        uint256 cap
    ) public ERC20(name, symbol) ERC20Capped(cap) {
        owner = msg.sender;
    }

    /// @notice Mint new tokens.
    /// @dev Only owner can perform this transaction.
    /// @param account Account to which tokens will be minted
    /// @param amount Amount of tokens to be minted
    function mint(address account, uint256 amount) public {
        require(msg.sender == owner, "Token: only owner can mint.");
        super._mint(account, amount);
    }
}
