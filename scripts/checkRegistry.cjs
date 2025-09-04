const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Checking Registry state with account:", deployer.address);
    
    const registryAddress = "0xF08511fb706A5a84Ae7738f8a6cA24D5162cc895";
    
    console.log("Getting Registry contract...");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = Registry.attach(registryAddress);
    
    try {
        console.log("Checking current Registry state...");
        
        const tokenFactory = await registry.getTokenFactory();
        const bondingCurve = await registry.getBondingCurve();
        const liquidityPool = await registry.getLiquidityPool();
        const userManager = await registry.getUserManager();
        const feeManager = await registry.getFeeManager();
        const marketGraduation = await registry.getMarketGraduation();
        const wokb = await registry.getWOKB();
        
        console.log("\nCurrent Registry Configuration:");
        console.log("Token Factory:", tokenFactory);
        console.log("Bonding Curve:", bondingCurve);
        console.log("Liquidity Pool:", liquidityPool);
        console.log("User Manager:", userManager);
        console.log("Fee Manager:", feeManager);
        console.log("Market Graduation:", marketGraduation);
        console.log("WOKB:", wokb);
        
        // Check if any are zero address (not initialized)
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const isInitialized = tokenFactory !== zeroAddress;
        
        console.log("\nRegistry Status:", isInitialized ? "✅ Initialized" : "❌ Not Initialized");
        
        if (isInitialized) {
            console.log("\nExpected addresses:");
            console.log("Token Factory: 0x7689A7ce1d9a09e2B996cCCb6cD81c015D5E36d3");
            console.log("Bonding Curve: 0xd64fd6b463aC54252FAB669a29d51Ae3373C3467");
            
            const correctTokenFactory = tokenFactory.toLowerCase() === "0x7689A7ce1d9a09e2B996cCCb6cD81c015D5E36d3".toLowerCase();
            const correctBondingCurve = bondingCurve.toLowerCase() === "0xd64fd6b463aC54252FAB669a29d51Ae3373C3467".toLowerCase();
            
            console.log("Token Factory matches:", correctTokenFactory ? "✅" : "❌");
            console.log("Bonding Curve matches:", correctBondingCurve ? "✅" : "❌");
            
            if (correctTokenFactory && correctBondingCurve) {
                console.log("\n🎉 Registry is properly configured! Token creation should work.");
            }
        }
        
    } catch (error) {
        console.error("Failed to check Registry state:", error.message);
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });