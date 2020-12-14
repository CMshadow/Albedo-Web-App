import React from 'react'
import { List, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { PVDetailTable } from './PVDetailTable'
import { Building, RootState } from '../../../@types'
const Title = Typography.Title

const reduceUnique = (data: { pvID: string; count: number }[]) => {
  return data.reduce((acc: { [key: string]: number }, val) => {
    Object.keys(acc).includes(val.pvID) ? (acc[val.pvID] += val.count) : (acc[val.pvID] = val.count)
    return acc
  }, {})
}

type MultiPVDetailTableProps = { buildingID: string }

export const MultiPVDetailTable: React.FC<MultiPVDetailTableProps> = ({ buildingID }) => {
  const { t } = useTranslation()
  const projectData = useSelector((state: RootState) => state.project)

  const genPVCount = (buildingData: Building): { pvID: string; count: number }[] =>
    buildingData.data
      .map(spec => ({
        pvID: spec.pv_panel_parameters.pv_model.pvID,
        count: spec.inverter_wiring.reduce((acc, val) => {
          acc += (val.string_per_inverter || 0) * (val.panels_per_string || 0)
          return acc
        }, 0),
      }))
      .filter((obj): obj is { pvID: string; count: number } => obj.pvID !== null)

  // 统计每种用到的组件id及数量
  let pvCount: { pvID: string; count: number }[] = []
  if (projectData) {
    if (buildingID === 'overview') {
      pvCount = projectData.buildings.flatMap(building => genPVCount(building))
    } else {
      const matchBuilding = projectData.buildings.find(
        building => building.buildingID === buildingID
      )
      if (matchBuilding) pvCount = genPVCount(matchBuilding)
    }
  }
  const uniquePVCount = reduceUnique(pvCount)
  const dataSource = Object.keys(uniquePVCount)

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
          {t('table.title.pvDetail')}
        </Title>
      }
      bordered={false}
      headStyle={{ textAlign: 'center' }}
    >
      <List
        grid={listGrid}
        itemLayout='horizontal'
        dataSource={dataSource}
        renderItem={pvID => (
          <List.Item>
            <Card
              hoverable
              bodyStyle={{ padding: '5px' }}
              bordered={false}
              style={{ cursor: 'unset' }}
            >
              <PVDetailTable pvID={pvID} count={uniquePVCount[pvID]} />
            </Card>
          </List.Item>
        )}
      />
    </Card>
  )
}
