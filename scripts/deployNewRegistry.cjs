const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying new Registry with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    console.log("Deploying Registry...");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("Registry deployed to:", registryAddress);

    const contracts = {
        tokenFactory: "0x7689A7ce1d9a09e2B996cCCb6cD81c015D5E36d3",
        bondingCurve: "0xd64fd6b463aC54252FAB669a29d51Ae3373C3467",
        liquidityPool: "0xDC225E7d4e3a1e5A65aC39F4B60E85f7657FFf0C",
        userManager: "0x7231bB2Ebc50cB32731cf7303E077B0042ab6778",
        feeManager: "0xCaCbd1C17f36061593181B6E482DaB822815c9a5",
        marketGraduation: "0x7Df5fda5E528ba80E84C3462cA7D7454c5129c7b",
        wokb: "0x952E6c15BEA13B9A6077419456B59f46c43F2934"
    };

    console.log("Initializing Registry...");
    await registry.initialize(
        contracts.tokenFactory,
        contracts.bondingCurve,
        contracts.liquidityPool,
        contracts.userManager,
        contracts.feeManager,
        contracts.marketGraduation,
        contracts.wokb
    );
    console.log("Registry initialized successfully!");

    console.log("\n=== New Registry Deployed ===");
    console.log("REGISTRY:", registryAddress);
    
    // Verify initialization
    console.log("\nVerifying initialization...");
    const tokenFactory = await registry.getTokenFactory();
    const bondingCurve = await registry.getBondingCurve();
    console.log("Token Factory:", tokenFactory);
    console.log("Bonding Curve:", bondingCurve);
    
    if (tokenFactory === contracts.tokenFactory && bondingCurve === contracts.bondingCurve) {
        console.log("✅ Registry properly initialized!");
        console.log("\nUpdate your frontend config with:");
        console.log(`REGISTRY: '${registryAddress}'`);
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });