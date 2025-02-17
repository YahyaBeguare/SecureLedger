const hre = require("hardhat");
const fs= require("fs");


const addressFile= require("./../src/address.json");
async function main() {
  console.log("Deploying contract...");
  const [deployer]= await hre.ethers.getSigners();
  console.log("Deploying contract with the account :", deployer.address);

  const SecureLedger = await hre.ethers.deployContract("SecureLedger", [deployer.address]);

  await SecureLedger.waitForDeployment();
  console.log(" Simple Contract address : ", await SecureLedger.target);
  addressFile["contractDetails"]= {contractAddress: SecureLedger.target, contractOwner: deployer.address } ;
  try{
    await fs.writeFileSync("src/address.json", JSON.stringify(addressFile, null, 2));
  } catch(err){
  console.error("error updating address file:", err);
}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
