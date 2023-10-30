import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import telecom from './telecom.json';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [lastBillDate, setLastBillDate] = useState(undefined);
  const [lastBillAmount, setLastBillAmount] = useState(undefined);
  const [customerId, setCustomerId] = useState(0);
  const [billDate, setBillDate] = useState(0);
  const [billAmount, setBillAmount] = useState(0);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3);
        } catch (error) {
          console.error(error);
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        setWeb3(web3);
      } else {
        console.error('No web3 instance detected');
      }
    };
    initWeb3();
  }, []);

  useEffect(() => {
    const initContract = async () => {
      if (web3 !== undefined) {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = telecom.networks[networkId];
        const contract = new web3.eth.Contract(telecom.abi, deployedNetwork && deployedNetwork.address);
        setContract(contract);
      }
    };
    initContract();
  }, [web3]);

  useEffect(() => {
    const getAccount = async () => {
      if (web3 !== undefined) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    };
    getAccount();
  }, [web3]);

  const handleSubmitBill = async () => {
    const weiAmount = web3.utils.toWei(billAmount.toString(), 'ether');
    const txData = contract.methods.submitBill(customerId, billDate, weiAmount).encodeABI();
    const gasLimit = await contract.methods.submitBill(customerId, billDate, weiAmount).estimateGas({ from: account });
    const nonce = await web3.eth.getTransactionCount(account);
    const rawTransaction = {
      from: account,
      to: contract.options.address,
      nonce,
      gas: gasLimit,
      data: txData,
    };

    await web3.eth.sendTransaction(rawTransaction);

    // Reset form fields
    setCustomerId(0);
    setBillDate(0);
    setBillAmount(0);
  };

  const handleGetLastBill = async () => {
    const { lastBillDate, lastBillAmount } = await contract.methods.getCustomerLastBill().call({ from: account });
    setLastBillDate(lastBillDate);
    setLastBillAmount(web3.utils.fromWei(lastBillAmount, 'ether'));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Telecommunication Billing</h2>
        <p>Account: {account}</p>
      </header>
      <main>
        <div className="Billing-form">
          <h2>Submit Bill</h2>
          <label htmlFor="customerId">Customer ID:</label>
          <input
            type="number"
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(parseInt(e.target.value))}
          />
          <label htmlFor="billDate">Bill Month:</label>
          <input
            type="number"
            id="billDate"
            value={billDate}
            onChange={(e) => setBillDate(parseInt(e.target.value))}
          />
          <label htmlFor="billAmount">Bill Amount (in Ether):</label>
          <input
            type="number"
            id="billAmount"
            value={billAmount}
            onChange={(e) => setBillAmount(parseFloat(e.target.value))}
          />
          <button onClick={handleSubmitBill}>Submit</button>
        </div>
        <div className="Last-bill">
          <h2>Last Bill Details</h2>
          <button onClick={handleGetLastBill}>Get Last Bill</button>
          <p>Customer ID: {customerId}</p>
          <p>Last Bill Month: {lastBillDate}</p>
          <p>Last Bill Amount (in Ether): {lastBillAmount}</p>
        </div>
      </main>
    </div>
  );
}

