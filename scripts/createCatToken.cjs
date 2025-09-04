const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Creating CATLAYER token with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const tokenFactoryAddress = "0xa959A269696cEd243A0E2Cc45fCeD8c0A24dB88e";
    
    console.log("Getting TokenFactory contract...");
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    const tokenFactory = TokenFactory.attach(tokenFactoryAddress);
    
    const tokenData = {
        name: "Cat Layer",
        symbol: "CATLAYER",
        supply: ethers.parseEther("1000000000"), // 1B tokens
        imageUri: "/catlayer.svg",
        description: "The purrfect meme token for X Layer! Join the cat revolution on the blockchain."
    };
    
    console.log("Creating token with data:", {
        name: tokenData.name,
        symbol: tokenData.symbol,
        supply: tokenData.supply.toString(),
        imageUri: tokenData.imageUri,
        description: tokenData.description
    });
    
    // Creation fee is typically 0.01 OKB
    const creationFee = ethers.parseEther("0.01");
    
    try {
        const tx = await tokenFactory.createToken(
            tokenData.name,
            tokenData.symbol,
            tokenData.supply,
            tokenData.imageUri,
            tokenData.description,
            { value: creationFee }
        );
        
        console.log("Transaction hash:", tx.hash);
        console.log("Waiting for confirmation...");
        
        const receipt = await tx.wait();
        console.log("Token creation confirmed in block:", receipt.blockNumber);
        
        // Find the TokenCreated event
        const tokenCreatedEvent = receipt.logs.find(
            log => log.topics[0] === ethers.id("TokenCreated(address,address,string,string)")
        );
        
        if (tokenCreatedEvent) {
            const tokenAddress = ethers.getAddress("0x" + tokenCreatedEvent.topics[1].slice(26));
            console.log("\n🎉 CATLAYER token created successfully!");
            console.log("Token Address:", tokenAddress);
            console.log("Creator:", deployer.address);
            console.log("Name:", tokenData.name);
            console.log("Symbol:", tokenData.symbol);
            console.log("Total Supply:", ethers.formatEther(tokenData.supply));
            
            console.log("\nYou can now view this token in your app at:");
            console.log(`http://localhost:5173/token/${tokenAddress}`);
        }
        
    } catch (error) {
        console.error("Token creation failed:", error.message);
        if (error.data) {
            console.error("Error data:", error.data);
        }
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });