import * as EncryptionHelper from "./EncryptionHelper";
var ipfsMiniApi = require('ipfs-mini');
var ipfsAPI = require('ipfs-api');


let ipfs = new  ipfsAPI('ipfs.infura.io', '5001', {
    protocol: 'https'
});

let ipfsMini = new ipfsMiniApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


// expect file content
export function uploadFile(fileContent) {

    // let fileReader = new FileReader();
    // fileReader.readAsBinaryString(fileContent)
    //  var fileData = fileReader.result;

    return new Promise((resolve, reject) => {
        // fileReader.onload = () => {
        //     let data = fileReader.result;
        //     let buffer = Buffer.from(data);
        //     let content = []
        //     content.push({
        //         path: "file 1",
        //         content: buffer
        //     });

        ipfs.add(new Buffer(fileContent, "binary"), (err, res) => {
            if (err) {
                console.log(err);
                reject(err);

            } else {
                console.log(res[0].hash);
                resolve(res[0].hash);
            }
        });
        // }
    });
}



export function downloadFile(fileAddress) {
    return new Promise((resolve, reject) => {

        ipfs.files.cat(fileAddress, (err, file) => {

            if (err) {
                reject(err);
            } else {
                resolve(file);
            }

        })
    });
}

export function uploadAclFile(aclData, accountPublicAddress) {
    return new Promise((resolve, reject) => {

        try {
          /*let encAcl = Object.assign({}, aclData);
            let filesPromis = aclData.acl.files.map((item) => {
                debugger;
                return EncryptionHelper.encryptByPublicKeyAsync(accountPublicAddress, JSON.stringify(item))
                 .then(encRes=>{
                     debugger;
                     return encRes;
                 });
            });*/

           /* Promise.all(filesPromis).then(filesAllProRes=>{
                encAcl.acl.files = filesAllProRes;
            })*/

          /*  let allSharesPromises = [];
            if (aclData.acl.shares) {
                for (const key in aclData.acl.shares) {
                    if (aclData.acl.shares.hasOwnProperty(key)) {
                        let sharesPromis = aclData.acl.shares[key].map(shItem => {
                            return EncryptionHelper.encryptByPublicKeyAsync(key, JSON.stringify(shItem))
                             .then(encSh=>{
                                 return encSh;
                             });
                        });

                        allSharesPromises.push(sharesPromis);*/

                       /* Promise.all(sharesPromis).then(sharesAllRes=>{
                            encAcl.acl.shares[key] = sharesAllRes;
                        })*/
                //    }
             //   }
          //  }

          /*  let ttt = [filesPromis].concat(allSharesPromises);
           
            Promise.all(ttt).then(allPromiss=>{
                encAcl.acl.files = allPromiss[0];
                if(allPromiss.length > 1){
                    let counter =1;
                    for (const key in aclData.acl.shares) {
                        if (aclData.acl.shares.hasOwnProperty(key)) {
                            encAcl.acl.shares[key] = allPromiss[counter];
                            counter++;
                        }
                    }

                }*/

                ipfsMini.addJSON(aclData, (jsonUploadError, jsonUploadResult) => {
                    if (jsonUploadError) {
                        console.log(jsonUploadError);
                        reject(jsonUploadError);
                    } else {
                        console.log(jsonUploadResult);
                        resolve(jsonUploadResult);
                    }
                });
                     

            //  resolve(0xf76a1c8cf287ea3fbcf330c03b92681fc41a4363)
        } catch (error) {
            reject(error);
        }

    });
}

export function downloadAclFile(fileAddress){
    return new Promise((resolve, reject) => {
        ipfsMini.catJSON(fileAddress,(err, fileRes)=>{
        if(err){
            reject(err);
        }
        else{
            resolve(fileRes);
        }
        });
    });
}