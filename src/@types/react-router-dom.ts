export type VerificationRedirectState = {
  username: string
  password: string
}

export type ParamsFormRedirectState = {
  buildingID?: string
}

export type Params = {
  projectID: string
  buildingID?: string
  portfolioID?: string
}

export type DefaultShowModal = {
  defaultShowModal?: boolean
}
