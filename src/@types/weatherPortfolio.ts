export type WeatherPortfolio = {
  portfolioID: string
  userID: string
  name: string
  address: string
  createdAt: number
  longitude: number
  latitude: number
  meteonorm_src: string | null
  nasa_src: string | null
  custom_src: string | null
}
