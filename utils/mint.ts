import { ethers } from 'ethers';
import contractAbi from "./contract.json";

const rpcUrl = process.env.NEXT_PUBLIC_KAKAROT_SEPOLIA_URL;

const contractAddress = process.env.NEXT_PUBLIC_KAKAROT_SEPOLIA_CONTRACT_ADDRESS as `0x`;

const provider = new ethers.JsonRpcProvider(rpcUrl);
const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider);
export async function mintNft(toAddress: string, privateKey: any) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(wallet) as any;

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
      const balance = await contract.balanceOf(address);
      const owner = await contract.owner();
      return balance.toString();
    } catch (error) {
      console.log(error);
      return error;
    }
  }
