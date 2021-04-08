import React from "react";
import { ResponsivePie } from "@nivo/pie";

const Cropland = ({ data }) => {
  if (data) {
    var values = [
      {
        id: "Hay",
        label: "Hay",
        value: data.hay_percent,
      },
      {
        id: "Crop",
        label: "Crop",
        value: data.percent_crop,
      },
    ];
  }

  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    return (
      <>
        <text
          x={centerX}
          y={120}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: "70px",
            fontWeight: "600",
          }}
        >
          {data.hay_prod}
        </text>
        <text
          x={centerX}
          y={170}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Hay Production
        </text>
      </>
    );
  };

  return (
    <div className="chart-container">
      {values && (
        <ResponsivePie
          data={values}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          // startAngle={-115}
          // endAngle={115}
          sortByValue={true}
          innerRadius={0.8}
          padAngle={0}
          cornerRadius={0}
          valueFormat={(v) => `${v}%`}
          colors={["#fcd909", "#377931"]}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={5}
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
          layers={[
            "slices",
            "sliceLabels",
            "radialLabels",
            "legends",
            CenteredMetric,
          ]}
          // legends={[
          //   {
          //     anchor: "right",
          //     direction: "column",
          //     justify: false,
          //     translateX: 60,
          //     translateY: 120,
          //     itemsSpacing: 0,
          //     itemWidth: 100,
          //     itemHeight: 18,
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

export default Cropland;
