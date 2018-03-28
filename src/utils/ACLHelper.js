

function validateACLStructure(aclJson) {
    if (!aclJson.hasOwnProperty('acl')) {
        aclJson.acl = {};
    }
    if (!aclJson.acl.hasOwnProperty('publicAddress')) {
        aclJson.acl.publicAddress = '';
    }
    if (!aclJson.acl.hasOwnProperty('files')) {
        aclJson.acl.files = [];
    }
    if (!aclJson.acl.hasOwnProperty('shares')) {
        aclJson.acl.shares = {};
    }
    if (!aclJson.acl.hasOwnProperty('sharedWithMe')) {
        aclJson.acl.sharedWithMe = {};
    }
}
export function addFileAccess(aclJson, myPubAddress, fileData) {

    validateACLStructure(aclJson);

    aclJson.acl.publicAddress = myPubAddress;
    aclJson.acl.files.push(fileData);
}



export function shareFile(aclJson, recieverPubKey, fileData) {
    validateACLStructure(aclJson);

    if (!aclJson.acl.shares.hasOwnProperty(recieverPubKey)) {
        aclJson.acl.shares[recieverPubKey] = [];
    }

    aclJson.acl.shares[recieverPubKey].push()
}

export function addFileToSharedWithMeList(aclJson, senderPubKey, fileData) {
    validateACLStructure(aclJson);

    if (!aclJson.acl.sharedWithMe.hasOwnProperty(senderPubKey)) {
        aclJson.acl.sharedWithMe[senderPubKey] = [];
    }

    aclJson.acl.sharedWithMe[senderPubKey].push(fileData);
}

export function getMyFileAccess(aclJson, fileAddress) {
    var files = aclJson.acl.files;
    if (!files)
        return null;

    return files.filter(file => file.fileAddress === fileAddress)[0];
}

export function getSharedFileAccess(aclJson, fileAddress, recieverPubKey) {
    var files = aclJson.acl.shares[recieverPubKey];
    if (!files)
        return null;

    return files.filter(file => file.fileAddress === fileAddress)[0];
}

export function listMyFiles(aclJson) {
    if (!aclJson.hasOwnProperty('acl')) {
        return [];
    }
    if (!aclJson.acl.hasOwnProperty('files')) {
        return [];
    }

    return aclJson.acl.files;
}

function listSharedFiles(aclJson, recieverPubKey, sectionName) {
    if (!aclJson.hasOwnProperty('acl')) {
        return [];
    }
    if (!aclJson.acl.hasOwnProperty(sectionName)) {
        return [];
    }
    if (!aclJson.acl[sectionName].hasOwnProperty(recieverPubKey)) {
        return [];
    }
    return aclJson.acl[sectionName][recieverPubKey];
}

export function listFilesIShared(aclJson, recieverPubKey) {
    return listSharedFiles(aclJson, recieverPubKey, 'shares')
}

export function listFilesSharedWithMe(aclJson, recieverPubKey) {
    return listSharedFiles(aclJson, recieverPubKey, 'sharedWithMe')
}

function listPeople(aclJson, sectionName) {
    if (!aclJson.hasOwnProperty('acl')) {
        return [];
    }
    if (!aclJson.acl.hasOwnProperty(sectionName)) {
        return [];
    }

    var people = [];
    for (var key in aclJson.acl[sectionName]) {
        if (aclJson.acl[sectionName].hasOwnProperty(key)) {
            people.push(key)
        }
    }
    return people;
}

export function listPeopleIShareWithThem (aclJson) {
    return listPeople(aclJson, 'shares');
}

export function listPeopleShareWithMe(aclJson) {
    return listPeople(aclJson, 'sharedWithMe');
}
export function updateSharedWithMe(senderACLFile, senderpubKey, recieverACLFile, recieverPubKey){
    var filesSharedWithReciever = listFilesIShared(senderACLFile,recieverPubKey);
    if(filesSharedWithReciever.length() === 0)
        return false;

    filesSharedWithReciever.foreach((file)=> addFileToSharedWithMeList(recieverACLFile, senderpubKey));
    return true;
}
//Test///////////////////////////////////////////////
// export function test(aclFile) {
//     debugger;
//     var aclJson = {};
//     addFileAccess(aclJson, "Mahmoud Public Key", "<IPFS fileA address>", "11111111111111111111", "AAAAAAAAAAAAAAAAAAAAAA");
//     addFileAccess(aclJson, "Mahmoud Public Key", "<IPFS fileB address>", "22222222222222222222222222", "BBBBBBBBBBBBBBBBBBBBBBBBBBB");
//     var file = getMyFileAccess(aclJson, "<IPFS fileB address>");

//     shareFile(aclJson, "Maha Public Key", "<IPFS fileA address>", "1X1X1X1X1X1X1X1X1X", "AXAXAXAXAXAXAXAXAXAXAX");
//     shareFile(aclJson, "Maha Public Key", "<IPFS fileB address>", "2X2X2X2X2X2X2X2X2X", "BXBXBXBXBXBXBXBXBXBXBX");
//     var mahaFile = getSharedFileAccess(aclJson, "<IPFS fileB address>", "Maha Public Key")
//     var mahaFileFail = getSharedFileAccess(aclJson, "<IPFS fileB address>", "Maha Public Keysssssssssss")

//     shareFile(aclJson, "Taher Public Key", "<IPFS fileA address>", "1111111111111XXXXXXXXXXXXXX", "AAAAAAAAAAAAAXXXXXXXXXXXXXXX");
//     var taherFile = getSharedFileAccess(aclJson, "<IPFS fileA address>", "Taher Public Key")
//     var taherFileFail = getSharedFileAccess(aclJson, "<IPFS fileA addressvvvvvvvvvvvvv>", "Taher Public Key")

//     var myFiles = listMyFiles(aclJson);
//     var mahaFiles = listMyFiles(aclJson, "Maha Public Key");
//     var success = JSON.stringify(aclFile) === JSON.stringify(aclJson);
// }