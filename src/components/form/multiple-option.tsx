import type { GridProps } from '@mui/material/Grid'
import type { ControllerProps, FieldErrors } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import type { OverridableStringUnion } from '@mui/types'

import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import type { SelectProps } from '@mui/material/Select'
import type { TextFieldPropsSizeOverrides } from '@mui/material'

type IProps = Omit<Omit<ControllerProps, 'render'>, 'name'> & {
  name: string
  selectProps?: SelectProps & { options?: Array<{ value: string; label: string }> }
  errors?: FieldErrors
  colProps?: GridProps
  size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      inlineSize: 250,
      maxBlockSize: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

const FormMultipleChipOption = (props: IProps) => {
  const { name, selectProps, errors, colProps, size = 'small', ...restControl } = props
  const { control } = useFormContext()

  return (
    <Grid item key={name} {...colProps}>
      <FormControl size={size} fullWidth>
        <InputLabel id={`select-${name}`} error={Boolean(errors && errors[name])}>
          {selectProps?.label} {restControl.rules?.required && <span className='text-red-500'>*</span>}
        </InputLabel>

        <Controller
          {...restControl}
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              multiple
              labelId={`select-${name}`}
              placeholder='Chọn'
              MenuProps={MenuProps}
              defaultValue={[]}
              {...selectProps}
              {...field}
              {...(errors && errors[name] && { error: true, helperText: errors[name]?.message?.toString() })}
              renderValue={selected => (
                <section className='flex flex-wrap gap-1'>
                  {(selected as unknown as Array<string>).map((value, index) => (
                    <Chip key={index} label={value} size='small' />
                  ))}
                </section>
              )}
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

export default FormMultipleChipOption
