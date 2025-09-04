const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Updating Registry with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const registryAddress = "0x0becC48729c02fC5d30239ab4E1B8c9AbB0d1f78";
    const newTokenFactoryAddress = "0xa959A269696cEd243A0E2Cc45fCeD8c0A24dB88e";
    
    console.log("Getting Registry contract...");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = Registry.attach(registryAddress);
    
    const contracts = {
        tokenFactory: newTokenFactoryAddress,
        bondingCurve: "0xd64fd6b463aC54252FAB669a29d51Ae3373C3467",
        liquidityPool: "0xDC225E7d4e3a1e5A65aC39F4B60E85f7657FFf0C",
        userManager: "0x7231bB2Ebc50cB32731cf7303E077B0042ab6778",
        feeManager: "0xCaCbd1C17f36061593181B6E482DaB822815c9a5",
        marketGraduation: "0x7Df5fda5E528ba80E84C3462cA7D7454c5129c7b",
        wokb: "0x952E6c15BEA13B9A6077419456B59f46c43F2934"
    };

    try {
        console.log("Re-initializing Registry with new TokenFactory...");
        await registry.initialize(
            contracts.tokenFactory,
            contracts.bondingCurve,
            contracts.liquidityPool,
            contracts.userManager,
            contracts.feeManager,
            contracts.marketGraduation,
            contracts.wokb
        );
        console.log("Registry updated successfully!");
        
        // Verify the update
        const tokenFactory = await registry.getTokenFactory();
        const bondingCurve = await registry.getBondingCurve();
        console.log("New Token Factory:", tokenFactory);
        console.log("Bonding Curve:", bondingCurve);
        
        if (tokenFactory === contracts.tokenFactory) {
            console.log("✅ Registry updated with new TokenFactory!");
        }
        
    } catch (error) {
        if (error.message.includes("already initialized")) {
            console.log("Registry already initialized. Using setAuthorizedContract instead...");
            
            // Set the new TokenFactory as authorized
            await registry.setAuthorizedContract(newTokenFactoryAddress, true);
            console.log("New TokenFactory authorized!");
            
            // Check current state
            const tokenFactory = await registry.getTokenFactory();
            console.log("Current Token Factory in Registry:", tokenFactory);
            console.log("New Token Factory:", newTokenFactoryAddress);
            
            console.log("Note: Registry still points to old TokenFactory but new one is authorized.");
            console.log("Token creation should work with the new TokenFactory.");
        } else {
            throw error;
        }
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });