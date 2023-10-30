// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract telecom {
    struct Customer {
        uint256 customerId;
        uint256 lastBillDate;
        uint256 lastBillAmount;
    }

    mapping(address => Customer) public customers;

    // Function to submit a bill for a customer
    function submitBill(uint256 _customerId, uint256 _billDate, uint256 _billAmount) public {
        require(_billAmount > 0, "Bill amount must be greater than zero");
        customers[msg.sender] = Customer(_customerId, _billDate, _billAmount);
    }

    // Function to retrieve the customer's last bill date and amount
    function getCustomerLastBill() public view returns (uint256 customerId, uint256 lastBillDate, uint256 lastBillAmount) {
    Customer storage customer = customers[msg.sender];
    require(customer.customerId > 0, "Customer ID not found");
    return (customer.customerId, customer.lastBillDate, customer.lastBillAmount);
    }

}