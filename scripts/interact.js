const hre = require("hardhat");

const proxyAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 
const abi=  require("../src/artifacts/contracts/SecureLedger.sol/SecureLedger.json").abi;
async function main(){
    const [, ,signer] = await hre.ethers.getSigners();
    console.log("Signer Address:", signer.address);

    // Attach the signer to the contract
    const proxyContract = new hre.ethers.Contract(proxyAddress, abi, signer);
    // const proxyContract = new hre.ethers.getContractAt("SecureLedger",proxyAddress);
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
