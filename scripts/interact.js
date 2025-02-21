const hre = require("hardhat");

const proxyAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 
const abi=  [
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "FileHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "Hash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "previous_commit",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "current_commit",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_url",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_newContent",
        "type": "string"
      }
    ],
    "name": "checkDataIntegrity",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "Hash",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "previous_commit",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "current_commit",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct SecureLedger.Details",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initialOwner",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_url",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_content",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_commit",
        "type": "string"
      }
    ],
    "name": "updateFileHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function main(){
    const [signer] = await hre.ethers.getSigners();
    console.log("Signer Address:", signer.address);

    // Attach the signer to the contract
    const proxyContract = new hre.ethers.Contract(proxyAddress, abi, signer);
    console.log("Proxy contract functions:", Object.keys(proxyContract.functions));


    // // Call the function with actual values
    // await proxyContract.updateFileHash("https://example.com/file", "file content", "commitHash123");

    // let [msg, details] = await proxyContract.checkDataIntegrity("https://example.com/file", "new file content");

    // console.log("Verification Message:", msg);
    // console.log("Verification Details:", details);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
