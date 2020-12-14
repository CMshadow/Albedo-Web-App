import { Project, Building, PowerCabinet, Transformer } from '../@types'

interface IFUTS {
  (allPowercabinets: Array<PowerCabinet>, allTransformers: Array<Transformer>): Array<string>
}

interface IFUCS {
  (
    allTransformers: Array<Transformer>,
    allPowercabinets: Array<PowerCabinet>,
    building: Building
  ): Array<string>
}

interface IFUIS {
  (
    allTransformers: Array<Transformer>,
    allPowercabinets: Array<PowerCabinet>,
    building: Building
  ): Array<string>
}

interface IUAE {
  (projectData: Project): boolean
}

export const findUnusedTransformerSerial: IFUTS = (allPowercabinets, allTransformers) => {
  const allTranformerSerial = allTransformers.map(transformer => transformer.transformer_serial_num)
  const allUsedTransformerSerial = allPowercabinets.flatMap(
    powercabinet => powercabinet.linked_transformer_serial_num
  )
  return allTranformerSerial.filter(serial => !allUsedTransformerSerial.includes(serial))
}

export const findUnusedCombiboxSerial: IFUCS = (allTransformers, allPowercabinets, building) => {
  const allCombiboxSerial = building.combibox.map(combibox => combibox.combibox_serial_num)
  const allUsedCombiboxSerial = allTransformers
    .flatMap(trans => trans.linked_combibox_serial_num)
    .concat(allPowercabinets.flatMap(powercabinet => powercabinet.linked_combibox_serial_num))
  return allCombiboxSerial.filter(serial => !allUsedCombiboxSerial.includes(serial))
}

export const findUnusedInverterSerial: IFUIS = (allTransformers, allPowercabinets, building) => {
  const allInverterSerial = building.data.flatMap((spec, specIndex) =>
    spec.inverter_wiring.map(
      inverter => `${building.buildingName}-${specIndex + 1}-${inverter.inverter_serial_number}`
    )
  )
  const allUsedInverterSerial = allTransformers
    .flatMap(trans => trans.linked_inverter_serial_num)
    .concat(
      building.combibox
        ? building.combibox.flatMap(combibox =>
            combibox.linked_inverter_serial_num.map(serial => `${building.buildingName}-${serial}`)
          )
        : []
    )
    .concat(allPowercabinets.flatMap(powercabinet => powercabinet.linked_inverter_serial_num))
  return allInverterSerial.filter(serial => !allUsedInverterSerial.includes(serial))
}

export const usedAllEquipments: IUAE = projectData => {
  const allPwrcabs = projectData.powercabinets || []
  const allTrans = projectData.transformers || []

  if (allPwrcabs.length === 0 || findUnusedTransformerSerial(allPwrcabs, allTrans).length > 0) {
    return false
  }

  if (
    projectData.buildings
      .map(building => findUnusedCombiboxSerial(allTrans, allPwrcabs, building))
      .some(ary => ary.length > 0)
  ) {
    return false
  }

  if (
    projectData.buildings
      .map(building => findUnusedInverterSerial(allTrans, allPwrcabs, building))
      .some(ary => ary.length > 0)
  ) {
    return false
  }

  return true
}
