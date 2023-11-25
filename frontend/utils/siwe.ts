import { SignMessageArgs } from "@wagmi/core";
import { getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";

export const siwe = async ({
  address,
  signMessageAsync,
}: {
  address: `0x${string}`;
  signMessageAsync: (args?: SignMessageArgs) => Promise<`0x${string}`>;
}) => {
  const callbackUrl = "/";
  const domain = window.location.host;
  const message = new SiweMessage({
    domain,
    address: address,
    statement: `${domain} wants to sign you in to the app`,
    uri: window.location.origin,
    version: "1",
    chainId: 137,
    nonce: await getCsrfToken(),
  });
  const signature = await signMessageAsync({
    message: message.prepareMessage(),
  });
  const siweCredentials = await signIn("credentials", {
    message: JSON.stringify(message),
    redirect: false,
    signature,
    callbackUrl,
  });

  console.log("siwe Credentials: ", siweCredentials);
};
