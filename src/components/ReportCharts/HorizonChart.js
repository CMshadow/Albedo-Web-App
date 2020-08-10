import React, { useState, useEffect, useRef } from "react";
import { Card, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as echarts from "echarts";
import { titleStyle } from "../../styles.config";
import ReactEcharts from "echarts-for-react";
const Title = Typography.Title;

export const HorizonChart = ({ buildingID }) => {
  const { t } = useTranslation();
  const chart = useRef(null);

  const symbolSize = 20;
  const [data, setdata] = useState([
    [0, 0],
    [5, 5],
    [10, 10],
    [15, 15],
    [20, 20],
  ])

  const option = {
    title: {
      text: "Try Dragging these Points",
    },
    tooltip: {
      triggerOn: "none",
      formatter: function (params) {
        return (
          "X: " +
          params.data[0].toFixed(2) +
          "<br>Y: " +
          params.data[1].toFixed(2)
        );
      },
    },
    grid: {},
    xAxis: {
      name: '方位角',
      min: 0,
      max: 360,
      splitNumber: 12,
      type: "value",
      axisLine: { onZero: false },
      axisLabel: { formatter: '{value}°'},
    },
    yAxis: {
      name: '高度角',
      min: 0,
      max: 90,
      splitNumber: 10,
      type: "value",
      axisLine: { onZero: false },
      axisLabel: { formatter: '{value}°'},
    },
    series: [
      {
        id: "a",
        type: "line",
        smooth: true,
        symbolSize: symbolSize,
        data: data,
      },
    ]
  };

  return (
    <ReactEcharts
      ref={chart}
      option={option}
      style={{ height: "600px", width: "100%" }}
      onChartReady={instance => 
        instance.setOption({
          graphic: data.map((item, index) => ({
            type: 'circle',
            shape: {
              r: symbolSize / 2
            },
            position: instance.convertToPixel('grid', item),
            draggable: true,
            z: 100,
            ondrag: e => {
              const newData = [...data]
              newData[index] = instance.convertFromPixel('grid', e.target.position)
              console.log(data)
              setdata(newData)
            }
          }))
        })
      }
    />
  );
};
