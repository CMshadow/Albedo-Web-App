import { getLanguage } from './getLanguage'
import { Unit } from '../@types'

const wh2otherCN = <T extends number | number[]>(data: T, withH = true) => {
  let mark: number
  if (Array.isArray(data)) {
    mark = Math.max(...data)
  } else {
    mark = data as number
  }

  if (mark < 1000) {
    return {
      value: data,
      unit: withH ? 'Wh' : 'W',
    }
  } else if (mark / 1e3 < 1000) {
    return {
      value: wh2kwh(data),
      unit: withH ? 'kWh' : 'kW',
    }
  } else if (mark / 1e6 < 1000) {
    return {
      value: wh2mwh(data),
      unit: withH ? 'MWh' : 'MW',
    }
  } else if (mark / 1e7 < 1000) {
    return {
      value: wh2WANkwh(data),
      unit: withH ? '万kWh' : '万kW',
    }
  } else {
    return {
      value: wh2gwh(data),
      unit: withH ? 'GWh' : 'GW',
    }
  }
}

const wh2otherUS = <T extends number | number[]>(data: T, withH = true) => {
  let mark: number
  if (Array.isArray(data)) {
    mark = Math.max(...data)
  } else {
    mark = data as number
  }

  if (mark < 1000) {
    return {
      value: data,
      unit: withH ? 'Wh' : 'W',
    }
  } else if (mark / 1e3 < 1000) {
    return {
      value: wh2kwh(data),
      unit: withH ? 'kWh' : 'kW',
    }
  } else if (mark / 1e6 < 1000) {
    return {
      value: wh2mwh(data),
      unit: withH ? 'MWh' : 'MW',
    }
  } else {
    return {
      value: wh2gwh(data),
      unit: withH ? 'GWh' : 'GW',
    }
  }
}

export const wh2other = <T extends number | number[]>(data: T) => {
  const locale = getLanguage()
  switch (locale) {
    case 'zh-CN':
      return wh2otherCN(data)
    default:
      return wh2otherUS(data)
  }
}

export const w2other = <T extends number | number[]>(data: T) => {
  const locale = getLanguage()
  switch (locale) {
    case 'zh-CN':
      return wh2otherCN(data, false)
    default:
      return wh2otherUS(data, false)
  }
}

export const other2wh = <T extends number | number[]>(data: T, unit: string) => {
  if (unit.toLowerCase() === 'wh') {
    return data
  } else if (unit.toLowerCase() === 'kwh') {
    return kwh2wh(data)
  } else if (unit.toLowerCase() === 'mwh') {
    return mwh2wh(data)
  } else if (unit.toLowerCase() === '万kwh') {
    return WANkwh2wh(data)
  } else {
    return gwh2wh(data)
  }
}

export const other2w = <T extends number | number[]>(data: T, unit: string) => {
  if (unit.toLowerCase() === 'w') {
    return data
  } else if (unit.toLowerCase() === 'kw') {
    return kwh2wh(data)
  } else if (unit.toLowerCase() === 'mw') {
    return mwh2wh(data)
  } else if (unit.toLowerCase() === '万kw') {
    return WANkwh2wh(data)
  } else {
    return gwh2wh(data)
  }
}

export const wh2kwh = <T extends number | number[]>(data: T) => {
  if (typeof data === 'number') return data / 1e3
  else return (data as number[]).map(val => val / 1e3) as number[]
}

export const kwh2wh = <T extends number | number[]>(data: T) => {
  if (typeof data === 'number') return data * 1e3
  else return (data as number[]).map(val => val * 1e3)
}

export const wh2mwh = <T extends number | number[]>(data: T) => {
  if (typeof data === 'number') return data / 1e6
  else return (data as number[]).map(val => val / 1e6)
}

export const mwh2wh = <T extends number | number[]>(data: T) => {
  if (typeof data === 'number') return data * 1e6
  else return (data as number[]).map(val => val * 1e6)
}

export const wh2WANkwh = <T extends number | number[]>(data: T) => {
  if (typeof data === 'number') return data / 1e7
  else return (data as number[]).map(val => val / 1e7)
}

export const WANkwh2wh = <T extends number | number[]>(data: T) => {
  if (typeof data === 'number') return data * 1e7
  else return (data as number[]).map(val => val * 1e7)
}

export const wh2gwh = <T extends number | number[]>(data: T) => {
  if (typeof data === 'number') return data / 1e9
  else return (data as number[]).map(val => val / 1e9)
}

export const gwh2wh = <T extends number | number[]>(data: T) => {
  if (typeof data === 'number') return data * 1e9
  else return (data as number[]).map(val => val * 1e9)
}

export const money2Other = <T extends number | number[]>(data: T) => {
  const locale = getLanguage()
  let mark: number
  if (Array.isArray(data)) {
    mark = Math.max(...data)
  } else {
    mark = data as number
  }

  switch (locale) {
    case 'zh-CN':
      if (Math.abs(mark) < 1000) {
        return { value: data, unit: '' }
      } else if (Math.abs(mark) / 1e3 < 10) {
        return {
          value: Array.isArray(data)
            ? (data as number[]).map(d => d / 1e3)
            : (data as number) / 1e3,
          unit: 'qian',
        }
      } else {
        return {
          value: Array.isArray(data)
            ? (data as number[]).map(d => d / 1e4)
            : (data as number) / 1e4,
          unit: 'wan',
        }
      }
    default:
      if (Math.abs(mark) < 1000) {
        return { value: data, unit: '' }
      } else if (Math.abs(mark) / 1e6 < 1) {
        return {
          value: Array.isArray(data)
            ? (data as number[]).map(d => d / 1e3)
            : (data as number) / 1e3,
          unit: 'qian',
        }
      } else {
        return {
          value: Array.isArray(data)
            ? (data as number[]).map(d => d / 1e6)
            : (data as number) / 1e6,
          unit: 'baiwan',
        }
      }
  }
}

export const kg2other = (data: number): { value: number; unit: string } => {
  if (data < 1000) return { value: data, unit: 'kg' }
  else return { value: data / 1000, unit: 't' }
}

export const other2m = (unit: Unit, value: number): number => {
  if (unit === 'm') return value
  else return Number((value * 0.3048).toFixed(4))
}

export const m2other = (unit: Unit, value: number): number => {
  if (unit === 'm') return value
  else return Number((value * 3.28084).toFixed(4))
}
