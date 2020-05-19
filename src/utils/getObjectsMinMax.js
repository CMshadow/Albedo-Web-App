export const getMin = (objArray, objKey) => {
  if (objArray.length === 0) return null
  return objArray.reduce((min, obj) =>
    obj[objKey] < min ? obj[objKey] : min, objArray[0][objKey]
  )
}

export const getMax = (objArray, objKey) => {
  if (objArray.length === 0) return null
  return objArray.reduce((max, obj) =>
    obj[objKey] > max ? obj[objKey] : max, objArray[0][objKey]
  )
}
