const BN = require('bn.js');

/* eslint-disable-next-line no-undef */
const Token = artifacts.require('Token');
/* eslint-disable-next-line no-undef */
const AirDrop = artifacts.require('AirDrop');

module.exports = async function (deployer, network, accounts) {
	const merkleRoot = null;

	await deployer.deploy(Token, 'Token', 'TKN', new BN(1e42), { from: accounts[0] });
	await deployer.deploy(AirDrop, merkleRoot, Token.address, { from: accounts[0] });
};