import TextField from '@mui/material/TextField'
import type { TextFieldProps } from '@mui/material'

type IProps = {} & TextFieldProps

const ElementInput = (props: IProps) => {
  return <TextField fullWidth placeholder='Nhập' {...props} />
}

export default ElementInput
