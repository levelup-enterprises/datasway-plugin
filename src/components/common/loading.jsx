import React, { useState, useEffect } from "react";

const Loading = (params) => {
  const [loading, toggleLoading] = useState(true);

  useEffect(() => {
    typeof params.trigger !== "undefined"
      ? params.trigger && toggleLoading(false)
      : setTimeout(() => {
          toggleLoading(false);
        }, [2000]);
  }, [params]);

  return (
    <>
      <div className={loading ? "loading-spinner" : "hide"}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={loading ? "hide" : ""}>{params.children}</div>
    </>
  );
};

export default Loading;
