import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { getCattleFeed } from "../services/get";
// Charts
import CattleFeedBars from "../components/charts/cattle-feed-bars";

const National = ({ region, county }) => {
  const [cattleData, updateCattleData] = useState([{}]);

  const updateNational = useCallback(() => {
    getCattle(region);
  }, [region]);

  useEffect(() => {
    updateNational();
  }, [updateNational]);

  //? Get cattle on feed data
  const getCattle = async (region) => {
    const { success } = await getCattleFeed({
      region: region,
    });
    if (success) {
      console.log("Cattle on Feed:");
      console.log(success);
      success.data && updateCattleData(success.data);
    }
  };

  //# Get up to 2 years
  // Line graph uses hay-price
  //  - Default Alfalpha class
  //  - Create a line for each of the prices
  //  - Add class filter

  //# Weekly data unless filtered
  // All others on state level use hay-transations

  //# National view
  // Show cattle on feed as line graph & stacked bar
  // - display last and this years data
  // Show total us cattle on feed

  return (
    <>
      <div className="chart-wrapper mini">
        <div className="chart">
          <h2>Cattle on Feed</h2>
          {!_.isEmpty(cattleData) && (
            <h1 className="lg-txt">{cattleData.total}</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default National;
