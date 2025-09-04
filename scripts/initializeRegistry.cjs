const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Initializing Registry with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const registryAddress = "0xF08511fb706A5a84Ae7738f8a6cA24D5162cc895";
    
    console.log("Getting Registry contract...");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = Registry.attach(registryAddress);
    
    const contracts = {
        tokenFactory: "0x7689A7ce1d9a09e2B996cCCb6cD81c015D5E36d3",
        bondingCurve: "0xd64fd6b463aC54252FAB669a29d51Ae3373C3467",
        liquidityPool: "0xDC225E7d4e3a1e5A65aC39F4B60E85f7657FFf0C",
        userManager: "0x7231bB2Ebc50cB32731cf7303E077B0042ab6778",
        feeManager: "0xCaCbd1C17f36061593181B6E482DaB822815c9a5",
        marketGraduation: "0x7Df5fda5E528ba80E84C3462cA7D7454c5129c7b",
        wokb: "0x952E6c15BEA13B9A6077419456B59f46c43F2934"
    };
    
    try {
        console.log("Initializing Registry with contracts...");
        const tx = await registry.initialize(
            contracts.tokenFactory,
            contracts.bondingCurve,
            contracts.liquidityPool,
            contracts.userManager,
            contracts.feeManager,
            contracts.marketGraduation,
            contracts.wokb
        );
        
        console.log("Transaction hash:", tx.hash);
        console.log("Waiting for confirmation...");
        
        const receipt = await tx.wait();
        console.log("Registry initialized successfully in block:", receipt.blockNumber);
        
        // Verify initialization by checking if contracts are set
        console.log("\nVerifying Registry initialization...");
        const tokenFactoryAddr = await registry.getTokenFactory();
        const bondingCurveAddr = await registry.getBondingCurve();
        
        console.log("Token Factory:", tokenFactoryAddr);
        console.log("Bonding Curve:", bondingCurveAddr);
        console.log("Expected Token Factory:", contracts.tokenFactory);
        console.log("Expected Bonding Curve:", contracts.bondingCurve);
        
        if (tokenFactoryAddr.toLowerCase() === contracts.tokenFactory.toLowerCase() &&
            bondingCurveAddr.toLowerCase() === contracts.bondingCurve.toLowerCase()) {
            console.log("✅ Registry initialized correctly!");
        } else {
            console.log("❌ Registry initialization verification failed");
        }
        
    } catch (error) {
        console.error("Registry initialization failed:", error.message);
        if (error.data) {
            console.error("Error data:", error.data);
        }
        
        // Check if already initialized
        if (error.message.includes("already initialized") || error.message.includes("Initializable: contract is already initialized")) {
            console.log("Registry is already initialized. Checking current state...");
            
            try {
                const tokenFactoryAddr = await registry.getTokenFactory();
                const bondingCurveAddr = await registry.getBondingCurve();
                console.log("Current Token Factory:", tokenFactoryAddr);
                console.log("Current Bonding Curve:", bondingCurveAddr);
                
                if (tokenFactoryAddr !== "0x0000000000000000000000000000000000000000") {
                    console.log("✅ Registry is already properly initialized!");
                } else {
                    console.log("❌ Registry initialized but contracts not set correctly");
                }
            } catch (checkError) {
                console.error("Failed to check registry state:", checkError.message);
            }
        }
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });