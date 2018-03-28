export function getTestAclFile() {
    return {
        "acl": {
            "publicAddress": "Mahmoud Public Key",
            "files": [
                {
                    "fileAddress": "<IPFS fileA address>",
                    "encryptedSymmetricKey": "11111111111111111111",
                    "encryptedFileName": "AAAAAAAAAAAAAAAAAAAAAA"
                }, {
                    "fileAddress": "<IPFS fileB address>",
                    "encryptedSymmetricKey": "22222222222222222222222222",
                    "encryptedFileName": "BBBBBBBBBBBBBBBBBBBBBBBBBBB"
                }
            ],
            "shares": {
                "Maha Public Key": [
                    {
                        "fileAddress": "<IPFS fileA address>",
                        "encryptedSymmetricKey": "1X1X1X1X1X1X1X1X1X",
                        "encryptedFileName": "AXAXAXAXAXAXAXAXAXAXAX"
                    }, {
                        "fileAddress": "<IPFS fileB address>",
                        "encryptedSymmetricKey": "2X2X2X2X2X2X2X2X2X",
                        "encryptedFileName": "BXBXBXBXBXBXBXBXBXBXBX"
                    }
                ],
                "Taher Public Key": [
                    {
                        "fileAddress": "<IPFS fileA address>",
                        "encryptedSymmetricKey": "1111111111111XXXXXXXXXXXXXX",
                        "encryptedFileName": "AAAAAAAAAAAAAXXXXXXXXXXXXXXX"
                    }
                ]
            },
            "sharedWithMe": {
                "Bob Public Key": [
                    {
                        "fileAddress": "<IPFS filexxx address>",
                        "encryptedSymmetricKey": "aaaaaaaaaaa",
                        "encryptedFileName": "aaaaaaaaaname"
                    }, {
                        "fileAddress": "<IPFS fileyyy address>",
                        "encryptedSymmetricKey": "bbbbbbbbbbbb",
                        "encryptedFileName": "bbbbbbbbbname"
                    }
                ],
                "Alice Public Key": [
                    {
                        "fileAddress": "<IPFS filezzz address>",
                        "encryptedSymmetricKey": "cccccccccccccccc",
                        "encryptedFileName": "cccccccccccname"
                    }
                ]
            }

        }
    }
}