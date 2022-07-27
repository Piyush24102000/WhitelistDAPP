import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { address, abi } from "./constants";
export default function Home() {

  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };
  //////////////Add address to whitelist///////////////
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const addAddressToWhitelist = async () => {
    const signer = await getProviderOrSigner(true);
    const whitelistContract = new Contract(
      address,
      abi,
      signer
    );
    const tx = await whitelistContract.addAddressToWhitelist();
    setLoading(true);
    await tx.wait();
    setLoading(false);
    await getNumberOfWhitelisted();
    setJoinedWhitelist(true);
  };
  /////////////Get number of whitelisted addresses/////////////////////
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);

  const getNumberOfWhitelisted = async () => {
    const provider = await getProviderOrSigner();
    const whitelistContract = new Contract(
      address,
      abi,
      provider
    );
    const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
    setNumberOfWhitelisted(_numberOfWhitelisted);

  };
  //////////////////Check if address in wallet///////////////
  const checkIfAddressInWhitelist = async () => {

    const signer = await getProviderOrSigner(true);
    const whitelistContract = new Contract(
      address,
      abi,
      signer
    );
    const accaddress = await signer.getAddress();
    const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
      accaddress
    );
    setJoinedWhitelist(_joinedWhitelist);

  };
  /////////////////Connect Wallet///////////////////
  const connectWallet = async () => {
try{
    await getProviderOrSigner();
    setWalletConnected(true);

    checkIfAddressInWhitelist();
    getNumberOfWhitelisted();
}catch(err){
  console.error(err);
}
  };
  ////////////////Render Button/////////////////
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };
  //////////////////////////
  useEffect(() => {
    if (!walletConnected) {

      web3ModalRef.current = new Web3Modal({
        network: "matic",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (

    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Tech Bulls!</h1>
          <div className={styles.description}>
            Tech Bull is a NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
          <div className={styles.blinking}>
            <h3>Hurry Up! Only first 10 users will be whitelisted...</h3>
          </div>
        </div>
        <div>
          <img className={styles.image} src="./tb.svg" />
        </div>

      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Piyush Tale
      </footer>

    </div>
  );
}