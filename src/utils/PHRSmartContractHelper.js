import * as EthHelper from './EtherumHelper'

var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_fileOwner",
				"type": "string"
			},
			{
				"name": "_fileAddress",
				"type": "string"
			}
		],
		"name": "setACLFileAddress",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_fileOwner",
				"type": "string"
			}
		],
		"name": "getACLFileAddress",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "fileOwner",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "fileAddress",
				"type": "string"
			}
		],
		"name": "FileAdded",
		"type": "event"
	}
]
var address = '0x4ef830aa64a886f3923c286abda4fe481ba35431';

var phrContract = EthHelper.getContract(abi, address);


export function setACLFileAddress(fileOwner, fileAddress, callBack) {
  var fees = window.web3.toWei(0.001, 'ether');
  phrContract.setACLFileAddress(fileOwner, fileAddress, { value: fees, gas: 500000 }, callBack);
}

export function getACLFileAddress(fileOwner, callBack) {
  phrContract.getACLFileAddress(fileOwner, callBack);
}


