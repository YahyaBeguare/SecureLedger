require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const INFURA_RPC_URL = process.env.INFURA_RPC_URL ;
const SEPOLIA_PRIVATE_KEY= process.env.SEPOLIA_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ;
//const COINMARKETCAP_KEY= process.env.COINMARKETCAP_KEY ;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
  
    sepolia: {
      url: `${INFURA_RPC_URL}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111 ,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    }

  },
  etherscan: {
    apiKey:{  
    sepolia:  ETHERSCAN_API_KEY,
    }
  },
  paths: {
    artifacts: './src/artifacts',
  }
};
