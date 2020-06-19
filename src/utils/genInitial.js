export const genInitial = (cognitoUser) => {
  console.log(Object.keys(cognitoUser.attributes))
  if (cognitoUser) {
    const locale = cognitoUser.attributes.locale;
    switch (locale) {
      case 'zh-CN':
        return cognitoUser.attributes.given_name;
      default:
        return cognitoUser.attributes.given_name[0] + cognitoUser.attributes.family_name[0]
    }
  }
}
