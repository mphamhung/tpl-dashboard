"use client";
import Chart from "chart.js/auto";
import { Line, Bar, Scatter } from "react-chartjs-2";
import { getGameEvents, getTeamInfo } from "@/lib/api-fetching";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const endPos = ["Goal", "TA", "Drop", "D"];
const colorMap = {
  Goal: "green",
  TA: "orange",
  Drop: "red",
  D: "blue",
};

export default function StatsAcrossTime({ rows }) {
  return null;
}
