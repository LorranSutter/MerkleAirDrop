// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.7.0;

import "./Token.sol";

/// @title Contract to manage air drops efficiently
/// @author Lorran Sutter
contract AirDrop {
    Token token;
    bytes32 public airDropWhiteListMerkleRoot;
    mapping(address => bool) redeemed;

    /// @param _token Token to be air dropped
    /// @param _airDropWhiteListMerkleRoot Merkle root of the addresses white list.
    constructor(Token _token, bytes32 _airDropWhiteListMerkleRoot) public {
        token = _token;
        airDropWhiteListMerkleRoot = _airDropWhiteListMerkleRoot;
    }

    /// @notice Addresses can redeem their tokens.
    /// @param path Proof path.
    /// @param witnesses List of proof witnesses.
    /// @param amount Amount of tokens wanted.
    function redeem(
        uint256 path,
        bytes32[] memory witnesses,
        uint256 amount
    ) public {
        require(
            amount < token.totalSupply(),
            "Amount required must be less than total supply"
        );
        require(!redeemed[msg.sender], "Already redeemed");

        bytes32 node = keccak256(abi.encodePacked(uint8(0x00), msg.sender));
        for (uint16 i = 0; i < witnesses.length; i++) {
            if ((path & 0x01) == 1) {
                node = keccak256(
                    abi.encodePacked(uint8(0x01), witnesses[i], node)
                );
            } else {
                node = keccak256(
                    abi.encodePacked(uint8(0x01), node, witnesses[i])
                );
            }
            path /= 2;
        }

        require(
            node == airDropWhiteListMerkleRoot,
            "Address not in the whitelist"
        );

        redeemed[msg.sender] = true;

        // token.transfer(msg.sender, amount);
    }
}
