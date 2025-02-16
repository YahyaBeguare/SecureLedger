const hre = require("hardhat");



async function main() {
  console.log("Deploying contract...");
  const [deployer]= await hre.ethers.getSigners();
  console.log("Deploying contract with the account :", deployer.address);

  const SecureLedger = await hre.ethers.deployContract("SecureLedger", [deployer.address]);

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
