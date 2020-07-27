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
    uint256 maxRedeemAmount;

    event Redeem(address indexed account, uint256 amount);

    /// @param _token Token to be air dropped
    /// @param _airDropWhiteListMerkleRoot Merkle root of the addresses white list.
    constructor(Token _token, bytes32 _airDropWhiteListMerkleRoot, uint256 _maxRedeemAmount) public {
        owner = msg.sender;
        token = _token;
        airDropWhiteListMerkleRoot = _airDropWhiteListMerkleRoot;
        maxRedeemAmount = _maxRedeemAmount;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "AirDrop: only owner can perform this transaction."
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

    /// @notice Addresses can redeem their tokens.
    /// @param _path Proof path.
    /// @param _witnesses List of proof witnesses.
    /// @param _amount Amount of tokens wanted.
    function redeem(
        uint256 _path,
        bytes32[] memory _witnesses,
        uint256 _amount
    ) public {
        require(_amount <= maxRedeemAmount, "AirDrop: amount must be less than max redeem amount.");
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

    /// @notice It cancels the Air Drop availability.
    /// @dev Only owner can perform this transaction. It selfdestructs the contract.
    function cancelAirDrop() public onlyOwner {
        uint256 contractBalance = token.balanceOf(address(this));
        token.transfer(owner, contractBalance);
        selfdestruct(address(0));
    }
}
