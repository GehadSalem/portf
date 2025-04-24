"use client";
import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { GlobeProps } from "./Globe";
// Dynamically import the World component (Globe)
const World = dynamic<GlobeProps>(
  () => import("./Globe").then((m) => m.Globe),
  { ssr: false }
);

const GridGlobe = () => {
  const globeConfig = {
    globeColor: "#062056",
    showGraticules: true,
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 10,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
  };

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

  const sampleMarkers = [
    {
      id: "1",
      city: "Belo Horizonte to Rio",
      coordinates: [-43.951191, -19.885592],
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      id: "2",
      city: "Delhi to Kuala Lumpur",
      coordinates: [77.209, 28.6139],
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      id: "3",
      city: "Belo Horizonte to Nairobi",
      coordinates: [-43.951191, -19.885592],
      color: colors[Math.floor(Math.random() * colors.length)],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="w-full h-[calc(100vh-100px)] relative flex justify-center items-center"
    >
      <World globeConfig={globeConfig} markers={sampleMarkers} />
    </motion.div>
  );
};

export default GridGlobe;
