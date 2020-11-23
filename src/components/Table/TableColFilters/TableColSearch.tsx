import React, { useState, useEffect, useRef } from 'react'
import { Input, Button, Space, Slider, InputNumber, Row, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import Highlighter from 'react-highlight-words'
import { SearchOutlined, FilterFilled, FilterOutlined } from '@ant-design/icons'
import styles from './TabelColSearch.module.scss'
import { getMin, getMax } from '../../../utils/getObjectsMinMax'
import { FilterDropdownProps } from 'antd/lib/table/interface'
import { Project, Inverter, PV } from '../../../@types'

type SearchStringType<T> = {
  colKey: keyof T
  data: T[]
  onClick?: (p: string | undefined) => void
  setactiveData: React.Dispatch<React.SetStateAction<T[]>>
}

export const SearchString = <T extends Record<string, any>>(props: SearchStringType<T>) => {
  const { colKey, data, onClick, setactiveData } = props
  const searchInputRef = useRef<Input>(null)
  const { t } = useTranslation()
  const [searchedCol, setsearchedCol] = useState<keyof T>()
  const [searchedText, setsearchedText] = useState<string>('')

  const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: keyof T) => {
    setactiveData(
      data.filter(record =>
        (record[colKey] as any)
          .toString()
          .toLowerCase()
          .includes(selectedKeys[0].toString().toLowerCase())
      )
    )
    confirm()
    setsearchedCol(dataIndex)
    setsearchedText(selectedKeys[0].toString())
  }

  const handleReset = (clearFilters?: () => void) => {
    setactiveData(data)
    clearFilters && clearFilters()
    setsearchedText('')
  }

  const nameOrCompany = (record: T, children: React.ReactNode) =>
    colKey !== 'companyName' ? (
      <Button
        type='link'
        onClick={() => {
          onClick && onClick(record.pvID || record.inverterID)
        }}
      >
        {children}
      </Button>
    ) : (
      <Tag color={record.theme}>{children}</Tag>
    )

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div className={styles.searchBox}>
        <Input
          className={styles.input}
          ref={searchInputRef}
          placeholder={`${t('filter.search')} ${t(`table.${colKey}`)}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, colKey)}
        />
        <Space>
          <Button
            className={styles.button}
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, colKey)}
            icon={<SearchOutlined />}
            size='small'
          >
            {t('filter.search')}
          </Button>
          <Button className={styles.button} onClick={() => handleReset(clearFilters)} size='small'>
            {t('filter.reset')}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: string | number | boolean, record: T) =>
      (record[colKey] as any).toString().toLowerCase().includes(value.toString().toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInputRef.current && searchInputRef.current.select())
      }
    },
    render: (text: string, record: T) =>
      searchedCol === colKey
        ? nameOrCompany(
            record,
            <Highlighter
              highlightClassName={styles.highlight}
              searchWords={[searchedText]}
              autoEscape={true}
              textToHighlight={text.toString()}
            />
          )
        : nameOrCompany(record, text),
  }
}

type SearchRangeProps<T> = {
  colKey: string
  data: T[]
  setactiveData: React.Dispatch<React.SetStateAction<T[]>>
}

export const SearchRange = <T extends Record<string, number>>(props: SearchRangeProps<T>) => {
  const { colKey, data, setactiveData } = props
  const { t } = useTranslation()
  const colMin = Math.floor(getMin(data, colKey))
  const colMax = Math.ceil(getMax(data, colKey))
  const [selectedVal, setselectedVal] = useState<[number, number]>([colMin, colMax])
  const [filtered, setfiltered] = useState(false)

  useEffect(() => {
    const colMin = Math.floor(getMin(data, colKey))
    const colMax = Math.ceil(getMax(data, colKey))
    setselectedVal([colMin, colMax])
  }, [colKey, data])

  const onFilter = (confirm: () => void) => {
    setactiveData(
      data.filter(record => record[colKey] >= selectedVal[0] && record[colKey] <= selectedVal[1])
    )
    setfiltered(true)
    confirm()
  }

  const onReset = (clearFilters?: () => void) => {
    setactiveData(data)
    setfiltered(false)
    clearFilters && clearFilters()
  }

  return {
    // eslint-disable-next-line react/display-name
    filterDropdown: ({ confirm, clearFilters }: FilterDropdownProps) => {
      return (
        <div className={styles.searchBox}>
          <Slider
            range
            min={colMin}
            max={colMax}
            onChange={values => setselectedVal(values)}
            value={selectedVal}
          />
          <Row>
            <Space>
              <InputNumber
                className={styles.button}
                min={colMin}
                max={selectedVal[1]}
                size='small'
                value={selectedVal[0]}
                onChange={value => setselectedVal([Number(value), selectedVal[1]])}
              />
              <InputNumber
                className={styles.button}
                min={selectedVal[0]}
                max={colMax}
                size='small'
                value={selectedVal[1]}
                onChange={value => setselectedVal([selectedVal[0], Number(value)])}
              />
            </Space>
          </Row>
          <Row>
            <Space>
              <Button
                className={styles.button}
                type='primary'
                onClick={() => onFilter(confirm)}
                icon={<FilterOutlined />}
                size='small'
              >
                {t('filter.filter')}
              </Button>
              <Button className={styles.button} onClick={() => onReset(clearFilters)} size='small'>
                {t('filter.reset')}
              </Button>
            </Space>
          </Row>
        </div>
      )
    },
    filterIcon: <FilterFilled style={{ color: filtered ? '#1890ff' : undefined }} />,
  }
}
