// import Web3 from 'web3';

// let selectedAccount;

// export const init = async () => {
//   let provider = window.ethereum;

//   if (typeof provider !== 'undefined') {
//     /// metamask is installed
//     console.log('metamask is installed!');
//     provider
//       .request({ method: 'eth_requestAccounts' })
//       .then((accounts) => {
//         //   console.log(accounts);
//         selectedAccount = accounts[0];
//         console.log(`Selected account is ${selectedAccount}`);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     window.ethereum.on('accountsChanged', (accounts) => {
//       selectedAccount = accounts[0];
//       console.log(`Selected account changed to ${selectedAccount}`);
//     });
//   }
//   const providerUrl =
//     'https://goerli.infura.io/v3/91504c66b254484881c8f33902d0e6fa';
//   const web3 = new Web3(providerUrl);

//   // The minimum ABI required to get the ERC20 Token balance
//   //   const minABI = [
//   //     // balanceOf
//   //     {
//   //       constant: true,
//   //       inputs: [{ name: '_owner', type: 'address' }],
//   //       name: 'balanceOf',
//   //       outputs: [{ name: 'balance', type: 'uint256' }],
//   //       type: 'function',
//   //     },
//   //   ];
// //
//   const walletAddress = '0x5c3b725c4e6add418b065e78af16b983a0f837f1';
//   const contract = new web3.eth.Contract(ABI, tokenAddress);

//   console.log({ contract });

//   const formatBalance = (balance, decimals) => {
//     const formattedBalance = parseInt(balance) / 10 ** decimals;
//     return formattedBalance;
//   };

//   async function getBalance() {
//     const result = await contract.methods.balanceOf(walletAddress).call();
//     // const name = await contract.methods.name().call();
//     // console.log({ name });
//     const totalSupply = await contract.methods.totalSupply().call();
//     console.log({ totalSupply });
//     const symbol = await contract.methods.symbol().call();
//     console.log({ symbol });

//     const decimals = await contract.methods.decimals().call();
//     console.log({ decimals: Number(decimals) });
//     //   const result = contract.methods
//     //     .balanceOf(walletAddress)
//     //     .call()
//     //     .then((balance) => web3.utils.fromWei(Number(balance)));

//     console.log({ result: Number(result) });
//     // // eslint-disable-next-line no-undef
//     // const format = web3.utils.fromWei(Number(result));
//     const format = formatBalance(Number(result), Number(decimals));
//     // const format = web3.utils.fromWei(Number(result), 'ether');

//     console.log({ format });
//     return format;
//     //   console.log({ result: Number(result) });
//   }

//   //   const balance = formatBalance(
//   //     await window.ethereum.request({
//   //       method: 'eth_getBalance',
//   //       params: [selectedAccount, 'latest'],
//   //     })
//   //   );

//   return getBalance();
// };

// const providerUrl =
//   'https://goerli.infura.io/v3/91504c66b254484881c8f33902d0e6fa';
// const web3 = new Web3(providerUrl);
// // // const web3 = init();
// // const web3 = new Web3(Web3.givenProvider);
// console.log({ web3 });

// window.addEventListener('load', function () {
//   // Check if web3 is available
//   if (typeof window.ethereum !== 'undefined') {
//     // Use the browser injected Ethereum provider
//     const web3 = new Web3(window.ethereum);
//     // Request access to the user's MetaMask account
//     window.ethereum.enable();
//     // Get the user's accounts
//     web3.eth.getAccounts().then(function (accounts) {
//       // Show the first account
//       console.log('Connected with MetaMask account: ' + accounts[0]);
//     });
//   } else {
//     // If web3 is not available, give instructions to install MetaMask
//     console.log(
//       'Please install MetaMask to connect with the Ethereum network'
//     );
//   }
// });
