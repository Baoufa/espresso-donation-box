// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "src/DonationBox.sol";

contract DeployDonationBox is Script {
    function run() public {
        vm.startBroadcast();
        DonationBox donationBox = new DonationBox();
        console2.log("Donation Box deployed at", address(donationBox));
        vm.stopBroadcast();
    }
}
