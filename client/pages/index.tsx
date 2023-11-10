import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CarbonCalculatorForm from "./components/CarbonCalculatorForm";
import LineChartComponent from "./components/LineChart";
import { CarbonData, CountryStats } from "./interfaces";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [countryStats, setCountryStats] = useState<CountryStats[]>([]);
  const [carbonOffsetData, setCarbonOffsetData] = useState<CarbonData[]>([]);
  const [avgCo2ForCountry, setAvgCo2ForCountry] = useState<number>(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/home")
      .then((response) => response.json())
      .then((data) => {
        setCountryStats(data.countryStats);
      });
  }, []);

  const handleCalculateOffset = (carbonData: CarbonData[], avgCo2: number) => {
    // Handle the carbonData in the parent component
    setCarbonOffsetData(carbonData);
    setAvgCo2ForCountry(avgCo2);
  };

  return (
    <>
      <Head>
        <title>Carbon Simulator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${inter.className}`}>
        <CarbonCalculatorForm
          countryStats={countryStats}
          onCalculateOffset={handleCalculateOffset}
        />
        {avgCo2ForCountry > 0 && (
          <LineChartComponent
            carbonData={carbonOffsetData}
            avgCo2ForCountry={avgCo2ForCountry}
          />
        )}
      </main>
    </>
  );
}
