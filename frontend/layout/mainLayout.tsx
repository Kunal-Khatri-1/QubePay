import { useEffect } from "react";
import Head from "next/head";

import { Navbar } from "../components";
import SiweSignInPopup from "../components/hp/SiweSignInPopup";

export default function MainLayout({ children }) {
  return (
    <div>
      <Head>
        <title>Qube</title>
        <meta
          name="description"
          content="Empowering relation between Freelancers and Organizations"
        />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Navbar />
      <SiweSignInPopup />
      {children}
    </div>
  );
}
