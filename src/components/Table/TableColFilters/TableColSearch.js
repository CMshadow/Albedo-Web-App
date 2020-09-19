import React, { useState, useEffect } from 'react';
import { Input, Button, Space, Slider, InputNumber, Row, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, FilterFilled, FilterOutlined } from '@ant-design/icons';
import * as styles from './TabelColSearch.module.scss';
import { getMin, getMax } from '../../../utils/getObjectsMinMax';

export const SearchString = ({colKey, data, onClick, setactiveData}) => {
  let searchInputRef;
  const { t } = useTranslation()
  const [searchedCol, setsearchedCol] = useState('')
  const [searchedText, setsearchedText] = useState('')

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    setactiveData(data.filter(record =>
      record[colKey].toString().toLowerCase().includes(selectedKeys[0].toLowerCase())
    ))
    confirm();
    setsearchedCol(dataIndex);
    setsearchedText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    setactiveData(data)
    clearFilters();
    setsearchedText('');
  };

  const nameOrCompany = (record, children) => (
    colKey !== 'companyName' ?
    <Button type='link' onClick={() => {onClick(record.pvID || record.inverterID)}}>
      {children}
    </Button> :
    <Tag color={record.theme}>{children}</Tag>
  )

  return {
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) =>
      <div className={styles.searchBox}>
        <Input
          className={styles.input}
          ref={node => {searchInputRef = node}}
          placeholder={`${t('filter.search')} ${t(`table.${colKey}`)}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, colKey)}
        />
        <Space>
          <Button
            className={styles.button}
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, colKey)}
            icon={<SearchOutlined />}
            size="small"
          >
            {t('filter.search')}
          </Button>
          <Button
            className={styles.button}
            onClick={() => handleReset(clearFilters)}
            size="small"
          >
            {t('filter.reset')}
          </Button>
        </Space>
      </div>
    ,
    filterIcon: filtered =>
      <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
    onFilter: (value, record) =>
      record[colKey].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {setTimeout(() => searchInputRef.select())}
    },
    render: (text, record) =>
      searchedCol === colKey ?
      nameOrCompany(
        record,
        <Highlighter
          highlightClassName={styles.highlight}
          searchWords={[searchedText]}
          autoEscape={true}
          textToHighlight={text.toString()}
        />
      ) :
      nameOrCompany(record, text)
  }
};


export const SearchRange = ({colKey, data, setactiveData}) => {
  const { t } = useTranslation()
  const colMin = Math.floor(getMin(data, colKey));
  const colMax = Math.ceil(getMax(data, colKey));
  const [selectedVal, setselectedVal] = useState([colMin, colMax]);
  const [filtered, setfiltered] = useState(false);

  useEffect(() => {
    const colMin = Math.floor(getMin(data, colKey));
    const colMax = Math.ceil(getMax(data, colKey));
    setselectedVal([colMin, colMax])
  }, [colKey, data])

  const onFilter = (confirm) => {
    setactiveData(data.filter(record =>
      record[colKey] >= selectedVal[0] && record[colKey] <= selectedVal[1]
    ))
    setfiltered(true)
    confirm()
  }

  const onReset = (clearFilters) => {
    setactiveData(data)
    setfiltered(false)
    clearFilters()
  }

  return {
    filterDropdown: ({confirm, clearFilters}) => {
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
                onChange={value => setselectedVal([value, selectedVal[1]])}
              />
              <InputNumber
                className={styles.button}
                min={selectedVal[0]}
                max={colMax}
                size='small'
                value={selectedVal[1]}
                onChange={value => setselectedVal([selectedVal[0], value])}
              />
            </Space>
          </Row>
          <Row>
            <Space>
              <Button
                className={styles.button}
                type="primary"
                onClick={() => onFilter(confirm)}
                icon={<FilterOutlined />}
                size="small"
              >
                {t('filter.filter')}
              </Button>
              <Button
                className={styles.button}
                onClick={() => onReset(clearFilters)}
                size="small"
              >
                {t('filter.reset')}
              </Button>
            </Space>
          </Row>
        </div>
      )
    },
    filterIcon: <FilterFilled style={{color: filtered ? '#1890ff' : undefined}}/>,
  }
};
