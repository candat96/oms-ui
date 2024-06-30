import type { ReactNode } from 'react'

import { Button, Drawer, IconButton, Typography } from '@mui/material'
import type { ResponsiveStyleValue } from '@mui/system'

import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'

import { useDictionary } from '@/hooks/DictionaryContext'
import { FormProviderCS } from '../form'

type IProps<T extends FieldValues> = {
  children: ReactNode
  drawerOpen: boolean
  methods: UseFormReturn<T, any, undefined>
  onValid: SubmitHandler<FieldValues | any>
  setDrawerOpen: (value: boolean) => void
  title?: string
  size?: ResponsiveStyleValue<string | number>
  loading?: boolean

  // dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

function DrawerCore<T extends FieldValues>(props: IProps<T>) {
  // const { title = 'Drawer Open', drawerOpen, setDrawerOpen, methods, loading = false, dictionary } = props
  const { title = 'Drawer Open', drawerOpen, setDrawerOpen, methods, loading = false } = props

  const dictionary = useDictionary()

  const handleClose = () => {
    methods.reset()
    setDrawerOpen(false)
  }

  return (
    <section>
      <Drawer
        open={drawerOpen}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: props.size } }}
      >
        <section className='flex justify-between items-center pli-5 plb-4 border-be'>
          <Typography variant='h5'>{title}</Typography>
          <IconButton onClick={handleClose} size='small'>
            <i className='ri-close-line text-2xl' />
          </IconButton>
        </section>

        <section className='p-6'>
          <FormProviderCS methods={methods} onValid={props.onValid}>
            {props.children}

            <section className='flex gap-4 mt-6'>
              <Button variant='contained' color='primary' type='submit' disabled={loading}>
                {dictionary?.['common']?.save || 'Lưu'}
              </Button>
              <Button variant='outlined' color='secondary' type='reset' onClick={handleClose} disabled={loading}>
                {dictionary?.['common']?.cancel || 'Huỷ'}
              </Button>
            </section>
          </FormProviderCS>
        </section>
      </Drawer>
    </section>
  )
}

export default DrawerCore
