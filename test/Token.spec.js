/* global artifacts contract before describe it assert */

const BN = require("bn.js");

// const BN = require('bn.js');
// const truffleAssert = require('truffle-assertions');

const Token = artifacts.require('Token');

contract('Token', (accounts) => {
	const tokenName = 'Token';
	const tokenSymbol = 'TKN';
	const tokenCap = (new BN(10)).pow(new BN(42));
	const addressZero = '0x0000000000000000000000000000000000000000';
	const creator = accounts[0];
	const userMinting = accounts[1];
	const userTransfer01 = accounts[2];
	const userTransfer02 = accounts[3];

	let tokenContractInstance;

	before(async () => {
		tokenContractInstance = await Token.deployed();
	});

	describe('A - Minting', () => {

		it('A.01 - token should have right name, symbol and cap', async () => {
			const name = await tokenContractInstance.name.call();
			const symbol = await tokenContractInstance.symbol.call();
			const cap = await tokenContractInstance.cap.call();

			assert.equal(name, tokenName, `Token name should be ${tokenName}`);
			assert.equal(symbol, tokenSymbol, `Token symbol should be ${tokenSymbol}`);
			assert.equal(cap, tokenCap.toString(), `Token cap should be ${tokenCap}`);
		});

		// it('A.02 - creator should be able to mint new tokens', async () => {
		// 	const amount = 42;

		// 	const tx = await tokenContractInstance.mint(userMinting, amount, { from: creator });
		// 	const userMintingBalance = await tokenContractInstance.balanceOf(userMinting);
		// 	const totalSupply = await tokenContractInstance.totalSupply.call();

		// 	truffleAssert.eventEmitted(tx, 'Transfer', (obj) => {
		// 		return (
		// 			obj.from == addressZero &&
		// 			obj.to === userMinting &&
		// 			obj.value == amount
		// 		);
		// 	}, `Fail to transfer ${amount} to ${userMinting} during minting`);

		// 	assert.equal(new BN(userMintingBalance), amount, `Balance of ${userMinting} must be ${amount}`);
		// 	assert.equal(new BN(totalSupply), amount, `Total supply must be ${amount}`);
		// });

	});

	// describe('B - Transfer', () => {

	// 	it('B.01 - should not be able make a transfer before startTime', async () => {
	// 		const startTime = parseInt(+(new Date()) / 1000) + 100;
	// 		const endTime = startTime + 1000;
	// 		const tokenContractInstanceTransfer = await Token.new('UIToken', 'UIT', 18, startTime, endTime, { from: creator });

	// 		const amount = 42;

	// 		await truffleAssert.reverts(
	// 			tokenContractInstanceTransfer.transfer(userTransfer02, amount, { from: userTransfer01 }),
	// 			'Token: it is not possible transfer tokens before startTime.'
	// 		);
	// 	});

	// 	it('B.02 - should not be able make a transfer after endTime', async () => {
	// 		const startTime = parseInt(+(new Date()) / 1000) - 100;
	// 		const endTime = startTime - 10;
	// 		const tokenContractInstanceTransfer = await Token.new('UIToken', 'UIT', 18, startTime, endTime, { from: creator });

	// 		const amount = 42;

	// 		await truffleAssert.reverts(
	// 			tokenContractInstanceTransfer.transfer(userTransfer02, amount, { from: userTransfer01 }),
	// 			'Token: it is not possible transfer tokens after endTime.'
	// 		);
	// 	});

	// 	it('B.03 - should not be able make a transfer without enough balance', async () => {
	// 		const amount = 42;

	// 		await truffleAssert.reverts(
	// 			tokenContractInstance.transfer(userTransfer02, amount, { from: userTransfer01 }),
	// 			'ERC20: transfer amount exceeds balance.'
	// 		);
	// 	});

	// 	it('B.04 - should be able make a transfer', async () => {
	// 		const amount = 42;
	// 		await tokenContractInstance.mint(userTransfer01, amount, { from: creator });
	// 		const tx = await tokenContractInstance.transfer(userTransfer02, amount, { from: userTransfer01 });

	// 		truffleAssert.eventEmitted(tx, 'Transfer', (obj) => {
	// 			return (
	// 				obj.from == userTransfer01 &&
	// 				obj.to === userTransfer02 &&
	// 				obj.value == amount
	// 			);
	// 		}, `Fail to transfer ${amount} from ${userTransfer01} to ${userTransfer02}`);

	// 		const userTransfer01Balance = await tokenContractInstance.balanceOf(userTransfer01);
	// 		const userTransfer02Balance = await tokenContractInstance.balanceOf(userTransfer02);

	// 		assert.equal(new BN(userTransfer01Balance), 0, `Balance of ${userTransfer01} must be 0`);
	// 		assert.equal(new BN(userTransfer02Balance), amount, `Balance of ${userTransfer02} must be ${amount}`);
	// 	});

	// });

});