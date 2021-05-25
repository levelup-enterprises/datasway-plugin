import React, { useState, useEffect, memo } from "react";

const Loading = memo((params) => {
  const [loading, toggleLoading] = useState(true);

  useEffect(() => {
    typeof params.trigger !== "undefined"
      ? params.trigger
        ? toggleLoading(false)
        : toggleLoading(true)
      : setTimeout(() => {
          toggleLoading(false);
        }, [2000]);
  }, [params]);

  return (
    <>
      <div className={loading ? "loading-wrapper" : "hide"}>
        <div className={"loading-spinner" + (params.offset ? " offset" : "")}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {params.message && loading && (
          <div className="loading-message fade-in-out">{params.message}</div>
        )}
      </div>
      <div className={loading ? "hide" : "loading-content"}>
        {params.children}
      </div>
    </>
  );
});

export default Loading;
