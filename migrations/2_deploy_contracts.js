/* global artifacts */

const fs = require('fs');
const path = require('path');
const BN = require('bn.js');

const Token = artifacts.require('Token');
const AirDrop = artifacts.require('AirDrop');

const merkleTree = require('../scripts/merkleTree');

module.exports = async function (deployer, network, accounts) {

	// Join white list with available accounts
	const whiteList = getWhiteList(path.resolve('scripts', 'whiteList.txt'));
	const addresses = Array.from(new Set([...whiteList, ...accounts]));

	const merkleRoot = merkleTree.merkleRoot(addresses);
	const cap = (new BN(10)).pow(new BN(42));

	await deployer.deploy(Token, 'Token', 'TKN', cap, { from: accounts[0] });
	await deployer.deploy(AirDrop, Token.address, merkleRoot, { from: accounts[0] });
};

function getWhiteList(input) {
	const addresses = fs.readFileSync(input, 'utf-8')
		.split('\n')
		.map(a => a.replace(/#.*/, '').trim())
		.filter(a => a.length > 0);
	return addresses;
}