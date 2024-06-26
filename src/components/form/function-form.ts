import type { FieldValues, UseFormSetValue } from 'react-hook-form'

type IValues<T> = { [s: string]: unknown } & T

export function FormEach<T extends FieldValues>(values: IValues<T>, fn: UseFormSetValue<IValues<T>>) {
  for (const [key, value] of Object.entries(values)) {
    // @ts-ignore
    fn(key, value)
  }
}
