import '../styles/service.css';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ethers } from 'ethers'; // Ethers v6
import FileUpload from './FileUpload.jsx';
import contractArtifact from "../artifacts/contracts/SecureLedger.sol/SecureLedger.json";
import contractDetails from "./../address.json";

const VIEWS = {
  DEFAULT: 'DEFAULT',
  RESULT: 'RESULT',
  LANDING: 'LANDING',
};

const CONTRACT_ADDRESS = contractDetails["contractDetails"]["contractAddress"];   

function Service() {
  const [walletAddress, setWalletAddress] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [commit, setCommit] = useState('');
  const [resultMsg, setResultMsg] = useState('');
  const [previousCommit, setPreviousCommit] = useState('');
  const [currentCommit, setCurrentCommit] = useState('');
  const [modificationTime, setModificationTime] = useState('');
  const [currentView, setCurrentView] = useState(VIEWS.DEFAULT);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [contract, setContract] = useState(null);
  console.log("address:", CONTRACT_ADDRESS);
  // Initialize provider and contract
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum); // UPDATED
        const signer = await provider.getSigner(); // UPDATED
        setContract(new ethers.Contract(
          CONTRACT_ADDRESS,
          contractArtifact.abi,
          signer
        ));
      }
    };
    initWeb3();
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setWalletAddress(accounts[0] || '');
      });
    }
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    // Convert BigInt to number
    const timestampNumber = Number(timestamp);
    return format(new Date(timestampNumber * 1000), 'yyyy-MM-dd HH:mm:ss');
  };

  // Request account access
  async function requestAccount() {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  }

  // Update file hash
  async function updateFileHash() {
    if (!fileName || !fileContent || !commit) {
      alert('Missing required fields!');
      return;
    }

    setIsUpdating(true);
    try {
      const tx = await contract.updateFileHash(fileName, fileContent, commit);
      await tx.wait();
      alert('Update successful!');
    } catch (err) {
      console.error('Update failed:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  }

  // Verify data integrity
  async function verifyIntegrity() {
    setIsVerifying(true);
    try {
      const result = await contract.checkDataIntegrity(fileName, fileContent);
      setResultMsg(result[0]);
      setPreviousCommit(result[1].previous_commit);
      setCurrentCommit(result[1].current_commit);
      setModificationTime(formatTimestamp(result[1].timestamp));
      setCurrentView(VIEWS.RESULT);
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="SERVICE">
       {currentView === VIEWS.LANDING && (
        <header className="Service-header">
          <div className='Wallet'>
            <button 
              className='connect_Button' 
              onClick={requestAccount}
              disabled={!!walletAddress}
            >
              {walletAddress ? 'Connected' : 'Connect Wallet'}
            </button>
            {walletAddress && (
              <p className='wallet-address'>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            )}
          </div>
          
          <div className='landingContainer' >
            <button 
              className='Button' 
              onClick={() => setCurrentView(VIEWS.DEFAULT)}
              
            >
              UPDATE
            </button>
            <button
              className='Button'
              onClick={() => setCurrentView(VIEWS.DEFAULT)}
             
            >
              Verify
            </button>
          </div>
        </header>
      )}

      
      {currentView === VIEWS.DEFAULT && (
        <header className="Service-header">
          <div className='Wallet'>
            <button 
              className='connect_Button' 
              onClick={requestAccount}
              disabled={!!walletAddress}
            >
              {walletAddress ? 'Connected' : 'Connect Wallet'}
            </button>
            {walletAddress && (
              <p className='wallet-address'>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            )}
          </div>
          
          <div className='firstContainer'>
            <FileUpload 
              getContent={setFileContent} 
              getName={setFileName} 
              getCommit={setCommit} 
            />
            <button 
              className='Button' 
              onClick={updateFileHash}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'UPDATE'}
            </button>
            <button
              className='Button'
              onClick={verifyIntegrity}
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'VERIFY'}
            </button>
          </div>
        </header>
      )}

      {currentView === VIEWS.RESULT && (
        <div className='Container'>
          <button onClick={() => setCurrentView(VIEWS.DEFAULT)}>Back</button>
          <div className='Result'>
            <h3>Verification Result</h3>
            <p>{resultMsg}</p>
          </div>
          <div className='Commits'>
            <div className='Pc'>
              <h3>Previous Commit</h3>
              <p>{previousCommit || 'N/A'}</p>
            </div>
            <div className='Cc'>
              <h3>Current Commit</h3>
              <p>{currentCommit}</p>
            </div>
          </div>
          <div className='LTM'>
            <h3>Last Modified</h3>
            <p>{modificationTime}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Service;