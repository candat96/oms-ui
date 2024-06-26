import { useMemo } from 'react'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

import { useTheme } from '@mui/material/styles'

import verticalMenuData from '@/data/navigation/verticalMenuData'
import { useSettings } from '@core/hooks/useSettings'
// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import useVerticalNav from '@menu/hooks/useVerticalNav'
// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'
// Component Imports
import { Menu, MenuItem, MenuSection, SubMenu } from '@menu/vertical-menu'

// Hook Imports

// MUI Imports

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Menus
  const verticalMenu = useMemo(() => verticalMenuData(), [])

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {verticalMenu.map((menu, idx) => {
          if (menu.isSection) {
            return (
              <MenuSection key={idx} label={menu.label}>
                {menu.children?.map(item => {
                  if (item.children && item.children.length) {
                    return (
                      <SubMenu key={item.href} label={item.label} icon={<i className={item.icon} />}>
                        {item.children.map(i => (
                          <MenuItem key={i.href} href={`/${item.href}/${i.href}`}>
                            {i.label}
                          </MenuItem>
                        ))}
                      </SubMenu>
                    )
                  }

                  return (
                    <MenuItem key={item.href} href={`/${item.href}`} icon={<i className={item.icon} />}>
                      {item.label}
                    </MenuItem>
                  )
                })}
              </MenuSection>
            )
          }

          if (menu.children && menu.children.length) {
            return (
              <SubMenu key={menu.href} label={menu.label} icon={<i className={menu.icon} />}>
                {menu.children.map(item => (
                  <MenuItem key={item.href} href={`/${menu.href}/${item.href}`}>
                    {item.label}
                  </MenuItem>
                ))}
              </SubMenu>
            )
          }

          return (
            <MenuItem key={menu.href} href={`/${menu.href}`} icon={<i className={menu.icon} />}>
              {menu.label}
            </MenuItem>
          )
        })}
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
