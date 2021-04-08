import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { getCattleFeed, getHayPrices } from "../services/get";
import Loading from "../components/common/loading";
// Charts
import CattleFeedLine from "../components/charts/cattle-feed-line";
import CattleFeedBars from "../components/charts/cattle-feed-bars";
import HayPriceLine from "../components/charts/hay-price-line";
import HayTable from "../components/hay-table";
import HayQuality from "../components/charts/hay-quality-pie";
import HayClass from "../components/charts/hay-class-pie";
import HayQualityBars from "../components/charts/hay-quality-bars";

const Region = ({ region, hayTrans }) => {
  const [cattleData, updateCattleData] = useState(null);
  const [hayPrices, updateHayPrices] = useState([{}]);

  //# Get region data on state change
  const updateRegion = useCallback(() => {
    getCattle(region);
    getPrices(region);
  }, [region]);

  useEffect(() => {
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
  // const getTransactions = async (region) => {
  //   const { success } = await getHayTransactions({
  //     region: region,
  //   });
  //   if (success) {
  //     console.log(success);
  //     success.data && updateHayTransactions(success.data);
  //   }
  // };

  return (
    <>
      {!_.isEmpty(cattleData) && cattleData.line.count > 0 && (
        <div className="chart-wrapper w-75">
          <div className="chart">
            <h2>Cattle on Feed</h2>
            <Loading>
              <CattleFeedLine data={cattleData.line} />
            </Loading>
          </div>
        </div>
      )}
      {!_.isEmpty(cattleData) && cattleData.bars.count > 0 && (
        <div className="chart-wrapper w-25">
          <div className="chart">
            <h2>Cattle on Feed</h2>
            <Loading>
              <CattleFeedBars bars={cattleData.bars} />
            </Loading>
          </div>
        </div>
      )}
      {!_.isEmpty(hayPrices) && hayPrices.count > 0 && (
        <div className="chart-wrapper w-100">
          <div className="chart">
            <h2>Hay Prices</h2>
            <Loading>
              <HayPriceLine data={hayPrices} />
            </Loading>
          </div>
        </div>
      )}
      {!_.isEmpty(hayTrans) && (
        <div className="chart-wrapper w-100">
          <div className="chart">
            <h2>Hay Transactions</h2>
            <Loading>
              <HayTable data={hayTrans.table} />
            </Loading>
          </div>
        </div>
      )}
      {!_.isEmpty(hayTrans) && (
        <div className="chart-wrapper w-50">
          <div className="chart">
            <h2>Hay Quality</h2>
            <Loading>
              <HayQuality data={hayTrans.table} />
            </Loading>
          </div>
        </div>
      )}
      {!_.isEmpty(hayTrans) && (
        <div className="chart-wrapper w-50">
          <div className="chart">
            <h2>Hay Class</h2>
            <Loading>
              <HayClass data={hayTrans.table} />
            </Loading>
          </div>
        </div>
      )}
      {!_.isEmpty(hayTrans) && (
        <div className="chart-wrapper w-50">
          <div className="chart">
            <h2>Hay Quality</h2>
            <Loading>
              <HayQualityBars data={hayTrans.bars} />
            </Loading>
          </div>
        </div>
      )}
    </>
  );
};

export default Region;
