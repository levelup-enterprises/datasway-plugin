import React from "react";

const TabContainer = (params) => {
  return <>{params.active && params.children}</>;
};

export default TabContainer;
