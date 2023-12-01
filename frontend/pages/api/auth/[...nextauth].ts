// import { FirestoreAdapter } from "@next-auth/firebase-adapter";
// import { cert } from "firebase-admin/app";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
// import * as admin from "firebase-admin";
import * as ethers from "ethers";
import { db } from "../../../utils/api/";
import { NextApiRequest, NextApiResponse } from "next";
import { UsersCollectionInterface } from "../../../interfaces/api/";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export const getNextAuthOptions = (req: NextApiRequest) => {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        console.log("credentials: ", credentials.message);
        try {
          const parsedCredentials = JSON.parse(credentials?.message || "{}");
          console.log("credential message parsed");

          const siwe = new SiweMessage(parsedCredentials);
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (result.success) {
            console.log("result sucessful");

            const uid = ethers.hexlify(
              ethers.keccak256(
                ethers.toUtf8Bytes(
                  `${parsedCredentials.address} ${process.env.NEXTAUTH_SECRET}`
                )
              )
            );

            console.log("uid created: ", uid);
            const userRef = db.collection("users").doc(uid);
            const userSnapshot = await userRef.get();

            console.log("got user snapshot");

            if (userSnapshot.exists) {
              console.log("user snapshot exists");
              // console.log("user exists");
              const userData = userSnapshot.data() as UsersCollectionInterface;
              console.log("userData: ", userData);

              return {
                uid: uid,
                address: parsedCredentials.address,
                displayName: userData.displayName,
                profilePictureUrl: userData.profilePictureUrl,
                email: userData.socials.email,
              } as unknown as any;
            } else {
              console.log("adding new signer to firestore");

              const newUserData: UsersCollectionInterface = {
                walletAddress: parsedCredentials.address,
                displayName: "",
                displayTitle: "",
                description: "",
                profileBannerUrl: "",
                profilePictureUrl: "",
                nonceArray: [],
                lastRequestTimestamp: 0,
                socials: {
                  github: "",
                  linkedIn: "",
                  twitter: "",
                  email: "",
                },
              };

              await userRef.set(newUserData);

              console.log("added user to firestore");

              return {
                uid: uid,
                displayName: "",
                profilePictureUrl: "",
                email: "",
              } as unknown as any;
            }
          }

          return null;
        } catch (e) {
          console.log("error: ", e.message);
          return null;
        }
      },
    }),
  ];

  const nextAuthOptions: NextAuthOptions = {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      session: ({ session, token }: { session: any; token: any }) => {
        console.log("Session: ", { session, token });

        const { uid, address, displayName, profilePictureUrl, email } = token;

        return {
          ...session,
          user: {
            ...session.user,
            address: address,
            id: uid,
            name: displayName,
            image: profilePictureUrl,
            email: email,
          },
        };
      },
      /**
       *
       * @param user => is passed only the first time the user logs in therefore not going to be present other times.
       */
      jwt: ({ token, user }) => {
        console.log("JWT callback", { token, user });

        // called when the user just logs in
        if (user) {
          const { uid, displayName, profilePictureUrl, email, address } =
            user as unknown as any;

          const jwtToken = {
            ...token,
            address,
            uid,
            displayName,
            profilePictureUrl,
            email,
          };

          return jwtToken;
        }

        return token;
      },
    },
  };

  return nextAuthOptions;
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  let nextAuthOptions = getNextAuthOptions(req);

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  if (isDefaultSigninPage) {
    nextAuthOptions.providers.pop();
  }

  return await NextAuth(req, res, nextAuthOptions);
}

/**
 * @dev @notice version higher versions are giving errors for CSRF and potentially sessions too
 */
// https://github.com/nextauthjs/next-auth/issues/7166
