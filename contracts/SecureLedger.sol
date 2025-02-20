//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21 ;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract SecureLedger is Initializable, OwnableUpgradeable {

    event DataUploaded(address indexed _AuthorAddress, string dataName) ;
    event DataUpdated(address indexed _AuthorAddress, string dataName, string commit );

    struct Details{
        bytes32 Hash ;
        string[] Commits ;
        uint256[]  timestamp ;
        
    }
    struct DataUploadInfo{
        string dataName ;
        uint256 timestamp ;
    }
    Details private details ;
        

     function initialize(address initialOwner) initializer public {
        __Ownable_init(initialOwner);
    }
    // Store the documents names uploaded by the author
    mapping(address => DataUploadInfo[]) internal authorDocs ;
    // Store the details of uploaded and updated data with its author
     mapping (address author => mapping(string dataName => Details dataDetails)) internal  FileHash ;

    function hash(string memory content)  internal pure returns(bytes32){
        bytes32 contentHash  = keccak256(bytes(content)) ;
         return  contentHash ;
           
    } 

    function uploadData(string memory _name, string memory _content, string memory _commit) public {
        address userAddress = msg.sender ;
        if(FileHash[userAddress][_name].Hash != bytes32(0)){
            revert("You already have a data uploaded with this name ") ;
        }

        bytes32 newHash= hash(_content);
        uint256 _timestamp= block.timestamp ;

        DataUploadInfo memory newDoc = DataUploadInfo({
            dataName: _name,
            timestamp: _timestamp
        });

        details.Hash= newHash ;
        // Assign the  commit to the commits history
        details.Commits.push(_commit);
  
        details.timestamp.push(_timestamp);
        // Update the data details state on contract . 
        FileHash[userAddress][_name] = details;
        authorDocs[userAddress].push(newDoc);
        emit DataUploaded(userAddress, _name);
    }

    function updateData(string memory _name, string memory _content, string memory _commit) public {
        if(FileHash[msg.sender][_name].Hash == bytes32(0)){
            revert("You don't have a registred data with this name !!");
        }
        bytes32 newHash= hash(_content);
        uint256 _timestamp= block.timestamp ;

        details.Hash= newHash ;
        // Push the  commit to the commits history
        details.Commits.push(_commit);
  
        details.timestamp.push(_timestamp);

        FileHash[msg.sender][_name] = details;
        emit DataUpdated(msg.sender, _name, _commit);
    }


    function checkDataIntegrity(address _author, string memory _name, string memory _newContent) public view  returns(string memory,Details memory) {
       
        string memory message ;  
       
         if (FileHash[_author][_name].Hash == bytes32(0) ) {
             revert("This Auther didn't upload any Data with this name, please check the uploaded file name and author address and try again" );
           
        }
        
        bytes32 currentHash= FileHash[_author][_name].Hash;
        bytes32 newHash= hash(_newContent);
        
        
        if( currentHash == newHash){
            message= "This Data matches the one stored by author, it hasn't been modified from last update  " ;
           
        } else {
            message= "This Data doesn't match, it has been modified, it's different from last version stored !!  ";           
            }
        
        return( message,FileHash[_author][_name]);
    }

    function getHistory() public view returns(DataUploadInfo[] memory){
        if(authorDocs[msg.sender].length == 0){
            revert("You didn't upload any data yet !! ");
        }
         return authorDocs[msg.sender];
    }

    
}

