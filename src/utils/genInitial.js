export const genInitial = (cognitoUser) => {
  if (cognitoUser) {
    const locale = cognitoUser.attributes.locale;
    switch (locale) {
      case 'zh-CN':
        return cognitoUser.attributes.given_name;
      default:
        return cognitoUser.attributes.given_name[0] + cognitoUser.attributes.last_name[0]
    }
  }
}
