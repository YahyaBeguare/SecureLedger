// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {ethers} = require("hardhat");

async function main() {

  const [deployer]= await ethers.getSigners();
  console.log("Deploying contract with the account :", deployer.address);

  const SecureLedger = await ethers.deployContract("SecureLedger", [deployer.address]);

  await SecureLedger.waitForDeployment();
  console.log(" Simple Contract address : ", await SecureLedger.getAddress());
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
