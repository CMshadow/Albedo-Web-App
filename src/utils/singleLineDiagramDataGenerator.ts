import { Building, Inverter, PV, Report } from '../@types'

export const getInverterWring = (buildingData: Building) =>
  buildingData.data.flatMap(setup => setup.inverter_wiring)

export const getCombiBoxData = (buildingReport: Report) =>
  buildingReport.investment.find(row => row.key === '4')?.description ?? ''

export const getCombiBoxCableChoice = (buildingReport: Report) => buildingReport.combibox_wir_choice

export const getPVsTableData = (allPV: PV[], buildingData: Building, buildingReport: Report) => {
  return buildingData.data.flatMap((spec, index) => {
    const pvName =
      allPV.find(obj => obj.pvID === spec.pv_panel_parameters.pv_model.pvID)?.name ?? ''
    return spec.inverter_wiring.map((inverterSpec, invIndex) => ({
      key: 'module: ' + index,
      array: `${index + 1}.${inverterSpec.inverter_serial_number}`,
      module_model: pvName,
      cable_length: inverterSpec.dc_cable_len?.map(num => `${num}m`).join(', ') || '',
      module_in_series: inverterSpec.panels_per_string,
      parallel_string: inverterSpec.string_per_inverter,
      dc_cable_choice: buildingReport ? buildingReport.setup_dc_wir_choice[index][invIndex][0] : '',
      ac_cable_choice: buildingReport ? buildingReport.setup_ac_wir_choice[index][invIndex] : '',
    }))
  })
}

export const getInverterTableData = (allInverter: Inverter[], buildingData: Building) => {
  return buildingData.data.flatMap((spec, index) =>
    spec.inverter_wiring.map(inverterSpec => {
      const inverterName =
        allInverter.find(obj => obj.inverterID === inverterSpec.inverter_model.inverterID)?.name ??
        ''

      return {
        key: 'inverter: ' + index,
        array: `${index + 1}.${inverterSpec.inverter_serial_number}`,
        inverter_model: inverterName,
        ac_cable_length: `${inverterSpec.ac_cable_len}m`,
      }
    })
  )
}
