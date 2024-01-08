//SPDX-License-Identifier: MIT 

pragma solidity ^0.8.19 ;
contract SecureLedger {

    address admin ;

    struct Details{
        bytes32 Hash ;
        string previous_commit ;
        string current_commit;
        uint  timestamp ;
        
    }

    constructor() {
      admin = msg.sender ;  
    } 

    string SCname= "Data Integrity";
    Details private details ;
    

    function name() public view returns( string memory){
        return SCname ; 
    }

     mapping (string => Details) public  FileHash ;

    function hash(string memory content)  internal pure returns(bytes32){
        bytes32 contentHash  = keccak256(bytes(content)) ;
         return  contentHash ;
           
    } 

    function updateFileHash(string memory _url, string memory _content, string memory _commit) public {

        require(msg.sender == admin, "your address doesen't have access to update the Data" );
        bytes32 newHash= hash(_content);
        uint256 _timestamp= block.timestamp ;

        details.Hash= newHash ;
        // assigning the previous commit to the details
        if(FileHash[_url].Hash == bytes32(0)){
            details.previous_commit= "Before existence";
        }else details.previous_commit= FileHash[_url].current_commit ;
        // assigning the current commit to the details
        details.current_commit= _commit ;
        details.timestamp= _timestamp ;

        FileHash[_url] = details;
    }


    function checkDataIntegrity(string memory _url, string memory _newContent) public view  returns(string memory,Details memory) {
       
        string memory message ;

        Details memory emptyDetails = Details({
                Hash:bytes32(0),
                previous_commit:"",
                current_commit:"",
                timestamp:0
                });
        
    
       

         if (FileHash[_url].Hash == bytes32(0) ) {
             message= "This URL is invalid,please check the uploaded file and try again" ;
            return( message, emptyDetails) ;
        }
        
        bytes32 currentHash= FileHash[_url].Hash;
        bytes32 newHash= hash(_newContent);
        
        
        if( currentHash == newHash){
            message= "this Data hasn't been modified from last update  " ;
            if(msg.sender== admin){
                return( message,FileHash[_url]);
            }else{
            return( message,emptyDetails) ;
                }
        } else {
            message= "This Data has been modified, it's different from last version stored !!  ";
            if(msg.sender== admin){
                return( message,FileHash[_url]);
            }else{
                return( message,emptyDetails) ;
                }
            }
    }



    
}

