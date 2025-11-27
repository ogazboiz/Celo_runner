// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {NFTMarketplace} from "../src/NFTMarketplace.sol";

contract DeployMarketplace is Script {
    // RunnerBadge contract address on Celo Sepolia
    address constant RUNNER_BADGE = 0x7B72c0E84012f868fe9a4164a8122593d0F38B84;
    // cUSD token address on Celo Sepolia
    address constant CUSD_TOKEN = 0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying NFTMarketplace...");
        console.log("RunnerBadge address:", RUNNER_BADGE);
        console.log("cUSD token address:", CUSD_TOKEN);

        NFTMarketplace marketplace = new NFTMarketplace(RUNNER_BADGE, CUSD_TOKEN);

        console.log("NFTMarketplace deployed at:", address(marketplace));
        console.log("Update CONTRACTS.MARKETPLACE in frontend config with:", address(marketplace));

        vm.stopBroadcast();
    }
}

