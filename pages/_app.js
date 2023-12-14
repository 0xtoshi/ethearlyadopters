import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@eisberg-labs/next-google-analytics";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics trackingId={"G-8YRY1JPB19"} />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
