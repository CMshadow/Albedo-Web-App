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
// import Grid from '../../components/SingleLineDiagram/Grid';
import { ReactReduxContext, Provider, useSelector } from "react-redux";
// import ServerPanel from '../../components/SingleLineDiagram/ServicePanel';
import { Table, Button, Tabs, Tooltip } from 'antd';
import { ProfileOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const buildingData = {
  "reGenReport": false,
  "buildingName": "aa",
  "data": [
    {
      "pv_panel_parameters": {
        "tilt_angle": 30,
        "mode": "single",
        "azimuth": 70,
        "pv_model": {
          "pvID": "574d83c0-b25a-11ea-84e3-7d1e266a542c",
          "userID": "6ca6aee2-dace-4b5c-8207-351aba887a2a"
        }
      },
      "inverter_wiring": [
        {
          "inverter_model": {
            "userID": "6ca6aee2-dace-4b5c-8207-351aba887a2a",
            "inverterID": "90462570-b277-11ea-abeb-8d6c15c5ad70"
          },
          "inverter_serial_number": 1,
          "ac_cable_len": 0,
          "dc_cable_len": [
            0,
            0
          ],
          "string_per_inverter": 2,
          "panels_per_string": 10
        },
        {
          "inverter_model": {
            "userID": "6ca6aee2-dace-4b5c-8207-351aba887a2a",
            "inverterID": "90462570-b277-11ea-abeb-8d6c15c5ad70"
          },
          "inverter_serial_number": 2,
          "ac_cable_len": 0,
          "dc_cable_len": [
            100,
            100
          ],
          "string_per_inverter": 2,
          "panels_per_string": 10
        },
        {
          "inverter_model": {
            "userID": "6ca6aee2-dace-4b5c-8207-351aba887a2a",
            "inverterID": "97d36160-b24d-11ea-9bc9-f704ab998545"
          },
          "inverter_serial_number": 3,
          "ac_cable_len": 3,
          "dc_cable_len": [
            2,
            2,
            2
          ],
          "string_per_inverter": 3,
          "panels_per_string": 9
        }
      ]
    },
    {
      "pv_panel_parameters": {
        "tilt_angle": 10,
        "mode": "single",
        "azimuth": 130,
        "pv_model": {
          "pvID": "f03ccff0-b24b-11ea-9761-43d8ee90547d",
          "userID": "6ca6aee2-dace-4b5c-8207-351aba887a2a"
        }
      },
      "inverter_wiring": [
        {
          "inverter_model": {
            "userID": "6ca6aee2-dace-4b5c-8207-351aba887a2a",
            "inverterID": "90462570-b277-11ea-abeb-8d6c15c5ad70"
          },
          "inverter_serial_number": 1,
          "ac_cable_len": 0,
          "dc_cable_len": [
            0,
            0
          ],
          "string_per_inverter": 2,
          "panels_per_string": 9
        },
        {
          "inverter_model": {
            "userID": "6ca6aee2-dace-4b5c-8207-351aba887a2a",
            "inverterID": "97d36160-b24d-11ea-9bc9-f704ab998545"
          },
          "inverter_serial_number": 2,
          "ac_cable_len": 14,
          "dc_cable_len": [
            5,
            5,
            5,
            5,
            5
          ],
          "string_per_inverter": 5,
          "panels_per_string": 7
        },
        {
          "inverter_model": {
            "userID": "6ca6aee2-dace-4b5c-8207-351aba887a2a",
            "inverterID": "90462570-b277-11ea-abeb-8d6c15c5ad70"
          },
          "inverter_serial_number": 3,
          "ac_cable_len": 5,
          "dc_cable_len": [
            2,
            2
          ],
          "string_per_inverter": 2,
          "panels_per_string": 6
        }
      ]
    }
  ],
  "combibox_cable_len": 8,
  "buildingID": "42518460-b98c-11ea-bf5a-0900e901db16"
}
const reportData = {
  "42518460-b98c-11ea-bf5a-0900e901db16": {
    "p_loss_combibox_wiring": 0.002694951783779492,
    "year_AC_power": {
      "value": 58.38587259107461,
      "unit": "MWh"
    },
    "p_loss_soiling": 0.02,
    "setup_ac_Ie": [
      [
        6.381239817359022,
        6.381239817359022,
        30.69379421529111
      ],
      [
        6.381239817359022,
        30.69379421529111,
        6.381239817359022
      ]
    ],
    "setup_dc_wir_choice": [
      [
        [
          "1 x 4mm²",
          "1 x 4mm²"
        ],
        [
          "1 x 6mm²",
          "1 x 6mm²"
        ],
        [
          "1 x 4mm²",
          "1 x 4mm²",
          "1 x 4mm²"
        ]
      ],
      [
        [
          "1 x 4mm²",
          "1 x 4mm²"
        ],
        [
          "1 x 4mm²",
          "1 x 4mm²",
          "1 x 4mm²",
          "1 x 4mm²",
          "1 x 4mm²"
        ],
        [
          "1 x 4mm²",
          "1 x 4mm²"
        ]
      ]
    ],
    "p_loss_connection": 0.005,
    "setup_month_irr": [
      [
        227.7450162046265,
        280.7211167774727,
        438.0495808747679,
        550.3412877979761,
        670.8732927515541,
        680.3827648166111,
        721.1749414789152,
        651.2201701418556,
        504.26877346951665,
        371.13190613769734,
        262.91114782130023,
        220.00134152409618
      ],
      [
        314.98174417255876,
        366.5901162767855,
        534.0906772880164,
        642.2768619782877,
        727.1624422817658,
        744.5796485580308,
        796.2898892958082,
        743.7971406103347,
        603.562284286405,
        483.58378538408425,
        374.1041987346451,
        324.1719650057418
      ]
    ],
    "year25_kWh_over_kWp": [
      1416.9990404079472,
      1409.9253344458718,
      1402.8006631181513,
      1395.6188368863268,
      1388.376236061902,
      1381.0767121396582,
      1373.723199854223,
      1366.3118922924714,
      1358.837237755811,
      1351.3000410247814,
      1343.7060773115145,
      1336.052576787658,
      1328.335516160875,
      1320.5574259205903,
      1312.7205199713192,
      1304.8230197694475,
      1296.8649505863498,
      1288.852468816088,
      1280.7811177779415,
      1272.6491121258177,
      1264.4532553292422,
      1256.1991771737,
      1247.8883884316324,
      1239.5202232214801,
      1231.0976580441477
    ],
    "so2_reduction": 41001.3366394574,
    "c_reduction": 371745.4521977471,
    "co2_reduction": 1362611.087651301,
    "p_loss_temperature": 0.030833585236344607,
    "nox_reduction": 20500.6683197287,
    "p_loss_conversion": 0.06014975917416232,
    "setup_ac_wir_choice": [
      [
        "3 x 4mm²",
        "3 x 4mm²",
        "3 x 6mm²"
      ],
      [
        "3 x 4mm²",
        "3 x 6mm²",
        "3 x 4mm²"
      ]
    ],
    "p_loss_tilt_azimuth": 0.13991632207639382,
    "month_AC_power": {
      "value": [
        2.6210737239010693,
        3.1729207053201685,
        4.688747845395884,
        5.719363737196084,
        6.63521157320062,
        6.736974233707988,
        7.147170644629968,
        6.594530163532627,
        5.267249115162062,
        4.105476514472635,
        3.0660546098431523,
        2.6310997247121697
      ],
      "unit": "MWh"
    },
    "p_loss_dc_wiring": 0.0022704306706441413,
    "year25_AC_power": [
      {
        "value": 58.38587259107461,
        "unit": "MWh"
      },
      {
        "value": 58.094408388720915,
        "unit": "MWh"
      },
      {
        "value": 57.80084421504737,
        "unit": "MWh"
      },
      {
        "value": 57.50492503699215,
        "unit": "MWh"
      },
      {
        "value": 57.20650170930865,
        "unit": "MWh"
      },
      {
        "value": 56.90573292856414,
        "unit": "MWh"
      },
      {
        "value": 56.60273961724141,
        "unit": "MWh"
      },
      {
        "value": 56.29736491571084,
        "unit": "MWh"
      },
      {
        "value": 55.98938007239428,
        "unit": "MWh"
      },
      {
        "value": 55.678818247380576,
        "unit": "MWh"
      },
      {
        "value": 55.36591740187514,
        "unit": "MWh"
      },
      {
        "value": 55.05056340817521,
        "unit": "MWh"
      },
      {
        "value": 54.732590490985906,
        "unit": "MWh"
      },
      {
        "value": 54.412102916315156,
        "unit": "MWh"
      },
      {
        "value": 54.08919190564104,
        "unit": "MWh"
      },
      {
        "value": 53.76378417604814,
        "unit": "MWh"
      },
      {
        "value": 53.43588076881539,
        "unit": "MWh"
      },
      {
        "value": 53.10573535132652,
        "unit": "MWh"
      },
      {
        "value": 52.77316429099935,
        "unit": "MWh"
      },
      {
        "value": 52.43809402462986,
        "unit": "MWh"
      },
      {
        "value": 52.10039284272801,
        "unit": "MWh"
      },
      {
        "value": 51.76029271435565,
        "unit": "MWh"
      },
      {
        "value": 51.41785588921425,
        "unit": "MWh"
      },
      {
        "value": 51.07305493039331,
        "unit": "MWh"
      },
      {
        "value": 50.72601248130868,
        "unit": "MWh"
      }
    ],
    "combibox_Ie": 62.60283416620982,
    "p_loss_degradation": 0.015,
    "p_loss_degradation_rest": 0.005,
    "p_loss_mismatch": 0.02,
    "investment": [],
    "ttl_dc_power_capacity": {
      "value": 41.215,
      "unit": "kW"
    },
    "combibox_wir_choice": "3 x 16mm²",
    "setup_month_irr_avg_pk_hr": [
      [
        2.040725951654359,
        2.784931714062229,
        3.925175455867097,
        5.09575266479608,
        6.011409433257648,
        6.2998404149686245,
        6.46214105267845,
        5.83530618406681,
        4.66915530990293,
        3.325554714495497,
        2.434362479826854,
        1.9713381856997862
      ],
      [
        2.8224170624781246,
        3.6368067090950937,
        4.785758757061078,
        5.947007981280441,
        6.515792493564209,
        6.89425600516695,
        7.135214061790392,
        6.664848930200133,
        5.588539669318566,
        4.33318804107602,
        3.4639277660615284,
        2.9047667115209843
      ]
    ],
    "system_efficiency": 0.831258633623078,
    "p_loss_system": 0.16874136637692205,
    "p_loss_ac_wiring": 0.0037653368020787157,
    "coal_reduction": 448281.28059140086,
    "p_loss_eff_irradiance": 0.017025835586003346,
    "kWh_over_kWp": 1416.9990404079472
  }
}

const SingleLineDiagUS = () => {
  const { buildingID } = useParams();

  const userPV = useSelector(state => state.pv.data);
  const officialPV = useSelector(state => state.pv.officialData);
  const allPV = userPV.concat(officialPV)
  const userInverter = useSelector(state => state.inverter.data);
  const officialInverter = useSelector(state => state.inverter.officialData)
  const allInverter = userInverter.concat(officialInverter)


  // const projectData = useSelector(state => state.project);
  // const buildingData = projectData.buildings.find(building =>
  //   building.buildingID === buildingID
  // )
  console.log(buildingData)
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
      panels_per_string: invSpec.panels_per_string
    }
  }))

  // const reportData = useSelector(state => state.report);
  console.log(reportData)
  const buildingReport = reportData[buildingID]
  const combiboxCableChoice = buildingReport ?
    DataGenerator.getCombiBoxCableChoice(buildingReport)
    : ''
  const acCableChoice = buildingReport ? buildingReport.setup_ac_wir_choice.flatMap(ary => ary) : []
  const dcCableChoice = buildingReport ? buildingReport.setup_dc_wir_choice.flatMap(ary => ary.flatMap(ary2 => ary2)) : []
  const combiboxIe = buildingReport && buildingReport.combibox_Ie ? buildingReport.combibox_Ie.toFixed(0) : ''
  const acIe = buildingReport && buildingReport.setup_ac_Ie ? buildingReport.setup_ac_Ie.flatMap(ary => ary.map(val => val.toFixed(0))) : []
  // console.log(combiboxIe + "cc")
  console.log(acIe + " :aaa")
  
  // const stringPanels = spec.map( i => i.panels_per_string)
  // const panelsInverter = spec.map( i => i.string_per_inverter)
  
  // const combiboxName = buildingReport && buildingReport.investment ?
  //   DataGenerator.getCombiBoxData(buildingReport)
  //   : '';
  // 

  // 创建 module table数据

  // const pvTableData = DataGenerator.getPVsTableData(allPV, buildingData, buildingReport);
  // 创建 inverter table数据
  // const invTableData = DataGenerator.getInverterTableData(allInverter, buildingData);

  let newWidth = useSelector(state => state.SLD.diagramWidth);
  let newHeight = newWidth * (4 / 3) + 120//useSelector(state => state.SLD.diagramHeight);
  // console.log("new " + newWidth)
  let [tableTrigger, setTable] = useState(true);
  const tableTriggerHandler = () => {
    setTable(!tableTrigger);
  }

  
  return (
    <div className={classes.SLD}>
      <Tooltip title="Equipment Table">
        <Button
          className={classes.triggerButton}
          shape="circle"
          size="large"
          icon={<ProfileOutlined />}
          onClick={tableTriggerHandler} />
      </Tooltip>
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
          {/* <Table
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
          /> */}
        </TabPane>
        <TabPane tab="Inverter" key="2">
        {/* <Table columns={[{
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
        /> */}
        </TabPane>
      </Tabs>

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

                  />
                <PanelArrayCollection 
                  index={1}
                  combiboxIe = {combiboxIe}
                  acIe={acIe}
                  numOfInv = {numOfInverter}
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
                  />
                <PanelArrayCollection 
                  index={2}
                  numOfInv = {numOfInverter}
                  combiboxIe = {combiboxIe}
                  acIe={acIe}
                  />
                <MeterAllIn combiboxIe = {combiboxIe}/>
              </Layer>
            </Provider>
          </Stage>
        )}
      </ReactReduxContext.Consumer>
    </div>
  );
}


export default SingleLineDiagUS;
