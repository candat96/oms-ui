import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import type { FormControlProps, SelectProps } from '@mui/material'

type IProps = {
  label: string
  options: Array<{ value: string; label: string }>
  selectProps?: SelectProps
  formControlProps?: FormControlProps
}

const ElementSelect = (props: IProps) => {
  const { label, options, selectProps, formControlProps } = props

  return (
    <FormControl size='small' sx={{ minWidth: 150 }} {...formControlProps}>
      <InputLabel id='id-select-warehouse-label'>{label}</InputLabel>
      <Select labelId='id-select-warehouse-label' label={label} {...selectProps}>
        {options.map((ware, idx: number) => (
          <MenuItem key={idx} value={ware.value}>
            {ware.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ElementSelect
