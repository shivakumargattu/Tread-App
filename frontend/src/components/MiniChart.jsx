// frontend/src/components/MiniChart.jsx
import React from "react";
import {
  Sparklines,
  SparklinesLine,
  SparklinesSpots,
  SparklinesReferenceLine,
} from "react-sparklines";

const MiniChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-gray-400">No Chart</div>;

  const prices = data.map((point) => point.price);

  return (
    <div className="w-full">
      <Sparklines data={prices} limit={30} width={100} height={30} margin={5}>
        <SparklinesLine color="#10b981" />
        <SparklinesSpots />
        <SparklinesReferenceLine type="mean" />
      </Sparklines>
    </div>
  );
};

export default MiniChart;
