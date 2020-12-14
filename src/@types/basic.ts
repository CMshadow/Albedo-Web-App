import { CognitoUser } from '@aws-amplify/auth'

export type Unit = 'm' | 'ft'

export type Locale = 'zh-CN' | 'en-US'

export type CognitoUserExt = CognitoUser & {
  attributes: {
    email: string
    sub: string
    locale: Locale
    family_name: string
    given_name: string
  }
}
