import _ from 'lodash'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

export const getLastDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)

export const getDayName = (date: Date) => {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

  const d = new Date(date)

  return days[d.getDay()]
}

export const convertEmptyParams = (params: Record<string, string | Date | number>) => {
  const result = {}

  for (const [key, value] of Object.entries(params)) {
    if (!_.isEmpty(value)) Object.assign(result, { [key]: value })
  }

  return result
}

function getDay(date: Date) {
  const day = date.getDay()

  return day === 0 ? 6 : day - 1
}

export function startOfWeek(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - getDay(date) - 1)
}

export function endOfWeek(date: Date) {
  return dayjs(new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - getDay(date))))
    .endOf('date')
    .toDate()
}

// Write me a function that gets the first day of the month
export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Write me a function that gets the last day of month
export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}
