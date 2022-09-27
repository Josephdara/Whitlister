const {ethers} = require("hardhat")

async function main(){
  const whitelistContract = await ethers.getContractFactory("Whitelist")
  const deployedWhitelistContract = await whitelistContract.deploy(200)
  await deployedWhitelistContract.deployed()
  console.log("Contract Addy", deployedWhitelistContract.address);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1)
} )