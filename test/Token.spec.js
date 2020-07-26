/* global artifacts contract before it assert */

const BN = require('bn.js');
const truffleAssert = require('truffle-assertions');

const Token = artifacts.require('Token');

contract('Token', (accounts) => {
	const tokenName = 'Token';
	const tokenSymbol = 'TKN';
	const tokenCap = (new BN(10)).pow(new BN(42));
	const addressZero = '0x0000000000000000000000000000000000000000';
	const account01 = accounts[1];

	let tokenContractInstance;

	before(async () => {
		tokenContractInstance = await Token.deployed();
	});

	it('01 - token should have right name, symbol and cap', async () => {
		const name = await tokenContractInstance.name.call();
		const symbol = await tokenContractInstance.symbol.call();
		const cap = await tokenContractInstance.cap.call();

		assert.equal(name, tokenName, `Token name should be ${tokenName}`);
		assert.equal(symbol, tokenSymbol, `Token symbol should be ${tokenSymbol}`);
		assert.equal(cap, tokenCap.toString(), `Token cap should be ${tokenCap}`);
	});

	it('02 - token should be able to mint', async () => {
		const tx = await tokenContractInstance.mint(account01, tokenCap);

		truffleAssert.eventEmitted(tx, 'Transfer', (obj) => {
			return (
				obj.from === addressZero &&
				obj.to === account01 &&
				obj.value.eq(tokenCap)
			);
		});
	});

	it('03 - token should not be able to mint more than cap', async () => {
		const totalSupply = await tokenContractInstance.totalSupply.call();
		const cap = await tokenContractInstance.cap.call();

		const toMint = cap.sub(totalSupply).add(new BN(1));

		await truffleAssert.reverts(
			tokenContractInstance.mint(account01, toMint),
			'ERC20Capped: cap exceeded.'
		);
	});

	it('04 - only owner should be able to mint', async () => {
		await truffleAssert.reverts(
			tokenContractInstance.mint(account01, 1, { from: account01 }),
			'Token: only owner can mint.'
		);
	});
});