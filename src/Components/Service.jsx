import '../styles/service.css';
import { useState} from 'react';
import FileUpload from './FileUpload';

//import CardBody from 'react-bootstrap/esm/CardBody';
//import {ethers, providers} from 'ethers'; 
const {ethers}= require("ethers");

function Service() {

  const [walletAddress, setWalletAddress]= useState(null);
  const [accounts, setAccounts]= useState('');
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [commit, setCommit]= useState('');
  const [resultMsg, setResultMsg]= useState('the result');
  const [previousCommit, setPreviousCommit]= useState('');
  const [currentCommit, setCurrentCommit]= useState('');
  const [time , setTime]= useState('');
  const [content,setContent]=useState(1);
  
  
 
  
  



  const timestampToDate = (timestamp) => {
    // Check if timestamp is defined before using toNumber()
    const timestampNumber = timestamp //!== null ? timestamp.toNumber() : null;
 
    //if (timestampNumber !== null) {
     // Convert Unix timestamp to milliseconds
     const milliseconds = timestampNumber * 1000;
   
     // Create a new Date object
     const date = new Date(milliseconds);
   
     // Get individual components of the date
     const year = date.getFullYear();
     const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
     const day = ('0' + date.getDate()).slice(-2);
     const hours = ('0' + date.getHours()).slice(-2);
     const minutes = ('0' + date.getMinutes()).slice(-2);
     const seconds = ('0' + date.getSeconds()).slice(-2);
   
     // Construct a formatted date string
     const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
     console.log("the time is :", formattedDate);
   
     setTime(formattedDate);/* } else {
       console.error('Timestamp is undefined or null.');
     } */
   }


  const getFileContent=(fileContent)=>{

    setFileContent(fileContent);
  
  }


  const getFileName=(fileName)=>{

    setFileName(fileName);
  }
  const getUpdatedCommit=(commit)=>{
    setCommit(commit);
  }

  

  async function requestAccount(){
    //check the existence of metamask
    if(window.ethereum){
      console.log("MetaMask detected !");
    } else {
      alert("MestaMask isn't detected !! , please install mehtaMask Extention First");

    }

    try{
      const accounts= await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("the Accs:", accounts);
      setWalletAddress(accounts[0]);
      alert(`this account : ${accounts[0]}  is connected`);

    } catch(err){
      console.error(err);
    }
  }

  async function connectWallet(){
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress= "0x1A5502fb65c29fAA0bb427214007e9F2bEC722b6" ;
      const ABI= [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
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
              "internalType": "struct VerifyDataIntegrity.Details",
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
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];

      const contract= new ethers.Contract(contractAddress,ABI,signer);
      return contract ;
     

    } catch(err){
      console.error(err);
    }
    }
    
  }

  async function updateFileHash(){
    try{
      const contract = await connectWallet();
    if (contract) {
      const name = await contract.name();
      console.log("Contract name is:", name);

      const updateFH = await contract.updateFileHash(fileName,fileContent, commit);
        await updateFH.wait(); // Wait for the transaction to be mined
        alert(" the Data updated successfully ");
        

    }} catch(err){
      console.error("the connection to contract error:",err);
      alert("your address doesen't have access to update the Data !!");
    }
  }

  async function verifyIntegrity(){
    try{
      const contract = await connectWallet();
    if (contract) {
      
      const verifyIntegrity = await contract.checkDataIntegrity(fileName, fileContent);
      console.log("the content to verify integrity is :",fileContent, "and url is :", fileName );
      //await verifyIntegrity.wait()
      setResultMsg(verifyIntegrity[0]);
      setPreviousCommit(verifyIntegrity[1].previous_commit) ;  
      setCurrentCommit(verifyIntegrity[1].current_commit);
      let timeStamp = verifyIntegrity[1].timestamp;
      timestampToDate(timeStamp);
     setContent(2);
      console.log("Data Integrity Result:", verifyIntegrity, "  the MSG : ", resultMsg, "the commits :", previousCommit ,"==>", currentCommit, "   timestamp is   :  ",time);

    }} catch(err){
      console.error("the connection to contract error:",err);
    }
  }

  let infos = {
    previous_commit: previousCommit ,
   current_commit : currentCommit ,
   modificationTime : time }
  console.log("informations are :", infos);

    
    return (
    <div className="SERVICE">
      {
      content===1  &&
      <header className="Service-header">
        
          <div className='Wallet'>
          <button className='connect_Button' onClick={requestAccount}>Connect</button>
          <h3 className='t1'>{walletAddress}</h3>
          </div>
        <div className='firstContainer'>
          
          <FileUpload getContent= {getFileContent} getName= {getFileName} getCommit={getUpdatedCommit} />
          <button className='Button' onClick={updateFileHash}>UPDATE </button>
          <button className='Button' onClick={verifyIntegrity}> VERIFY </button>
          
        </div>
      </header>
      } 
      {content===2  &&
      <div className='Container'>
      <aside>
        <div>
              <div className='mainContainer'>
                  <div className='Result'>
                    <h3>State</h3>
                    <p>
                      {resultMsg}
                    </p>
                  </div>
                  <div className='Commits'>
                    
                    <div className='Pc'>
                      
                      <h3> Previous Commit </h3>
                      <p>
                        {infos.previous_commit}
                      </p>
                      
                    </div>

                    <div className='Cc'>
                    <h3>Current Commit</h3>
                      <p>
                        {infos.current_commit}
                      </p>
                    </div>
                  </div>
                  
                  <div className='LTM'>
                    <h3>Time of last modification </h3>
                    <p>
                      {infos.modificationTime}
                    </p>
                    
                  </div>
            </div>
        </div>
        
      </aside>
      

      </div>
      }
      <footer>
        
      </footer>
    </div>
  );
}

export default Service;
