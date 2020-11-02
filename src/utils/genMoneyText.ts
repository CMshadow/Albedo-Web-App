import { TFunction } from 'i18next'
import { getLanguage } from './getLanguage'
import { money2Other } from './unitConverter'


interface IMoneyText {
  (param: {t : TFunction, money: number, abbr: boolean}): string | null
}

/**
 * 生成金钱文本， 根据locale里的语言自动人民币或美元符号，如果abbr则生成如 ‘3万’否则如 ‘￥ 30,000’
 */
export const MoneyText: IMoneyText = ({t, money, abbr=false}) => {
  const moneyFormat = money2Other(money)
  const locale = getLanguage()
  let text: string | null
  if (money === null || money === undefined || Array.isArray(moneyFormat.value)) {
    text = null
  } else {
    switch (locale) {
      case 'zh-CN':
        text = abbr ? 
          `${moneyFormat.value.toFixed(2)} ${t(`money.${moneyFormat.unit}`)}` :
          `￥ ${money.toLocaleString()}`
        break
      default:
        text = abbr ? 
          `$ ${moneyFormat.value.toFixed(2)} ${t(`money.${moneyFormat.unit}`)}`:
          `$ ${money.toLocaleString()}`
    }
  }
  return text
}
