import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'

import CustomIconButton from '@/@core/components/mui/IconButton'

type IProps<T> = {
  row: T & { lock?: boolean }
  hidden?: boolean
  onSwitch?: (row: T, checked: boolean) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

function ColumnActions<T = unknown>(props: IProps<T>) {
  if (props.hidden) return null

  return (
    <Stack direction='row' width='100%' justifyContent='center' spacing={1}>
      {typeof props.row.lock !== 'undefined' && props.onSwitch && (
        <Switch
          defaultChecked={props.row.lock}
          onChange={(e: unknown, lock: boolean) => {
            props.onSwitch && props.onSwitch(props.row, lock)
          }}
        />
      )}

      {props.onEdit && (
        <CustomIconButton
          onClick={() => {
            props.onEdit && props.onEdit(props.row)
          }}
          variant='outlined'
        >
          <i className='ri-pencil-fill' />
        </CustomIconButton>
      )}
      {props.onDelete && (
        <CustomIconButton
          onClick={() => {
            props.onDelete && props.onDelete(props.row)
          }}
          variant='outlined'
        >
          <i className='ri-delete-bin-fill' />
        </CustomIconButton>
      )}
    </Stack>
  )
}

export default ColumnActions
