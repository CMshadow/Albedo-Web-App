import React, {useState, useEffect} from 'react';
import Konva from 'konva';
import  {Stage, Layer, Text, Shape, Group}  from 'react-konva';
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import classes from './SingleLineDiagram_us.module.scss';
import Background from '../../components/SingleLineDiagram/backgroundGrid';
import PanelArrayCollection from '../../components/SingleLineDiagram/PanelArrayCollection ';
import InverterCollection from '../../components/SingleLineDiagram/InverterCollection';
import InterConnect from '../../components/SingleLineDiagram/Interconnecter';
import Disconnecter from '../../components/SingleLineDiagram/AcDisconnecter';
import ServerPanle from '../../components/SingleLineDiagram/ServicePanel';
import Meter from '../../components/SingleLineDiagram/Meter';
import Grid from '../../components/SingleLineDiagram/Grid';
import { ReactReduxContext, Provider, useSelector } from "react-redux";
import { getReport } from '../../pages/Report/service'
import { setReportData } from '../../store/action/reportAction'
import ServerPanel from '../../components/SingleLineDiagram/ServicePanel';
import { Table, Button, Tabs, Tooltip, notification } from 'antd';
import { ProfileOutlined } from '@ant-design/icons';
import * as DataGenerator from '../../utils/singleLineDiagramDataGenerator';
const { TabPane } = Tabs;

const SingleLineDiagUS = () => {
  const dispatch = useDispatch()
  const stageWidth = useSelector(state => state.SLD.stageWidth);
  const stageHeight = useSelector(state => state.SLD.stageHeight);
  const userPV = useSelector(state => state.pv.data);
  const officialPV = useSelector(state => state.pv.officialData);
  const projectData = useSelector(state => state.project);
  const reportData = useSelector(state => state.report);
  const userInverter = useSelector(state => state.inverter.data);
  const officialInverter = useSelector(state => state.inverter.officialData)
  const { projectID, buildingID } = useParams();
  const buildingReport = reportData[buildingID];
  const buildingData = DataGenerator.getBuildingData(projectData, buildingID);
  const spec = DataGenerator.getInverterWring(buildingData);
  const stringPanels = spec.map( i => i.panels_per_string);
  const panelsInverter = spec.map( i => i.string_per_inverter);
  const numOfInverter = spec.length;
  const combiboxName = buildingReport && buildingReport.investment ? 
    DataGenerator.getCombiBoxData(buildingReport) 
    : '';
  const combiboxCableChoice = buildingReport ? 
    DataGenerator.getCombiBoxCableChoice(buildingReport) 
    : ''

  // 创建 module table数据
  const allPV = userPV.concat(officialPV)
  const pvTableData = DataGenerator.getPVsTableData(allPV, buildingData,buildingReport);
  // 创建 inverter table数据
  const allInverter = userInverter.concat(officialInverter)
  const invTableData = DataGenerator.getInverterTableData(allInverter, buildingData);

  useEffect(() => {
    if (!Object.keys(reportData).includes(buildingID)) {
      dispatch(getReport({projectID, buildingID: buildingID}))
        .then(res => {
          dispatch(setReportData({buildingID: buildingID, data: res}))
        })
        .catch(err => {
          notification.warning({
            message: 'Some contents are missing',
            description: 'Generate the report to view the complete dragram'
          })
        })
    }
  },[buildingID, dispatch, projectID, reportData])

  let [tableTrigger, setTable] = useState(true);
  const tableTriggerHandler = () => {
    setTable(!tableTrigger);
  }
    

  return (
    <div>
      <Tooltip title="Equipment TabLe">
        <Button 
          className={classes.triggerButton} 
          shape="circle" 
          size="large"
          icon={<ProfileOutlined />}
          onClick={tableTriggerHandler} />
      </Tooltip>
      <div>
        <Tabs
          hidden={tableTrigger}
          className={classes.tab}
          tabBarStyle={{
            backgroundColor: 'rgba(255,255,255, 0.5)',
            paddingLeft: 30,
            marginBottom: 0
          }}
        >
          <TabPane tab="Module" key="1">
            <Table 
              columns={[{
                title: <div style={{fontSize: 10}} >Array</div>,
                width: 60,
                dataIndex: "array",
                key: "array_module",
                align: 'center',
                ellipsis: true
              },{
                title: <div style={{fontSize: 10}} >Module Model</div>,
                width: 150,
                dataIndex: "module_model",
                key: "module_model",
                align: 'center',
                ellipsis: true
              },{
                title: <div style={{fontSize: 10}} >DC Cable Length</div>,
                width: 120,
                dataIndex: "dc_cable_choice",
                key: "cable_length",
                align: 'center',
                ellipsis: true
              },{
                title: <div style={{fontSize: 10}} >Module in Series</div>,
                width: 120,
                dataIndex: "module_in_series",
                key: "module_in_series",
                align: 'center',
                ellipsis: true
              },{
                title: <div style={{fontSize: 10}} >Parallel String</div>,
                width: 110,
                dataIndex: "parallel_string",
                key: "parallel_string",
                align: 'center',
                ellipsis: true
              } ]} 
              dataSource={pvTableData}
              pagination={false}
              scroll={{ x: 100, y: 200 }}
            />
          </TabPane>
          <TabPane tab="Inverter" key="2">
          <Table columns={[{
            title: <div style={{fontSize: 10}} >Array</div>,
            width: 150,
            dataIndex: "array",
            key: "array",
            align: 'center',
            ellipsis: true
            },{
              title: <div style={{fontSize: 10}} >Inverter Model</div>,
              width: 150,
              dataIndex: "inverter_model",
              key: "inverter_model",
              align: 'center',
              ellipsis: true
            }, {
              title: <div style={{fontSize: 10}} >AC Cable Length</div>,
              width: 200,
              dataIndex: "ac_cable_length",
              key: "ac_cable_length",
              align: 'center',
              ellipsis: true
            }]} 
            dataSource={invTableData} 
            scroll={{ x: 100, y: 200 }} 
            pagination={false}
          />
          </TabPane>
        </Tabs>
      </div>

      <ReactReduxContext.Consumer>
        {({ store }) => (
          <Stage 
            className={classes.stage} 
            height={window.innerHeight} 
            width={window.innerWidth}>
            <Provider store={store}>
              <Layer draggable={true}>
                <Background 
                  width={window.innerWidth} 
                  height={window.innerHeight}/>
                  <PanelArrayCollection  
                    width={stageWidth} 
                    height={stageHeight} 
                    numOfArray={numOfInverter}
                    stringOfPanels={stringPanels}
                    panelsOfInverter={panelsInverter}
                    pvTable={pvTableData}/>
                  <InverterCollection 
                    width={stageWidth} 
                    height={stageHeight} 
                    numOfInverter={numOfInverter}
                    invertersData={invTableData}
                    pvTable={pvTableData}/>
                  <InterConnect 
                    width={stageWidth} 
                    height={stageHeight} 
                    numOfInverter={numOfInverter}
                    combineBoxName={combiboxName}
                    combiTable={combiboxCableChoice}/>
                  <Disconnecter 
                    width={stageWidth} 
                    height={stageHeight} 
                    combiTable={combiboxCableChoice}
                    numOfArray={numOfInverter}/>
                  <ServerPanel 
                    width={stageWidth} 
                    height={stageHeight}
                    combiTable={combiboxCableChoice}/>
                  <Meter 
                    width={stageWidth} 
                    height={stageHeight}/>
                  <Grid 
                    width={stageWidth} 
                    height={stageHeight}/> 
              </Layer>
            </Provider>
          </Stage>
          
        )}
      </ReactReduxContext.Consumer>

    </div>
  );
}


export default SingleLineDiagUS;