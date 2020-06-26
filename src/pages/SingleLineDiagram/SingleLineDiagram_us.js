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


const SingleLineDiagUS = () => {
  const dispatch = useDispatch()
  const stageWidth = useSelector(state => state.SLD.stageWidth);
  const stageHeight = useSelector(state => state.SLD.stageHeight);
  const { projectID, buildingID } = useParams();
  const projectData = useSelector(state => state.project)
  const buildingData = projectData.buildings.find(building => building.buildingID === buildingID)
  const reportData = useSelector(state => state.report)
  const spec = buildingData.data.flatMap(setup => setup.inverter_wiring)
  console.log(reportData)
  const stringPanels = spec.map( i => i.panels_per_string);
  const panelsInverter = spec.map( i => i.string_per_inverter);

  useEffect(() => {
    if (!Object.keys(reportData).includes(buildingID)) {
      dispatch(getReport({projectID, buildingID: buildingID}))
        .then(res => {
          dispatch(setReportData({buildingID: buildingID, data: res}))
        })
        .catch(err => {
        })
    }
  },[buildingID, dispatch, projectID, reportData])

  const numOfInverter = spec.length;

  return (
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
                  panelsOfInverter={panelsInverter}/>
                 <InverterCollection 
                  width={stageWidth} 
                  height={stageHeight} 
                  numOfInverter={numOfInverter}/>
                <InterConnect 
                  width={stageWidth} 
                  height={stageHeight} 
                  numOfInverter={numOfInverter}/>
                <Disconnecter 
                  width={stageWidth} 
                  height={stageHeight} />
                <ServerPanel 
                  width={stageWidth} 
                  height={stageHeight}/>
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
  );
}


export default SingleLineDiagUS;