// module.exports = function(_deployer) {
//   // Use deployer to state migration tasks.
// };

const Telecom = artifacts.require("telecom.sol")
module.exports = function (_deployer) {
  // Deploy Flight contract with the address of the airline as a parameter
  _deployer.deploy(Telecom);
};
