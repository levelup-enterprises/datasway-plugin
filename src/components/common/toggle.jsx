import React, { useRef, useReducer } from "react";

const Toggle = (params) => {
  const inputRef = useRef(false);
  const reducer = (state, action) => action;
  // const [toggled, setToggled] = useState(false);
  const [toggled, setToggled] = useReducer(reducer, false);

  const setToggle = (e) => {
    setToggled(!toggled);
    params.onChange(e);
  };
  console.log(inputRef);

  return (
    <div className="form-group">
      <input
        type="checkbox"
        name={params.name}
        id={params.name}
        ref={inputRef}
        checked={toggled}
        onChange={(e) => setToggle(e)}
      />
      <label htmlFor={params.name}>{params.title}</label>
    </div>
  );
};
export default Toggle;
