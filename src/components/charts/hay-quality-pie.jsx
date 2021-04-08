import React from "react";
import { ResponsivePie } from "@nivo/pie";
import _ from "lodash";

const HayQuality = ({ data }) => {
  if (data) {
    var quality = {};
    var total = data.length;
    Object.values(data).forEach((v) => {
      quality[v["Quality"]]
        ? (quality[v["Quality"]] += 1)
        : (quality[v["Quality"]] = 1);
    });

    var values = Object.entries(quality).map((v) => ({
      id: v[0],
      value: Math.round((v[1] / total) * 100),
      label: v[0],
    }));
  }

  return (
    <div className="chart-container">
      {values && (
        <ResponsivePie
          data={values}
          margin={{ top: 20, right: 80, bottom: 60, left: 80 }}
          startAngle={-60}
          sortByValue={true}
          innerRadius={0}
          padAngle={0}
          cornerRadius={0}
          valueFormat={(v) => `${v}%`}
          colors={{ scheme: "nivo" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={11}
          radialLabelsTextXOffset={4}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={-13}
          radialLabelsLinkDiagonalLength={22}
          radialLabelsLinkHorizontalLength={17}
          radialLabelsLinkColor={{ from: "color" }}
          sliceLabelsRadiusOffset={0.7}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#333333"
          enableSliceLabels={false}
          radialLabel={(d) => `${d.id} (${d.formattedValue})`}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "premium",
              },
              id: "dots",
            },
            {
              match: {
                id: "supreme",
              },
              id: "lines",
            },
          ]}
          legends={[
            {
              anchor: "right",
              direction: "column",
              justify: false,
              translateX: 60,
              translateY: 100,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 15,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
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

export default HayQuality;
