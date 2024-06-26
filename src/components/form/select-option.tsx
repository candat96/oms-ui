import { Controller, useFormContext } from 'react-hook-form'

import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { OverridableStringUnion } from '@mui/types'

import type { GridProps } from '@mui/material/Grid'
import type { SelectProps } from '@mui/material/Select'
import type { ControllerProps, FieldErrors } from 'react-hook-form'
import type { TextFieldPropsSizeOverrides } from '@mui/material'

type IProps = Omit<Omit<ControllerProps, 'render'>, 'name'> & {
  name: string
  selectProps?: SelectProps & { options?: Array<{ value: string; label: string }> }
  errors?: FieldErrors
  colProps?: GridProps
  size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>
}

const FormSelectOption = (props: IProps) => {
  const { name, selectProps, errors, colProps, size = 'small', ...restControl } = props
  const { control } = useFormContext()

  return (
    <Grid item key={name} {...colProps}>
      <FormControl size={size} fullWidth>
        <InputLabel error={Boolean(errors && errors[name])}>
          {selectProps?.label} {restControl.rules?.required && <span className='text-red-500'>*</span>}
        </InputLabel>
        <Controller
          {...restControl}
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              placeholder='Chọn'
              {...selectProps}
              {...field}
              {...(errors && errors[name] && { error: true, helperText: errors[name]?.message?.toString() })}
            >
              {(selectProps?.options ? selectProps.options : []).map((option, idx) => (
                <MenuItem value={option.value} key={idx}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </Grid>
  )
}

export default FormSelectOption
