require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const INFURA_RPC_URL = process.env.INFURA_RPC_URL ;
const SEPOLIA_PRIVATE_KEY= process.env.SEPOLIA_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ;
const GANACHE_ACCOUNT= process.env.GANACHE_PRIVATE_KEY ;
//const COINMARKETCAP_KEY= process.env.COINMARKETCAP_KEY ;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",

  networks: {
    
    hardhat: { },
    sepolia: {
      url: `${INFURA_RPC_URL}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111 ,
    },
    ganache:{
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [GANACHE_ACCOUNT]
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
