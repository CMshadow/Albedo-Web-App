interface IGetMinorMax {
  (objArray: { [key: string]: number }[], objKey: string): number | null
}

export const getMin: IGetMinorMax = (objArray, objKey) => {
  if (objArray.length === 0) return null
  return objArray.reduce(
    (min: number, obj) => (obj[objKey] < min ? obj[objKey] : min),
    objArray[0][objKey]
  )
}

export const getMax: IGetMinorMax = (objArray, objKey) => {
  if (objArray.length === 0) return null
  return objArray.reduce((max, obj) => (obj[objKey] > max ? obj[objKey] : max), objArray[0][objKey])
}
