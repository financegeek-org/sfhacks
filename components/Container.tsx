// Import necessary modules and components
import * as fcl from "@onflow/fcl"; // Flow Client Library for interacting with the blockchain
import * as types from "@onflow/types"; // Flow types for argument types
import useCurrentUser from "../hooks/useCurrentUser"; // Custom hook for user authentication
import { useEffect, useState } from "react"; // React hooks for managing state
import TotalSupplyQuickNFT from "../cadence/scripts/TotalSupplyQuickNFT.cdc"; // Cadence script to get total NFT supply
import GetMetadataQuickNFT from "../cadence/scripts/GetMetadataQuickNFT.cdc"; // Cadence script to get NFT metadata
import GetIDsQuickNFT from "../cadence/scripts/GetIDsQuickNFT.cdc"; // Cadence script to get NFT IDs
import SetUpAccount from "../cadence/transactions/SetUpAccount.cdc"; // Cadence transaction to set up a user account
import MintNFT from "../cadence/transactions/MintNFT.cdc"; // Cadence transaction to mint an NFT
import elementStyles from "../styles/Elements.module.css"; // CSS styles for elements
import containerStyles from "../styles/Container.module.css"; // CSS styles for containers
import useConfig from "../hooks/useConfig"; // Custom hook for configuration
import { createExplorerTransactionLink } from "../helpers/links"; // Helper function to create transaction links
import {
  FacebookShareButton,
  InstapaperShareButton,
  LineShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
} from "react-share";

// Function to generate a random integer between 0 and 2
function randomInteger0To2(): number {
  return Math.floor(Math.random() * 3);
}

// Define the Container component as the default export
export default function Container() {
  // State variables to store data and transaction information
  const [totalSupply, setTotalSupply] = useState(0);
  const [datas, setDatas] = useState([]);
  const [txMessage, setTxMessage] = useState("");
  const [txLink, setTxLink] = useState("");

  // Custom hook to get network configuration
  const { network } = useConfig();

  // Custom hook to get user authentication status
  const user = useCurrentUser();

  // Function to query the blockchain for total NFT supply
  const queryChain = async () => {
    const res = await fcl.query({
      cadence: TotalSupplyQuickNFT,
    });

    setTotalSupply(res);
  };

  // Function to handle the setup of a user account to receive NFTs
  const mutateSetUpAccount = async (event) => {
    event.preventDefault();

    // Reset transaction-related states
    setTxLink("");
    setTxMessage("");

    // Execute the setUpAccount transaction on the blockchain
    const transactionId = await fcl.mutate({
      cadence: SetUpAccount,
    });

    // Generate a transaction link for the user to check the transaction status
    const txLink = createExplorerTransactionLink({ network, transactionId });

    // Update transaction-related states to inform the user
    setTxLink(txLink);
    setTxMessage("Check your setup transaction.");
  };

  // Function to handle the minting of a new NFT
  const mutateMintNFT = async (event) => {
    event.preventDefault();

    // Reset transaction-related states
    setTxLink("");
    setTxMessage("");

    // Define an array of predefined NFT metadata
    const nftMetadata = [
/*
      {
        name: "Recycling 1",
        description: "NFT of our first recycling adventure",
        thumbnail: "ipfs://QmTyoWERpPpT23HypUErBvKmeeLqng5ksirSu2mwcULj8t",
      },
      {
        name: "Recycling 2",
        description: "NFT of our first recycling adventure with better prompt",
        thumbnail: "ipfs://QmTssM9CnNvqr4dNGEJeuy5WMu6ZbcyJgr26rUfScHBngi",
      },
*/
      {
        name: "Cute AI Bear 1",
        description: "Cute AI Bear 1",
        thumbnail: "ipfs://QmZEKmBcFnHWdRN4YwipkuuKtWiuKQUoFUfVvVJJMzp3LY",
      },
      {
        name: "Cute AI Bear 2",
        description: "Cute AI Bear 2",
        thumbnail: "ipfs://QmTX1nMxAV2VXGqnCS1tAU7JNPCRtDEPNuL4zBRnAUNSUN",
      },
      {
        name: "Cute AI Bear 3",
        description: "Cute AI Bear 3",
        thumbnail: "ipfs://QmfPcT7oaHRritGRjRdMMLwYeJXoQTFDN8gP5KzSypTKpY",
      },
/*
      {
        name: "Generated token 1",
        description: "NFT of a random generated token 1",
        thumbnail: "ipfs://QmQn7HTNUr6Hna52JNqEk47WazE1gwR87G2EJixAD6tLVX",
      },
      {
        name: "Generated token 2",
        description: "NFT of a random generated token 2",
        thumbnail: "ipfs://QmXaUwfTACsHwDediVQtqcmiwuESfKvP8G8YakVy34q7ck",
      },
      */
    ];
    // Generate a random integer to select NFT metadata
    let rand: number = Math.floor(Math.random() * (nftMetadata.length-1));
    rand=0;
    // Execute the mintNFT transaction on the blockchain
    const transactionId = await fcl.mutate({
      cadence: MintNFT,
      args: (arg, t) => [
        arg(user.addr, types.Address),
        arg(nftMetadata[rand].name, types.String),
        arg(nftMetadata[rand].description, types.String),
        arg(nftMetadata[rand].thumbnail, types.String),
      ],
    });

    // Generate a transaction link for the user to check the transaction status
    const txLink = createExplorerTransactionLink({
      network,
      transactionId,
    });

    // Update transaction-related states to inform the user
    setTxLink(txLink);
    setTxMessage("Check your NFT minting transaction.");

    // Fetch the updated list of user's NFTs
    await fetchNFTs();
  };

  // Function to fetch the user's NFTs
  const fetchNFTs = async () => {
    // Reset the datas state to an empty array
    setDatas([]);
    // Initialize an array to store NFT IDs
    let IDs = [];

    try {
      // Query the blockchain to get the IDs of the user's owned NFTs
      IDs = await fcl.query({
        cadence: GetIDsQuickNFT,
        args: (arg, t) => [arg(user.addr, types.Address)],
      });
    } catch (err) {
      console.log("No NFTs Owned");
    }

    // Initialize an array to store NFT metadata
    let _src = [];

    try {
      // Iterate through each NFT ID and fetch metadata from the blockchain
      for (let i = 0; i < IDs.length; i++) {
        const result = await fcl.query({
          cadence: GetMetadataQuickNFT,
          args: (arg, t) => [
            arg(user.addr, types.Address),
            arg(IDs[i].toString(), types.UInt64),
          ],
        });

        // Handle cases where the thumbnail URL is an IPFS URL
        let imageSrc = result["thumbnail"];
        if (result["thumbnail"].startsWith("ipfs://")) {
          imageSrc =
            "https://quicknode.myfilebase.com/ipfs/" + imageSrc.substring(7);
        }

        // Add NFT metadata to the _src array
        _src.push({
          imageUrl: imageSrc,
          description: result["description"],
          id: result["id"],
        });
      }

      // Update the datas state with the fetched NFT metadata
      setDatas(_src);
    } catch (err) {
      console.log(err);
    }
  };

  // Effect hook to fetch user's NFTs when the user is authenticated
  useEffect(() => {
    if (user && user.addr) {
      fetchNFTs();
    }
  }, [user]);

  return (
    <div className={containerStyles.container}>
      <div>
        <h2>Mint Your NFT</h2>
        <div>
          <button onClick={mutateSetUpAccount} className={elementStyles.button}>
            Set Up Account
          </button>

          <button onClick={mutateMintNFT} className={elementStyles.button}>
            Mint NFT
          </button>
        </div>
        <div>
          {txMessage && (
            <div className={elementStyles.link}>
              <a href={txLink} target="_blank" rel="noopener noreferrer">
                {txMessage}
              </a>
            </div>
          )}
        </div>
      </div>
      <hr />
      <div>
        <h2>Your NFTs</h2>
        <div className={containerStyles.nftcontainer}>
          {datas.map((item, index) => (
            <div className={containerStyles.nft} key={index}>
              <img src={item.imageUrl} alt={"NFT Thumbnail"} />
              <p>{`${item.description} #${item.id}`}</p>
              <p>
                <TwitterShareButton title="AI Bears" url={item.imageUrl}><TwitterIcon size={32} round={true} /></TwitterShareButton>
                <LineShareButton title="AI Bears" url={item.imageUrl}><LineIcon size={32} round={true} /></LineShareButton>
                <WhatsappShareButton title="AI Bears" url={item.imageUrl}><WhatsappIcon size={32} round={true} /></WhatsappShareButton>
              </p>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div>
        <button onClick={queryChain} className={elementStyles.button}>
          Query Total Supply
        </button>
        <h4>Total Minted NFT: {totalSupply}</h4>
      </div>
    </div>
  );
}