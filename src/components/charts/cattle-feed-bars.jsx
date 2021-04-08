import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import _ from "lodash";

const CattleFeedBars = ({ bars }) => {
  // Build data object
  if (!_.isEmpty(bars.data)) {
    var states = [];
    var keys = [];
    states.push(
      Object.entries(bars.data).map((c) => {
        let state = c[1];
        state.state = c[0];
        return state;
      })
    );
    keys = Object.keys(states[0][0]).filter((k) => k !== "state");
  }

  //# USE hay-price table
  return (
    <div className="chart-container wide">
      {states && (
        <ResponsiveBar
          data={states[0]}
          keys={keys}
          indexBy="state"
          margin={{ top: 10, right: 10, bottom: 60, left: 70 }}
          padding={0.2}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={bars.config ? bars.config : null}
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
          fill={[
            {
              match: {
                id: "fries",
              },
              id: "dots",
            },
            {
              match: {
                id: "sandwich",
              },
              id: "lines",
            },
          ]}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "States",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Head",
            legendPosition: "middle",
            legendOffset: -60,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 60,
              itemsSpacing: 2,
              itemWidth: 70,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      )}
    </div>
  );
};

export default CattleFeedBars;
