"use client";
import { Pie, Bar, Scatter } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";
import React, { useEffect, useState } from "react";
import Link from "next/link";
const endPos = ["Goal", "TA", "Drop", "D"];
const colorMap = {
  Goal: "green",
  TA: "orange",
  Drop: "red",
  D: "blue",
};

export function PieChart({ row, columns, label }) {
  const data = {
    labels: columns,
    datasets: [
      {
        label: label,
        data: columns.map((c) => row[c]),
      },
    ],
  };
  return <Pie data={data} />;
}
