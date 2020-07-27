/* global artifacts contract before it assert web3 */

const BN = require('bn.js');
const truffleAssert = require('truffle-assertions');

const merkleTree = require('../scripts/merkleTree');
const Token = artifacts.require('Token');
const AirDrop = artifacts.require('AirDrop');

contract('Air Drop', (accounts) => {

	// Remove 2 last accounts from white list to use in tests
	const whiteList = accounts.slice(0, accounts.length - 2);

	const creator = accounts[0];
	const account01 = accounts[1];
	const account02 = accounts[2];
	const account03 = accounts[3];

	const accountToBeAdded = accounts[accounts.length - 2];
	const accountNotInTheWhiteList = accounts[accounts.length - 1];

	const maxRedeemAmount = (new BN(10)).pow(new BN(20));
	const merkleRoot = merkleTree.merkleRoot(whiteList);
	const account01Proof = merkleTree.merkleProof(whiteList, account01);
	const account02Proof = merkleTree.merkleProof(whiteList, account02);
	const account03Proof = merkleTree.merkleProof(whiteList, account03);

	let airDropAddress;
	let tokenContractInstance;
	let airDropContractInstance;

	before(async () => {
		tokenContractInstance = await Token.deployed();
		airDropContractInstance = await AirDrop.deployed();
		airDropAddress = airDropContractInstance.address;

		// Update Merkle Root from deployed contracts in order to test it afterwards
		await airDropContractInstance.updateMerkleRoot(merkleRoot, { from: creator });

		// Mint all tokens to Air Drop Contract
		const tokenCap = (new BN(10)).pow(new BN(42));
		await tokenContractInstance.mint(airDropAddress, tokenCap);
	});

	it('01 - customer should be able to redeem tokens', async () => {
		const amount = new BN(1000);
		const initialCustomerBalance = await tokenContractInstance.balanceOf(account01);
		const initialContractBalance = await tokenContractInstance.balanceOf(airDropAddress);

		const tx = await airDropContractInstance.redeem(
			account01Proof.path,
			account01Proof.witnesses,
			amount,
			{ from: account01 }
		);

		truffleAssert.eventEmitted(tx, 'Redeem', (obj) => {
			return (
				obj.account === account01 &&
				obj.amount.eq(amount)
			);
		});

		const newCustomerBalance = await tokenContractInstance.balanceOf(account01);
		const calculatedNewCustomerBalance = initialCustomerBalance.add(amount);

		assert.isOk(
			newCustomerBalance.eq(calculatedNewCustomerBalance),
			`New customer balance should be ${calculatedNewCustomerBalance}`
		);

		const newContractBalance = await tokenContractInstance.balanceOf(airDropAddress);
		const calculatedNewContractBalance = initialContractBalance.sub(amount);

		assert.isOk(
			newContractBalance.eq(calculatedNewContractBalance),
			`New Air Drop contract balance should be ${calculatedNewContractBalance}`
		);
	});

	it('02 - customer not in the white list should not be able to redeem tokens', async () => {
		const amount = new BN(1000);

		await truffleAssert.reverts(
			airDropContractInstance.redeem(
				account01Proof.path,
				account01Proof.witnesses,
				amount,
				{ from: accountNotInTheWhiteList }
			),
			'AirDrop: address not in the whitelist or wrong proof provided.'
		);
	});

	it('03 - customer should be able to redeem tokens only once', async () => {
		const amount = new BN(1000);

		await airDropContractInstance.redeem(
			account02Proof.path,
			account02Proof.witnesses,
			amount,
			{ from: account02 }
		);

		await truffleAssert.reverts(
			airDropContractInstance.redeem(
				account02Proof.path,
				account02Proof.witnesses,
				amount,
				{ from: account02 }
			),
			'AirDrop: already redeemed.'
		);
	});

	it('04 - customer can only redeem at most max redeem amount', async () => {
		const amount = maxRedeemAmount.mul(new BN(2));

		await truffleAssert.reverts(
			airDropContractInstance.redeem(
				account03Proof.path,
				account03Proof.witnesses,
				amount,
				{ from: account03 }
			),
			'AirDrop: amount must be less than max redeem amount.'
		);
	});

	it('05 - it should be able to update Merkle Root', async () => {
		const newWhiteList = [...whiteList, accountToBeAdded];
		const newMerkleRoot = merkleTree.merkleRoot(newWhiteList);

		await airDropContractInstance.updateMerkleRoot(newMerkleRoot, { from: creator });
		const updatedMerkleRoot = await airDropContractInstance.airDropWhiteListMerkleRoot.call();

		assert.equal(
			newMerkleRoot,
			updatedMerkleRoot,
			`New Merkle Root should be ${updatedMerkleRoot}`
		);
	});

	it('06 - only owner should be able to update Merkle Root', async () => {
		truffleAssert.reverts(
			airDropContractInstance.updateMerkleRoot(merkleRoot, { from: account01 }),
			'AirDrop: only owner can perform this transaction.'
		);
	});

	it('07 - should be able to cancel air drop', async () => {
		// Local deployment
		const newMerkleRoot = merkleTree.merkleRoot(accounts);
		const newCap = (new BN(10)).pow(new BN(42));
		const newMaxRedeemAmount = (new BN(10)).pow(new BN(20));
		const newToken = await Token.new('Token', 'TKN', newCap, { from: creator });
		const newAirDrop = await AirDrop.new(newToken.address, newMerkleRoot, newMaxRedeemAmount, { from: creator });

		const initialOwnerBalance = await newToken.balanceOf(creator);
		const contractBalance = await newToken.balanceOf(newAirDrop.address);

		await newAirDrop.cancelAirDrop({ from: creator });

		const newOwnerBalance = await newToken.balanceOf(creator);
		const calculatedNewOwnerBalance = initialOwnerBalance.add(contractBalance);

		assert.isOk(
			newOwnerBalance.eq(calculatedNewOwnerBalance),
			`Owner balance should be ${calculatedNewOwnerBalance}`
		);

		assert.equal(
			await web3.eth.getCode(newAirDrop.address),
			'0x',
			`Contract ${newAirDrop.address} should have been selfdestructed`);
	});

	it('08 - only contract creator should be able to cancel air drop', async () => {
		await truffleAssert.reverts(
			airDropContractInstance.cancelAirDrop({ from: account01 }),
			'AirDrop: only owner can perform this transaction.'
		);
	});

});