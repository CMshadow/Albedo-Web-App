import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { ContextMenu, MenuItem } from "react-contextmenu";
import { Card, Row, Col, Input, Button, Typography } from 'antd'
import { v4 as uuid } from 'uuid';
import * as actions from '../../../../store/action/index'
import * as styles from './ContextMenu.module.scss'
import Coordinate from '../../../../infrastructure/point/coordinate'
const Text = Typography.Text

const POINT_OFFSET = 0.025
const POLYGON_OFFSET = -0.025

const EditPolylineContextMenu = ({hoverId}) => {
  const dispatch = useDispatch()
  const polyline = useSelector(state => state.undoable.present.polyline[hoverId]).entity
  const props = useSelector(state => state.undoable.present.polyline[hoverId]).props
  const rightClickCor = useSelector(state => state.cesium.rightClickCor)
  const insidePolygonId = useSelector(state => state.undoable.present.polyline[hoverId]).insidePolygonId

  return (
    <ContextMenu
      id="cesium_context_menu"
      hideOnLeave={false}
      preventHideOnContextMenu
      preventHideOnResize
      preventHideOnScroll
    >
      <Card bodyStyle={{padding: 10, width: '200px'}}>
        {
          props.polylineAddVertex ?
          <MenuItem
            onClick={() => {
              const pointId = uuid()
              const addPos = polyline.determineAddPointPosition(rightClickCor)
              const preciseCor = polyline.preciseAddPointPosition(addPos, rightClickCor)
              dispatch(actions.polylineAddVertex({
                polylineId: hoverId, mouseCor: preciseCor, pointId, position: addPos
              }))
              const pointCor = new Coordinate(
                preciseCor.lon, preciseCor.lat, preciseCor.height + POINT_OFFSET
              )
              dispatch(actions.addPoint({
                mouseCor: pointCor, pointId, polylineId: hoverId,
                polygonId: insidePolygonId === 'EMPTY' ? null : insidePolygonId
              }))
              if (insidePolygonId !== 'EMPTY') {
                const polygonCor = new Coordinate(
                  preciseCor.lon, preciseCor.lat, preciseCor.height + POLYGON_OFFSET
                )
                dispatch(actions.polygonAddVertex({
                  polygonId: insidePolygonId, mouseCor: polygonCor, pointId, position: addPos
                }))
              }
              dispatch(actions.releaseHoverObj())
            }}
          >
            <Row gutter={[8, 8]} align='middle'>
              <Button
                className={styles.button}
                type='primary'
              >
                Add Point
              </Button>
            </Row>
          </MenuItem> :
          null
        }
        <MenuItem
          onClick={() => {
            dispatch(actions.polylineDelete(hoverId))
            dispatch(actions.releaseHoverObj())
          }}
        >
          <Row gutter={[8, 8]} align='middle'>
            <Button
              className={styles.button}
              type='primary'
              size='small'
              danger
            >
              Delete Polyline
            </Button>
          </Row>
        </MenuItem>
      </Card>
    </ContextMenu>
  );
}

export default EditPolylineContextMenu;
