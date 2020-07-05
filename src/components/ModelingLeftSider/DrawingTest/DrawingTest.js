import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'antd';
import * as actions from '../../../store/action/index'
import * as objTypes from '../../../store/action/drawing/objTypes'
import { Color } from 'cesium'

export const DrawingTest = () => {
  const dispatch = useDispatch()
  const drawStatus = useSelector(state => state.undoable.present.drwStat.status)

  return (
    <>
      <Button
        loading={drawStatus === objTypes.POINT}
        onClick={() => dispatch(actions.setDrwStatPoint())}
      >
        Draw Point
      </Button>
      <Button
        loading={drawStatus === objTypes.LINE}
        onClick={() => dispatch(actions.setDrwStatLine({
          polylineTheme: Color.STEELBLUE,
          polylineHighlight: Color.ORANGE,
          polylineAddVertex: false,
          pointHeight: false
        }))}
      >
        不能添加点的单段线, 点不能改高度不能删除
      </Button>
      <Button
        loading={drawStatus === objTypes.POLYLINE}
        onClick={() => dispatch(actions.setDrwStatPolyline({
          polylineTheme: Color.RED,
          polylineHighlight: Color.ORANGE,
          polylineAddVertex: true,
          pointHeight: true
        }))}
      >
        能添加点的红色多段线 点可以改高度可删除
      </Button>
      <Button
        loading={drawStatus === objTypes.POLYGON}
        onClick={() => dispatch(dispatch(actions.setDrwStatPolygon({
          pointHeight: true,
          polygonPos: true,
          polygonHeight: true,
          polygonTheme: Color.RED.withAlpha(0.2),
          polygonHighlight: Color.ORANGE.withAlpha(0.2)
        })))}
      >
        Draw with-height Polygon
      </Button>
      <Button
        loading={drawStatus === objTypes.POLYGON}
        onClick={() => dispatch(dispatch(actions.setDrwStatPolygon({
          pointHeight: false,
          polygonPos: false,
          polygonHeight: false,
        })))}
      >
        Draw No-height Polygon
      </Button>
      <Button
        loading={drawStatus === objTypes.CIRCLE}
        onClick={() => dispatch(actions.setDrwStatCircle())}
      >
        Draw Circle
      </Button>
      <Button
        loading={drawStatus === objTypes.SECTOR}
        onClick={() => dispatch(actions.setDrwStatSector())}
      >
        Draw Sector
      </Button>
    </>
  )
}
