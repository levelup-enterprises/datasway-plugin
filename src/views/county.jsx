import React, { useState, useEffect, useCallback } from "react";
import { getDrought, getHay } from "../services/get";
import _ from "lodash";
import Loading from "../components/common/loading";
// Charts
import DroughtLine from "../components/charts/drought-line";
import Cropland from "../components/charts/cropland-pie";
import DroughtDSIC from "../components/charts/drought-pie";

const County = ({ county }) => {
  // States
  const [droughtData, updateDroughtData] = useState(null);
  const [droughtDSIC, updateDroughtDSIC] = useState(null);
  const [hayProd, updateHayProd] = useState(null);

  //# Get region data on state change
  const updateRegion = useCallback(() => {
    getDroughtData(county);
    getHayData(county);
  }, [county]);

  useEffect(() => {
    updateRegion();
  }, [updateRegion]);

  //? Get Drought data
  const getDroughtData = async (county) => {
    const { success } = await getDrought({
      county: county,
    });
    if (success) {
      console.log("Drought data:");
      console.log(success);
      success.data && updateDroughtData(success.data.graph);
      success.data && updateDroughtDSIC(success.data.current);
    }
  };

  //? Get Hay data
  const getHayData = async (county) => {
    const { success } = await getHay({
      county: county,
    });
    if (success) {
      console.log("Hay data:");
      console.log(success);
      const { data } = success;
      console.log(data);
      updateHayProd(data);
      // updateHayPercent(data.hay_percent);
      // updateCropPercent(data.crop_percent);
    }
  };

  return (
    <>
      {!_.isEmpty(droughtData) && (
        <div className="chart-wrapper w-100">
          <div className="chart">
            <h2>Extreme Drought</h2>
            <Loading>
              <DroughtLine data={droughtData} />
            </Loading>
          </div>
        </div>
      )}

      {!_.isEmpty(droughtDSIC) && (
        <div className="chart-wrapper w-50">
          <div className="chart">
            <h2>DSIC</h2>
            <Loading>
              <DroughtDSIC data={droughtDSIC} />
            </Loading>
          </div>
        </div>
      )}

      {!_.isEmpty(hayProd) && (
        <div className="chart-wrapper w-50">
          <div className="chart">
            <h2>Cropland</h2>
            <Loading>
              <Cropland data={hayProd} />
            </Loading>
          </div>
        </div>
      )}
    </>
  );
};

export default County;
