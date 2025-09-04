const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying MarketGraduation with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const registryAddress = "0xF08511fb706A5a84Ae7738f8a6cA24D5162cc895";

    console.log("Deploying MarketGraduation...");
    const MarketGraduation = await ethers.getContractFactory("MarketGraduation");
    const marketGraduation = await MarketGraduation.deploy(registryAddress);
    await marketGraduation.waitForDeployment();
    const marketGraduationAddress = await marketGraduation.getAddress();
    console.log("MarketGraduation deployed to:", marketGraduationAddress);

    console.log("Initializing Registry...");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = Registry.attach(registryAddress);
    
    await registry.initialize(
        "0x7689A7ce1d9a09e2B996cCCb6cD81c015D5E36d3", // tokenFactory
        "0xd64fd6b463aC54252FAB669a29d51Ae3373C3467", // bondingCurve
        "0xDC225E7d4e3a1e5A65aC39F4B60E85f7657FFf0C", // liquidityPool
        "0x7231bB2Ebc50cB32731cf7303E077B0042ab6778", // userManager
        "0xCaCbd1C17f36061593181B6E482DaB822815c9a5", // feeManager
        marketGraduationAddress, // marketGraduation
        "0x952E6c15BEA13B9A6077419456B59f46c43F2934"  // wokb
    );
    console.log("Registry initialized with all contracts");

    console.log("\n=== Final Contract Addresses ===");
    console.log("MARKET_GRADUATION:", marketGraduationAddress);
    console.log("\nAll contracts deployed and configured!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });