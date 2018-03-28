import * as StorageHelper from "./StorageHelper";
import * as EncryptionHelper from "./EncryptionHelper"
import * as ACLManager from '../utils/ACLManager'
import * as ACLHelper from '../utils/ACLHelper'
import * as PHRSmartContractHelper from "./PHRSmartContractHelper"
import saveAs from 'save-as'
import * as CommonHelper from '../utils/CommonHelper'

/**
 * Download file from IPFS, decrypt it, and save the disk
 * @param FileData: { 
 * fileAddress:"QmVtUsMpt4PUYwkRs6iDbAmQRjfLTLDBou97UvGUpUn1TF"
 * fileName:"8.txt"
 * fromAddress:"N16nHAtCmhQaskXnid3pmB6yUtCP5u1kt4gvnmu7xH2GHDDNnjzjqwEyySDrvyrDSLLgRFv9Mrnp3NxLtHdYnhPS"
 * mimeType:"text/plain"
 * size:180
 * symmetricKey:"hjasklhfkjsdgfksjdgf"
 * toAddress:"N16nHAtCmhQaskXnid3pmB6yUtCP5u1kt4gvnmu7xH2GHDDNnjzjqwEyySDrvyrDSLLgRFv9Mrnp3NxLtHdYnhPS"
 * }
 */
export function downloadMyFileAsync(fileData) {
    return new Promise((resolve, reject)=>{
        StorageHelper.downloadFile(fileData.fileAddress).then(encryptedFile=>{
            var decryptedByteArray = EncryptionHelper.decryptAsByteArray(encryptedFile.toString(), fileData.symmetricKey);
            var blob = new Blob([decryptedByteArray], { type: fileData.mimeType }).slice(0, fileData.size);
            saveAs(blob, fileData.fileName)
        });
    });
}

export function uploadFileToAccount(file, accountPublicAddress) {
    var reader = new FileReader();

    return new Promise((resolve, reject) => {
        try {
            reader.onload = (readedFile) => {
                var fileName = file.name;
                var fileType = file.type;
                var fileLength = file.size;
                var arrayBuffer = readedFile.target.result;

                // encrypt file
                var genSymmetricKey = EncryptionHelper.generateSharedKey();
                var cipher = EncryptionHelper.encrypt(arrayBuffer, genSymmetricKey);
                console.log("cipher: " + cipher);

                // upoade file 
                StorageHelper.uploadFile(cipher)
                    .then((fileHash) => {
                        // add file access

                        let fileAccess = {
                            fileAddress: fileHash,
                            symmetricKey: genSymmetricKey,
                            fileName: fileName,
                            size: fileLength,
                            mimeType: fileType
                        };
                        console.log("Current fileAccess: " + JSON.stringify(fileAccess));

                        ACLManager.addNewFileAccessAsync(fileAccess)
                            .then(() => {
                                var accessFile = ACLManager.getEncryptedACLJson();
                                console.log("Updated  ACL: " + JSON.stringify(accessFile));

                                // store ACL in ipfs(encryption included) 


                                StorageHelper.uploadAclFile(accessFile, accountPublicAddress)
                                    .then((aclHash) => {

                                        PHRSmartContractHelper.setACLFileAddress(accountPublicAddress, aclHash, (smartContractError, smartContractResult) => {

                                            if (smartContractError) {
                                                console.log(smartContractError);
                                                reject(smartContractError);
                                            } else {


                                                let uploadResult = {
                                                    accessFile,
                                                    fileHash,
                                                    aclHash

                                                };

                                                console.log(JSON.stringify(uploadResult));
                                                resolve(uploadResult);
                                            }
                                        })
                                    })
                                    .catch((aclStoreError) => {
                                        console.log(aclStoreError);
                                        reject(aclStoreError);
                                    });
                            });

                    })
                    .catch((uploadErr) => {
                        console.log(uploadErr);
                        reject(uploadErr);
                    });



                //

            }

        } catch (error) {
            reject(error);
        }
        reader.readAsArrayBuffer(file);
    });

}


export function getMyACLFile(publicKey, privateKey) {
    return new Promise((resolve, reject) => {
        PHRSmartContractHelper.getACLFileAddress(publicKey, (error, myAclRes) => {
            if (error) {
                reject(error)
            } else {
                if (!CommonHelper.isValidString(myAclRes)) {
                    resolve({});
                } else {
                    StorageHelper.downloadAclFile(myAclRes)
                        .then(aclFileres => {
                            resolve(aclFileres);
                        });
                }

            }
        })
    });
}

export function shareFileWithAccount(fileData, recieverPublicKey,ownerPublicAddress) {

    return new Promise((resolve, reject) => {
        try {
           ACLManager.addNewFileAccessAsync(fileData,recieverPublicKey)
           .then((newFileAccess)=>{
               
            var accessFile = ACLManager.getEncryptedACLJson();
            console.log("Updated  ACL: " + JSON.stringify(accessFile));

            // store ACL in ipfs(encryption included) 


            StorageHelper.uploadAclFile(accessFile, ownerPublicAddress)
                .then((aclHash) => {

                    PHRSmartContractHelper.setACLFileAddress(ownerPublicAddress, aclHash, (smartContractError, smartContractResult) => {

                        if (smartContractError) {
                            console.log(smartContractError);
                            reject(smartContractError);
                        } else {


                            let uploadResult = {
                                accessFile,
                                aclHash

                            };

                            console.log(JSON.stringify(uploadResult));
                            resolve(uploadResult);
                        }
                    })
                })
                .catch((aclStoreError) => {
                    console.log(aclStoreError);
                    reject(aclStoreError);
                });

           }).catch(err=>reject(err)); 
        } catch (error) {
           reject(error); 
        }
    });

}