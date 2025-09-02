const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const feeRecipient = deployer.address;

    console.log("1. Deploying WOKB...");
    const WOKB = await ethers.getContractFactory("WOKB");
    const wokb = await WOKB.deploy();
    await wokb.waitForDeployment();
    const wokbAddress = await wokb.getAddress();
    console.log("WOKB deployed to:", wokbAddress);

    console.log("2. Deploying PumpFunLaunchpad...");
    const PumpFunLaunchpad = await ethers.getContractFactory("PumpFunLaunchpad");
    const launchpad = await PumpFunLaunchpad.deploy(feeRecipient, wokbAddress);
    
    await launchpad.waitForDeployment();
    const launchpadAddress = await launchpad.getAddress();
    console.log("PumpFunLaunchpad deployed to:", launchpadAddress);
    
    const deploymentInfo = {
        network: hre.network.name,
        wokb: wokbAddress,
        launchpad: launchpadAddress,
        feeRecipient: feeRecipient,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        quickswapFactory: "0xd2480162Aa7F02Ead7BF4C127465446150D58452",
        quickswapPositionManager: "0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd"
    };
    
    console.log("\nDeployment Info:", JSON.stringify(deploymentInfo, null, 2));
    
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\nWaiting for block confirmations...");
        await launchpad.deploymentTransaction().wait(5);
        
        try {
            await hre.run("verify:verify", {
                address: wokbAddress,
                constructorArguments: [],
            });
            console.log("WOKB verified on explorer");
            
            await hre.run("verify:verify", {
                address: launchpadAddress,
                constructorArguments: [feeRecipient, wokbAddress],
            });
            console.log("PumpFunLaunchpad verified on explorer");
        } catch (error) {
            console.log("Verification failed:", error.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });