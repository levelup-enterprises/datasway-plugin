import React, { useState, useEffect } from "react";

const Loading = (params) => {
  const [loading, toggleLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      toggleLoading(false);
    }, [2000]);
  });

  return (
    <>
      {loading ? (
        <div className="loading-spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        params.children
      )}
    </>
  );
};

export default Loading;
