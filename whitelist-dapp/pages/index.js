import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal, { providers } from "web3modal";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [addressesWhitelisted, setAddressesWhitelisted] = useState(0);
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
      return web3Provider;
    } catch (err) {
      console.error(err);
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
        <br />
        <div className={styles.description}>
          {addressesWhitelisted} have already joined the Whitelist
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg"></img>
        </div>
      </div>
      <footer className={styles.footer}>Made by josephdara.eth</footer>
    </div>
  );
}
