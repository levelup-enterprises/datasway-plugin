import React, { useState } from "react";
import _, { sortBy } from "lodash";

const HayTable = ({ data }) => {
  if (!_.isEmpty(data)) {
    var headers = Object.keys(data[0]).map((k) => k);
    var values = [];
    Object.values(data).forEach((v) => {
      values.push(Object.values(v).map((v) => v));
    });
  }

  const buildHeaders = (values) => {
    return values.map((v, i) => (
      <div className="col" onClick={() => sortBy(v)} key={i}>
        {v}
      </div>
    ));
  };

  const buildRows = (data) => {
    var row = [];
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
    return row;
  };

  const sortBy = (header) => {
    console.log(header);
  };

  return (
    <div className="table">
      <div className="table-wrapper">
        <div className="row header">{headers && buildHeaders(headers)}</div>
        {values && buildRows(values)}
      </div>
    </div>
  );
};

export default HayTable;
