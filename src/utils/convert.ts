import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

// function convert string date to format date
export const convertDateToString = (d: Date | string, format: string = 'DD/MM/YYYY') => {
  if (!d) return ''
  const date = new Date(d)

  return format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
    .replace('DD', date.getDate().toString().padStart(2, '0'))
    .replace('HH', (+date.getHours()).toString().padStart(2, '0'))
    .replace('mm', date.getMinutes().toString().padStart(2, '0'))
    .replace('ss', date.getSeconds().toString().padStart(2, '0'))
}

export const convertStringToDate = (date: string | Date, format: string = 'DD/MM/YYYY') => {
  const formattedDate = dayjs(date, format)

  return new Date(formattedDate.toString())
}
