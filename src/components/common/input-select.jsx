import React from "react";

const Select = (params) => {
  const buildDropdown = (types) => {
    return types.map((v, k) => (
      <option value={v} key={k}>
        {v}
      </option>
    ));
  };

  return (
    <div className="form-group select">
      <h4>{params.title}</h4>
      <select
        className="input-select"
        name={params.name}
        id={params.name}
        onChange={(e) => params.handleChange(e.target.value)}
      >
        {buildDropdown(params.options)}
      </select>
    </div>
  );
};
export default Select;
