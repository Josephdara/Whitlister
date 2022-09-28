import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { Contract, providers } from "ethers";
import { ABI, WHITELIST_CONTRACT_ADDRESS } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [addressesWhitelisted, setAddressesWhitelisted] = useState(0);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3modalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3modalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 5) {
        window.alert("change network to goerli");
        throw new Error("change network to goerli");
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (err) {
      console.error(err);
    }
  };
  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        signer
      );
      const tx = await whitelistContract.whitelistAnAddress();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        signer
      );
      const address = await signer.getAddress();
      const joinedWhitelist = await whitelistContract.whitelisted(address);
      setJoinedWhitelist(joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        provider
      );
      const addressesWhitelisted =
        await whitelistContract.addressesWhitelisted();
      setAddressesWhitelisted(addressesWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>Thanks, You already Joined!!</div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading....</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join Whitelist
          </button>
        );
      }
    } else {
      <button onClick={connectWallet} className={styles.button}>
        Connect Your Wallet
      </button>;
    }
  };
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3modalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title> Whitelisting app</title>
        <meta name="description" content="Whitelisting App" />
      </Head>
      <div className={styles.main}>
        <h1 className={styles.title}> Welcome to Glory Sound Prep</h1>

        <div className={styles.description}>
          {addressesWhitelisted} have already joined the Whitelist
        </div>
        {renderButton()}
        <div>
          <img className={styles.image} src="./crypto-devs.svg"></img>
        </div>
      </div>
      <footer className={styles.footer}>Made by josephdara.eth</footer>
    </div>
  );
}
