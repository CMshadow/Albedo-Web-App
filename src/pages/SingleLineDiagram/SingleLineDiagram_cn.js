import React, {useState} from 'react';
import  {Stage, Layer}  from 'react-konva';
import { useParams } from 'react-router-dom'
import classes from './SingleLineDiagram_us.module.scss';
import Background from '../../components/SingleLineDiagram/SingleLineDiagram_CN/Background';
import Boundary from '../../components/SingleLineDiagram/SingleLineDiagram_CN/DiagramBoundary';
import PanelArrayCollection from '../../components/SingleLineDiagram/SingleLineDiagram_CN/panelArrayCollection';
import MeterSelfUse from '../../components/SingleLineDiagram/SingleLineDiagram_CN/SelfUseMeter';
import MeterAllIn from '../../components/SingleLineDiagram/SingleLineDiagram_CN/MeterAllIn';
import * as DataGenerator from '../../utils/singleLineDiagramDataGenerator'
import ComponentsTable from '../../components/SingleLineDiagram/SingleLineDiagram_CN/ComponentTable';
import { ReactReduxContext, Provider, useSelector } from "react-redux";

const SingleLineDiagUS = () => {
  const { buildingID } = useParams();

  const userPV = useSelector(state => state.pv.data);
  const officialPV = useSelector(state => state.pv.officialData);
  const allPV = userPV.concat(officialPV)
  const userInverter = useSelector(state => state.inverter.data);
  const officialInverter = useSelector(state => state.inverter.officialData)
  const allInverter = userInverter.concat(officialInverter)


  const projectData = useSelector(state => state.project);
  const buildingData = projectData.buildings.find(building =>
    building.buildingID === buildingID
  )
  const invSpec = DataGenerator.getInverterWring(buildingData)
  const aggrePaco = invSpec.map(spec =>
    allInverter.find(inv => inv.inverterID === spec.inverter_model.inverterID).paco
    ).reduce((cum, val) => {
      Object.keys(cum).includes(val.toString()) ? cum[val] += 1 : cum[val] = 1
      return cum
    }, {})
  const numOfInverter = invSpec.length
  const allPVArray = buildingData.data.flatMap((setup, index) => setup.inverter_wiring.flatMap(invSpec => {
    const pvSpec = allPV.find(pv => pv.pvID === setup.pv_panel_parameters.pv_model.pvID)
    const inverter = allInverter.find(inv => inv.inverterID === invSpec.inverter_model.inverterID)
    return {
      siliconMaterial: pvSpec.siliconMaterial,
      inverter_serial_number: `${index + 1}.${invSpec.inverter_serial_number}`,
      pvName: pvSpec.name,
      pmax: pvSpec.pmax,
      voc: pvSpec.voco,
      vpm: pvSpec.vmpo,
      isc: pvSpec.isco,
      ipm: pvSpec.impo,
      string_per_inverter: invSpec.string_per_inverter,
      panels_per_string: invSpec.panels_per_string,
      inverterName: inverter.name,
      paco: inverter.paco
    }
  }))

  const reportData = useSelector(state => state.report);
  const buildingReport = reportData[buildingID]
  const combiboxCableChoice = buildingReport ?
    DataGenerator.getCombiBoxCableChoice(buildingReport)
    : ''
  const acCableChoice = buildingReport ? buildingReport.setup_ac_wir_choice.flatMap(ary => ary) : []
  const dcCableChoice = buildingReport ? buildingReport.setup_dc_wir_choice.flatMap(ary => ary.flatMap(ary2 => ary2)) : []
  const combiboxIe = buildingReport && buildingReport.combibox_Ie ? buildingReport.combibox_Ie.toFixed(0) : ''
  const acIe = buildingReport && buildingReport.setup_ac_Ie ? buildingReport.setup_ac_Ie.flatMap(ary => ary.map(val => val.toFixed(0))) : []
  const combiboxName = buildingReport && buildingReport.investment ?
  DataGenerator.getCombiBoxData(buildingReport)
  : '';
  let newWidth = useSelector(state => state.SLD.diagramWidth);
  let newHeight =useSelector(state => state.SLD.diagramHeight);

  return (
    <div className={classes.SLD}>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <Stage
            className={classes.stage}
            height={newHeight}
            width={newWidth}
            draw={true}
          >
            <Provider store={store}>
              <Layer>
                <Background />
                <Boundary
                  index = {1}
                  width = {newWidth}
                  height = {newHeight}
                  combiBox = {combiboxCableChoice}
                  acData = {acCableChoice}
                  dcData = {dcCableChoice}
                  numOfInv = {numOfInverter}
                  aggrePacpData = {aggrePaco}
                  allPVArray = {allPVArray}
                  projectData = {projectData}
                  />
                <PanelArrayCollection
                  index={1}
                  combiboxIe = {combiboxIe}
                  acIe={acIe}
                  numOfInv = {numOfInverter}
                  allPVArray = {allPVArray}
                  />
                <MeterSelfUse combiboxIe = {combiboxIe}/>
                <Boundary
                  index = {2}
                  width = {newWidth}
                  height = {newHeight}
                  combiBox = {combiboxCableChoice}
                  acData = {acCableChoice}
                  dcData = {dcCableChoice}
                  numOfInv = {numOfInverter}
                  aggrePacpData = {aggrePaco}
                  allPVArray = {allPVArray}
                  combiboxIe = {combiboxIe}
                  projectData = {projectData}
                  />
                <PanelArrayCollection
                  index={2}
                  numOfInv = {numOfInverter}
                  combiboxIe = {combiboxIe}
                  acIe={acIe}
                  allPVArray = {allPVArray}
                  />
                <MeterAllIn combiboxIe = {combiboxIe}/>

                <ComponentsTable
                  index = {3}
                  width = {newWidth}
                  height = {newHeight}
                  allPVArray = {allPVArray}
                  dcData = {dcCableChoice}
                  numOfInv = {numOfInverter}
                  acData = {acCableChoice}
                  combiboxName = {combiboxName}
                  combiBox = {combiboxCableChoice}
                />
              </Layer>
            </Provider>
          </Stage>
        )}
      </ReactReduxContext.Consumer>
    </div>
  );
}


export default SingleLineDiagUS;
