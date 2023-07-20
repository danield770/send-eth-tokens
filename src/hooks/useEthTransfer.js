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
    transferStatus === 'success' && getBalance();
  }, [transferStatus]);

  const [balance, setBalance] = React.useState(0);
  const [decimals, setDecimals] = React.useState(0);

  const providerUrl = `https://goerli.infura.io/v3/${process.env.REACT_APP_KEY}`;
  const web3 = new Web3(providerUrl);
  const contract = new web3.eth.Contract(ABI, tokenAddress);

  async function getBalance() {
    const result = await contract.methods.balanceOf(fromAddress).call();
    const contractDecimals = await contract.methods.decimals().call();

    setDecimals(Number(contractDecimals));

    const formattedBalance = formatBalance(
      Number(result),
      Number(contractDecimals)
    );

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

  const amountError =
    amountToTransfer > balance
      ? `Maximum tokens available for transfer is ${balance}`
      : '';
  const toError =
    toAddress && !isValidAddress(toAddress) ? 'Invalid ethereum address' : '';

  const TRANSFER_FUNCTION_ABI = {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  };

  return {
    amountError,
    toError,
    data:
      !toAddress || toError
        ? ''
        : web3.eth.abi.encodeFunctionCall(TRANSFER_FUNCTION_ABI, [
            toAddress,
            amountToTransfer * 10 ** decimals,
          ]),
  };
}

export default useEthTransfer;
