
const hre = require("hardhat");

async function main() {

  const Lock = await hre.ethers.getContractFactory("whitelist");
  const lock = await Lock.deploy(10);

  await lock.deployed();

  console.log("Lock with 1 ETH deployed to:", lock.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
