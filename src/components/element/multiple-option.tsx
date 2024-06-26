import { useState } from 'react'

import type { OverridableStringUnion } from '@mui/types'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent, TextFieldPropsSizeOverrides } from '@mui/material'

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

type IProps = {
  label: string
  options: Array<{ value: string; label: string }>
  size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>
}

const ElementMultiple = (props: IProps) => {
  const { options, label, size = 'small' } = props
  const [value, setValue] = useState<Array<string>>([])

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    setValue(event.target.value as string[])
  }

  return (
    <FormControl size={size} fullWidth sx={{ minWidth: 150 }}>
      <InputLabel id='select-label'>{label}</InputLabel>
      <Select
        multiple
        labelId='select-label'
        placeholder='Chọn'
        label={label}
        MenuProps={MenuProps}
        value={value}
        onChange={handleChange}
        renderValue={selected => (
          <section className='flex flex-wrap gap-1'>
            {(selected as unknown as Array<string>).map((value, index) => (
              <Chip key={index} label={value} size='small' />
            ))}
          </section>
        )}
      >
        {options.map((option, idx) => (
          <MenuItem value={option.value} key={idx}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ElementMultiple
