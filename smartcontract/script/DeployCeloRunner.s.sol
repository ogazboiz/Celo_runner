// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/QuestToken.sol";
import "../src/RunnerBadge.sol";
import "../src/CeloRunner.sol";

/**
 * @title DeployCeloRunner
 * @dev Deployment script for Celo Runner game contracts
 * 
 * Usage:
 * forge script script/DeployCeloRunner.s.sol:DeployCeloRunner --rpc-url <your_rpc_url> --private-key <your_private_key> --broadcast
 * 
 * For Celo Alfajores testnet:
 * forge script script/DeployCeloRunner.s.sol:DeployCeloRunner --rpc-url https://alfajores-forno.celo-testnet.org --private-key <your_private_key> --broadcast
 */
contract DeployCeloRunner is Script {
    
    function run() external {
        // Get deployer private key from environment or use provided key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy QuestToken
        console.log("Deploying QuestToken...");
        QuestToken questToken = new QuestToken();
        console.log("QuestToken deployed at:", address(questToken));
        
        // 2. Deploy RunnerBadge
        console.log("Deploying RunnerBadge...");
        RunnerBadge runnerBadge = new RunnerBadge();
        console.log("RunnerBadge deployed at:", address(runnerBadge));
        
        // 3. Deploy CeloRunner with token addresses
        console.log("Deploying CeloRunner...");
        CeloRunner celoRunner = new CeloRunner(
            address(questToken),
            address(runnerBadge)
        );
        console.log("CeloRunner deployed at:", address(celoRunner));
        
        // 4. Set CeloRunner as authorized minter for both tokens
        console.log("Setting CeloRunner as authorized minter...");
        questToken.setGameContract(address(celoRunner));
        runnerBadge.setGameContract(address(celoRunner));
        
        console.log("\n=== Deployment Summary ===");
        console.log("QuestToken:", address(questToken));
        console.log("RunnerBadge:", address(runnerBadge));
        console.log("CeloRunner:", address(celoRunner));
        console.log("========================\n");
        
        vm.stopBroadcast();
    }
}
