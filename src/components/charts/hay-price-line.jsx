import React from "react";
import { ResponsiveLine } from "@nivo/line";

const HayPriceLine = ({ data }) => {
  // Build data object
  if (!data[0]) {
    var prices = [];
    Object.entries(data.line).forEach((c) => {
      if (c[0] !== "config") {
        prices[c[0]] = Object.entries(c[1]).map((v) => {
          return { id: v[0], data: v[1].data };
        });
      }
    });
  }

  prices && console.log(prices.Alfalfa);

  //# USE hay-price table
  return (
    <div className="chart-container wide">
      {prices && prices.Alfalfa && (
        <ResponsiveLine
          data={prices.Alfalfa}
          margin={{ top: 50, right: 120, bottom: 50, left: 60 }}
          colors={data.config ? data.config : null}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false,
            precision: "month",
          }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          xFormat="time:%Y-%m-%d"
          lineWidth={2}
          curve="natural"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            format: "%b %y",
            tickValues: "every month",
            tickPadding: 5,
            tickRotation: 0,
            legend: "Date",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Price",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          // enableArea={true}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
};

export default HayPriceLine;
