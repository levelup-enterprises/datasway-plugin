import React, { useState } from "react";

const HeaderColumn = ({ value, resort, index }) => {
  const [order, toggleOrder] = useState("desc");

  const handleClick = (value, order) => {
    const newOrder = order === "desc" ? "asc" : "desc";
    toggleOrder(newOrder);
    resort(value, newOrder);
  };

  return (
    <div className={"col " + order} onClick={() => handleClick(index, order)}>
      {value}
    </div>
  );
};

export default HeaderColumn;
