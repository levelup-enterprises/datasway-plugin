import React, { useState } from "react";

const TabHeader = ({ headers, updateTab }) => {
  const [active, setActive] = useState(0);

  const updateActive = (id) => {
    setActive(id);
    updateTab(id);
  };

  const tabs = headers.map((v, i) => (
    <div
      className={"tab " + (i === active ? "active" : "")}
      onClick={() => updateActive(i)}
      key={i}
    >
      <h3>{v}</h3>
    </div>
  ));

  return <div className="tab-header">{tabs}</div>;
};

export default TabHeader;
