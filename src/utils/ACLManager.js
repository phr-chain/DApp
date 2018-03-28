import * as EncryptionHelper from '../utils/EncryptionHelper'


var encJson, pubAddressBase58, privAddressBase58, onUpdate;

export function init(myPubAddressBase58, myPrivAddressBase58, onUpdateCallback, myAclEncJson) {
    pubAddressBase58 = myPubAddressBase58;
    privAddressBase58 = myPrivAddressBase58;
    onUpdate = onUpdateCallback;
    if(!onUpdate){
        console.error("ACLManager: Missing onUpdateCallback");
    }
    
    encJson = myAclEncJson || {};
    encJson.acl = encJson.acl || {};
    encJson.acl.files = encJson.acl.files || [];
    onUpdate();
}

const isMyFile = (file)=>file.toAddress===pubAddressBase58;
const isSharedWithOther = (file)=>file.toAddress!==pubAddressBase58 && file.fromAddress===pubAddressBase58;
const isSharedWithMe = (file)=>file.toAddress===pubAddressBase58 && file.fromAddress!==pubAddressBase58;

export function readTestAsync(){
    return new Promise(function(resolve, reject){
        var files, shares, sharedWithMe;
        files = [{
            fromAddress: "Mahmoud",
            toAddress: "Mahmoud",
            fileAddress: "<IPFS fileAAAAAAAA address>",
            fileLock: ""
        },{
            fromAddress: "Mahmoud",
            toAddress: "Mahmoud",
            fileAddress: "<IPFS fileBBBBBBBB address>",
            fileLock: ""
        },{
            fromAddress: "Mahmoud",
            toAddress: "Mahmoud",
            fileAddress: "<IPFS fileCCCCCCCC address>",
            fileLock: ""
        }];
        shares = [{
            fromAddress: "Mahmoud",
            toAddress: "Maha",
            fileAddress: "<IPFS fileAAAAAAAA address>",
            fileLock: ""
        },{
            fromAddress: "Mahmoud",
            toAddress: "Taher",
            fileAddress: "<IPFS fileBBBBBBBB address>",
            fileLock: ""
        }];
        sharedWithMe = [{
            fromAddress: "Taher",
            toAddress: "Mahmoud",
            fileAddress: "<IPFS fileXXXXXXXXX address>",
            fileLock: ""
        },{
            fromAddress: "Maha",
            toAddress: "Mahmoud",
            fileAddress: "<IPFS fileYYYYYYYYY address>",
            fileLock: ""
        }];
        resolve({files, shares, sharedWithMe});
    });
}

export function readAsync(){
    var myFilesPromise = unlockFilesAsync(encJson.acl.files.filter(isMyFile));
    var sharedWithMePromise = unlockFilesAsync(encJson.acl.files.filter(isSharedWithMe));
    var shares = encJson.acl.files.filter(isSharedWithOther);
    return new Promise(function(resolve, reject){
        Promise.all([myFilesPromise, sharedWithMePromise])
            .then(results=>{
                const [files, sharedWithMe] = results;
                resolve({files, shares, sharedWithMe});
            });
    });
}

function unlockFileAsync(encFileAccess){
    return new Promise(function(resolve, reject){
        
        var plainFileAccess = Object.assign({}, encFileAccess);
        EncryptionHelper.decryptByPrivateKeyAsync(privAddressBase58, encFileAccess.lock)
            .then(unlock=>{
                
                unlock = JSON.parse(unlock.toString())
                plainFileAccess = Object.assign(plainFileAccess, unlock);
                delete plainFileAccess.lock;
                resolve(plainFileAccess);
            })
    });
}

function unlockFilesAsync(encFilesAccess){
    
    return Promise.all(encFilesAccess.map(unlockFileAsync));
}

function lockFileAsync(plainFileAccess, toAddress, fromAddress){
    return new Promise(function(resolve, reject){
        var plainLock = Object.assign({}, plainFileAccess);
        delete plainLock.fileAddress;
        EncryptionHelper.encryptByPublicKeyAsync(toAddress, JSON.stringify(plainLock))
            .then((lock)=> {
                resolve({fromAddress, toAddress, fileAddress: plainFileAccess.fileAddress, lock});
            });
    });
}

export function addNewFileAccessAsync(plainFileAccess, toAddressBase58){
    var fromAddress = pubAddressBase58;
    var toAddress = toAddressBase58 || pubAddressBase58;
    
    return lockFileAsync(plainFileAccess, toAddress, fromAddress)
        .then(encFileAccess=>{
            
            encJson.acl.files.push(encFileAccess);
            onUpdate();
        });
}

export function getEncryptedACLJson(){
    return encJson;
}