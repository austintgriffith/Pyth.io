const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

console.log("Reading data...")
const address = fs.readFileSync(process.argv[2]+".address").toString().trim()
let abi = false
if(!address){
  console.log("Couldn't load "+process.argv[2]+".address")
}else{
  abi = JSON.parse(fs.readFileSync(process.argv[2]+".abi"));
  if(!abi){
    console.log("Couldn't load "+process.argv[2]+".abi")
  }else{
    console.log("Loading...")
    web3.eth.getAccounts().then((accounts)=>{
      console.log("Loaded account "+accounts[1])
      let contract = new web3.eth.Contract(abi,address)
      console.log("interact...")
      //let requestsAddress = fs.readFileSync("../Requests/Requests.address").toString().trim();
      //console.log("requestsAddress",requestsAddress)
      contract.methods.spend(1).send({
        from: accounts[1],
        gas: 100000,
        gasPrice:5000000000
      }).then(function(receipt,data){
        console.log("SENT:",receipt,data)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });
    })
  }
}




/*
let deployed = test.deploy({
  data: bytecode,
  arguments: ["CONARG1"]
})
console.log("Deployed...")

console.log(deployed)
*/
