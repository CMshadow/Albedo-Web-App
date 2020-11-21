export type AxiosBasicParams = {
  username?: string
  jwtToken?: string
}

export interface IAxiosRequest<P, R> {
  (args: P): Promise<R>
}
