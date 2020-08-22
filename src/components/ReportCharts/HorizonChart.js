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
  const data = new Array(12).fill([]).map((val, index) => [(index + 1) * 30, 5])

  const option = {
    title: {
      text: "Try Dragging these Points",
    },
    tooltip: {
      triggerOn: "none",
      position: 'left',
      formatter: params => (
        "X: " +
        params.data[0].toFixed(2) +
        "<br>Y: " +
        params.data[1].toFixed(2)
      )
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
            invisible: true,
            z: 100,
            ondrag: e => {
              data[index] = [
                data[index][0],
                instance.convertFromPixel('grid', e.target.position)[1]
              ]
              instance.setOption({
                series: [{ data: data }],
                graphic: data.map(item => ({
                  position: instance.convertToPixel('grid', item),
                }))
              });
              instance.dispatchAction({type: 'showTip', seriesIndex: 0, dataIndex: index})
            },
            onmousemove: e =>
              instance.dispatchAction({type: 'showTip', seriesIndex: 0, dataIndex: index}),
            onmouseout: e =>
              instance.dispatchAction({type: 'hideTip'})
          }))
        })
      }
    />
  );
};
