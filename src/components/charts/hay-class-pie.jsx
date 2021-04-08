import React from "react";
import { ResponsivePie } from "@nivo/pie";
import _ from "lodash";

const HayClass = ({ data }) => {
  if (data) {
    var quality = {};
    var total = data.length;
    Object.values(data).forEach((v) => {
      quality[v["Class"]]
        ? (quality[v["Class"]] += 1)
        : (quality[v["Class"]] = 1);
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
          // margin={{ top: 10, right: 150, bottom: 20, left: 20 }}
          margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
          sortByValue={true}
          valueFormat={(v) => `${v}%`}
          colors={[
            "green",
            "orange",
            "#fcd909",
            "#fe6006e0",
            "#009805ba",
            "#e66a00",
          ]}
          borderWidth={1}
          // enableRadialLabels={false}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          startAngle={-40}
          radialLabelsSkipAngle={5}
          radialLabelsTextXOffset={5}
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
                id: "peanut",
              },
              id: "dots",
            },
            {
              match: {
                id: "alfalfa",
              },
              id: "lines",
            },
          ]}
          // legends={[
          //   {
          //     anchor: "right",
          //     direction: "column",
          //     justify: false,
          //     // translateX: 110,
          //     // translateY: 0,
          //     translateX: 60,
          //     translateY: 80,
          //     itemsSpacing: 2,
          //     itemWidth: 101,
          //     itemHeight: 21,
          //     itemTextColor: "#999",
          //     itemDirection: "left-to-right",
          //     itemOpacity: 1,
          //     symbolSize: 15,
          //     symbolShape: "circle",
          //     effects: [
          //       {
          //         on: "hover",
          //         style: {
          //           itemTextColor: "#000",
          //         },
          //       },
          //     ],
          //   },
          // ]}
        />
      )}
    </div>
  );
};

export default HayClass;
