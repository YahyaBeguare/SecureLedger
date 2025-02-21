require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require('@openzeppelin/hardhat-upgrades');

const INFURA_RPC_URL = process.env.INFURA_RPC_URL;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",

  networks: {
    hardhat: {},
    sepolia: {
      url: `${INFURA_RPC_URL}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
    },
    
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: true
  },
  paths: {
    artifacts: "./src/artifacts",
  },
};
