export function mappingData<FROM = unknown, TO = unknown>({
  from,
  mapper,
  keeps,
  handle
}: IMappingProps<FROM, TO>): Partial<TO> | Partial<TO>[] {
  if (Array.isArray(from)) {
    const arrFrom = from.map(item => {
      const arrResult: Partial<TO> = {}

      for (const key of Object.keys(mapper)) {
        const fromKey = mapper[key]

        if (item[fromKey] !== undefined) {
          // @ts-ignore
          arrResult[key] = item[fromKey] || ''
        }
      }

      for (const key of keeps) {
        if (item[key] !== undefined) {
          // @ts-ignore
          arrResult[key] = item[key] || ''
        }
      }

      return { ...arrResult, ...(handle ? handle(item) : null) }
    })

    return arrFrom
  }

  const result: Partial<TO> = {}

  for (const key of Object.keys(mapper)) {
    const fromKey = mapper[key]

    if (from[fromKey] !== undefined) {
      // @ts-ignore
      result[key] = from[fromKey] || ''
    }
  }

  for (const key of keeps) {
    // @ts-ignore
    if (from[key] !== undefined) {
      // @ts-ignore
      result[key] = from[key] || ''
    }
  }

  return { ...result, ...(handle ? handle(from) : null) }
}

export interface IMappingProps<FROM = unknown, TO = unknown> {
  from: FROM
  mapper: {
    [key: string]: keyof FROM
  }
  keeps: string[]
  handle?: (form: FROM) => Partial<TO>
}

export interface IMapping<FROM = unknown, TO = unknown> {
  mapper: {
    [key: string]: keyof FROM
  }
  keeps: string[]
  handle?: (form: FROM) => Partial<TO>
}
