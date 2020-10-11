export const findUnusedTransformerSerial = (allPowercabinets, allTransformers) => {
  const allTranformerSerial = allTransformers.map(transformer =>
    transformer.transformer_serial_num
  )
  const allUsedTransformerSerial = allPowercabinets.flatMap(powercabinet =>
    powercabinet.linked_transformer_serial_num
  )
  return allTranformerSerial.filter(serial => !allUsedTransformerSerial.includes(serial))
}

export const findUnusedCombiboxSerial = (allTransformers, allPowercabinets, building) => {
  const allCombiboxSerial = building.combibox.map(combibox => 
    combibox.combibox_serial_num
  )
  const allUsedCombiboxSerial = allTransformers.flatMap(trans =>
    trans.linked_combibox_serial_num
  ).concat(
    allPowercabinets.flatMap(powercabinet => powercabinet.linked_combibox_serial_num)
  )
  return allCombiboxSerial.filter(serial => !allUsedCombiboxSerial.includes(serial))
}

export const findUnusedInverterSerial = (allTransformers, allPowercabinets, building) => {
  const allInverterSerial = building.data.flatMap((spec, specIndex) =>
    spec.inverter_wiring.map(inverter => 
      `${building.buildingName}-${specIndex + 1}-${inverter.inverter_serial_number}`
    )
  )
  const allUsedInverterSerial = allTransformers.flatMap(trans =>
    trans.linked_inverter_serial_num
  ).concat(
    building.combibox ? 
    building.combibox.flatMap(combibox => 
      combibox.linked_inverter_serial_num.map(serial => `${building.buildingName}-${serial}`)
    ) :
    []
  ).concat(
    allPowercabinets.flatMap(powercabinet => powercabinet.linked_inverter_serial_num)
  )
  return allInverterSerial.filter(serial => !allUsedInverterSerial.includes(serial))
}

export const usedAllEquipments = (projectData) => {
  const allPowercabinets = projectData.powercabinets || []
  const allTransformers = projectData.transformers || []

  if (
    allPowercabinets.length === 0 ||
    findUnusedTransformerSerial(allPowercabinets, allTransformers).length > 0
  ) {
    return false
  }

  if (
    projectData.buildings.map(building => 
      findUnusedCombiboxSerial(allTransformers, allPowercabinets, building)
    ).some(ary => ary.length > 0)
  ) {
    return false
  }

  if (
    projectData.buildings.map(building => 
      findUnusedInverterSerial(allTransformers, allPowercabinets, building)
    ).some(ary => ary.length > 0)
  ) {
    return false
  }

  return true
}
