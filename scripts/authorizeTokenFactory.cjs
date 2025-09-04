const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Authorizing TokenFactory with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const registryAddress = "0x0becC48729c02fC5d30239ab4E1B8c9AbB0d1f78";
    const newTokenFactoryAddress = "0xa959A269696cEd243A0E2Cc45fCeD8c0A24dB88e";
    
    console.log("Getting Registry contract...");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = Registry.attach(registryAddress);
    
    try {
        console.log("Authorizing new TokenFactory in Registry...");
        const tx = await registry.setAuthorizedContract(newTokenFactoryAddress, true);
        await tx.wait();
        console.log("New TokenFactory authorized successfully!");
        
        console.log("TokenFactory address:", newTokenFactoryAddress);
        console.log("Registry address:", registryAddress);
        
        console.log("✅ Ready to create tokens!");
        
    } catch (error) {
        console.error("Authorization failed:", error.message);
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });