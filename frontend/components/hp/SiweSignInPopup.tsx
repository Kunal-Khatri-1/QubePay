import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { modalVariant, siwe } from "../../utils";
import { aesthetics } from "../../constants";
import { Glow } from "..";
import Image from "next/image";
import {
  GifLoader,
  IconNotificationError,
  IconNotificationWarning,
  IconSiwe,
} from "../../assets";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { whitelist } from "../../constants/whitelist";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useNotificationContext } from "../../context";
// import { redirect } from "next/navigation";

const SiweSignInPopup = () => {
  const { address, isConnected } = useAccount({
    onDisconnect() {
      signOut();
    },
  });
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  // const {connect} = useConnect()
  const { data: session } = useSession();
  const [authStatusText, setAuthStatusText] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Notification Context
  const context = useNotificationContext();
  const setShowNotification = context.setShowNotification;
  const setNotificationConfiguration = context.setNotificationConfiguration;

  useEffect(() => {
    // TODO: Fix this whitelist feature
    if (isConnected && whitelist.includes(address) && !session) {
      (async () => {
        setShowModal(true);
        const siweArgs = { address, signMessageAsync, setAuthStatusText };
        const signInStatus = await siwe(siweArgs);
        if (signInStatus) {
          router.push(`/dashboard/${address}`);
          // redirect(`dashboard/${address}`);
        } else {
          disconnect();
          setNotificationConfiguration({
            modalColor: "#d14040",
            title: "Error",
            message: "Please reconnect to try again",
            icon: IconNotificationError,
          });
          setShowNotification(true);
        }
        setShowModal(false);
      })();
    } else if (isConnected && !whitelist.includes(address)) {
      disconnect();
      setNotificationConfiguration({
        modalColor: "#d1d140",
        title: "Access Denied",
        message: "You're not on the whitelist.",
        icon: IconNotificationWarning,
      });
      setShowNotification(true);
    }
  }, [isConnected]);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          variants={modalVariant()}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={
            "fixed w-screen h-screen top-0 left-0 backdrop-blur-md z-50 grid-cols-12 grid font-nunito text-white"
          }
        >
          <div className="lg:col-start-5 lg:col-end-9 grid place-items-center">
            {/* <Tilt className="w-full"> */}
            <div className="w-full blue-transparent-green-gradient rounded-xl p-[2px] flex flex-row items-center shadow-lg">
              <div className="w-full bg-bg_primary rounded-xl px-8 relative">
                <Glow styles={aesthetics.glow.mobileNavbarGlowStyles} />
                <div className="px-4 py-16 flex flex-col gap-8 items-center justify-center">
                  {/* Siwe Logo */}
                  <Image
                    src={IconSiwe}
                    alt="Icon_siwe"
                    width={100}
                    height={100}
                    className=" w-24 h-24 mx-auto"
                  />
                  {/* Main */}
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <h2 className=" text-2xl font-bold">
                      Signing in with Wallet
                    </h2>
                    {/* Auth status Wrapper */}
                    <div className="flex flex-row gap-2 items-center">
                      <Image
                        src={GifLoader}
                        alt="Loading..."
                        width={20}
                        height={20}
                        className=" w-5 h-5"
                      />
                      {/* Auth status */}
                      <p className=" text-base text-gray-300">
                        {authStatusText}
                      </p>
                    </div>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SiweSignInPopup;
