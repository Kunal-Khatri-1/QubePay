// Lighthouse SDK Imports
import { uploadText } from "@lighthouse-web3/sdk";

const uploadTextToIpfs = async (text: string) => {
  console.log("apiKey: ", process.env.LIGHTHOUSE_API_KEY);
  const output = await uploadText(
    text,
    "d6ca5379.1ea7da96c2fc41c7bfcfd4d7a64f5b4e"
  );

  console.log("text Status:", output);
  // "https://gateway.lighthouse.storage/ipfs/" +
  return output.data.Hash;
};

export { uploadTextToIpfs };
