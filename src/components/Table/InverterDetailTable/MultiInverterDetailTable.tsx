import React from 'react'
import { List, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { InverterDetailTable } from './InverterDetailTable'
import { Building, RootState } from '../../../@types'
const Title = Typography.Title

const reduceUnique = (data: { inverterID: string; count: number }[]) => {
  return data.reduce((acc: { [key: string]: number }, val) => {
    Object.keys(acc).includes(val.inverterID)
      ? (acc[val.inverterID] += val.count)
      : (acc[val.inverterID] = val.count)
    return acc
  }, {})
}

type MultiInverterDetailTableProps = { buildingID: string }

export const MultiInverterDetailTable: React.FC<MultiInverterDetailTableProps> = ({
  buildingID,
}) => {
  const { t } = useTranslation()
  const projectData = useSelector((state: RootState) => state.project)

  const genInverterCount = (buildingData: Building): { inverterID: string; count: number }[] =>
    buildingData.data
      .flatMap(spec =>
        spec.inverter_wiring.map(inverterSpec => ({
          inverterID: inverterSpec.inverter_model.inverterID,
          count: 1,
        }))
      )
      .filter((obj): obj is { inverterID: string; count: number } => obj.inverterID !== null)

  // 统计每种用到的逆变器id及数量
  let inverterCount: { inverterID: string; count: number }[] = []
  if (projectData) {
    if (buildingID === 'overview') {
      inverterCount = projectData.buildings.flatMap(building => genInverterCount(building))
    } else {
      const matchBuilding = projectData.buildings.find(
        building => building.buildingID === buildingID
      )
      if (matchBuilding) inverterCount = genInverterCount(matchBuilding)
    }
  }
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
