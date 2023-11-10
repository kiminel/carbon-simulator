import React from "react";
import { TableFooterProps } from "../interfaces";

const TableFooter = ({ rows, totalCost }: TableFooterProps) => {
  const getTotalTrees = () => {
    const total = rows
      .map((row) => row.trees)
      .filter((initialValue) => !isNaN(initialValue))
      .reduce(
        (accumulatedTotal, initialValue) => accumulatedTotal + initialValue,
        0
      );
    return total;
  };

  return (
    <div>
      <div className="row pt-2 justify-content-center">
        <div className="col-3">
          <p className="px-2">
            {rows.length}{" "}
            {rows.length === 1 ? (
              <label htmlFor="entry" className="pb-2">
                entry
              </label>
            ) : (
              <label htmlFor="entries" className="pb-2">
                entries
              </label>
            )}
          </p>
        </div>
        <div className="col-3">
          <p className="px-2">{getTotalTrees()} trees</p>
        </div>
        <div className="col-3">
          <p className="px-2">${totalCost} total</p>
        </div>
        <div className="col-1"></div>
      </div>
      <div className="row justify-content-center">
        <div className="col-3 pb-3">
          <button type="submit" className="btn btn-primary">
            Calculate Offset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableFooter;
