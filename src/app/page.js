"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const defaultLeagueId = "778";

const Home = () => {
  const router = useRouter();
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    // wake api
    const res = fetch("https://tplapp.onrender.com/").then(setApiReady(true));
  }, []);

  useEffect(() => {
    // Perform the redirect
    if (apiReady) {
      console.log("api is reqdy!");
      router.push(`/${defaultLeagueId}`); // Redirect to '/new-route'
    }
  }, [apiReady]);

  // This component doesn't actually render anything
  return <>{apiReady ? <>ready</> : <>Loading ...</>}; </>;
};

export default Home;
