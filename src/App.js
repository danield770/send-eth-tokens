import React from 'react';
import useEthTransfer from './hooks/useEthTransfer';
import detectEthereumProvider from '@metamask/detect-provider';
import { tokenAddress } from './config/hord6';
import './App.css';

function App() {
  React.useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log({ provider });
      setHasProvider(Boolean(provider));
    };
    const connectAccount = async () => {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log({ accounts });
      setWallet({ accounts });
    };
    const handleAccountsChanged = (accounts) => setWallet({ accounts });

    getProvider();
    connectAccount();
    window.ethereum.on('accountsChanged', (accounts) => {
      setWallet({ accounts });
      console.log(`Selected account changed to ${accounts[0]}`);
    });
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const [hasProvider, setHasProvider] = React.useState(null);
  const [wallet, setWallet] = React.useState({ accounts: [] });
  const [toAddress, setToAddress] = React.useState('');
  const [amount, setAmount] = React.useState(null);
  const [transferStatus, setTransferStatus] = React.useState('idle');
  const [txnHash, setTxnHash] = React.useState('');
  const [txnError, setTxnError] = React.useState('');
  const { toError, amountError, data } = useEthTransfer(
    wallet.accounts[0],
    toAddress,
    amount,
    transferStatus
  );
  const invalidForm = !toAddress || !amount || toError || amountError;

  if (!hasProvider) {
    return (
      <div>Please install MetaMask to connect with the Ethereum network</div>
    );
  }
  function onSubmit(e) {
    e.preventDefault();
    console.log('starting transfer...');
    setTransferStatus('pending');

    window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: wallet.accounts[0],
            to: tokenAddress,
            data,
          },
        ],
      })
      .then((txHash) => {
        console.log(txHash);
        setTxnHash(txHash);
        setTransferStatus('success');
      })
      .catch((error) => {
        console.error(error);
        setTxnError(error);
        setTransferStatus('fail');
      });
  }
  function resetForm() {
    setToAddress('');
    setAmount(0);
    setTransferStatus('idle');
    setTxnHash('');
    setTxnError('');
  }

  return (
    <>
      <h1>
        <a href='https://goerli.etherscan.io/token/0xe72c69b02b4b134fb092d0d083b287cf595ed1e6'>
          HORD6
        </a>{' '}
        token Transfer
      </h1>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder='Wallet address of recipient'
        />
        {toError && <div className='error'>{toError}</div>}
        <input
          type='number'
          value={amount}
          min={1}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder='Amount of tokens to transfer'
        />
        {amountError && <div className='error'>{amountError}</div>}
        {transferStatus === 'success' || transferStatus === 'fail' ? (
          <input
            type='reset'
            value='Reset form'
            className='btn'
            onClick={resetForm}
          />
        ) : (
          <button
            className='btn'
            disabled={invalidForm || transferStatus === 'pending'}
            type='submit'
          >
            Transfer tokens
          </button>
        )}
      </form>
      {txnHash && (
        <>
          <h2>Transaction Successful!</h2>
          <div>Transaction Hash: {txnHash}</div>
        </>
      )}
      {txnError && (
        <>
          <h2>Transaction Failed!</h2>
          <div>Transaction Error: {txnError.toString()}</div>
        </>
      )}
    </>
  );
}
export default App;
