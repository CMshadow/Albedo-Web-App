import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, Row } from 'antd'
import { FormulaIntermedia, MonthRatioIntermedia } from '../../@types'
import { TMYFormulaPreviewChart } from '../../components/Charts/TMYFormulaPreviewChart'
import { RatioBarChart } from '../../components/Charts/RatioBarChart'
import { GHIOriginVSFixedBarChart } from '../../components/Charts/GHIOriginVSFixedBarChart'
import styles from './TmyProcedure.module.scss'
import { wh2kwh } from '../../utils/unitConverter'

const YEAR_BASE = 2000

type IntermediateVizProps = {
  previewTab: string
  preview: {
    originGHI: number[]
    fixedGHI: number[]
    intermediate: MonthRatioIntermedia | FormulaIntermedia | FormulaIntermedia[]
  }
}

export const IntermediateViz: React.FC<IntermediateVizProps> = props => {
  const { t } = useTranslation()
  const { preview, previewTab } = props
  const [selMonth, setselMonth] = useState(1)

  if (previewTab === '1') {
    return (
      <GHIOriginVSFixedBarChart
        dataSource={[
          ...preview.originGHI.map((val, i) => ({
            year: YEAR_BASE + i,
            ghi: val,
            src: 'origin' as const,
          })),
          ...preview.fixedGHI.map((val, i) => ({
            year: YEAR_BASE + i,
            ghi: val,
            src: 'fixed' as const,
          })),
        ]}
        scale={{
          year: {
            type: 'cat',
            alias: t('acPowerTable.year'),
            tickCount: 20,
          },
          ghi: {
            type: 'linear',
            alias: t('GHICompareChart.GHI'),
            tickCount: 10,
            nice: true,
            formatter: (text: number) => `${Number(wh2kwh(text).toString()).toFixed(2)} kWh/㎡`,
          },
          src: {
            formatter: (text: string) => t(`weatherManager.portfolio.intermediate.src.${text}`),
          },
        }}
      />
    )
  } else if (Array.isArray(preview.intermediate)) {
    const intermediate = preview.intermediate
    return (
      <>
        <Row className={styles.row} justify='center'>
          <Radio.Group
            defaultValue={selMonth.toString()}
            onChange={e => setselMonth(Number(e.target.value))}
          >
            {Array(12)
              .fill(0)
              .map((val, i) => (
                <Radio.Button key={`${i + 1}`} value={`${i + 1}`}>
                  {t(`sunPosition.month.${i + 1}`)}
                </Radio.Button>
              ))}
          </Radio.Group>
        </Row>
        <Row className={styles.row}>
          <TMYFormulaPreviewChart
            dataSource={intermediate[selMonth - 1].userGHI.map((val, i) => ({
              userGHI: val,
              refGHI: intermediate[selMonth - 1].refGHI[i],
            }))}
            coeff={intermediate[selMonth - 1].coeff}
            r={intermediate[selMonth - 1].r}
          />
        </Row>
      </>
    )
  } else if ('userGHI' in preview.intermediate) {
    const intermediate = preview.intermediate
    return (
      <Row className={styles.row}>
        <TMYFormulaPreviewChart
          dataSource={intermediate.userGHI.map((val, i) => ({
            userGHI: val,
            refGHI: intermediate.refGHI[i],
          }))}
          coeff={intermediate.coeff}
          r={intermediate.r}
        />
      </Row>
    )
  } else {
    const intermediate = preview.intermediate
    return (
      <Row className={styles.row}>
        <RatioBarChart
          dataSource={intermediate.ratio.map((val, i) => ({
            month: i,
            ratio: val,
          }))}
          scale={{
            month: {
              type: 'cat',
              alias: t('weatherAnalysisTable.month'),
              tickCount: 12,
              formatter: (text: number) => t(`weatherAnalysisTable.month.${text + 1}`),
            },
            ratio: {
              type: 'linear',
              alias: t('RatioBarChart.yAxis'),
              tickCount: 10,
              nice: true,
              min: intermediate.ratio.reduce((min, val) => (val < min ? val : min), Infinity),
              formatter: (text: number) => text.toFixed(3),
            },
          }}
        />
      </Row>
    )
  }
}
