import React from 'react';
import { useSelector } from 'react-redux'
import { ContextMenu, MenuItem } from "react-contextmenu";
import { Card, Row, Col, Input } from 'antd'

const EditPointContextMenu = ({hoverId}) => {
  const point = useSelector(state => state.undoable.present.point[hoverId])

  return (
    <ContextMenu
      id="cesium_context_menu"
      hideOnLeave={false}
      preventHideOnContextMenu
      preventHideOnResize
      preventHideOnScroll
    >
      <MenuItem preventClose>
        <Card bodyStyle={{padding: 10}}>
          <Row align='middle' style={{width: '150px'}}>
            <Col span={8}>Height</Col>
            <Col span={16}>
              <Input addonAfter='m' size='small' value={point.height}/>
            </Col>
          </Row>
        </Card>
      </MenuItem>
    </ContextMenu>
  );
}

export default EditPointContextMenu;
