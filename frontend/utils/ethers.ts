import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// JSON RPC Provider
// const LOCAL_NODE_URL = "http://127.0.0.1:8545/";
// const MUMBAI_NODE_URL = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
const POLYGON_NODE_URL = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_PRODUCTION}`;
const jsonRpcProvider = new ethers.JsonRpcProvider(POLYGON_NODE_URL);

export function getJsonRpcProvider(): ethers.JsonRpcProvider {
  return jsonRpcProvider;
}

// Web3 Provider (e.t. Metamask)
let web3Provider: ethers.BrowserProvider | undefined;

export function initializeWeb3Provider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    web3Provider = new ethers.BrowserProvider((window as any).ethereum);
  }
}

export function getWeb3Provider(): ethers.BrowserProvider | undefined {
  if (!web3Provider) {
    throw new Error(
      "Web3 provider is not initialized. Please call initializeWeb3Provider() first."
    );
  }
  return web3Provider;
}

export function getSigner() {
  if (!web3Provider) {
    throw new Error(
      "Web3 provider is not initialized. Please call initializeWeb3Provider() first."
    );
  }
  return web3Provider.getSigner();
}
