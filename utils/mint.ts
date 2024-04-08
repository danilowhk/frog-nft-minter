import { ethers } from 'ethers';
import contractAbi from "./contract.json";

// Environment variables for network configuration and contract interaction
const rpcUrl = process.env.NEXT_PUBLIC_KAKAROT_SEPOLIA_URL;
const contractAddress = process.env.NEXT_PUBLIC_KAKAROT_SEPOLIA_CONTRACT_ADDRESS as `0x`;

// Initialize provider and contract using ethers.js
const provider = new ethers.JsonRpcProvider(rpcUrl);
const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider);
export async function mintNft(toAddress: string, privateKey: any) {
  try {

    // Creating a wallet with the private key and provider to sign transactions
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(wallet) as any;

    // Executing the safeMint function of the contract to mint NFTs
    const transaction = await contractWithSigner.mintNFT(toAddress);
    console.log("transaction", transaction);

    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function balanceOf(address: string) {
    try {
      // Querying the balance and the contract owner for logging purposes
      const balance = await contract.balanceOf(address);
      return balance.toString();
      
    } catch (error) {
      console.log(error);
      return error;
    }
  }
