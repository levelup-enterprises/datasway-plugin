import React, { useState, useEffect } from "react";
import Loading from "../components/common/loading";
import _ from "lodash";

const Ads = ({ data, showAds, displayAdButton, region }) => {
  // States
  const [ads, updateAds] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const mapinfo = window.simplemaps_countymap_mapinfo.default_regions;

  const buildAds = (data) => {
    try {
      !_.isEmpty(data) ? displayAdButton(true) : displayAdButton(false);
      return Object.values(data).map((d, k) => (
        <div className="card" key={k}>
          <h2 className="title">{d.city + ", " + d.state}</h2>
          {d.img_url && <img src={d.img_url} alt="Ad" />}
          <h4>{d.typeOf}</h4>
          <p>{d.description ? d.description : "No description available"}</p>
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
    } catch (e) {
      console.log(e);
      return true;
    }
  };

  const filterAds = (data, region) => {
    if (!_.isEmpty(data) && region) {
      const state = mapinfo[region].name;
      return Object.values(data).filter((v) => v.state === state);
    } else return {};
  };

  useEffect(() => {
    setLoaded(false);
    updateAds(buildAds(filterAds(data, region)));
    setLoaded(true);
  }, [data, region]);

  return (
    <>
      {showAds && (
        <Loading trigger={loaded} message="Getting ads">
          <section className="ads">{ads && ads}</section>
        </Loading>
      )}
    </>
  );
};

export default Ads;
