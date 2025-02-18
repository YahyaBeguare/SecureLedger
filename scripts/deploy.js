const hre = require("hardhat");
const fs= require("fs");


const addressFile= require("./../src/address.json");

  
let SecureLedger ;
let SecureLedgerProxy ;

async function deploy() {
  // Get the deployer's signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy the implementation contract (SecureLedger)
  try{
   SecureLedger = await hre.ethers.deployContract("SecureLedger");
  await SecureLedger.waitForDeployment();
  console.log("SecureLedger implementation deployed to:", SecureLedger.target);
  } catch(err){
    console.error("errror deploying SecureLedger implementation ontract, ", err);
  }

  console.log("deploying proxy..");
  try{
  // Prepare the initialization data.
  // Our initialize function takes an address as initialOwner.
  const initData = SecureLedger.interface.encodeFunctionData("initialize", [deployer.address]);

  // Deploy the proxy contract (SecureLedgerProxy) with the implementation address and init data.
  SecureLedgerProxy = await  hre.ethers.deployContract("SecureLedgerProxy",[SecureLedger.target, initData]);
  await SecureLedgerProxy.waitForDeployment();
  console.log("SecureLedger proxy deployed to:", SecureLedgerProxy.target);
}catch(err){
  console.error("errror deploying SecureLedger implementation ontract, ", err);
}
//  Set the the contract addresses to address.json 
  addressFile["contractDetails"]= {implementationAddress: SecureLedger.target, proxyAddress: SecureLedgerProxy.target, contractOwner: deployer.address } ;
  try{
    await fs.writeFileSync("src/address.json", JSON.stringify(addressFile, null, 2));
  } catch(err){
  console.error("error updating address file:", err);
}

  // (Optional) Attach the implementation's ABI to the proxy address so you can interact with it
  const proxyContract = await hre.ethers.getContractAt("SecureLedger",SecureLedgerProxy.target);
  const name = await proxyContract.name();
  console.log("Contract name:", name);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });




