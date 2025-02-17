const hre = require("hardhat");

async function main(){
const proxyAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 
const proxyContract = await hre.ethers.getContractAt("SecureLedger", proxyAddress);
console.log("Contract name:", await proxyContract.name());

}
main()
.then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

