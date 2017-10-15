//
// usage: node contract setDescendant Store previous
//
// ex: node contract setDescendant Store previous
//
let ACCOUNT_INDEX = 1
module.exports = (contract,params,args)=>{
  console.log("%*== onDeploy: set descendant to "+params.previousAddress)
  return contract.methods.setDescendant(params.previousAddress).send({
    from: params.accounts[ACCOUNT_INDEX],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}
