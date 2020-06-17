import { getLanguage } from './getLanguage'

export const watthour2MJ = (data) => {
  return data * 0.0036
}

const wh2otherCN = (data, withH=true) => {
  let mark = data
  if (Array.isArray(data)) mark = Math.min(data)

  if (mark < 1000) {
    return {
      'value': data,
      'unit': withH ? 'Wh' : 'W'
    }
  } else if (mark / 1e3 < 1000) {
    return {
      'value': wh2kwh(data),
      'unit': withH ? 'kWh' : 'kW'
    }
  }
  else if (mark / 1e6 < 1000) {
    return {
      'value': wh2mwh(data),
      'unit': withH ? 'MWh' : 'MW'
    }
  } else if (mark / 1e7 < 1000) {
    return {
      'value': wh2WANkwh(data),
      'unit': withH ? '万kWh' : '万kW'
    }
  } else {
    return {
      'value': wh2gwh(data),
      'unit': withH ? 'GWh' : 'GW'
    }
  }
}

const wh2otherUS = (data, withH=true) => {
  let mark = data
  if (Array.isArray(data)) mark = Math.min(data)

  if (mark < 1000) {
    return {
      'value': data,
      'unit': withH ? 'Wh' : 'W'
    }
  } else if (mark / 1e3 < 1000) {
    return {
      'value': wh2kwh(data),
      'unit': withH ? 'kWh' : 'kW'
    }
  }
  else if (mark / 1e6 < 1000) {
    return {
      'value': wh2mwh(data),
      'unit': withH ? 'MWh' : 'MW'
    }
  } else {
    return {
      'value': wh2gwh(data),
      'unit': withH ? 'GWh' : 'GW'
    }
  }
}

export const wh2other = (data) => {
  const locale = getLanguage()
  switch(locale) {
    case 'zh-CN': return wh2otherCN(data)
    default: return wh2otherUS(data)
  }
}

export const w2other = (data) => {
  const locale = getLanguage()
  switch(locale) {
    case 'zh-CN': return wh2otherCN(data, false)
    default: return wh2otherUS(data, false)
  }
}

export const other2wh = (data, unit) => {
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

export const other2w = (data, unit) => {
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

export const wh2kwh = (data) => {
  return data / 1e3
}

export const kwh2wh = (data) => {
  return data * 1e3
}

export const wh2mwh = (data) => {
  return data / 1e6
}

export const mwh2wh = (data) => {
  return data * 1e6
}

export const wh2WANkwh = (data) => {
  return data / 1e7
}

export const WANkwh2wh = (data) => {
  return data * 1e7
}

export const wh2gwh = (data) => {
  return data / 1e9
}

export const gwh2wh = (data) => {
  return data * 1e9
}

export const money2Other = (data) => {
  const locale = getLanguage()
  let mark = data
  if (Array.isArray(data)) mark = Math.min(data)

  switch (locale) {
    case 'zh-CN':
      if (Math.abs(mark) < 1000) {
        return { 'value': data, 'unit': '' }
      } else if (Math.abs(mark) / 1e3 < 10) {
        return { 'value': data / 1e3, 'unit': 'qian' }
      } else {
        return { 'value': data / 1e4, 'unit': 'wan' }
      }
    default:
      if (Math.abs(mark) < 1000) {
        return { 'value': data, 'unit': '' }
      } else if (Math.abs(mark) / 1e6 < 1) {
        return { 'value': data / 1e3, 'unit': 'qian' }
      } else {
        return { 'value': data / 1e6, 'unit': 'baiwan' }
      }
  }
}

export const kg2other = (data) => {
  if (data < 1000) return {value: data, unit: 'kg'}
  else return {value: data / 1000, unit: 't'}
}
