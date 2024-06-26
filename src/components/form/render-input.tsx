import type { ReactNode } from 'react'

import type { OverridableStringUnion } from '@mui/types'
import type { TextFieldProps, TextFieldPropsSizeOverrides } from '@mui/material/TextField'
import type { SelectProps } from '@mui/material/Select'

import type { ControllerProps, FieldErrors } from 'react-hook-form'

import type { GridProps } from '@mui/material/Grid'

import type { SwitchProps } from '@mui/material'

import FormSelectOption from './select-option'
import FormInputText from './text-input'
import FormMultipleChipOption from './multiple-option'
import FormSwitchInput from './switch-input'

export type IFieldType = {
  size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>
  type: 'button' | 'input' | 'multiple-chip' | 'select' | 'switch'
  name: string
  overview?: ReactNode
  controlProps?: Omit<Omit<ControllerProps, 'render'>, 'name'>
  colProps?: GridProps
  errors?: FieldErrors
  inputProps?: TextFieldProps
  selectProps?: SelectProps & { options?: Array<{ value: string; label: string }> }
  switchProps?: SwitchProps & { label?: string }
}

const renderFields = (props: IFieldType) => {
  if (props.type === 'button' && props.overview) {
    return props.overview
  } else if (props.type === 'input') {
    return (
      <FormInputText
        colProps={props.colProps}
        name={props.name}
        inputProps={props.inputProps}
        errors={props.errors}
        size={props.size}
        {...props.controlProps}
      />
    )
  } else if (props.type === 'select') {
    return (
      <FormSelectOption
        colProps={props.colProps}
        name={props.name}
        selectProps={props.selectProps}
        errors={props.errors}
        size={props.size}
        {...props.controlProps}
      />
    )
  } else if (props.type === 'multiple-chip') {
    return (
      <FormMultipleChipOption
        colProps={props.colProps}
        name={props.name}
        selectProps={props.selectProps}
        errors={props.errors}
        size={props.size}
        {...props.controlProps}
      />
    )
  } else if (props.type === 'switch') {
    return (
      <FormSwitchInput
        colProps={props.colProps}
        name={props.name}
        switchProps={props.switchProps}
        {...props.controlProps}
      />
    )
  }
}

export default renderFields
