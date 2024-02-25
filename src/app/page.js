'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const defaultLeagueId = "778"

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Perform the redirect
    router.push(`/${defaultLeagueId}`); // Redirect to '/new-route'
  }, []);

  // This component doesn't actually render anything
  return null;

};

export default Home;