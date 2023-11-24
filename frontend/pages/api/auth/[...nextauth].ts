import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

// adapter: FirestoreAdapter({
//   credential: cert({
// 	projectId: "succery-qube-dev",
// 	clientEmail:
// 	  "firebase-adminsdk-sp25y@succery-qube-dev.iam.gserviceaccount.com",
// 	privateKey:
// 	  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzlouPXyxMm4z0\nfHWd/piNZExk4GMTIckyN84ey6+s3vng9kqdkYhXAsrRWq8gLvp9ZvpQsOCutykK\niK9dLMNvRXc5UZ8R8OirZ9bZI3DT/SdOjAVcY7v2ytnAKVATeI7VKA/Fr+V48LQ5\n4SVLP1/g+67FnV4kuEPybcQj7hN+tVqg8hv69GArfCmq4HQVP8NAaz+oCb0nDQ/y\n8rW9MF90GzMuQdEd5VynVoUf1Lm0Pe085rBm/C4GFt+PUWpd6/MS+svuySfykXCt\n4P9UwJjiyAg/WgTQ2QGs3ROwy+fKRhexo/2voIWelo3vzeZCc1IrbWni3du6tAUM\nV/XKZC4pAgMBAAECggEAROU+SRRj9EfAfZK5tJEViTivLgv/NjnB6+gIxTuy+4jX\nJ/yUh3praaYClOpLQPeE1VMKOKaCq8RMlGP3krE3kJp/sJelhMZ9HDTL8aVtBYaa\n68E/1T/Vvkn324Z919pqQVALLPXb/Neq7IF5QzLe33rug5VppoCiYIDHvFj7VaIr\nnJmQtPZHIFrMDh+1JoM490cXBFD9MeaFaoAyrAcRk+/j1PgMPK3j0bv0k6u8XNFc\nONSeueKyN+Z6LPZuvuXvKhGux5ETSlOX1FhpnONfmUFbCs1HpROZVnoton7jU0pI\nVrui7GSN3YnCEtRho365wxqvt8sOumzkgXGQBzAO2QKBgQDxw7vyuebeOCmxwtrV\nje7JGeRquvdAoyGbuOBbwJvCQ13XfuG3UYKq6T67IdFu5HsRX/pNus5OtoJ8eg1C\nww0PqAeVFbQtJmMcQCckj5yH6OWz1f2G9vCGw9+dbtf+8ShULKRNdgdPrCM0TP+e\nUC0eda1VkVdlpU7VIDlhAyuSqwKBgQC+KZYQV9nNOyCnLtTFyeybTwfgpD/ShnKj\nr4l9w7Sheh4m8/vqliI3PAxxZA4qnCPyBHZbuSMEXix8yd8MfIqPHAJghWLS47vH\nYsmyzVE6vKjBucbZlsEXXlWTx2+F2vP63AQMwp1xokzn/zwfGMeLHYrwweh4L7W3\n+RdBYO4iewKBgHdYiI9p9e39C5gU+LIzPo1HmtqVMTlXTl/xA9BHZJyhZNHccNBu\nDHMScUUvjJORdq89EfMNJIr2zbNlDObIIsp3yEZwUGF5cbOgd7I0srDk53+/Q0g8\n3r+oMdslvLq9kYr7/p++hB1wfHB1Ejq0mZFPxiFXfi1PTXsoTSr2xavBAoGAD+1J\nvUquWksWfAonFf3IjGV9Imp/UfGizmTYXikzCsdAmUCcG9TBPuEPpbucmCMFu7J1\n+06xSR9eGIGL5e7UaBIPfOgPE9yxEI0MmaYqpIHCnJ8jsXu35m4nOr5cb9ib0Kn2\nyN7P8wGF8XRmI7Cend82kN2cy9wrGyKIuRgWOdsCgYEAtw2fg3r4PAUxzTwxUeAn\n4FV4cUIaVURxovvydukGOcLIQ8UN9U/VchmYDkYMgcU+UPhVnjOXEvq9ouRygm+L\nBwX974c6MgR7waxHTQfhgK+mzJRBluTjLCLw9aZPh9JDo3gwL34G+bRzfqU/lzPi\ndEm5eW5YyNxcmfOElnb1Kb4=\n-----END PRIVATE KEY-----\n".replace(
// 		/\\n/g,
// 		"\n"
// 	  ),
//   }),
// }),

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
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
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        session.address = token.sub;
        session.user.name = token.sub;
        session.user.image = "https://www.fillmurray.com/128/128";
        return session;
      },
    },
  });
}
