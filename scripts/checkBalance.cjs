const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Account:", deployer.address);
    const balanceWei = await deployer.provider.getBalance(deployer.address);
    const balanceOKB = ethers.formatEther(balanceWei);
    
    console.log("Balance (Wei):", balanceWei.toString());
    console.log("Balance (OKB):", balanceOKB);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });