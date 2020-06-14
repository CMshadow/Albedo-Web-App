import React from "react";
import { Chart, Point, Annotation, Axis, Coordinate, registerShape } from "bizcharts";
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// 自定义Shape 部分
registerShape('point', 'pointer', {
  draw(cfg, container) {
    const group = container.addGroup();
    const center = this.parsePoint({ x: 0, y: 0 }); // 获取极坐标系下画布中心点
    // 绘制指针
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: cfg.x,
        y2: cfg.y,
        stroke: cfg.color,
        lineWidth: 5,
        lineCap: 'round',
      },
    });
    group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 9.75,
        stroke: cfg.color,
        lineWidth: 4.5,
        fill: '#fff',
      },
    });

    return group;
  },
});



export const SystemEfficiencyChart = ({buildingID}) => {
  const {t} = useTranslation()
  const reportData = useSelector(state => state.report)
  const buildingReport = reportData[buildingID]
  const systemEfficiency = Number(
    (buildingReport.system_efficiency * 100).toFixed(0)
  )

  const data = [{ value: systemEfficiency }];

  return (
    <Chart
      height={500}
      data={data}
      padding={[0, 0, 30, 0]}
      scale={{
        value:{
          min: 0,
          max: 100,
          tickInterval: 10,
        }
      }}
      forceFit
    >
      <Coordinate
      type="polar"
      radius={0.75}
      startAngle={(-9 / 8) * Math.PI}
      endAngle={(1 / 8) * Math.PI}
      />
      <Axis name="1" />
      <Axis
        name="value"
        line={null}
        label={{
          offset: -36,
          style: {
            fontSize: 18,
            textAlign: 'center',
            textBaseline: 'middle',
          },
        }}
        subTickLine={{
          count: 4,
          length: -15,
        }}
        tickLine={{
          length: -24,
        }}
        grid={null}
      />
      <Point
        position="value*1"
        color="#faad14"
        shape="pointer"
        animate={{
          appear: {
            animation: 'fade-in'
          }
        }}
      />
      <Annotation.Arc
        top={false}
        start={[0, 1]}
        end={[100, 1]}
        style={{
          stroke:'#CBCBCB',
          lineWidth:18,
          lineDash:null,
        }}
      />
      <Annotation.Arc
        start={[0, 1]}
        end={[data[0].value, 1]}
        style={{
          stroke: '#1890ff',
          lineWidth: 18,
          lineDash: null,
        }}
      />
      <Annotation.Text
        position={['50%', '85%']}
        content={t('systemEfficiencyChart.name')}
        style={{
          fontSize: 20,
          fill: '#545454',
          textAlign: 'center',
        }}
      />
      <Annotation.Text
        position={['50%', '90%']}
        content={`${data[0].value} %`}
        style={{
          fontSize: 36,
          fill: '#545454',
          textAlign: 'center',
        }}
        offsetY={15}
      />
    </Chart>
  )
}
