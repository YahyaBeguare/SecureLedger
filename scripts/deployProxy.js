const {ethers, upgrades} = require("hardhat");
const fs= require("fs");


const addressFile= require("./../src/address.json");

  
let SecureLedger ;
let SecureLedgerProxy ;

async function deploy() {
  // Get the deployer's signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy the implementation contract (SecureLedger)
  try{
   SecureLedger = await ethers.getContractFactory("SecureLedger");
  SecureLedgerProxy=  await upgrades.deployProxy(SecureLedger, [deployer.address]);
  await SecureLedgerProxy.waitForDeployment();

  console.log("SecureLedger proxy deployed to:", SecureLedgerProxy.target);

  } catch(err){
    console.error("errror deploying SecureLedger proxy ontract, ", err);
  }

 
//  Set the the contract addresses to address.json 
  addressFile["contractDetails"]= { proxyAddress: SecureLedgerProxy.target, contractOwner: deployer.address } ;
  try{
    await fs.writeFileSync("src/address.json", JSON.stringify(addressFile, null, 2));
  } catch(err){
  console.error("error updating address file:", err);
}


}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });




