# :airplane::droplet: Merkle Air Drop

Efficient token air drop using Merkle Tree.

### Introduction

When a new token is offered (ICO), the owner has the option to perform an air drop to distribute his token between wallets at random, in order to improve his visibility. It can issue two main problems: users with unwanted tokens and high cost. A possible solution is employing a **Merkle Tree**, which will solve the problems in the following way:

- There will be a pre defined _white list_ of address that will be able to redeem the new token.
- A **Merkle Root** will be build based on the pre defined _white list_.
- Only the **Merkle Root** will be stored in the contract so as to verify if the customer is in the _white list_.
- Since customers request tokens, they are the ones who pay the transaction fee.

### Token contract

A token has been implemented based on **ERC20** from Open Zeppelin to be used in the Air Drop contract. This token is instantiated with _name_, _symbol_ and _cap_, and the caller becomes the owner. This token also inherits from **ERC20Capped** contract, which is initialized with the parameter _cap_. Finally, `mint` function is implemented so as to only the contract owner is allowed to mint new tokens.

### AirDrop contract

The AirDrop contract is the core of this project. This contract is instantiated with _token address_, _Merkle Root_ and a _max redeem amount_, and the caller becomes the owner. A token must be issued before AirDrop deployment. The _Merkle Root_ must be precomputed so as to deploy the contract and prevent unwanted addresses in the white list.

Customers in the _white list_ may redeem at most the pre defined _max redeem amount_ submitting their _Merkle Proof_. The contract owner may update the _white list_, compute a new _Merkle Root_, update it in the contract and the history of users that already redeemed their tokens will not be changed. When the owner wishes to cancel or just shut down the air drop, all remaining tokens will be transfered to his account and the Air Drop contract will be destructed.

## :fuelpump: Gas Optimization

- Any variable is initialized in its declaration to reduce construction cost.
- The function `redeem` was defined as `external` to prevent the parameter `witnesses` from being copied to memory.
- Only **Merkle Root** was stored in the contract as a means of checking whitelisted customers and saving a great amount of storage.

## :closed_lock_with_key: Security

1. Token contract

    - Only contract owner can `mint` new tokens.
    - Employed **ERC20Capped** to limit the total supply. Total supply is defined in deployment.

2. Air Drop contract

    - To `redeem` tokens, customer must have to provide its Merkle Proof.
    - Customers can redeem only once and only a predefined _maximum redeem amount_ to prevent a customer from acquiring all tokens.
    - Only contract owner can update the **Merkle Root** and cancel the Air Drop.
    - Cancelling the Air Drop will initiate contract _self-destruction_ in order to prevent any future use.

3. General

    - No warnings or errors are issued in the contracts.
    - Contracts have **100%** of test coverage.

## :runner: How to run

Open your terminal in the folder you want to clone the project

```sh
# Clone this repo
git clone https://github.com/LorranSutter/MerkleAirDrop.git

# Go to the project folder
cd MerkleAirDrop

# Init truffle
truffle develop

# Run migrations
migrate
```

If you change your contracts, you will have to run migrations again. Just type the following command:

```sh
# Run migrations again
migrate --reset
```

### :syringe: Tests

To run the tests, execute the following command:

```sh
# Run tests
truffle test
```

To check tests coverage, execute the following command:

```sh
truffle run coverage
```

<div align="center">

<img src="https://res.cloudinary.com/lorransutter/image/upload/v1595886603/MerkleAirDropCoverage.png" height=400>

</div>

## :book: Resources

- [Merkle Air-Drops](https://blog.ricmoo.com/merkle-air-drops-e6406945584d)
- [Merkle Airdrop - Smartz](https://wiki.smartz.io/documentation/merkle-airdrop/)

## :computer: Technologies

- [Solidity](https://solidity.readthedocs.io/) - smart contract programming language
- [Truffle](https://www.trufflesuite.com/) - dApp environment
- [Truffle-assertions](https://www.npmjs.com/package/truffle-assertions) - additional assertions for truffle
- [Open Zeppelin Contracts](https://www.npmjs.com/package/@openzeppelin/contracts) - a library for secure smart contract development
- [Solium](https://www.npmjs.com/package/solium) - Solidity linter to analyse code for style & security issues
- [Solidity Coverage](https://www.npmjs.com/package/solidity-coverage) - code coverage for Solidity testing
- [Ethers.js](https://docs.ethers.io/) - interact with smart contracts
- [bn.js](https://www.npmjs.com/package/bn.js) - library to handle big numbers
- [ESlint](https://eslint.org/) - pluggable JS linter

## :cookie: Credits

- [Smart contract design patterns and best practices - Dhruvin Parikh](https://georgebrowncollege-toronto.github.io/Advanced-Smart-Contracts/notes/sc-patterns-best-practices/lecture/index.html#/)
- [Decentralized storage lessons - Doug Hoyte](https://github.com/hoytech/blockchain-storage)
