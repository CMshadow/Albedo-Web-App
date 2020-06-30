import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import * as styles from './LeftSider.module.scss';
// import UndoRedo from '../../../components/ui/UndoRedo/UndoRedo';
// import HomePanel from './individualPanels/homePanel';
// import ManageBuildingPanel from './individualPanels/manageBuildingPanel';
// import CreateBuildingPanel from './individualPanels/createBuildingPanel';
// import DrawBuildingPanel from './individualPanels/drawBuildingPanel';
// import Editing3DPanel from './individualPanels/editing3DPanel';
// import SetUpPVPanel from './individualPanels/setUpPVPanel';
// import SetUpWiringPanel from './individualPanels/setUpWiringPanel';
// import SetUpBridgingPanel from './individualPanels/setUpBridgingPanel';
// import * as uiStateJudge from '../../../infrastructure/ui/uiStateJudge';
import * as actions from '../../../store/action/index'
import * as objTypes from '../../../store/action/drawing/objTypes'

const { Sider } = Layout;

const LeftSider = (props) => {
  const dispatch = useDispatch()
  const drawStatus = useSelector(state => state.undoable.present.drwStat.status)
  const [siderCollapse, setsiderCollapse] = useState(false)

  const toggle = () => setsiderCollapse(!siderCollapse)


  let content = null;
  content = (
    <>
      <Button loading={drawStatus === objTypes.POINT} onClick={() => dispatch(actions.setDrwStatPoint())}>Draw Point</Button>
      <Button loading={drawStatus === objTypes.LINE} onClick={() => dispatch(actions.setDrwStatLine())}>Draw line</Button>
      <Button loading={drawStatus === objTypes.POLYLINE} onClick={() => dispatch(actions.setDrwStatPolyline())}>Draw Polyline</Button>
      <Button loading={drawStatus === objTypes.POLYGON} onClick={() => dispatch(actions.setDrwStatPolygon())}>Draw Polygon</Button>
      <Button loading={drawStatus === objTypes.CIRCLE} onClick={() => dispatch(actions.setDrwStatCircle())}>Draw Circle</Button>
      <Button loading={drawStatus === objTypes.SECTOR} onClick={() => dispatch(actions.setDrwStatSector())}>Draw Sector</Button>
    </>
  )
  // if (this.state.siderCollapse === false) {
  //   if (uiStateJudge.isIdleStates(this.props.uiState)) {
  //     content = (<HomePanel/>);
  //   }
  //   else if (uiStateJudge.showManageBuildingPanel(this.props.uiState)) {
  //     content = (<ManageBuildingPanel />)
  //   }
  //   else if (uiStateJudge.showCreateBuildingPanel(this.props.uiState)) {
  //     content = (<CreateBuildingPanel/>);
  //   }
  //   else if (uiStateJudge.showDrawingPanel(this.props.uiState)) {
  //     content = (<DrawBuildingPanel/>);
  //   }
  //   else if (uiStateJudge.showEditing3DPanel(this.props.uiState)) {
  //     content = (<Editing3DPanel/>);
  //   }
  //   else if (uiStateJudge.showSetUpPVPanel(this.props.uiState)) {
  //     content = (<SetUpPVPanel/>)
  //   }
  //   else if (uiStateJudge.showSetUpWiringPanel(this.props.uiState)) {
  //     content = (<SetUpWiringPanel/>)
  //   }
  //   else if (uiStateJudge.showSetUpBridgingPanel(this.props.uiState)) {
  //     content = (<SetUpBridgingPanel/>)
  //   }
  // }

  return (
    <Layout className={styles.outerLayout}>
      <Sider
        className={styles.leftSider}
        width={350}
        collapsedWidth={50}
        collapsible
        trigger={null}
        collapsed={siderCollapse}
      >
        <Layout className = {styles.upperPart}>
          {content}
        </Layout>
        <Layout className = {styles.lowerPart}>
          {/* {this.state.siderCollapse ? null : <UndoRedo />} */}
        </Layout>
      </Sider>
      <Button
        className={styles.collapseButton}
        icon={siderCollapse ? <RightOutlined/> : <LeftOutlined/>}
        shape='circle'
        size='small'
        onClick={() => toggle()}
      />
    </Layout>
  );
}

export default LeftSider;
