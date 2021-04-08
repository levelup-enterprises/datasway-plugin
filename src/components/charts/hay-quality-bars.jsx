import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import _ from "lodash";

const HayQualityBars = ({ data }) => {
  // Build data object
  if (!_.isEmpty(data)) {
    var quality = [];
    // var colors = [];
    quality.push(
      Object.entries(data).map((c) => ({ quality: c[0], "Min Price": c[1] }))
    );
    quality = quality[0];
    console.log(quality);
  }

  //# USE hay-price table
  return (
    <div className="chart-container wide">
      {quality && (
        <ResponsiveBar
          data={quality}
          keys={["Min Price"]}
          indexBy="quality"
          colors={{ scheme: "greens" }}
          colorBy="indexValue"
          margin={{ top: 20, right: 20, bottom: 50, left: 120 }}
          padding={0.15}
          layout="horizontal"
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          // colors={{ scheme: "nivo" }}
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
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Average min price",
            legendPosition: "middle",
            legendOffset: 32,
          }}
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
