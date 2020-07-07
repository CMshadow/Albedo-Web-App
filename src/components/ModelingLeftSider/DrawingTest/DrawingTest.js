import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'antd';
import * as actions from '../../../store/action/index'
import * as objTypes from '../../../store/action/drawing/objTypes'
import { Color } from 'cesium'

const POINT_OFFSET = 0.025
const POLYLINE_OFFSET = 0.0125
const POLYGON_OFFSET = 0

export const DrawingTest = () => {
  const dispatch = useDispatch()
  const drawStatus = useSelector(state => state.undoable.present.drwStat.status)

  return (
    <>
      <Button
        loading={drawStatus === objTypes.LINE}
        onClick={() => dispatch(actions.setDrwStatLine({
          polylineHt: 0.5 + POLYLINE_OFFSET,
          pointHt: 0.5 + POINT_OFFSET,
          polylineTheme: Color.STEELBLUE,
          polylineHighlight: Color.ORANGE,
          polylineAddVertex: false,
          pointHeight: false,
          pointDelete: false
        }))}
      >
        不能添加点的单段线, 点不能改高度不能删除
      </Button>
      <Button
        loading={drawStatus === objTypes.POLYLINE}
        onClick={() => dispatch(actions.setDrwStatPolyline({
          polylineHt: 0.01 + POLYLINE_OFFSET,
          pointHt: 0.01 + POINT_OFFSET,
          polylineTheme: Color.RED,
          polylineHighlight: Color.ORANGE,
          polylineAddVertex: true,
          pointHeight: true,
          pointDelete: true
        }))}
      >
        能添加点的红色多段线 点可以改高度可删除
      </Button>
      <Button
        loading={drawStatus === objTypes.POLYGON}
        onClick={() => dispatch(dispatch(actions.setDrwStatPolygon({
          polygonHt: 0.05 + POLYGON_OFFSET,
          polylineHt: 0.05 + POLYLINE_OFFSET,
          pointHt: 0.05 + POINT_OFFSET,
          pointHeight: true,
          pointDelete: true,
          polygonPos: true,
          polygonHeight: true,
          polygonTheme: Color.RED.withAlpha(0.2),
          polygonHighlight: Color.ORANGE.withAlpha(0.2),
          polylineTheme: Color.GREEN,
          polylineHighlight: Color.ORANGE,
          polylineAddVertex: true,
          polylineDelete: false
        })))}
      >
        可调整高度可拖动红色多边体，绿线，点可改高度
      </Button>
      <Button
        loading={drawStatus === objTypes.POLYGON}
        onClick={() => dispatch(dispatch(actions.setDrwStatPolygon({
          polygonHt: 0.01 + POLYGON_OFFSET,
          polylineHt: 0.01 + POLYLINE_OFFSET,
          pointHt: 0.01 + POINT_OFFSET,
          pointHeight: false,
          pointDelete: true,
          polygonPos: false,
          polygonHeight: false,
          polylineAddVertex: true,
          polylineDelete: false
        })))}
      >
        不可调整高度不可拖动白色多边体，蓝线，点不可改高度
      </Button>
      <Button
        loading={drawStatus === objTypes.CIRCLE}
        onClick={() => dispatch(actions.setDrwStatCircle({
          circleHt: 0.05 + POLYLINE_OFFSET,
          pointHt: 0.05 + POINT_OFFSET,
          pointHeight: false,
          pointDelete: false,
          circleTheme: Color.SEAGREEN,
          circleHighlight: Color.ORANGE,
          circleDelete: true,
        }))}
      >
        Draw Circle
      </Button>
      <Button
        loading={drawStatus === objTypes.SECTOR}
        onClick={() => dispatch(actions.setDrwStatSector({
          sectorHt: 0.05 + POLYLINE_OFFSET,
          pointHt: 0.05 + POINT_OFFSET,
          pointHeight: false,
          pointDelete: false,
          sectorTheme: Color.DARKCYAN,
          sectorHighlight: Color.ORANGE,
          sectorDelete: true,
        }))}
      >
        Draw Sector
      </Button>
    </>
  )
}
