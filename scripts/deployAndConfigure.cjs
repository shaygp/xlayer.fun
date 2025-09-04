const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

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
    console.log(`REGISTRY="${contracts.registry}"`);
    console.log(`TOKEN_FACTORY="${contracts.tokenFactory}"`);
    console.log(`BONDING_CURVE="${contracts.bondingCurve}"`);
    console.log(`LIQUIDITY_POOL="${contracts.liquidityPool}"`);
    console.log(`USER_MANAGER="${contracts.userManager}"`);
    console.log(`FEE_MANAGER="${contracts.feeManager}"`);
    console.log(`MARKET_GRADUATION="${contracts.marketGraduation}"`);
    console.log(`WOKB="${contracts.wokb}"`);

    console.log("\n10. Updating frontend configuration...");
    await updateFrontendConfig(contracts);

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

async function updateFrontendConfig(contracts) {
    const configPath = path.join(__dirname, '..', 'src', 'config', 'contracts.ts');
    
    try {
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        configContent = configContent.replace(
            /REGISTRY: ''/,
            `REGISTRY: '${contracts.registry}'`
        );
        configContent = configContent.replace(
            /TOKEN_FACTORY: ''/,
            `TOKEN_FACTORY: '${contracts.tokenFactory}'`
        );
        configContent = configContent.replace(
            /BONDING_CURVE: ''/,
            `BONDING_CURVE: '${contracts.bondingCurve}'`
        );
        configContent = configContent.replace(
            /LIQUIDITY_POOL: ''/,
            `LIQUIDITY_POOL: '${contracts.liquidityPool}'`
        );
        configContent = configContent.replace(
            /USER_MANAGER: ''/,
            `USER_MANAGER: '${contracts.userManager}'`
        );
        configContent = configContent.replace(
            /FEE_MANAGER: ''/,
            `FEE_MANAGER: '${contracts.feeManager}'`
        );
        configContent = configContent.replace(
            /MARKET_GRADUATION: ''/,
            `MARKET_GRADUATION: '${contracts.marketGraduation}'`
        );
        configContent = configContent.replace(
            /WOKB: ''/,
            `WOKB: '${contracts.wokb}'`
        );
        
        fs.writeFileSync(configPath, configContent);
        console.log("Frontend configuration updated successfully!");
        
    } catch (error) {
        console.error("Error updating frontend configuration:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });