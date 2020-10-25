import React from 'react'
import { List, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { PVDetailTable } from './PVDetailTable'
const Title = Typography.Title

const reduceUnique = data => {
  return data.reduce((acc, val) => {
    Object.keys(acc).includes(val.pvID) ?
    acc[val.pvID] += val.count :
    acc[val.pvID] = val.count
    return acc
  }, {})
}

export const MultiPVDetailTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )

  const genPVCount = (buildingData) => buildingData.data.map(spec => ({
    pvID: pvData.find(pv =>
      pv.pvID === spec.pv_panel_parameters.pv_model.pvID
    ).pvID,
    count: spec.inverter_wiring.reduce((acc, val) => {
      acc += val.string_per_inverter * val.panels_per_string
      return acc
    }, 0)
  }))

  // 统计每种用到的组件id及数量
  const pvCount = buildingID === 'overview' ?
    projectData.buildings.flatMap(building => genPVCount(building)) :
    genPVCount(projectData.buildings.find(building => building.buildingID === buildingID))
  const uniquePVCount = reduceUnique(pvCount)
  const dataSource = Object.keys(uniquePVCount)

  const listGrid = {
    gutter: 16,
    xs: 1,
    sm: 1,
    md: dataSource.length > 1 ? 2 : 1,
    lg: dataSource.length > 1 ? 2 : 1,
    xl: dataSource.length > 1 ? 2 : 1,
    xxl: dataSource.length > 1 ? 3 : 1
  }

  return (
    <Card
      title={
        <Title className='cardTitle' level={4}>
          {t('table.title.pvDetail')}
        </Title>
      }
      bordered={false}
      headStyle={{textAlign: 'center'}}
    >
      <List
        grid={listGrid}
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={pvID => (
          <List.Item>
            <Card hoverable bodyStyle={{padding: '5px'}} bordered={false} style={{cursor: 'unset'}}>
              <PVDetailTable pvID={pvID} count={uniquePVCount[pvID]}/>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  )
}
