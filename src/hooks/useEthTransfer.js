import React from 'react';
import Web3 from 'web3';
import { ABI, tokenAddress } from '../config/hord6';

function useEthTransfer(fromAddress, toAddress = '', amountToTransfer = 0) {
  React.useEffect(() => {
    async function getBalance() {
      const result = await contract.methods.balanceOf(fromAddress).call();
      const decimals = await contract.methods.decimals().call();
      // console.log({ decimals: Number(decimals) });

      const formattedBalance = formatBalance(Number(result), Number(decimals));

      // console.log({ format });
      setBalance(formattedBalance);
    }
    fromAddress && getBalance();
  }, [fromAddress]);

  const [balance, setBalance] = React.useState(0);

  const providerUrl = `https://goerli.infura.io/v3/${process.env.REACT_APP_KEY}`;
  const web3 = new Web3(providerUrl);
  const contract = new web3.eth.Contract(ABI, tokenAddress);

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

  // if (!fromAddress)
  //   return {
  //     web3: undefined,
  //     amountError: '',
  //     toError: '',
  //   }; // nothing meaningful to return if no wallet exists

  // console.log({ contract });
  // console.log({ amountToTransfer });
  // console.log({ balance });
  const amountError =
    amountToTransfer > balance
      ? `Maximum tokens available for transfer is ${balance}`
      : '';
  const toError =
    toAddress && !isValidAddress(toAddress) ? 'Invalid ethereum address' : '';

  return {
    web3,
    amountError,
    toError,
  };
}

export default useEthTransfer;
