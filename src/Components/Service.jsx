import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { format } from 'date-fns';
import contractArtifact from "../artifacts/contracts/SecureLedger.sol/SecureLedger.json";
import contractDetails from "../address.json";
import '../styles/service.css';

const CONTRACT_ADDRESS = contractDetails["contractDetails"]["proxyAddress"];

const VIEWS = {
  LANDING: 'LANDING',
  UPLOAD: 'UPLOAD',
  UPDATE: 'UPDATE',
  VERIFY: 'VERIFY',
};

// Helper to extract revert reason from an error object
const extractErrorReason = (error) => {
  return error?.reason || error?.error?.reason || error.message || "An error occurred";
};

export default function Service() {
  // ---------- GLOBAL STATES ----------
  const [currentView, setCurrentView] = useState(VIEWS.LANDING);
  const [walletAddress, setWalletAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // ---------- FORM FIELDS ----------
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [commit, setCommit] = useState('');
  const [authorAddress, setAuthorAddress] = useState('');

  // ---------- MESSAGES & RESULTS ----------
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resultMsg, setResultMsg] = useState('');
  const [previousCommit, setPreviousCommit] = useState('');
  const [currentCommit, setCurrentCommit] = useState('');
  const [modificationTime, setModificationTime] = useState('');

  // ---------- HISTORY ----------
  const [historyData, setHistoryData] = useState([]);
  const [commitsHistory, setCommitsHistory] = useState([]);
  const [timestampsHistory, setTimestampsHistory] = useState([]);

  // ---------- INITIALIZE CONTRACT WHEN WALLET IS CONNECTED ----------
  useEffect(() => {
    const initContract = async () => {
      if (walletAddress && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            contractArtifact.abi,
            signer
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Contract connection error:", error);
          setErrorMessage("Contract connection error: " + error.message);
        }
      }
    };
    initContract();
  }, [walletAddress]);

  // ---------- CONNECT WALLET ----------
  const requestAccount = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    if (isConnecting) return; // prevent multiple calls
    setIsConnecting(true);

    // Set a timeout to reset the flag if the request hangs
    const connectionTimeout = setTimeout(() => {
      console.warn("Connection request timed out. Resetting isConnecting flag.");
      setIsConnecting(false);
    }, 10000); // 10 seconds timeout

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      clearTimeout(connectionTimeout);
      setWalletAddress(accounts[0]);
    } catch (error) {
      clearTimeout(connectionTimeout);
      console.error("Account request error:", error);
      setErrorMessage("Account request error: " + error.message);
    }
    setIsConnecting(false);
  };

  // ---------- DISCONNECT WALLET ----------
  const disconnectWallet = () => {
    setWalletAddress('');
    setContract(null);
  };

  // ---------- FORMAT WALLET ADDRESS ----------
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0,6)}...${address.slice(-4)}`;
  };

  // ---------- TIMESTAMP FORMATTER ----------
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const ts = Number(timestamp);
    return format(new Date(ts * 1000), 'yyyy-MM-dd HH:mm:ss');
  };

  // ---------- RESET FORM STATE ----------
  const resetForm = () => {
    setFileName('');
    setFileContent('');
    setCommit('');
    setAuthorAddress('');
    setResultMsg('');
    setPreviousCommit('');
    setCurrentCommit('');
    setModificationTime('');
    setHistoryData([]);
    setCommitsHistory([]);
    setTimestampsHistory([]);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // ---------- FILE SELECTION HANDLER ----------
  const handleFileSelect = async (event) => {
    setErrorMessage('');
    setSuccessMessage('');
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("File reading error:", error);
      setErrorMessage("File reading error: " + error.message);
    }
  };

  // ========== UPLOAD FUNCTIONALITY ==========
  const handleUpload = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!contract) {
      setErrorMessage("No contract found. Please connect your wallet first!");
      return;
    }
    if (!fileName || !fileContent || !commit) {
      setErrorMessage("All fields are required for upload!");
      return;
    }
    try {
      const tx = await contract.uploadData(fileName, fileContent, commit);
      const receipt = await tx.wait();
      let foundEvent = false;
      if (receipt.logs) {
        // receipt.log.forEach((event) => {
        for(const log of receipt.logs) {
          try {
            const parsed = contract.interface.parseLog(log);
            if (parsed.name === "DataUploaded") {
              const  _AuthorAddress  = parsed.args._AuthorAddress;
              const dataName  = parsed.args.dataName.toString();
              console.log(`File "${dataName}" has been uploaded successfully by ${_AuthorAddress}.`);
              setSuccessMessage(`File "${dataName}" has been uploaded successfully by ${_AuthorAddress}.`);
              foundEvent = true;
              break;
            }
          } catch (e) {
            // ignore non-matching events
          }
        };
      }
      if (!foundEvent) {
        setSuccessMessage("Upload transaction completed but no event was found.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(extractErrorReason(error));
    }
  };

  // ========== UPDATE FUNCTIONALITY ==========
  const handleUpdate = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!contract) {
      setErrorMessage("No contract found. Please connect your wallet first!");
      return;
    }
    if (!fileName || !fileContent || !commit) {
      setErrorMessage("All fields are required for update!");
      return;
    }
    try {
      const tx = await contract.updateData(fileName, fileContent, commit);
      const receipt = await tx.wait();
    console.log("Transaction receipt:", receipt);

    let foundEvent = false;

    if (receipt.logs) {
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          
          if (parsed?.name === "DataUpdated") {
            // Destructure with proper type handling
            const _AuthorAddress = parsed.args._AuthorAddress;
            const dataName = parsed.args.dataName.toString(); 
            const eventCommit = parsed.args.commit.toString();
            
            console.log(
              `File "${dataName}" updated successfully by ${_AuthorAddress} with commit "${eventCommit}"`
            );
            
            setSuccessMessage(
              `File "${dataName}" updated successfully by ${_AuthorAddress.slice(0, 6)}...${_AuthorAddress.slice(-4)} with commit "${eventCommit}".`
            );
            
            foundEvent = true;
            break; // Exit loop after finding our event
          }
        } catch (e) {
          console.debug("Skipping non-matching log:", e.message);
        }
      }
    }

    if (!foundEvent) {
      console.warn("Transaction completed but no DataUpdated event found");
      setSuccessMessage(
        "Update transaction completed but couldn't verify details (missing event). " +
        `Transaction hash: ${receipt.hash}`
      );
    }
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(extractErrorReason(error));
    }
  };

  // ---------- HISTORY ----------
  const handleHistory = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!contract) {
      setErrorMessage("No contract found. Please connect your wallet first!");
      return;
    }
    try {
      const history = await contract.getHistory();
      setHistoryData(history);
      if (history.length === 0) {
        setSuccessMessage("No upload history found.");
      }
    } catch (error) {
      console.error("History retrieval error:", error);
      setErrorMessage(extractErrorReason(error));
    }
  };

  // ========== VERIFY FUNCTIONALITY ==========
  const handleVerify = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!contract) {
      setErrorMessage("No contract found. Please connect your wallet first!");
      return;
    }
    if (!authorAddress || !fileName || !fileContent) {
      setErrorMessage("All fields are required for verification!");
      return;
    }
    try {
      const result = await contract.checkDataIntegrity(authorAddress, fileName, fileContent);
      setResultMsg(result[0]);
      const details = result[1];
      setCommitsHistory(details.Commits);
      setTimestampsHistory(details.timestamp);
      if (details.Commits.length > 0 && details.timestamp.length > 0) {
        setPreviousCommit(details.Commits[details.Commits.length - 2] || 'N/A');
        setCurrentCommit(details.Commits[details.Commits.length - 1]);
        setModificationTime(formatTimestamp(details.timestamp[details.timestamp.length - 1]));
      }
      setSuccessMessage("Data verification successful!");
    } catch (error) {
      console.error("Verification error:", error);
      if( extractErrorReason(error) === "This Auther didn't upload any Data with this name, please check the uploaded file name and author address and try again"){
      setErrorMessage("This Author didn't upload any Data with this name, please check the uploaded file name and author address and try again");
      } else setErrorMessage(extractErrorReason(error));
    }
  };

  // ========== RENDER VIEWS ==========

  // LANDING VIEW
  const renderLanding = () => (
    <div className="landing">
      <h2>SERVICES</h2>
      <div className="card-container">
        <div className="card" onClick={() => { resetForm(); setCurrentView(VIEWS.UPLOAD); }}>
          <h3>Data Upload</h3>
          <p>Upload new data</p>
        </div>
        <div className="card" onClick={() => { resetForm(); setCurrentView(VIEWS.UPDATE); }}>
          <h3>Data Update</h3>
          <p>Update your existing data</p>
        </div>
        <div className="card" onClick={() => { resetForm(); setCurrentView(VIEWS.VERIFY); }}>
          <h3>Data Verification</h3>
          <p>Verify the integrity of data</p>
        </div>
      </div>
    </div>
  );

  // UPLOAD VIEW
  const renderUploadView = () => (
    <div className="upload-container">
      <div className="drag-drop-box">
        <input type="file" id="fileInput" className="file-input" onChange={handleFileSelect} />
        <label htmlFor="fileInput" className="file-label">
          Drag & drop a file here, or click to select a file
        </label>
      </div>
      <div className="form-group">
        <input type="text" placeholder="Data name..." value={fileName} onChange={(e) => setFileName(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="text" placeholder="Write your commit here..." value={commit} onChange={(e) => setCommit(e.target.value)} />
      </div>
      <div className="action-buttons">
        <button className="back-button" onClick={() => { resetForm(); setCurrentView(VIEWS.LANDING); }}>
          Back
        </button>
        <div className="right-actions">
          <button className="submit-button" onClick={handleUpload}>
            SUBMIT
          </button>
        </div>
      </div>
      {fileContent && (
        <div className="file-preview">
          <p><strong>File Name:</strong> {fileName}</p>
          <p><strong>Content:</strong> {fileContent}</p>
        </div>
      )}
      {successMessage && <div className="popup-message success-text">{successMessage}</div>}
      {errorMessage && <div className="popup-message error-text">{errorMessage}</div>}
    </div>
  );

  // UPDATE VIEW
  const renderUpdateView = () => (
    <div className="upload-container">
      <div className="drag-drop-box">
        <input type="file" id="fileInput" className="file-input" onChange={handleFileSelect} />
        <label htmlFor="fileInput" className="file-label">
          Drag & drop a file here, or click to select a file
        </label>
      </div>
      <div className="form-group">
        <input type="text" placeholder="Data name..." value={fileName} onChange={(e) => setFileName(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="text" placeholder="Write your commit here..." value={commit} onChange={(e) => setCommit(e.target.value)} />
      </div>
      <div className="action-buttons">
        <button className="back-button" onClick={() => { resetForm(); setCurrentView(VIEWS.LANDING); }}>
          Back
        </button>
        <div className="right-actions">
          <button className="submit-button" onClick={handleUpdate}>
            SUBMIT
          </button>
          <button className="history-button" onClick={handleHistory}>
            Check Upload History
          </button>
        </div>
      </div>
      {fileContent && (
        <div className="file-preview">
          <p><strong>File Name:</strong> {fileName}</p>
          <p><strong>Content:</strong> {fileContent}</p>
        </div>
      )}
      {successMessage && <div className="popup-message success-text">{successMessage}</div>}
      {errorMessage && <div className="popup-message error-text">{errorMessage}</div>}
      {historyData && historyData.length > 0 && (
        <div className="history-container">
          <h3>Upload History</h3>
          <ul>
            {historyData.map((doc, index) => (
              <li key={index}>
                <strong>{doc.dataName}</strong> – at - {formatTimestamp(doc.timestamp)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // VERIFY VIEW
  const renderVerifyView = () => (
    <div className="upload-container">
      <div className="drag-drop-box">
        <input type="file" id="fileInput" className="file-input" onChange={handleFileSelect} />
        <label htmlFor="fileInput" className="file-label">
          Drag & drop a file here, or click to select a file
        </label>
      </div>
      <div className="form-group">
        <input type="text" placeholder="Author address..." value={authorAddress} onChange={(e) => setAuthorAddress(e.target.value)} />
      </div>
      <div className="form-group">
        <input type="text" placeholder="Data name..." value={fileName} onChange={(e) => setFileName(e.target.value)} />
      </div>
      <div className="action-buttons">
        <button className="back-button" onClick={() => { resetForm(); setCurrentView(VIEWS.LANDING); }}>
          Back
        </button>
        <div className="right-actions">
          <button className="submit-button" onClick={handleVerify}>
            VERIFY
          </button>
        </div>
      </div>
      {successMessage && <div className="popup-message success-text">{successMessage}</div>}
      {errorMessage && <div className="popup-message error-text">{errorMessage}</div>}
      {resultMsg && (
        <div className="verification-result">
          <p><strong>Message:</strong> {resultMsg}</p>
          <div className="verification-history">
            <h4>Commits History</h4>
            <ul>
              {commitsHistory.map((cmt, index) => (
                <li key={index}>
                  <span>{cmt} - {formatTimestamp(timestampsHistory[index])}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="service">
      {walletAddress ? (
        <div className="wallet-info">
          <span className='address-span'>Connected: {formatAddress(walletAddress)}</span>
          <button className="disconnect-button" onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button className="connect-button" onClick={requestAccount} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}

      {currentView === VIEWS.LANDING && renderLanding()}
      {currentView === VIEWS.UPLOAD && renderUploadView()}
      {currentView === VIEWS.UPDATE && renderUpdateView()}
      {currentView === VIEWS.VERIFY && renderVerifyView()}
    </div>
  );
}
