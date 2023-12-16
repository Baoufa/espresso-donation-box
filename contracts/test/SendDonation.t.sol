// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import {Test, console2} from "forge-std/Test.sol";
import {DonationBox} from "src/DonationBox.sol";

contract SendDonation is Test {
    DonationBox public donationBox;

    function setUp() public {
        vm.createSelectFork("sepolia");

        address alice = makeAddr("0x2642381fdf335501897a31d0f96de374b4d8d237");
        vm.deal(alice, 10 ether);

        vm.startPrank(alice);
        donationBox = new DonationBox();
        vm.stopPrank();
    }

    function testFuzzDonate() public {
        address bob = makeAddr("bob");

        vm.deal(bob, 20 ether);
        uint256 donation = 10 ether;
        vm.startPrank(bob);

        donationBox.donate{value: donation}();
        vm.stopPrank();

        assertEq(donationBox.getTotalDonations(), donation);
    }
}
