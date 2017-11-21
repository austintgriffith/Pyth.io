const fs = require('fs');
module.exports = {
  'zeppelin-solidity/contracts/ownership/Ownable.sol': fs.readFileSync('zeppelin-solidity/contracts/ownership/Ownable.sol', 'utf8'),
  'zeppelin-solidity/contracts/ownership/HasNoEther.sol': fs.readFileSync('zeppelin-solidity/contracts/ownership/HasNoEther.sol', 'utf8'),
  'zeppelin-solidity/contracts/ownership/Contactable.sol': fs.readFileSync('zeppelin-solidity/contracts/ownership/Contactable.sol', 'utf8'),
  'Predecessor.sol': fs.readFileSync('Predecessor/Predecessor.sol', 'utf8')
}
