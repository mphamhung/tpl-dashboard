"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [latestLeagueId, setLatestLeagueId] = useState(null);
  useEffect(() => {
    // wake api
    const queryApi = async () => {
      const res = await fetch("https://tplapp.onrender.com/teams");
      const teams = await res.json();

      let maxLeagueId = -1;
      teams.forEach((element) => {
        if (Number(element.leagueId) > maxLeagueId) {
          maxLeagueId = Number(element.leagueId);
        }
      });
      setLatestLeagueId(maxLeagueId);
    };

    queryApi();
  }, []);

  useEffect(() => {
    // Perform the redirect
    if (latestLeagueId) {
      console.log("api is reqdy!");
      router.push(`/rankings/${latestLeagueId}`); // Redirect to '/new-route'
    }
  }, [latestLeagueId]);

  // This component doesn't actually render anything
  return null;
};

export default Page;
