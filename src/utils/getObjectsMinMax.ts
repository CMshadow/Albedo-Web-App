interface IGetMinorMax {
  (objArray: Record<string, unknown>[], objKey: string): number
}

export const getMin: IGetMinorMax = (objArray, objKey) => {
  if (objArray.length === 0) return Infinity
  return objArray.reduce(
    (min, obj) => (Number(obj[objKey]) < min ? Number(obj[objKey]) : min),
    Number(objArray[0][objKey])
  )
}

export const getMax: IGetMinorMax = (objArray, objKey) => {
  if (objArray.length === 0) return -Infinity
  return objArray.reduce(
    (max, obj) => (Number(obj[objKey]) > max ? Number(obj[objKey]) : max),
    Number(objArray[0][objKey])
  )
}
