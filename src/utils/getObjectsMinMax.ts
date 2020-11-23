interface IGetMinorMax {
  (objArray: Record<string, number>[], objKey: string): number
}

export const getMin: IGetMinorMax = (objArray, objKey) => {
  if (objArray.length === 0) return Infinity
  return objArray.reduce(
    (min: number, obj) => (obj[objKey] < min ? obj[objKey] : min),
    objArray[0][objKey]
  )
}

export const getMax: IGetMinorMax = (objArray, objKey) => {
  if (objArray.length === 0) return -Infinity
  return objArray.reduce((max, obj) => (obj[objKey] > max ? obj[objKey] : max), objArray[0][objKey])
}
