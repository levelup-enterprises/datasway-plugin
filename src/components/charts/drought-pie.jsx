import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";

const DroughtDSIC = ({ data, dimensions }) => {
  const [configBottom, setConfigBottom] = useState("20px");
  var tier = "";
  var color = "";

  if (data) {
    let influence = data.dsic / 1500;
    influence = influence.toFixed(2);

    var values = [
      {
        id: "Influence",
        label: "Influence",
        value: 100,
      },
      {
        id: "",
        label: "",
        value: 0,
      },
    ];

    switch (data.tier) {
      case 1:
        tier = "Abnormally Dry";
        color = `rgba(255, 255, 0, ${influence})`;
        break;
      case 2:
        tier = "Moderate Drought";
        color = `rgba(245, 245, 220, ${influence})`;
        break;
      case 3:
        tier = "Severe Drought";
        color = `rgba(255, 165, 0, ${influence})`;
        break;
      case 4:
        tier = "Extreme Drought";
        color = `rgba(255, 0, 0, ${influence})`;
        break;
      default:
        tier = "Exceptional Drought";
        color = `rgba(139, 0, 0, ${influence})`;
        break;
    }
  }

  useEffect(() => {
    if (dimensions && dimensions.width < 400) {
      setConfigBottom("4vw");
    } else {
      setConfigBottom("20px");
    }
  }, [dimensions]);

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
          {data.dsic}
        </text>
        <text
          x={centerX}
          y={170}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: configBottom,
            fontWeight: "600",
          }}
        >
          {tier}
        </text>
      </>
    );
  };

  return (
    <div className="chart-container">
      {values && (
        <ResponsivePie
          key={dimensions && dimensions.width}
          data={values}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          sortByValue={true}
          innerRadius={0.8}
          padAngle={0}
          cornerRadius={0}
          valueFormat={(v) => `${v}%`}
          colors={color}
          borderWidth={0}
          borderColor={{ from: "color" }}
          enableSliceLabels={false}
          enableRadialLabels={false}
          isInteractive={false}
          layers={[
            "slices",
            "sliceLabels",
            "radialLabels",
            "legends",
            CenteredMetric,
          ]}
        />
      )}
    </div>
  );
};

export default DroughtDSIC;
