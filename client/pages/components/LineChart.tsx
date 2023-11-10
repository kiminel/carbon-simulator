import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CarbonDataProps } from "../interfaces";

const LineChartComponent: React.FC<CarbonDataProps> = ({
  carbonData,
  avgCo2ForCountry,
}) => {
  const formattedCarbonData = carbonData.map((element) => ({
    date: element.date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    }),
    offset: Math.round(element.offset),
    avgCo2: Math.round(avgCo2ForCountry * 100),
  }));

  return (
    <div className="py-5 d-flex justify-content-center">
      <LineChart
        width={1000}
        height={600}
        data={formattedCarbonData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" label="Average CO2 offset by date" height={100} />
        <YAxis tickCount={11} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="offset"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          name="Your carbon offset"
        />
        <Line
          type="monotone"
          dataKey="avgCo2"
          stroke="#82ca9d"
          name="Average Co2 consumption per person"
        />
      </LineChart>
    </div>
  );
};

export default LineChartComponent;
