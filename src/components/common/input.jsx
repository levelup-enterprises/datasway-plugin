import React from "react";

const Input = (params) => {
  return (
    <div className="form-group select">
      <h4>{params.title}</h4>
      <input
        type={params.type}
        name={params.name}
        id={params.name}
        onChange={(e) => params.onChange(e.target.value)}
      />
    </div>
  );
};
export default Input;
