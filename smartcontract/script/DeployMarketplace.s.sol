// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {NFTMarketplace} from "../src/NFTMarketplace.sol";

contract DeployMarketplace is Script {
    // RunnerBadge contract address on Celo Sepolia
    address constant RUNNER_BADGE = 0x7B72c0E84012f868fe9a4164a8122593d0F38B84;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying NFTMarketplace...");
        console.log("RunnerBadge address:", RUNNER_BADGE);

        NFTMarketplace marketplace = new NFTMarketplace(RUNNER_BADGE);

        console.log("NFTMarketplace deployed at:", address(marketplace));
        console.log("Update CONTRACTS.MARKETPLACE in frontend config with:", address(marketplace));

        vm.stopBroadcast();
    }
}

