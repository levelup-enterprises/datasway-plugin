import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import {
  getCattleFeed,
  getHayPrices,
  getHayTransactions,
} from "../services/get";
import Loading from "../components/common/loading";
// Charts
import CattleFeedLine from "../components/charts/cattle-feed-line";
import CattleFeedBars from "../components/charts/cattle-feed-bars";
import HayPriceLine from "../components/charts/hay-price-line";
import HayTable from "../components/hay-table";
import HayQuality from "../components/charts/hay-quality-pie";
import HayClass from "../components/charts/hay-class-pie";
import HayQualityBars from "../components/charts/hay-quality-bars";

const Region = ({ region, refreshMap }) => {
  const [currentRegion, updateCurrentRegion] = useState(null);
  const [cattleData, updateCattleData] = useState({});
  const [hayPrices, updateHayPrices] = useState({});
  const [hayTrans, updateHayTrans] = useState({});
  const [loaded, toggleLoaded] = useState(false);

  //# Get region data on state change
  const updateRegion = useCallback(() => {
    if (currentRegion !== region) {
      console.log("get api");
      getCattle(region);
      getPrices(region);
      getHayTable(region);
    } else refreshMap();
  }, [region]);

  useEffect(() => {
    toggleLoaded(false);
    updateRegion();
  }, [updateRegion]);

  //? Get cattle on feed data
  const getCattle = async (region) => {
    const { success } = await getCattleFeed({
      region: region,
    });
    if (success) {
      console.log("Cattle on feed:");
      console.log(success);
      success.data && updateCattleData(success.data);
      updateCurrentRegion(region);
    }
  };

  //? Get hay price data
  const getPrices = async (region) => {
    const { success } = await getHayPrices({
      region: region,
    });
    if (success) {
      console.log("Hay Price:");
      console.log(success);
      success.data && updateHayPrices(success.data);
    }
  };

  //? Get hay transaction data
  const getHayTable = async (region) => {
    const { success, error } = await getHayTransactions({
      region: region,
    });
    if (success) {
      console.log("Hay Transactions:");
      console.log(success);
      success.data && updateHayTrans(success.data);
    }
    error && console.log(error);
    refreshMap();
    toggleLoaded(true);
  };

  return (
    <Loading trigger={loaded} message="Gathering state data">
      <h1 className="mt-2">Regional information</h1>
      <section className="charts region">
        {!_.isEmpty(cattleData) && cattleData.line.count > 0 && (
          <div className="chart-wrapper w-75">
            <div className="chart">
              <h2>Cattle on Feed</h2>
              <CattleFeedLine data={cattleData.line} />
            </div>
          </div>
        )}
        {!_.isEmpty(cattleData) && cattleData.bars.count > 0 && (
          <div className="chart-wrapper w-25">
            <div className="chart">
              <h2>Cattle on Feed</h2>
              <CattleFeedBars bars={cattleData.bars} />
            </div>
          </div>
        )}
        {!_.isEmpty(hayPrices) && hayPrices.count > 0 && (
          <div className="chart-wrapper w-100">
            <div className="chart">
              <h2>Hay Prices</h2>
              <HayPriceLine data={hayPrices} />
            </div>
          </div>
        )}
        {!_.isEmpty(hayTrans) && (
          <div className="chart-wrapper w-100">
            <div className="chart">
              <h2>Hay Transactions</h2>
              <HayTable data={hayTrans.table} />
            </div>
          </div>
        )}
        {!_.isEmpty(hayTrans) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>Hay Quality</h2>
              <HayQuality data={hayTrans.table} />
            </div>
          </div>
        )}
        {!_.isEmpty(hayTrans) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>Hay Class</h2>
              <HayClass data={hayTrans.table} />
            </div>
          </div>
        )}
        {!_.isEmpty(hayTrans) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>Hay Quality</h2>
              <HayQualityBars data={hayTrans.bars} />
            </div>
          </div>
        )}
      </section>
    </Loading>
  );
};

export default Region;
