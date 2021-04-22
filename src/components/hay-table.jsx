import React, { useState, useEffect } from "react";
import { sortValues } from "../services/utilities";
import _ from "lodash";
import HeaderColumn from "./common/header-column";
import Select from "./common/input-select";
import Input from "./common/input";

const HayTable = ({
  data,
  filters,
  resetFilters,
  resetDate,
  updateDate,
  handleChange,
  dimensions,
}) => {
  const [headers, updateHeaders] = useState(null);
  const [values, updateValues] = useState(null);
  const [rows, setRows] = useState(null);
  const [showFilters, toggleShowFilters] = useState(
    dimensions.width < 670 ? false : true
  );

  useEffect(() => {
    if (!_.isEmpty(data)) {
      updateHeaders(Object.keys(data[0]).map((k) => k));
      let values = [];
      Object.values(data).forEach((v) => {
        values.push(Object.values(v).map((v) => v));
      });
      updateValues(values);
      buildRows(values);
    } else {
      updateValues(null);
      buildRows({});
    }
    dimensions.width > 670 ? toggleShowFilters(true) : toggleShowFilters(false);
  }, [data, dimensions]);

  const handleResort = (col, order) => {
    const resorted = sortValues(values, col, order);
    updateValues(resorted);
    buildRows(resorted);
  };

  const buildHeaders = (values) => {
    if (values) {
      return values.map((v, i) => (
        <HeaderColumn value={v} resort={handleResort} index={i} key={i} />
      ));
    }
  };

  const buildRows = (data) => {
    let row = [];
    Object.values(data).forEach((r, i) => {
      row.push(
        <div className="row" key={i}>
          {Object.values(r).map((v, i) => {
            return (
              <div className="col" key={i} title={v}>
                {v}
              </div>
            );
          })}
        </div>
      );
    });
    setRows(row);
  };

  const handleToggleFilters = (e) => {
    e.preventDefault();
    toggleShowFilters(!showFilters);
  };

  return (
    <>
      <form className="filter-wrapper">
        <Input
          title="Change week"
          type="date"
          name="week"
          value={resetDate && ""}
          onChange={updateDate}
        />
        {filters && (
          <>
            {showFilters && (
              <>
                {filters[1] && (
                  <Select
                    title="Region"
                    name="Region"
                    options={filters[1]}
                    handleChange={(e) => handleChange(e, 1)}
                  />
                )}
                {filters[2] && (
                  <Select
                    title="Class"
                    name="class"
                    options={filters[2]}
                    handleChange={(e) => handleChange(e, 2)}
                  />
                )}
                {filters[3] && (
                  <Select
                    title="Quality"
                    name="quality"
                    options={filters[3]}
                    handleChange={(e) => handleChange(e, 3)}
                  />
                )}
                {filters[4] && (
                  <Select
                    title="Unit"
                    name="unit"
                    options={filters[4]}
                    handleChange={(e) => handleChange(e, 4)}
                  />
                )}
                {filters[5] && (
                  <Select
                    title="Package"
                    name="package"
                    options={filters[5]}
                    handleChange={(e) => handleChange(e, 5)}
                  />
                )}
                <div className="form-group reset">
                  <button onClick={(e) => resetFilters(e)}>Reset</button>
                </div>
              </>
            )}
            {dimensions.width < 670 && (
              <div className="form-group reset">
                <button
                  className="toggle-filters"
                  onClick={(e) => handleToggleFilters(e)}
                >
                  {showFilters ? "Less filters" : "More filters"}
                </button>
              </div>
            )}
          </>
        )}
      </form>
      <div className="table">
        {values ? (
          <div className="table-wrapper">
            <div className="row header">{headers && buildHeaders(headers)}</div>
            {rows && rows}
          </div>
        ) : (
          <h1>No data available</h1>
        )}
      </div>
    </>
  );
};

export default HayTable;
