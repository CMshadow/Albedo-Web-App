import React, { useState } from 'react'
import {
  DownloadOutlined,
  UploadOutlined,
  InboxOutlined,
  CheckCircleTwoTone,
  PaperClipOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import {
  Steps,
  Tabs,
  Row,
  Col,
  Image,
  Button,
  Collapse,
  Typography,
  Upload,
  notification,
  Result,
  Radio,
  Select,
  Space,
} from 'antd'
import { Params, ParsedCSV, WeatherPortfolio } from '../../@types'
import { parseString } from 'fast-csv'
import styles from './TmyProcedure.module.scss'
import { useTranslation } from 'react-i18next'
import { RcFile, UploadProps } from 'antd/lib/upload'
import { complementCSV } from '../../services'
import { useParams } from 'react-router-dom'
import { aggregateByMonth, aggregateDay2Month } from '../../utils/dataChunk'

const { Step } = Steps
const { TabPane } = Tabs
const { Panel } = Collapse
const { Paragraph, Text, Title } = Typography
const { Dragger } = Upload

const INSTURCTION_IMAGE_PATH =
  'https://albedo-static-assets.s3-us-west-2.amazonaws.com/website-images'
const TEMPLATE_CSV_PATH =
  'https://albedo-static-assets.s3-us-west-2.amazonaws.com/weather-templates'

type TmyProcedureProps = {
  initStep?: number
  portfolio: WeatherPortfolio
  setportfolio: (p: WeatherPortfolio) => void
  genExtraChartData?: (d: { month: number; src: string; value: number }[]) => void
  genExtraTableData?: (d: Record<string, number[]>) => void
}

type CSVRow = {
  GHI: string
  DNI: string
  DHI: string
  'Dry-bulb': string
  Pressure: string
  Wspd: string
}

const Cols = ['GHI', 'DNI', 'DHI', 'Dry-bulb', 'Pressure', 'Wspd'] as const

export const TmyProcedure: React.FC<TmyProcedureProps> = props => {
  const { initStep, portfolio, setportfolio, genExtraChartData, genExtraTableData } = props
  const { t } = useTranslation()
  const { portfolioID } = useParams<Params>()
  const [step, setstep] = useState(initStep ?? 0)
  const [loading, setloading] = useState(false)
  const [fileList, setfileList] = useState<RcFile[]>([])
  const [parsedData, setparsedData] = useState<ParsedCSV[]>([])
  const [dataYear, setdataYear] = useState<number[]>([])
  const [selSrc, setselSrc] = useState<'meteonorm' | 'nasa'>('meteonorm')

  if (!portfolioID) return null

  const TabContents = [
    {
      key: 'hourly',
      tab: t('weatherManager.portfolio.template.hourly'),
      csv: 'Weather_Template_Hourly.CSV',
      instruction: 'Hourly_Instruction.png',
    },
    {
      key: 'daily',
      tab: t('weatherManager.portfolio.template.daily'),
      csv: 'Weather_Template_Daily.CSV',
      instruction: 'Daily_Instruction.png',
    },
    {
      key: 'monthly',
      tab: t('weatherManager.portfolio.template.monthly'),
      csv: 'Weather_Template_Monthly.CSV',
      instruction: 'Monthly_Instruction.png',
    },
  ]

  const genChartData = (parsedData: ParsedCSV[], fileList: RcFile[]) =>
    parsedData.flatMap((data, i) =>
      (data.GHI.length === 8760
        ? aggregateByMonth(data.GHI)
        : data.GHI.length === 365
        ? aggregateDay2Month(data.GHI)
        : data.GHI
      ).map((val, j) => ({
        month: j,
        src: fileList[i].name,
        value: val,
      }))
    )

  const genTableData = (parsedData: ParsedCSV[], fileList: RcFile[]) => {
    const aggr: Record<string, number[]> = {}
    parsedData.forEach((data, i) => {
      aggr[fileList[i].name] =
        data.GHI.length === 8760
          ? aggregateByMonth(data.GHI)
          : data.GHI.length === 365
          ? aggregateDay2Month(data.GHI)
          : data.GHI
    })
    return aggr
  }

  const uploadProps: UploadProps = {
    accept: '.csv',
    fileList: fileList,
    disabled: loading,
    itemRender: (_, file, filelist) => {
      const index = filelist?.indexOf(file)
      return (
        <Row align='middle' className={styles.fileRow}>
          <Col span={20}>
            <Space>
              <PaperClipOutlined />
              {file.name}
              <Select
                className={styles.select}
                key='year'
                placeholder='选择年份'
                options={Array(20)
                  .fill(0)
                  .map((_, i) => ({ label: 2000 + i, value: 2000 + i }))}
                onSelect={val => {
                  if (index !== undefined) {
                    dataYear.splice(index, 1, Number(val))
                    setdataYear([...dataYear])
                  }
                }}
              />
            </Space>
          </Col>
          <Col span={4}>
            <Row justify='end'>
              <Button
                danger
                type='link'
                onClick={() => {
                  if (index !== undefined) {
                    fileList.splice(index, 1)
                    dataYear.splice(index, 1)
                    parsedData.splice(index, 1)
                  }
                  setfileList([...fileList])
                  setdataYear([...dataYear])
                  setparsedData([...parsedData])
                  genExtraChartData &&
                    genExtraChartData(genChartData([...parsedData], [...fileList]))
                  genExtraTableData &&
                    genExtraTableData(genTableData([...parsedData], [...fileList]))
                }}
                icon={<DeleteOutlined className={styles.delete} />}
              />
            </Row>
          </Col>
        </Row>
      )
    },
    beforeUpload: file => {
      const reader = new FileReader()

      reader.readAsText(file)
      reader.onload = event => {
        const parsedCSV: ParsedCSV = {
          GHI: [],
          DNI: [],
          DHI: [],
          'Dry-bulb': [],
          Pressure: [],
          Wspd: [],
        }

        event.target?.result &&
          parseString(event.target.result.toString(), {
            headers: ['Date', undefined, 'GHI', 'DNI', 'DHI', 'Dry-bulb', 'Pressure', 'Wspd'],
            skipLines: 1,
          })
            .on('error', error => console.error(error))
            .on('data', (row: CSVRow) => {
              Cols.forEach(key => parsedCSV[key].push(Number(row[key])))
            })
            .on('end', (rowCount: number) => {
              if (![12, 365, 8760].includes(rowCount)) {
                notification.error({ message: '不符合模版要求' })
                return
              }
              if (Cols.some(col => parsedCSV[col].some(val => isNaN(val)))) {
                notification.error({ message: '文件中存在非数字值' })
                return
              }
              if (
                parsedCSV['GHI'].every(val => val === 0) ||
                parsedCSV['Dry-bulb'].every(val => val === 0) ||
                parsedCSV['Wspd'].every(val => val === 0)
              ) {
                notification.error({ message: '必填列不能全部留空' })
                return
              }
              notification.success({ message: 'CSV文件读取完毕' })

              const newFileList = [...fileList, file]
              const newParsedData = [...parsedData, parsedCSV]
              setfileList(newFileList)
              setparsedData(newParsedData)
              setdataYear([...dataYear, 0])

              genExtraChartData && genExtraChartData(genChartData(newParsedData, newFileList))
              genExtraTableData && genExtraTableData(genTableData(newParsedData, newFileList))
            })
      }
      return false
    },
  }

  const DownloadContent = (
    <Tabs tabPosition='left'>
      {TabContents.map(pane => (
        <TabPane tab={pane.tab} key={pane.key}>
          <Row className={styles.row}>
            <Button
              block
              type='primary'
              icon={<DownloadOutlined />}
              size='large'
              href={`${TEMPLATE_CSV_PATH}/${pane.csv}`}
              target='_blank'
              onClick={() => setstep(1)}
            >
              {`${t('weatherManager.portfolio.template.download')}${t(
                `weatherManager.portfolio.template.${pane.key}`
              )}`}
            </Button>
          </Row>
          <Row className={styles.row}>
            <Collapse bordered={false} className={styles.row}>
              <Panel
                header={`${t(`weatherManager.portfolio.template.${pane.key}`)}${t(
                  'weatherManager.portfolio.template.instruction'
                )}`}
                key='1'
              >
                <Paragraph>{t('weatherManager.portfolio.template.instruction.content')}</Paragraph>
                <Paragraph>
                  {t(`weatherManager.portfolio.template.instruction.content-${pane.key}`)}
                </Paragraph>
                <Image src={`${INSTURCTION_IMAGE_PATH}/${pane.instruction}`} />
              </Panel>
            </Collapse>
          </Row>
        </TabPane>
      ))}
    </Tabs>
  )

  const UploadContent = (
    <div>
      <Dragger {...uploadProps}>
        <Row justify='center'>
          <Col span={24}>
            <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </Col>
        </Row>
        <Row justify='center'>
          <Col span={24}>
            <Text strong>{t('weatherManager.portfolio.upload.description')}</Text>
          </Col>
        </Row>
      </Dragger>
      <Row className={styles.row}>
        <Button
          block
          size='large'
          type='primary'
          disabled={fileList.length === 0 || dataYear.some(y => y === 0)}
          icon={<UploadOutlined />}
          loading={loading}
          onClick={() => {
            setloading(true)
            complementCSV({ parsedCSV: parsedData, dataYear, portfolioID })
              .then(updatedWeatherPortfolio => {
                setportfolio(updatedWeatherPortfolio)
                setloading(false)
                setstep(2)
              })
              .catch(err => {
                console.log(err)
                setloading(false)
              })
          }}
        >
          {t('weatherManager.portfolio.upload')}
        </Button>
      </Row>
    </div>
  )

  const FinishContent = (
    <Result
      status='success'
      title={t('weatherManager.portfolio.custom-ready.title')}
      subTitle={t('weatherManager.portfolio.custom-ready.subtitle')}
      icon={<CheckCircleTwoTone twoToneColor='#52c41a' style={{ fontSize: 50 }} />}
      extra={[
        <Button type='primary' key='download'>
          {t('weatherManager.portfolio.custom.download')}
        </Button>,
      ]}
    />
  )

  const ProcessedStep = (
    <Row gutter={15}>
      <Col span={8}>
        <Row justify='center'>
          <Title level={5}>选择实测数据</Title>
        </Row>
        <Row justify='center'>
          <Radio.Group defaultValue='real'>
            <Radio value='real'>实测数据</Radio>
          </Radio.Group>
        </Row>
      </Col>
      <Col span={8}>
        <Row justify='center'>
          <Title level={5}>选择卫星数据</Title>
        </Row>
        <Row justify='center'>
          <Radio.Group
            defaultValue='meteonorm'
            value={selSrc}
            onChange={e => setselSrc(e.target.value)}
          >
            <Radio style={{ display: 'block' }} value='meteonorm'>
              {t('weatherManager.portfolio.meteonorm')}
            </Radio>
            {portfolio.nasa_src && (
              <Radio style={{ display: 'block' }} value='nasa'>
                {t('weatherManager.portfolio.nasa')}
              </Radio>
            )}
          </Radio.Group>
        </Row>
      </Col>
      <Col span={8}>
        <Row justify='center'>
          <Title level={5}>选择融合方法</Title>
        </Row>
        <Row justify='center'>
          <Radio.Group defaultValue='month-ratio'>
            <Radio
              disabled={selSrc === 'meteonorm'}
              style={{ display: 'block' }}
              value='month-ratio'
            >
              月比值修正
            </Radio>
            <Radio
              disabled={selSrc === 'meteonorm' || parsedData.some(item => item.GHI.length < 365)}
              style={{ display: 'block' }}
              value='year-formula'
            >
              总体相关方程
            </Radio>
            <Radio
              style={{ display: 'block' }}
              disabled={selSrc === 'meteonorm' || parsedData.some(item => item.GHI.length < 365)}
              value='month-formula'
            >
              各月相关方程
            </Radio>
            <Radio style={{ display: 'block' }} value='ghi-ratio'>
              总辐射修正
            </Radio>
          </Radio.Group>
        </Row>
      </Col>
    </Row>
  )

  return (
    <>
      <Row className={styles.row} justify='center'>
        <Title level={4}>{t(`weatherManager.portfolio.${portfolio.mode}`)}</Title>
      </Row>
      <Row className={styles.row}>
        <Col span={24}>
          <Steps type='navigation' current={step} onChange={step => setstep(step)}>
            <Step title={t('weatherManager.portfolio.tmy.step.1')} disabled={loading} />
            <Step title={t('weatherManager.portfolio.tmy.step.2')} disabled={loading} />
            {portfolio.mode === 'processed' && (
              <Step
                title={t('weatherManager.portfolio.tmy.step.3')}
                disabled={parsedData.length === 0 || loading}
              />
            )}
            <Step
              title={t('weatherManager.portfolio.tmy.step.4')}
              disabled={!portfolio.custom_src || loading}
            />
          </Steps>
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col span={24}>
          {step === 0
            ? DownloadContent
            : step === 1
            ? UploadContent
            : portfolio.mode === 'processed' && step === 2
            ? ProcessedStep
            : FinishContent}
        </Col>
      </Row>
    </>
  )
}
