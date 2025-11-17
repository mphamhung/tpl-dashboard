"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadGameInfo } from "@/lib/api";
import { tidy, summarize, max, distinct } from "@tidyjs/tidy";

const Page = () => {
  const router = useRouter();
  const [latestLeagueId, setLatestLeagueId] = useState(null);
  useEffect(() => {
    // wake api
    const queryApi = async () => {
      const res = await loadGameInfo();
      const maxLeagueId = tidy(
        res,
        distinct("leagueId"),
        summarize({
          maxLeagueId: max("leagueId"),
        })
      )[0]["maxLeagueId"];
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
