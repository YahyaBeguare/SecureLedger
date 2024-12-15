# Deploying the smart contract to test all functionalities of this project 
first copy the smart contract from SecureLedger.sol in Smart_contract folder and deploy it on Remix , then copy the smart contract Adress and paste it in the line 103 of the component Service.jsx which contains the smart contract address .

# Hardhat configuration
Configure the testnet network, you're willing to work with, in the .env file (check .env.example ) and set 
1. The provider url (from INFURA or ALCHEMY...) .
2. Set the account private key .

Ps: Or you could use the local hardhat network

1. Start the hardhat node in a separate terminal

```
npx hardhat node
```
# Getting Started with React App


1. Navigate to the root directory 

```
cd data-integrity-project
```

2. Start the FrontEnd server 

```
npm start`

```





