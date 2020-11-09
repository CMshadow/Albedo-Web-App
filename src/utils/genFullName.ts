import { CognitoUserExt } from '../@types'

interface IGenFullName {
  (cognitoUser: CognitoUserExt): string | undefined
}

export const genFullName: IGenFullName = cognitoUser => {
  if (cognitoUser) {
    const locale = cognitoUser.attributes.locale
    switch (locale) {
      case 'zh-CN':
        return cognitoUser.attributes.family_name + cognitoUser.attributes.given_name
      default:
        return cognitoUser.attributes.given_name + ' ' + cognitoUser.attributes.family_name
    }
  }
}
