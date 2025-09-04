const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Finishing deployment with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const contracts = {
        wokb: "0x952E6c15BEA13B9A6077419456B59f46c43F2934",
        registry: "0xF08511fb706A5a84Ae7738f8a6cA24D5162cc895",
        tokenFactory: "0x7689A7ce1d9a09e2B996cCCb6cD81c015D5E36d3",
        bondingCurve: "0xd64fd6b463aC54252FAB669a29d51Ae3373C3467",
        liquidityPool: "0xDC225E7d4e3a1e5A65aC39F4B60E85f7657FFf0C",
        userManager: "0x7231bB2Ebc50cB32731cf7303E077B0042ab6778",
        feeManager: "0xCaCbd1C17f36061593181B6E482DaB822815c9a5"
    };

    console.log("8. Deploying MarketGraduation...");
    const MarketGraduation = await ethers.getContractFactory("MarketGraduation");
    const marketGraduation = await MarketGraduation.deploy(contracts.registry);
    await marketGraduation.waitForDeployment();
    contracts.marketGraduation = await marketGraduation.getAddress();
    console.log("MarketGraduation deployed to:", contracts.marketGraduation);

    console.log("9. Initializing Registry...");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = Registry.attach(contracts.registry);
    
    await registry.initialize(
        contracts.tokenFactory,
        contracts.bondingCurve,
        contracts.liquidityPool,
        contracts.userManager,
        contracts.feeManager,
        contracts.marketGraduation,
        contracts.wokb
    );
    console.log("Registry initialized with all contracts");

    console.log("\n=== Deployment Complete ===");
    console.log("REGISTRY:", contracts.registry);
    console.log("TOKEN_FACTORY:", contracts.tokenFactory);
    console.log("BONDING_CURVE:", contracts.bondingCurve);
    console.log("LIQUIDITY_POOL:", contracts.liquidityPool);
    console.log("USER_MANAGER:", contracts.userManager);
    console.log("FEE_MANAGER:", contracts.feeManager);
    console.log("MARKET_GRADUATION:", contracts.marketGraduation);
    console.log("WOKB:", contracts.wokb);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });