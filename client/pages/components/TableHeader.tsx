import React from "react";

const TableHeader = ({ timeFrame }: { timeFrame: string }) => {
  return (
    <div className="row justify-content-center">
      <div className="col-3 py-3">
        {timeFrame === "monthly" ? (
          <label htmlFor="monthly">Month & Year</label>
        ) : (
          <label htmlFor="yearly">Year</label>
        )}
      </div>
      <div className="col-3 py-3">
        <label htmlFor="trees">Number of Trees</label>
      </div>
      <div className="col-3 py-3">Total USD</div>
      <div className="col-1"></div>
    </div>
  );
};

export default TableHeader;
