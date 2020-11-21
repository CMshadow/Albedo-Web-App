import React from 'react'
import { List, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { InverterDetailTable } from './InverterDetailTable'
const Title = Typography.Title

const reduceUnique = data => {
  return data.reduce((acc, val) => {
    Object.keys(acc).includes(val.inverterID)
      ? (acc[val.inverterID] += val.count)
      : (acc[val.inverterID] = val.count)
    return acc
  }, {})
}

export const MultiInverterDetailTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )

  const genInverterCount = buildingData =>
    buildingData.data.flatMap(spec =>
      spec.inverter_wiring.map(inverterSpec => ({
        inverterID: inverterData.find(
          inverter => inverter.inverterID === inverterSpec.inverter_model.inverterID
        ).inverterID,
        count: 1,
      }))
    )

  // 统计每种用到的逆变器id及数量
  const inverterCount =
    buildingID === 'overview'
      ? projectData.buildings.flatMap(building => genInverterCount(building))
      : genInverterCount(projectData.buildings.find(building => building.buildingID === buildingID))
  const uniqueInverterCount = reduceUnique(inverterCount)
  const dataSource = Object.keys(uniqueInverterCount)

  const listGrid = {
    gutter: 16,
    xs: 1,
    sm: 1,
    md: dataSource.length > 1 ? 2 : 1,
    lg: dataSource.length > 1 ? 2 : 1,
    xl: dataSource.length > 1 ? 2 : 1,
    xxl: dataSource.length > 1 ? 3 : 1,
  }

  return (
    <Card
      title={
        <Title className='cardTitle' level={4}>
          {t('table.title.inverterDetail')}
        </Title>
      }
      headStyle={{ textAlign: 'center' }}
      bordered={false}
    >
      <List
        grid={listGrid}
        itemLayout='horizontal'
        dataSource={dataSource}
        renderItem={inverterID => (
          <List.Item>
            <Card
              hoverable
              bodyStyle={{ padding: '5px' }}
              bordered={false}
              style={{ cursor: 'unset' }}
            >
              <InverterDetailTable
                inverterID={inverterID}
                count={uniqueInverterCount[inverterID]}
              />
            </Card>
          </List.Item>
        )}
      />
    </Card>
  )
}
