const sum = (data: number[]) => {
  return data.reduce((sum, val) => sum + val, 0)
}

export const aggregateByMonth = (data: number[]) => {
  // 8760小时数据按月累加
  return [
    sum(data.slice(0, 744)),
    sum(data.slice(744, 1416)),
    sum(data.slice(1416, 2160)),
    sum(data.slice(2160, 2880)),
    sum(data.slice(2880, 3624)),
    sum(data.slice(3624, 4344)),
    sum(data.slice(4344, 5088)),
    sum(data.slice(5088, 5832)),
    sum(data.slice(5832, 6552)),
    sum(data.slice(6552, 7296)),
    sum(data.slice(7296, 8016)),
    sum(data.slice(8016, 8760)),
  ]
}

export const aggregateDay2Month = (data: number[]) => {
  // 365天数据整合成12个月
  return [
    sum(data.slice(0, 31)),
    sum(data.slice(31, 59)),
    sum(data.slice(59, 90)),
    sum(data.slice(90, 120)),
    sum(data.slice(120, 151)),
    sum(data.slice(151, 181)),
    sum(data.slice(181, 212)),
    sum(data.slice(212, 243)),
    sum(data.slice(243, 273)),
    sum(data.slice(273, 304)),
    sum(data.slice(304, 334)),
    sum(data.slice(334, 365)),
  ]
}
