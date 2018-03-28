import Web3 from 'web3';

window.addEventListener('load', function () {
    if (typeof window.web3 !== 'undefined') {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
       // window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/"));
       // window.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
}) 


export function getContract(contractAbi, contractAddress){
    return window.web3.eth.contract(contractAbi).at(contractAddress);
}

export function getCurrentAccount(contractAbi, contractAddress){
    return window.web3.eth.accounts[0];
}