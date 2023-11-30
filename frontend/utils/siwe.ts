import { SignMessageArgs } from "@wagmi/core";
import { getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";

export const siwe = async ({
  address,
  signMessageAsync,
  setAuthStatusText,
}: {
  address: `0x${string}`;
  signMessageAsync: (args?: SignMessageArgs) => Promise<`0x${string}`>;
  setAuthStatusText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  try {
    const callbackUrl = "/";
    const domain = window.location.host;
    setAuthStatusText("Generating Sign in message...");
    const message = new SiweMessage({
      domain,
      address: address,
      statement: `${domain} wants to sign you in to the app`,
      uri: window.location.origin,
      version: "1",
      chainId: 137,
      nonce: await getCsrfToken(),
    });

    setAuthStatusText("Confirim the sign-in message...");
    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    });

    setAuthStatusText("Signing you in...");
    const siweCredentials = await signIn("credentials", {
      message: JSON.stringify(message),
      redirect: false,
      signature,
      callbackUrl,
    });

    if (siweCredentials.ok) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
