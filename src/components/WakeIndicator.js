"use client";
import { useEffect, useState } from "react";
import GppGoodIcon from "@mui/icons-material/GppGood";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";
export function WakeIndicator({}) {
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    // wake api
    const queryApi = async () => {
      const _ = await fetch("https://tplapp.onrender.com/");
      setApiReady(true);
    };

    queryApi();
  }, []);

  return (
    <>
      <div
        className={
          apiReady ? "sm:hidden text-lime-500" : "sm:hidden text-orange-500"
        }
      >
        |
      </div>
      <div className="hidden sm:block">
        {apiReady ? <GppGoodIcon /> : <SyncProblemIcon />}
      </div>
    </>
  );
}
