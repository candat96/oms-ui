import type { MouseEvent } from 'react'
import { useState } from 'react'

import { Menu, MenuItem, Zoom } from '@mui/material'

import type { ButtonProps, MenuItemProps, MenuProps } from '@mui/material'

import CustomIconButton from '@/@core/components/mui/IconButton'

type IProps = {
  buttonProps?: ButtonProps
  menuProps?: MenuProps
  items: Array<MenuItemProps & { fn?: () => void }>
}

const BtnMenu = (props: IProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <CustomIconButton
        aria-controls={Boolean(anchorEl) ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-label='capture screenshot'
        aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
        variant='outlined'
        onClick={handleClick}
        {...props.buttonProps}
      >
        <i className='ri-camera-lens-fill' />
      </CustomIconButton>

      <Menu
        keepMounted
        id='basic-menu'
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        TransitionComponent={Zoom}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        {...props.menuProps}
      >
        {props.items.map((option, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              option.fn && option.fn()
              handleClose()
            }}
            {...option}
          />
        ))}
      </Menu>
    </>
  )
}

export default BtnMenu
