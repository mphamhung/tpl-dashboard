"use client";

import { tidy, mutate, summarize, max } from "@tidyjs/tidy";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getGames } from "@/lib/api";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [_, leagueId] = pathname.split("/");
  useEffect(() => {
    // Perform the redirect
    const fetchDates = async () => {
      const res = await getGames(leagueId);
      const max_date = tidy(
        res,
        mutate({
          parsed_date: (row) => Date.parse(`${row.date} EST`),
        }),
        summarize({
          max_date: max("parsed_date"),
        })
      )[0]["max_date"];
      router.push(`/${leagueId}/${max_date}`);
    };
    fetchDates();
  }, []);

  return null;
};
export default Page;
