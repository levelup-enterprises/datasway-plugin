import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import _ from "lodash";

const HayQualityBars = ({ data, dimensions }) => {
  const [quality, setQuality] = useState({});
  const [config, setConfig] = useState({
    margin: 50,
    rotate: 0,
    offset: 32,
  });
  // Build data object
  const updateData = (data) => {
    if (!_.isEmpty(data)) {
      let quality = [];
      quality.push(
        Object.entries(data).map((c) => ({ quality: c[0], "Min Price": c[1] }))
      );
      return quality[0];
    } else return {};
  };

  // Modify based on screen width
  const modifyChart = (screen) => {
    screen.width < 750
      ? setConfig({
          margin: 60,
          rotate: -60,
          offset: 40,
        })
      : setConfig({
          margin: 50,
          rotate: 0,
          offset: 32,
        });
  };

  useEffect(() => {
    dimensions && modifyChart(dimensions);
    setQuality(updateData(data));
  }, [data]);

  //# USE hay-price table
  return (
    <div className="chart-container wide">
      {quality && (
        <ResponsiveBar
          key={quality[0] && quality[0]["Min Price"] + dimensions.width}
          data={quality}
          keys={["Min Price"]}
          indexBy="quality"
          colors={{ scheme: "greens" }}
          colorBy="indexValue"
          margin={{ top: 20, right: 20, bottom: config.margin, left: 120 }}
          padding={0.15}
          layout="horizontal"
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={
            dimensions.width < 380
              ? null
              : {
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: config.rotate,
                  legend: "Average min price",
                  legendPosition: "middle",
                  legendOffset: config.offset,
                }
          }
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Quality",
            legendPosition: "middle",
            legendOffset: -110,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          // legends={false}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      )}
    </div>
  );
};

export default HayQualityBars;
