import { useState } from 'react'

import TextField from '@mui/material/TextField'
import type { CellContext } from '@tanstack/react-table'

export function InputColumn<T = unknown>(cell: CellContext<T, unknown>) {
  const {
    getValue,
    row: { index },
    column: { id },
    table
  } = cell

  const [value, setValue] = useState(() => getValue())

  const onBlur = () => {
    table.options.meta?.updateData && table.options.meta.updateData(index, id, value)
  }

  return (
    <TextField
      fullWidth
      onBlur={onBlur}
      onChange={e => setValue(e.target.value)}
      placeholder='Nhập'
      size='small'
      value={value}
    />
  )
}
