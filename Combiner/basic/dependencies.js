const fs = require('fs');
module.exports = {
  'zeppelin-solidity/contracts/ownership/Ownable.sol': fs.readFileSync('zeppelin-solidity/contracts/ownership/Ownable.sol', 'utf8'),
  'Addressed.sol': fs.readFileSync('Addressed/Addressed.sol', 'utf8')
}
