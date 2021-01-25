import React from 'react'
import { Stage, Layer } from 'react-konva'
import { useParams } from 'react-router-dom'
import classes from './SingleLineDiagram_us.module.scss'
import Background from '../../components/SingleLineDiagram/SingleLineDiagram_CN/Background'
import Boundary from '../../components/SingleLineDiagram/SingleLineDiagram_CN/DiagramBoundary'
import PanelArrayCollection from '../../components/SingleLineDiagram/SingleLineDiagram_CN/panelArrayCollection'
import MeterSelfUse from '../../components/SingleLineDiagram/SingleLineDiagram_CN/SelfUseMeter'
import MeterAllIn from '../../components/SingleLineDiagram/SingleLineDiagram_CN/MeterAllIn'
import * as DataGenerator from '../../utils/singleLineDiagramDataGenerator'
import ComponentsTable from '../../components/SingleLineDiagram/SingleLineDiagram_CN/ComponentTable'
import { ReactReduxContext, Provider, useSelector } from 'react-redux'
import { RootState, Params, IAllPVArray, DomesticReport } from '../../@types'

const SingleLineDiagCN = () => {
  const { buildingID } = useParams<Params>()

  const userPV = useSelector((state: RootState) => state.pv.data)
  const officialPV = useSelector((state: RootState) => state.pv.officialData)
  const allPV = userPV.concat(officialPV)

  const userInverter = useSelector((state: RootState) => state.inverter.data)
  const officialInverter = useSelector((state: RootState) => state.inverter.officialData)
  const allInverter = userInverter.concat(officialInverter)

  const newWidth = useSelector((state: RootState) => state.SLD.diagramWidth)
  const newHeight = useSelector((state: RootState) => state.SLD.diagramHeight)

  const reportData = useSelector((state: RootState) => state.report)
  const projectData = useSelector((state: RootState) => state.project)

  const buildingData = projectData?.buildings.find(building => building.buildingID === buildingID)

  if (!buildingData || !buildingID) return null

  const invSpec = DataGenerator.getInverterWring(buildingData)
  const numOfInverter = invSpec.length

  const aggrePaco = invSpec
    ?.map(spec => allInverter.find(inv => inv.inverterID === spec.inverter_model.inverterID)?.paco)
    .filter((val): val is number => val !== undefined)
    .reduce((cum: { [key: string]: number }, val) => {
      Object.keys(cum).includes(val.toString())
        ? (cum[val.toString()] += 1)
        : (cum[val.toString()] = 1)
      return cum
    }, {})

  const allPVArray: IAllPVArray[] = buildingData.data.flatMap((setup, index) =>
    setup.inverter_wiring
      .flatMap(invSpec => {
        const pvSpec = allPV.find(pv => pv.pvID === setup.pv_panel_parameters.pv_model.pvID)
        const inverter = allInverter.find(
          inv => inv.inverterID === invSpec.inverter_model.inverterID
        )
        if (!pvSpec || !inverter) {
          return undefined
        } else {
          return {
            siliconMaterial: pvSpec.siliconMaterial as string,
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
            paco: inverter.paco,
            acCableChoice: '',
            dcCableChoice: [] as string[],
          }
        }
      })
      .filter((obj): obj is IAllPVArray => obj !== undefined)
  )
  const buildingReport = reportData[buildingID] as DomesticReport
  const combiboxCableChoice = DataGenerator.getCombiBoxCableChoice(buildingReport)
  const acCableChoice = buildingReport.setup_ac_wir_choice.flatMap(ary => ary)
  acCableChoice.forEach(
    (cableChoiceAry, index) => (allPVArray[index].acCableChoice = cableChoiceAry)
  )
  const dcCableChoice = buildingReport.setup_dc_wir_choice.flatMap(ary => ary.map(ary2 => ary2))
  dcCableChoice.forEach(
    (cableChoiceAry, index) => (allPVArray[index].dcCableChoice = cableChoiceAry)
  )

  const combiboxIe =
    buildingReport && buildingReport.combibox_Ie ? Number(buildingReport.combibox_Ie.toFixed(0)) : 0
  const acIe =
    buildingReport && buildingReport.setup_ac_Ie
      ? buildingReport.setup_ac_Ie.flatMap(ary => ary.map(val => Number(val.toFixed(0))))
      : []
  const combiboxName =
    buildingReport && buildingReport.investment ? DataGenerator.getCombiBoxData(buildingReport) : ''

  return (
    <div className={classes.SLD}>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <Stage className={classes.stage} height={newHeight} width={newWidth} draw={true}>
            <Provider store={store}>
              <Layer>
                <Background />
                <Boundary
                  index={1}
                  combiBox={combiboxCableChoice}
                  acData={acCableChoice}
                  dcData={dcCableChoice}
                  numOfInv={numOfInverter}
                  aggrePacoData={aggrePaco}
                  allPVArray={allPVArray}
                  projectData={projectData}
                />
                <PanelArrayCollection
                  index={1}
                  combiboxIe={combiboxIe}
                  acIe={acIe}
                  numOfInv={numOfInverter}
                  allPVArray={allPVArray}
                />
                <MeterSelfUse combiboxIe={combiboxIe} />
                <Boundary
                  index={2}
                  combiBox={combiboxCableChoice}
                  acData={acCableChoice}
                  dcData={dcCableChoice}
                  numOfInv={numOfInverter}
                  aggrePacoData={aggrePaco}
                  allPVArray={allPVArray}
                  combiboxIe={combiboxIe}
                  projectData={projectData}
                />
                <PanelArrayCollection
                  index={2}
                  numOfInv={numOfInverter}
                  combiboxIe={combiboxIe}
                  acIe={acIe}
                  allPVArray={allPVArray}
                />
                <MeterAllIn combiboxIe={combiboxIe} />

                <ComponentsTable
                  index={3}
                  allPVArray={allPVArray}
                  dcData={dcCableChoice}
                  numOfInv={numOfInverter}
                  acData={acCableChoice}
                  combiboxName={combiboxName}
                  combiBox={combiboxCableChoice}
                />
              </Layer>
            </Provider>
          </Stage>
        )}
      </ReactReduxContext.Consumer>
    </div>
  )
}

export default SingleLineDiagCN
