// Import necessary modules and components
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Links from "../components/Links";
import Container from "../components/Container";
import useCurrentUser from "../hooks/useCurrentUser";

export default function Home() {
  // Use the useCurrentUser hook to check if a user is logged in
  const { loggedIn } = useCurrentUser();

  // Return the JSX structure for the web page
  return (
    <div className={styles.container}>
      <Head>
        <title>QuickNFT on Flow</title>
        <meta name="description" content="QuickNFT Collection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main content section */}
      <main className={styles.main}>
        <h1 className={styles.title}>AI Recyclers</h1>
        {/* Render the Container component conditionally if the user is logged in */}
        {loggedIn && <Container />}
      </main>
    </div>
  );
}