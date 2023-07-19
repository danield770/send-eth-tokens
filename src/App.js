import React from 'react';
import useEthTransfer from './hooks/useEthTransfer';
import detectEthereumProvider from '@metamask/detect-provider';
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
    // window.ethereum.on('accountsChanged', (accounts) => {
    //   setWallet({ accounts });
    //   console.log(`Selected account changed to ${accounts[0]}`);
    // });
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);
  const [hasProvider, setHasProvider] = React.useState(null);
  const initialState = { accounts: [] };
  const [wallet, setWallet] = React.useState(initialState);
  const [toAddress, setToAddress] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const { web3, toError, amountError } = useEthTransfer(
    wallet.accounts[0],
    toAddress,
    amount
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
  }
  console.log({ web3 });

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
          min={1}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder='Amount of tokens to transfer'
        />
        {amountError && <div className='error'>{amountError}</div>}
        <button className='btn' disabled={invalidForm} type='submit'>
          Transfer Tokens
        </button>
      </form>
    </>
  );
}
export default App;
