import React from 'react';
import Web3 from 'web3';
import { ABI, tokenAddress } from '../config/hord6';

function useEthTransfer(
  fromAddress,
  toAddress = '',
  amountToTransfer = 0,
  transferStatus = 'idle'
) {
  React.useEffect(() => {
    fromAddress && getBalance();
  }, [fromAddress]);

  React.useEffect(() => {
    function sendTokens() {
      contract.methods
        .transfer(toAddress, amountToTransfer)
        .send({ from: fromAddress })
        .on('transactionHash', function (hash) {
          console.log({ hash });
          setTxnHash(hash);
        })
        .on('receipt', function (receipt) {
          console.log({ receipt });
          setStatus('success');
          getBalance();
        })
        .on('error', function (error, receipt) {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log({ receipt });
          setStatus('fail');
        });
    }

    setStatus(transferStatus);
    transferStatus === 'pending' && sendTokens();
  }, [transferStatus]);

  const [balance, setBalance] = React.useState(0);
  const [status, setStatus] = React.useState(transferStatus);
  const [txnHash, setTxnHash] = React.useState('');

  const providerUrl = `https://goerli.infura.io/v3/${process.env.REACT_APP_KEY}`;
  const web3 = new Web3(providerUrl);
  const contract = new web3.eth.Contract(ABI, tokenAddress);

  async function getBalance() {
    const result = await contract.methods.balanceOf(fromAddress).call();
    const decimals = await contract.methods.decimals().call();
    // console.log({ decimals: Number(decimals) });

    const formattedBalance = formatBalance(Number(result), Number(decimals));

    // console.log({ format });
    setBalance(formattedBalance);
  }

  function formatBalance(balance, decimals) {
    const formattedBalance = parseInt(balance) / 10 ** decimals;

    return formattedBalance;
  }

  function isValidAddress(adr) {
    try {
      web3.utils.toChecksumAddress(adr);
      return true;
    } catch (e) {
      return false;
    }
  }

  console.log({ contract });
  // console.log({ amountToTransfer });
  // console.log({ balance });
  const amountError =
    amountToTransfer > balance
      ? `Maximum tokens available for transfer is ${balance}`
      : '';
  const toError =
    toAddress && !isValidAddress(toAddress) ? 'Invalid ethereum address' : '';

  return {
    amountError,
    toError,
    status,
    txnHash,
  };
}

export default useEthTransfer;
