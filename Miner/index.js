/*
Miner
*/

const IPFS = require('ipfs-daemon')
const options = {}
const ipfs = new IPFS(options)
const ipfsReady = false

const RPC = true
const WEBSERVER = "localhost"

console.log("Starting up...")
const fs = require('fs');
const Web3 = require('web3');
const net = require('net');
const request = require('request');
const client = net.Socket();

let web3
let connectionString
let mainContractAddress
let mainContractAbi
let mainContract
let authContractAddress
let authContractAbi
let authContract
let requestsContractAddress
let requestsContractAbi
let requestsContract
let tokenContractAddress
let tokenContractAbi
let tokenContract
let selectedAddress
let permission
let blockNumber

let requestList = []
let blockNumberSearchBack=10





//Start everything off by attempting to connect to eth network
//connectToEthereumNetwork()

/*
setInterval(()=>{
  if(mainContract&&authContract&&requestsContract&&tokenContract){
      loadRequests()
  }else{console.log("---")}
},10000)


setInterval(()=>{
  if(requestList&&tokenContract){
      loadReservedCoinInRequests()
  }else{console.log("###")}
},15000)

setInterval(()=>{
  if(requestList&&tokenContract){
      loadReservedCoinInRequests()
  }else{console.log("###")}
},15000)
*/

ipfs.on('ready', () => {
  console.log("@@ IPFS READY @@")
  ipfsReady=true
})
ipfs.on('error', (e) => console.log("@@@ IPFS ERROR",e))

function connectToEthereumNetwork(){
  if(RPC){
    console.log("Using RPC...")
    connectionString = 'http://localhost:8545'
    web3 = new Web3(new Web3.providers.HttpProvider(connectionString));
  }else{
    console.log("Using IPC...")
    connectionString = '/Users/austingriffith/Library/Ethereum/testnet/geth.ipc';
    web3 = new Web3(new Web3.providers.IpcProvider(connectionString, client));
  }
  console.log("Checking for accounts on ethereum network ("+connectionString+")...")
  web3.eth.getAccounts().then((accounts)=>{
    console.log(accounts)

    selectedAddress=accounts[0]

    connectToMainContract()
  })
}

function loadContractAddress(contract,callback){
  let address
  try{
    console.log("Reading",contract+".address")
    address = fs.readFileSync(contract+".address").toString().trim()
    console.log("Reading",address+".abi")
    let abi = JSON.parse(fs.readFileSync(address+".abi").toString())
    console.log(contract+" contract data loaded locally...")
    callback(null,address,abi)
  }catch(e){
    console.log("Failed to load "+contract+" contract data locally, attempting to download...")
    console.log("Connecting to "+WEBSERVER+"...")
    request('http://'+WEBSERVER+'/address/'+contract,(error, response, body)=>{
      if(error){
        callback("Failed to load "+contract+" address from "+WEBSERVER+"!")
      }else{
        address = body.trim()
        loadContractAbi(contract,address,callback)
      }
    })
  }
}

function loadContractAbi(contract,address,callback){
  let abi
  try{
    abi = JSON.parse(fs.readFileSync(address+".abi").toString())
    console.log(contract+" contract abi loaded locally...")
    callback(null,address,abi)
  }catch(e){
    console.log("Failed to load "+contract+" abi locally, attempting to download...")
    console.log("Connecting to "+WEBSERVER+"...")
    request('http://'+WEBSERVER+'/abi/'+contract,(error, response, body)=>{
      if(!error){
        try{
          abi = JSON.parse(body)
          console.log("writing",contract+".address")
          fs.writeFileSync(contract+".address",address)
          console.log("writing",address+".abi")
          fs.writeFileSync(address+".abi",JSON.stringify(abi))
          callback(null,address,abi)
        }catch(e){
          callback("Failed to parse main ABI from "+WEBSERVER+"!")
        }
      }
    })
  }
}

function connectToMainContract(){
  console.log("Connecting to main contract...")
  loadContractAddress("Main",(err,address,abi) => {
    if(err){
      console.log(err)
    }else{
      mainContractAddress=address
      mainContractAbi=abi
      mainContract = new web3.eth.Contract(mainContractAbi,mainContractAddress)
      console.log("Ready to interact with mainContract...")
      mainContract.methods.getContractAddress(0).call().then((_authContractAddress)=>{
        console.log("Setting authContractAddress to "+_authContractAddress)
        authContractAddress = _authContractAddress
        mainContract.methods.getContractAddress(10).call().then((_requestsContractAddress)=>{
          console.log("Setting authContractAddress to "+_requestsContractAddress)
          requestsContractAddress = _requestsContractAddress
          mainContract.methods.getContractAddress(20).call().then((_tokenContractAddress)=>{
            console.log("Setting authContractAddress to "+_tokenContractAddress)
            tokenContractAddress = _tokenContractAddress
            connectToAuthContract()
          })
        })
      })
    }
  })
}


function connectToAuthContract(){
  console.log("Connecting to auth contract...")
  loadContractAbi("Auth",authContractAddress,(err,address,abi) => {
    if(err){
      console.log(err)
    }else{
      authContractAbi=abi
      authContract = new web3.eth.Contract(authContractAbi,authContractAddress)
      console.log("Ready to interact with authContract...")
      authContract.methods.getPermission(selectedAddress).call().then((_permission)=>{
        console.log("Permission level: "+_permission)
        permission=_permission;
        connectToRequestsContract()
      })
    }
  })
}


function connectToRequestsContract(){
  console.log("Connecting to requests contract...")
  loadContractAbi("Requests",requestsContractAddress,(err,address,abi) => {
    if(err){
      console.log(err)
    }else{
      requestsContractAbi=abi
      requestsContract = new web3.eth.Contract(requestsContractAbi,requestsContractAddress)
      console.log("Ready to interact with requestsContract...")
      requestsContract.methods.mainAddress().call().then((_mainAddress)=>{
        console.log("_mainAddress: "+_mainAddress)
        connectToTokenContract()
      })
    }
  })
}


function connectToTokenContract(){
  console.log("Connecting to token contract...")
  loadContractAbi("Token ",tokenContractAddress,(err,address,abi) => {
    if(err){
      console.log(err)
    }else{
      tokenContractAbi=abi
      tokenContract = new web3.eth.Contract(tokenContractAbi,tokenContractAddress)
      console.log("Ready to interact with tokenContract...")
      tokenContract.methods.mainAddress().call().then((_mainAddress)=>{
        console.log("_mainAddress: "+_mainAddress)
        loadRequests()
        setTimeout(loadReservedCoinInRequests,5000)
      })
    }
  })
}

function loadRequests(){
  let DEBUG = false
  if(DEBUG) console.log("Loading requests...")
  if(DEBUG) console.log("Current Block Number: ",blockNumber)
  web3.eth.getBlockNumber((err,_currentBlockNumber)=>{
    if(DEBUG) console.log("_currentBlockNumber: "+_currentBlockNumber)
    if(_currentBlockNumber){
      let thisBlockNumberSearchBack = _currentBlockNumber-blockNumberSearchBack
      if(DEBUG) console.log("Looking for AddRequest events back to block ",thisBlockNumberSearchBack)
      requestsContract.getPastEvents('AddRequest', {
          fromBlock: thisBlockNumberSearchBack,
          toBlock: 'latest'
      }, function(error, events){
        console.log("Found "+events.length+" requests...");
        for(let request in events.reverse()){
          if(DEBUG) console.log(events[request].returnValues)
          if(!requestList[events[request].returnValues._id]){
            console.log("Adding request "+events[request].returnValues._id+" with combiner "+events[request].returnValues._combiner)
            requestList[events[request].returnValues._id] = events[request].returnValues
          }
        }
      })
    }
  })
}

function loadReservedCoinInRequests(){
  let DEBUG=true
  if(DEBUG) console.log("## REQUESTS ")
  for(let req in requestList){
    //for each request we want to see how much coin is still reserved
    //getReserved(address _combiner,bytes32 _id) constant returns (uint)
    //getReservedByString(address _combiner,string _id) constant returns (uint){
    if(typeof requestList[req].reserved == "undefined" || requestList[req].reserved>0 ){
      if(DEBUG) console.log(requestList[req]._id)
      tokenContract.methods.getReservedByString(requestList[req]._combiner,requestList[req]._id).call().then((_reserved)=>{
        if(DEBUG) console.log("_reserved: "+_reserved)
        requestList[req].reserved=_reserved
      })
    }

    if(requestList[req].reserved){
      console.log("#  "+requestList[req]._id+" ("+requestList[req].reserved+") "+requestList[req]._url)
    }
  }
}