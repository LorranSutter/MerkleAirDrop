# MerkleAirDrop

Efficient token air drop using Merkle Tree

## :fuelpump: Gas Optimization

Inline only owner modifier to reduce number of lines.

## :closed_lock_with_key: Security

ERC20Capped to limit the total supply. Total supply is defined in deployment.

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

## :book: Resources

- [Merkle Air-Drops](https://blog.ricmoo.com/merkle-air-drops-e6406945584d)
- [Merkle Airdrop - Smartz](https://wiki.smartz.io/documentation/merkle-airdrop/)

## Technologies :computer:

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

- [Decentralized storage lessons - Doug Hoyte](https://github.com/hoytech/blockchain-storage)
