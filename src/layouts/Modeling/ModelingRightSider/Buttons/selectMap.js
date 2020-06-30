import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Dropdown, Row, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/pro-light-svg-icons'
import { selectMap } from '../../../../store/action/index'

const SelectMap = () =>{
  const dispatch = useDispatch()
  const selectedMap = useSelector(state => state.cesium.selectedMap)

  const menu = (
    <Menu
      selectedKeys={[selectedMap]}
      onClick = {(item, key) => {
        dispatch(selectMap(item.key))
      }}
    >
      <Menu.Item key='google'>
        Google Map
      </Menu.Item>
      <Menu.Item key='bing'>
        Bing Map
      </Menu.Item>
      <Menu.Item key='aMap'>
        AMap
      </Menu.Item>
    </Menu>
  );

  return (
    <Row style={{top:'10px'}}>
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
        <Button
          type='primary'
          shape='circle'
          size='large'
        >
          <FontAwesomeIcon icon={faLayerGroup} />
        </Button>
      </Dropdown>
    </Row>
  );
};

export default SelectMap;
