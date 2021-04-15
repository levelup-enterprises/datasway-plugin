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
      <div className={loading ? "loading-wrapper" : "hide"}>
        <div className="loading-spinner">
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
};

export default Loading;
