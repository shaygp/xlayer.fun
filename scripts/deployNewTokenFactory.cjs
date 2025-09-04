const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying new TokenFactory with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const registryAddress = "0x0becC48729c02fC5d30239ab4E1B8c9AbB0d1f78";

    console.log("Deploying TokenFactory...");
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    const tokenFactory = await TokenFactory.deploy(registryAddress);
    await tokenFactory.waitForDeployment();
    const tokenFactoryAddress = await tokenFactory.getAddress();
    console.log("TokenFactory deployed to:", tokenFactoryAddress);

    console.log("\n=== New TokenFactory Deployed ===");
    console.log("TOKEN_FACTORY:", tokenFactoryAddress);
    
    // Verify it can access the Registry
    console.log("\nVerifying Registry connection...");
    const bondingCurve = await tokenFactory.registry();
    console.log("Registry address:", bondingCurve);
    console.log("Expected Registry:", registryAddress);
    
    if (bondingCurve.toLowerCase() === registryAddress.toLowerCase()) {
        console.log("✅ TokenFactory properly connected to Registry!");
        console.log("\nUpdate your frontend config with:");
        console.log(`TOKEN_FACTORY: '${tokenFactoryAddress}'`);
        
        console.log("\nNow update Registry to authorize new TokenFactory...");
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });