import React, { useState, useEffect } from "react";
import { CarbonData, CarbonFormProps, Row } from "../interfaces";
import TableHeader from "./TableHeader";
import TableFooter from "./TableFooter";
import { getCurrentFormattedDate, getYearDifference } from "../utils";

const CarbonCalculatorForm: React.FC<CarbonFormProps> = ({
  countryStats,
  onCalculateOffset,
}) => {
  const [rows, setRows] = useState<Row[]>([
    {
      date: getCurrentFormattedDate(),
      trees: 0,
      cost: 0,
    },
  ]);
  const [timeFrame, setTimeFrame] = useState<string>("monthly");
  const [selectedCountry, setSelectedCountry] = useState("Australia");
  const [avgCO2, setAvgCO2] = useState<number>(17.1);
  const [annualCost, setAnnualCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [inputError, setInputError] = useState<string>("");
  const [indexesWithError, setIndexesWithError] = useState<number[]>([]);
  const [carbonNeutralDate, setCarbonNeutralDate] = useState<Date | null>(null);

  const handleTimeFrameChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTimeFrame(event.target.value);
  };

  const handleNewEntry = () => {
    const newRows = [...rows];
    newRows.push({ date: "", trees: 0, cost: 0 });
    setRows(newRows);
  };

  const handleKeyPress = (event: React.KeyboardEvent, _index: number) => {
    const { key } = event;
    if (key === "Enter") {
      event.preventDefault();
      handleNewEntry();
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country.trim());
    const selectedCountryData = countryStats.find((name) => {
      return name.country.toLowerCase() === country.toLowerCase();
    });
    if (selectedCountryData) {
      setAvgCO2(selectedCountryData.avgCo2);
    }
  };

  const handleDateChange = (index: number, date: string) => {
    const rowDates = [...rows];
    rowDates[index].date = date;
    setRows(rowDates);
    console.log("rowDates: ", rowDates);
  };

  const handleTreesChange = (index: number, trees: number) => {
    const rowTrees = [...rows];
    rowTrees[index].trees = trees;
    setRows(rowTrees);
    getRowCostOfTrees(index);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newRows = [...rows];
    setRows(() => newRows.filter((_, index) => index !== rowIndex));
  };

  const getUniqueDates = (timeFrame: string) => {
    const newRows = [...rows];
    return newRows
      .map((row) => {
        return row.date.substring(0, timeFrame === "monthly" ? 7 : 4);
      })
      .filter((date, index, currentDate) => {
        return currentDate.indexOf(date) === index;
      })
      .filter((date) => date);
  };

  const getRowCostOfTrees = (index: number) => {
    const rowTrees = [...rows];
    rowTrees[index].cost = rowTrees[index].trees * 120;
    setRows(rowTrees);
  };

  const getTotalAnnualCost = () => {
    const dates = getUniqueDates("yearly");
    setAnnualCost(dates.length * 12);
  };

  const getTotalCostOfTrees = () => {
    const rowTrees = [...rows];
    const sumOfCost = rowTrees
      .map((row) => {
        return row.cost;
      })
      .reduce(
        (accumulatedTotal, initialValue) => accumulatedTotal + initialValue,
        0
      );
    setTotalCost(annualCost + sumOfCost);
  };

  useEffect(() => {
    getTotalCostOfTrees();
    getTotalAnnualCost();
  });

  const validateForm = () => {
    let hasError = false;
    let newInputError = "";
    let indexesWithError: number[] = [];

    rows.forEach((row, index) => {
      if (row.trees <= 0) {
        newInputError = "Value must be greater than 0";
        hasError = true;
        indexesWithError.push(index);
      }
    });
    setInputError(newInputError);
    setIndexesWithError(indexesWithError);
    return !hasError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (isFormValid) {
      let lastUserDates = getUniqueDates(timeFrame);
      //get last user date input of list
      let lastUserDate = lastUserDates[lastUserDates.length - 1];
      // calculate last point based on last user date input
      const lastDatePoint = new Date(
        new Date(lastUserDate).setFullYear(parseInt(lastUserDate) + 7)
      );
      const carbonData: CarbonData[] = [];

      //datePoint that will track 6month intervals from the current date
      let datePoint = new Date();
      let offsetPoint = 0;

      // populate an array with dates and offset points for the graph
      do {
        carbonData.push({ date: datePoint, offset: offsetPoint });

        //get timeFrame of datePoint
        let currentTimeFrame = datePoint.getTime();
        // get all previous user inputs before currentTimeFrame
        let previousDates = lastUserDates.filter((dateString) => {
          let formattedDate = new Date(dateString).getTime();
          return formattedDate < currentTimeFrame;
        });

        // Get all the rows of the previousDates to sum the trees
        let previousRows = rows.filter((row) =>
          previousDates.includes(
            row.date.substring(0, timeFrame === "monthly" ? 7 : 4)
          )
        );

        // calculate offset
        previousRows.forEach((row) => {
          // how much in the past is row.date compared to datePoint to see where the trees must be categorized
          let difference = getYearDifference(new Date(row.date), datePoint);

          let offset = 0;
          if (difference > 0 && difference < 6) {
            offset = ((row.trees * difference) / 6) * 28.5;
          } else if (difference >= 6) {
            offset = row.trees * 28.5;
          }

          offsetPoint += offset;
        });

        if (offsetPoint > Math.round(avgCO2 * 100)) {
          setCarbonNeutralDate(datePoint);
        }

        datePoint = new Date(
          new Date(datePoint).setMonth(datePoint.getMonth() + 6) // calculate interval ticks in 6 month increments
        );
      } while (datePoint.getTime() <= lastDatePoint.getTime());

      onCalculateOffset(carbonData, avgCO2);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="container">
        <h1 className="text-center pt-5 display-5">Carbon Offset Simulator</h1>

        <div className="py-5 d-flex justify-content-center column-gap-5">
          <div className="col-sm-3 row">
            <div>
              <label htmlFor="timeFrame" className="pb-2">
                Time-frame:
              </label>
              <select
                name="timeFrame"
                id="timeFrame"
                className="form-select"
                onChange={handleTimeFrameChange}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label htmlFor="county" className="pb-2">
                Country:
              </label>
              <select
                name="country"
                id="country"
                className="form-select"
                onChange={(e) => handleCountryChange(e.currentTarget.value)}
              >
                {countryStats &&
                  countryStats.map((name, index) => (
                    <option key={index} value={name.country}>
                      {name.country}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="py-2 col">
              <div className="card">
                <div className="card-header">Average CO2</div>
                <div className="card-body">
                  <p className="card-text">
                    {selectedCountry &&
                      `${
                        countryStats.find(
                          (name) => name.country === selectedCountry
                        )?.country || "Select a country"
                      } has an average CO2 consumption of `}{" "}
                    {avgCO2} per person per year in metric tons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center pb-4">
          <div className="col-sm-8 shadow rounded">
            <div className="p-4 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNewEntry}
              >
                Add Purchase <i className="bi bi-plus-circle"></i>
              </button>
            </div>

            <TableHeader timeFrame={timeFrame} />
            {rows.map((row, index) => (
              <div className="row justify-content-center pb-2" key={index}>
                <div className="col-3">
                  <input
                    required
                    className="form-control"
                    min={getCurrentFormattedDate()}
                    type="date"
                    value={row.date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                  />
                </div>

                <div className="col-3">
                  <input
                    required
                    type="number"
                    min={0}
                    className={`form-control ${
                      indexesWithError.includes(index) ? "bg-danger" : ""
                    }`}
                    placeholder="0"
                    value={row.trees}
                    onChange={(e) =>
                      handleTreesChange(index, parseInt(e.target.value))
                    }
                    onKeyDown={(e) => handleKeyPress(e, index)}
                  />
                  {indexesWithError.includes(index) && inputError && (
                    <span className="text-danger">{inputError}</span>
                  )}
                </div>

                <div className="col-3">
                  <label htmlFor="usdForRow" className="pb-2">
                    {row?.cost ? `${row.cost}` : "0"}
                  </label>
                </div>

                <div className="col-1">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleDeleteRow(index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            <TableFooter rows={rows} totalCost={totalCost} />
          </div>
        </div>
      </form>
      <div className="pt-4 d-flex justify-content-center">
        <div className="col-sm-6 border border-success rounded p-3 text-center">
          <h4 className=" pb-2">Summary</h4>
          {carbonNeutralDate ? (
            <p>
              You will achieve carbon neutrality in{" "}
              <span className="fw-bold">
                {carbonNeutralDate?.toLocaleDateString("default", {
                  month: "short",
                  year: "numeric",
                })}
                !{" "}
              </span>
              <i className="bi bi-tree h4"></i>
            </p>
          ) : (
            <>
              <p>
                You will not achieve carbon neutrality within 6 years. Plant
                some more trees!
                <i className="bi bi-tree h4"></i>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CarbonCalculatorForm;
