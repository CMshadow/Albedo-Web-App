import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Row, Button, Spin, Space, Tooltip, notification } from 'antd';
import { SettingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/logo-no-text.png';
import ModelingHeader from '../ModelingHeader/ModelingHeader';
import LeftSider from '../ModelingLeftSider/LeftSider'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert';
import { getProject, saveProject, globalOptTiltAzimuth, allTiltAzimuthPOA } from '../../pages/Project/service'
import { getPV, getOfficialPV } from '../../pages/PVTable/service'
import { getInverter, getOfficialInverter } from '../../pages/InverterTable/service'
import { saveReport } from '../../pages/Report/service'
import { setProjectData, setPVData, setOfficialPVData, setInverterData, setOfficialInverterData, updateProjectAttributes } from '../../store/action/index';
import { CustomViewer } from '../../components/Modeling/Cesium/CustomViewer/CustomViewer'
import * as styles from './ModelingLayout.module.scss';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const ModelingLayout = (props) => {
  const history = useHistory();

  return (
    <Layout>
      <ModelingHeader/>
      <Layout>
        <LeftSider/>
        <Content>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default ModelingLayout;
