import type { ControllerProps } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'

import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import type { GridProps } from '@mui/material/Grid'
import type { SwitchProps } from '@mui/material/Switch'

type IProps = Omit<Omit<ControllerProps, 'render'>, 'name'> & {
  name: string
  switchProps?: SwitchProps & { label?: string }
  colProps?: GridProps
}

const FormSwitchInput = (props: IProps) => {
  const { control } = useFormContext()
  const { name, switchProps, colProps, ...restControl } = props

  return (
    <Grid key={name} item {...colProps}>
      <Controller
        {...restControl}
        name={name}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            labelPlacement='start'
            className='mie-4'
            control={<Switch {...field} {...switchProps} />}
            label={switchProps?.label}
          />
        )}
      />
    </Grid>
  )
}

export default FormSwitchInput
