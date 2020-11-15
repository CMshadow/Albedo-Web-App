export type AxiosBasicParams = {
  username: string
  jwtToken: string
}

export interface IAxiosRequest<P, R> {
  (param: P): Promise<R>
}

export interface IRequest<P, R> {
  (params?: P): Promise<R>
}
