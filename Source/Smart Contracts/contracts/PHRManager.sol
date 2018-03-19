pragma solidity ^0.4.17;

contract PHRManager {
    
    struct UserACL {
        mapping(string => string) myFiles;  //[file address, MyPub(SharedKey)]
        mapping (address => mapping (string => string))  sharedFiles; //[RecieverPub: [file address, RecieverPub(SharedKey)]]
    }
      
    event FileAdded(address fileAddress, string fileSecret); 
    event AccessAdded(address fileAddress, string fileSecret);
    

    address  contractOwner; 
    mapping(address => UserACL) acls; //[UserPub: his ACL]
    
    function PHRManager() public {
        contractOwner = msg.sender;
    }
    
    function addFileAccess(string _fileAddress, string _encryptedsharedkey) public payable{
        uint fees = 0.5 ether;
        require(msg.value > fees);
            
        acls[msg.sender].myFiles[_fileAddress] = _encryptedsharedkey;
        
        contractOwner.transfer(fees);
        if (msg.value > fees)
            msg.sender.transfer(msg.value - fees);

        FileAdded(msg.sender,  _fileAddress);            
    }

    function getMyFileAccess(string _fileAddress) public view returns(string){
        return acls[msg.sender].myFiles[_fileAddress];
    }
    
    function giveAccess(address _reciever, string _fileAddress, string _encryptedsharedkey) public payable{
        uint fees = 0.1 ether;
        require(msg.value > fees);
        
        acls[msg.sender].sharedFiles[_reciever][_fileAddress] = _encryptedsharedkey;

        contractOwner.transfer(fees);
        if (msg.value > fees)
            msg.sender.transfer(msg.value - fees);
        
        AccessAdded(_reciever, _fileAddress);
    }

    function getFileAccess(address _filecontractOwner, string _fileAddress) public view returns(string){
        return acls[_filecontractOwner].sharedFiles[msg.sender][_fileAddress];
    }
    
    function() public payable{
        //Change this action latter
        contractOwner.transfer(msg.value);
    }
}
