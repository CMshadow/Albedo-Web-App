import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, Row } from 'antd'
import { FormulaIntermedia, MonthRatioIntermedia } from '../../@types'
import { TMYFormulaPreviewChart } from '../../components/Charts/TMYFormulaPreviewChart'
import { RatioBarChart } from '../../components/Charts/RatioBarChart'
import styles from './TmyProcedure.module.scss'

type IntermediaVizProps = {
  preview: MonthRatioIntermedia | FormulaIntermedia | FormulaIntermedia[]
}

export const IntermediaViz: React.FC<IntermediaVizProps> = props => {
  const { t } = useTranslation()
  const { preview } = props
  const [selMonth, setselMonth] = useState(1)

  if (Array.isArray(preview)) {
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
            dataSource={preview[selMonth - 1].userGHI.map((val, i) => ({
              userGHI: val,
              refGHI: preview[selMonth - 1].refGHI[i],
            }))}
            coeff={preview[selMonth - 1].coeff}
            r={preview[selMonth - 1].r}
          />
        </Row>
      </>
    )
  } else if ('userGHI' in preview) {
    return (
      <Row className={styles.row}>
        <TMYFormulaPreviewChart
          dataSource={preview.userGHI.map((val, i) => ({
            userGHI: val,
            refGHI: preview.refGHI[i],
          }))}
          coeff={preview.coeff}
          r={preview.r}
        />
      </Row>
    )
  } else {
    return (
      <Row className={styles.row}>
        <RatioBarChart
          dataSource={preview.ratio.map((val, i) => ({
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
              min: preview.ratio.reduce((min, val) => (val < min ? val : min), Infinity),
              formatter: (text: number) => text.toFixed(3),
            },
          }}
        />
      </Row>
    )
  }
}
