import { Controller, useFormContext } from 'react-hook-form'
import type { OverridableStringUnion } from '@mui/types'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import type { GridProps } from '@mui/material/Grid'
import type { TextFieldProps, TextFieldPropsSizeOverrides } from '@mui/material/TextField'
import type { ControllerProps, FieldErrors } from 'react-hook-form'

type IProps = Omit<Omit<ControllerProps, 'render'>, 'name'> & {
  name: string
  inputProps?: TextFieldProps
  errors?: FieldErrors
  colProps?: GridProps
  size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>
}

const FormInputText = (props: IProps) => {
  const { name, inputProps, errors, colProps, size = 'small', ...restControl } = props
  const { control } = useFormContext()

  return (
    <Grid key={name} item {...colProps}>
      <Controller
        {...restControl}
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            size={size}
            fullWidth
            placeholder='Nhập'
            {...field}
            {...inputProps}
            {...(errors && errors[name] && { error: true, helperText: errors[name]?.message?.toString() })}
            label={
              <>
                {inputProps?.label} {restControl.rules?.required && <span className='text-red-500'>*</span>}
              </>
            }
          />
        )}
      />
    </Grid>
  )
}

export default FormInputText
