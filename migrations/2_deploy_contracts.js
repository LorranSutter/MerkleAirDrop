/* global artifacts */

const BN = require('bn.js');

const Token = artifacts.require('Token');
const AirDrop = artifacts.require('AirDrop');

const merkleTree = require('../scripts/merkleTree');

module.exports = async function (deployer, network, accounts) {

	const merkleRoot = merkleTree.merkleRoot(accounts);
	const cap = (new BN(10)).pow(new BN(42));
	const maxRedeemAmount = (new BN(10)).pow(new BN(20));

	await deployer.deploy(Token, 'Token', 'TKN', cap, { from: accounts[0] });
	await deployer.deploy(AirDrop, Token.address, merkleRoot, maxRedeemAmount, { from: accounts[0] });
};