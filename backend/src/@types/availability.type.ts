export interface AvailabilityReponseType {
  timeGap: number
  days: {
    day: string
    startTime: string
    endTime: string
    isAvailable: boolean
  }[]
}
