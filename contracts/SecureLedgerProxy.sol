//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21 ;


import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol" ;

contract SecureLedgerProxy is ERC1967Proxy {
    constructor(address _logicContractAddress, bytes memory _data ) ERC1967Proxy(_logicContractAddress, _data){}
}
