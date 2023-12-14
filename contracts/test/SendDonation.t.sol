// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import {Test, console2} from "forge-std/Test.sol";
import {DonationBox} from "src/DonationBox.sol";

contract SendDonation is Test {
    DonationBox public donationBox;

    function setUp() public {
        vm.createSelectFork("sepolia");

        address alice = makeAddr("alice");
        vm.deal(alice, 10 ether);

        vm.startPrank(alice);
        donationBox = new DonationBox();
        vm.stopPrank();
    }

    function testFuzzDonate(string memory salt, uint256 value) public {
        address bob = makeAddr(salt);

        vm.deal(bob, value);
        uint256 donation = value / 2;
        vm.startPrank(bob);

        donationBox.donate{value: donation}();
        vm.stopPrank();

        assertEq(donationBox.getTotalDonations(), donation);
    }
}
