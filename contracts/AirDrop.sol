// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.7.0;

import "./Token.sol";

/// @title Contract to manage air drops efficiently
/// @author Lorran Sutter
contract AirDrop {
    address private owner;
    Token private token;
    bytes32 public airDropWhiteListMerkleRoot;
    mapping(address => bool) private redeemed;

    event Redeem(address indexed account, uint256 amount);

    /// @param _token Token to be air dropped
    /// @param _airDropWhiteListMerkleRoot Merkle root of the addresses white list.
    constructor(Token _token, bytes32 _airDropWhiteListMerkleRoot) public {
        owner = msg.sender;
        token = _token;
        airDropWhiteListMerkleRoot = _airDropWhiteListMerkleRoot;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "AirDrop: only owner can update Merkle Root."
        );
        _;
    }

    /// @notice Update merkle root
    /// @param _airDropWhiteListMerkleRoot Merkle root of the addresses white list.
    function updateMerkleRoot(bytes32 _airDropWhiteListMerkleRoot)
        public
        onlyOwner
    {
        airDropWhiteListMerkleRoot = _airDropWhiteListMerkleRoot;
    }

    // TODO Include assembly computation
    /// @notice Addresses can redeem their tokens.
    /// @param _path Proof path.
    /// @param _witnesses List of proof witnesses.
    /// @param _amount Amount of tokens wanted.
    function redeem(
        uint256 _path,
        bytes32[] memory _witnesses,
        uint256 _amount
    ) public {
        require(!redeemed[msg.sender], "AirDrop: already redeemed.");

        // Avoid no-assign-params
        uint256 path = _path;
        bytes32[] memory witnesses = _witnesses;

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
            "AirDrop: address not in the whitelist or wrong proof provided."
        );

        redeemed[msg.sender] = true;

        token.transfer(msg.sender, _amount);

        emit Redeem(msg.sender, _amount);
    }
}
