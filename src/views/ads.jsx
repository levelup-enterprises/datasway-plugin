import React, { useState, useEffect } from "react";
import Loading from "../components/common/loading";

const Ads = ({ data }) => {
  // States
  const [ads, updateAds] = useState(null);

  const buildAds = (data) => {
    return Object.values(data).map((d, k) => (
      <div className="card" key={k}>
        <h2 className="title">{d.name + ", " + d.state}</h2>
        <img src={d.img_url} alt="Ad" />
        <h4>{d.type}</h4>
        <p>{d.description}</p>
        <a
          href={d.url}
          className="button"
          target="_blank"
          rel="noreferrer"
          title="View post"
        >
          Learn more
        </a>
      </div>
    ));
  };

  useEffect(() => {
    console.log(data);
    updateAds(buildAds(data));
  }, [data]);

  return <section className="ads">{ads && ads}</section>;
};

export default Ads;
