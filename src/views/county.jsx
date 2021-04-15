import React, { useState, useEffect, useCallback } from "react";
import { getDrought, getHay } from "../services/get";
import _ from "lodash";
import Loading from "../components/common/loading";
// Charts
import DroughtLine from "../components/charts/drought-line";
import Cropland from "../components/charts/cropland-pie";
import DroughtDSIC from "../components/charts/drought-pie";

const County = ({ county, refreshMap }) => {
  // States
  const [currentCounty, updateCurrentCounty] = useState(null);
  const [droughtData, updateDroughtData] = useState(null);
  const [droughtDSIC, updateDroughtDSIC] = useState(null);
  const [hayProd, updateHayProd] = useState(null);
  const [loaded, toggleLoaded] = useState(false);

  //# Get region data on state change
  const updateRegion = useCallback(() => {
    if (currentCounty !== county) {
      toggleLoaded(false);
      getDroughtData(county);
      getHayData(county);
    } else refreshMap();
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
      updateCurrentCounty(county);
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
    }
    toggleLoaded(true);
  };

  return (
    <Loading trigger={loaded} message="Gathering county data">
      <h1 className="mt-2">County information</h1>
      <section className="charts">
        {!_.isEmpty(droughtData) && (
          <div className="chart-wrapper w-100">
            <div className="chart">
              <h2>Extreme Drought</h2>
              <DroughtLine data={droughtData} />
            </div>
          </div>
        )}

        {!_.isEmpty(droughtDSIC) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>DSIC</h2>
              <DroughtDSIC data={droughtDSIC} />
            </div>
          </div>
        )}

        {!_.isEmpty(hayProd) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>Cropland</h2>
              <Cropland data={hayProd} />
            </div>
          </div>
        )}
      </section>
    </Loading>
  );
};

export default County;
