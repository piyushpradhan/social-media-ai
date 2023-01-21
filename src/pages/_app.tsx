import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/api";

import "../styles/globals.css";
import Layout from "../components/Layout";
import { ModalProvider } from "../hooks/context/modalContext";
import { LoadingProvider } from "../hooks/context/loadingContext";
import { AppProvider } from "../hooks/context/appContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ModalProvider>
        <AppProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </ModalProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
