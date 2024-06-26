import type { ReactNode } from 'react'

import type { FieldValues, SubmitErrorHandler, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'

interface IProps<T extends FieldValues> {
  children: ReactNode
  methods: UseFormReturn<T, any, undefined>
  onInvalid?: SubmitErrorHandler<FieldValues> | undefined
  onValid: SubmitHandler<FieldValues>
}

function FormProviderCS<T extends FieldValues>(props: IProps<T>) {
  const { children, onValid, onInvalid, methods, ...restProps } = props

  return (
    <FormProvider {...methods} {...restProps}>
      <form autoComplete='off' onSubmit={methods.handleSubmit(onValid, onInvalid)}>
        {children}
      </form>
    </FormProvider>
  )
}

export default FormProviderCS
