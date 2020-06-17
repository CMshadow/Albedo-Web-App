import { getLanguage } from './getLanguage'
import { money2Other } from './unitConverter'

export const MoneyText = ({t, money, abbr=false}) => {
  const moneyFormat = money2Other(money)
  const locale = getLanguage()
  let text
  if (money === null || money === undefined) {
    text = null
  } else {
    switch (locale) {
      case 'zh-CN':
        text = abbr ? `${moneyFormat.value.toFixed(2)} ${t(`money.${moneyFormat.unit}`)}` :
          `￥ ${money.toLocaleString()}`
        break
      default:
        text = abbr ? `$ ${moneyFormat.value.toFixed(2)} ${t(`money.${moneyFormat.unit}`)}`:
          `$ ${money.toLocaleString()}`
    }
  }
  return text
}
