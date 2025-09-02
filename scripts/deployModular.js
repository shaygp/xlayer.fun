const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying modular contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const contracts = {};

    console.log("\n1. Deploying WOKB...");
    const WOKB = await ethers.getContractFactory("WOKB");
    const wokb = await WOKB.deploy();
    await wokb.waitForDeployment();
    contracts.wokb = await wokb.getAddress();
    console.log("WOKB deployed to:", contracts.wokb);

    console.log("\n2. Deploying Registry...");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();
    contracts.registry = await registry.getAddress();
    console.log("Registry deployed to:", contracts.registry);

    console.log("\n3. Deploying TokenFactory...");
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    const tokenFactory = await TokenFactory.deploy(contracts.registry);
    await tokenFactory.waitForDeployment();
    contracts.tokenFactory = await tokenFactory.getAddress();
    console.log("TokenFactory deployed to:", contracts.tokenFactory);

    console.log("\n4. Deploying BondingCurveContract...");
    const BondingCurveContract = await ethers.getContractFactory("BondingCurveContract");
    const bondingCurve = await BondingCurveContract.deploy(contracts.registry);
    await bondingCurve.waitForDeployment();
    contracts.bondingCurve = await bondingCurve.getAddress();
    console.log("BondingCurveContract deployed to:", contracts.bondingCurve);

    console.log("\n5. Deploying LiquidityPoolContract...");
    const LiquidityPoolContract = await ethers.getContractFactory("LiquidityPoolContract");
    const liquidityPool = await LiquidityPoolContract.deploy(contracts.registry);
    await liquidityPool.waitForDeployment();
    contracts.liquidityPool = await liquidityPool.getAddress();
    console.log("LiquidityPoolContract deployed to:", contracts.liquidityPool);

    console.log("\n6. Deploying UserManagement...");
    const UserManagement = await ethers.getContractFactory("UserManagement");
    const userManager = await UserManagement.deploy(contracts.registry);
    await userManager.waitForDeployment();
    contracts.userManager = await userManager.getAddress();
    console.log("UserManagement deployed to:", contracts.userManager);

    console.log("\n7. Deploying FeeManager...");
    const FeeManager = await ethers.getContractFactory("FeeManager");
    const feeManager = await FeeManager.deploy(contracts.registry, deployer.address);
    await feeManager.waitForDeployment();
    contracts.feeManager = await feeManager.getAddress();
    console.log("FeeManager deployed to:", contracts.feeManager);

    console.log("\n8. Deploying MarketGraduation...");
    const MarketGraduation = await ethers.getContractFactory("MarketGraduation");
    const marketGraduation = await MarketGraduation.deploy(contracts.registry);
    await marketGraduation.waitForDeployment();
    contracts.marketGraduation = await marketGraduation.getAddress();
    console.log("MarketGraduation deployed to:", contracts.marketGraduation);

    console.log("\n9. Initializing Registry...");
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

    const deploymentInfo = {
        network: hre.network.name,
        contracts: contracts,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        quickswapFactory: "0xd2480162Aa7F02Ead7BF4C127465446150D58452",
        quickswapPositionManager: "0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd"
    };
    
    console.log("\n=== Deployment Complete ===");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n=== Contract Addresses for Frontend ===");
    console.log(`REGISTRY_ADDRESS="${contracts.registry}"`);
    console.log(`TOKEN_FACTORY_ADDRESS="${contracts.tokenFactory}"`);
    console.log(`BONDING_CURVE_ADDRESS="${contracts.bondingCurve}"`);
    console.log(`LIQUIDITY_POOL_ADDRESS="${contracts.liquidityPool}"`);
    console.log(`USER_MANAGER_ADDRESS="${contracts.userManager}"`);
    console.log(`FEE_MANAGER_ADDRESS="${contracts.feeManager}"`);
    console.log(`MARKET_GRADUATION_ADDRESS="${contracts.marketGraduation}"`);
    console.log(`WOKB_ADDRESS="${contracts.wokb}"`);

    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\nWaiting for block confirmations...");
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        console.log("\nVerifying contracts...");
        
        const verifyContract = async (address, args) => {
            try {
                await hre.run("verify:verify", {
                    address: address,
                    constructorArguments: args,
                });
                console.log(`Verified: ${address}`);
            } catch (error) {
                console.log(`Verification failed for ${address}:`, error.message);
            }
        };
        
        await verifyContract(contracts.wokb, []);
        await verifyContract(contracts.registry, []);
        await verifyContract(contracts.tokenFactory, [contracts.registry]);
        await verifyContract(contracts.bondingCurve, [contracts.registry]);
        await verifyContract(contracts.liquidityPool, [contracts.registry]);
        await verifyContract(contracts.userManager, [contracts.registry]);
        await verifyContract(contracts.feeManager, [contracts.registry, deployer.address]);
        await verifyContract(contracts.marketGraduation, [contracts.registry]);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });