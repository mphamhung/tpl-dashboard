"use client";

import { tidy, distinct } from "@tidyjs/tidy";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [_, leagueId] = pathname.split("/");
  useEffect(() => {
    // Perform the redirect
    const fetchDates = async () => {
      const res = await fetch(`https://tplapp.onrender.com/games/${leagueId}`);
      console.log(`https://tplapp.onrender.com/games/${leagueId}`);
      const games = await res.json();
      const dates = tidy(games, distinct("date")).map(
        (row) => new Date(new Date(row.date).toUTCString())
      );
      dates.reverse();
      router.push(`/${leagueId}/${dates[0].getTime()}`);
    };
    fetchDates();
  }, []);

  return null;
};
export default Page;
