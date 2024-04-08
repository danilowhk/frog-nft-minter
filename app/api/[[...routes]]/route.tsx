/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { handle } from 'frog/next'
import { mintNft, balanceOf } from '../../../utils/mint'

const privateKey = process.env.PRIVATE_KEY as `0x`;
const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Define a route for the root ('/') frame where the initial form is presented
app.frame('/', (c) => {
  return c.res({
    action: "/mint",
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/mint.png`,
    imageAspectRatio: '1:1',
    intents: [
      <TextInput placeholder="Address" />,
      // Button to mint the NFT
      <Button value="Mint">Mint NFT</Button>,
    ],
  })
})

// Define a route for the '/mint' frame where the minting process is handled
app.frame('/mint', async (c) => {
  console.log("Minting...");

  // Extract inputText from the context, which presumably contains the Ethereum address
  const { inputText } = c;

  // Validate the Ethereum address format using a regular expression
  // This checks if the address starts with '0x' followed by 40 hex characters
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(inputText as `0x`);
  if (!isValidAddress) {
    // If the address is not valid, return a response indicating the invalid address
    // and prompt the user to go back or correct it
    return c.res({
      action: "/",
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/invalid_address.png`,
      imageAspectRatio: '1:1',
      intents: [
        // Button component to navigate back or take appropriate action
        <Button value="Invalid Address">Go Back</Button>,
      ],
    });
  }
  
  // Cast the validated inputText to an Ethereum address format
  const address = inputText as `0x`;
  // Call balanceOf to get the current balance of the address
  const balanceData = await balanceOf(address);
  console.log("Balance Before:", balanceData);
  // Check address already have the NFT
  if (balanceData == 0) {
    try {
      // Attempt to mint an NFT for the given address
      const mintTransaction: any = await mintNft(address, privateKey);
      console.log("Mint Transaction:", mintTransaction);
      // If minting is successful, return a success response with the minted NFT image
      return c.res({
        action: "/",
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/minted.png`,
        imageAspectRatio: '1:1',
        intents: [
          // Button component indicating the minting was successful
          <Button value="Minted">Minted</Button>,
        ],
      });
    } catch (error) {
      // Log and handle any errors that occur during the minting process
      console.error("Minting failed:", error);
      // Return a failure response if minting fails
      return c.res({
        action: "/",
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/mint_failed.png`,
        imageAspectRatio: '1:1',
        intents: [
          // Button component to navigate back or take appropriate action on failure
          <Button value="Mint Failed">Go Back</Button>,
        ],
      });
    }
  }

  // If the balance is not zero, it means the NFT has already been minted for this address
  // Return a response indicating the NFT is already minted
  return c.res({
    action: "/",
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/already_minted.png`,
    imageAspectRatio: '1:1',
    intents: [
      // Button component indicating the NFT is already minted
      <Button value="Minted">Already Minted</Button>,
    ],
  });
});

export const GET = handle(app)
export const POST = handle(app)
