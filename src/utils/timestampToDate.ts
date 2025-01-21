export interface Timestamp {
  _seconds: number
  _nanoseconds: number
}

export function timestampToDate(timestamp: Timestamp): Date {
  const milliseconds =
    timestamp._seconds * 1000 + timestamp._nanoseconds / 1_000_000
  return new Date(milliseconds)
}
