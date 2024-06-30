'use client'

import { useCallback, useState } from 'react'

import { useForm } from 'react-hook-form'

import InputAdornment from '@mui/material/InputAdornment'

import Grid from '@mui/material/Grid'

import TableCore from '@/components/table/core'
import { useTableBasket } from './component/useTable'
import type { IBasket } from '@/types/category/basket'
import DrawerCore from '@/components/drawer/core'
import type { IFieldType } from '@/components/form/render-input'
import renderFields from '@/components/form/render-input'
import {
  useCreateBasketMutation,
  useListBasketQuery,
  useRemoveBasketMutation,
  useUpdateBasketMutation
} from '@/redux-store/slices/cate-basket'
import { FormEach } from '@/components/form/function-form'

export default function Page() {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const basket = useListBasketQuery({})
  const [createBasket, { isLoading: createLoading }] = useCreateBasketMutation()
  const [updateBasket, { isLoading: updateLoading }] = useUpdateBasketMutation()
  const [removeBasket] = useRemoveBasketMutation()

  const methods = useForm<IBasket>({
    defaultValues: {
      code: '',
      name: '',
      size: { height: '', width: '', length: '' },
      id: ''
    }
  })

  const { setValue } = methods

  const handleCreate = () => {
    setIsEdit(false)
    setDrawerOpen(true)
  }

  const handleOnEdit = useCallback(
    (data: IBasket) => {
      console.log('data-----', data)
      setIsEdit(true)
      FormEach<IBasket>({ ...data }, setValue)
      setDrawerOpen(true)
    },
    [setValue]
  )

  const handleOnRemove = useCallback(
    (data: IBasket) => {
      removeBasket(data.id)
    },
    [removeBasket]
  )

  const { columns } = useTableBasket({ handleEdit: handleOnEdit, handleDelete: handleOnRemove })

  const handleOnFinish = (value: { [s: string]: unknown } & IBasket) => {
    const result = {
      code: value.code,
      name: value.name,
      height: value.size.height,
      width: value.size.width,
      length: value.size.length
    }

    if (isEdit) {
      updateBasket({ ...result, id: value.id }).finally(() => {
        setDrawerOpen(false)
        setIsEdit(false)
      })
    } else {
      createBasket(result).finally(() => {
        setDrawerOpen(false)
      })
    }
  }

  const inputs: IFieldType[] = [
    {
      type: 'input',
      name: 'code',
      colProps: { xs: 6 },
      inputProps: {
        label: 'Mã Sọt',
        autoFocus: true,
        InputProps: {
          endAdornment: (
            <InputAdornment position='end' className='text-[#666CFF]'>
              <i className='ri-printer-line'></i>
            </InputAdornment>
          )
        }
      },
      controlProps: { rules: { required: true } }
    },
    {
      type: 'input',
      name: 'name',
      colProps: { xs: 6 },
      inputProps: { label: 'Tên Sọt' },
      controlProps: { rules: { required: true } }
    },
    {
      type: 'input',
      name: 'size.length',
      colProps: { xs: 4 },
      inputProps: {
        label: 'Chiều dài',
        InputProps: {
          endAdornment: <InputAdornment position='end'>cm</InputAdornment>
        }
      }
    },
    {
      type: 'input',
      name: 'size.width',
      colProps: { xs: 4 },
      inputProps: {
        label: 'Chiều rộng',
        InputProps: {
          endAdornment: <InputAdornment position='end'>cm</InputAdornment>
        }
      }
    },
    {
      type: 'input',
      name: 'size.height',
      colProps: { xs: 4 },
      inputProps: {
        label: 'Chiều cao',
        InputProps: {
          endAdornment: <InputAdornment position='end'>cm</InputAdornment>
        }
      }
    }
  ]

  return (
    <section>
      <TableCore<IBasket>
        header={{ filter: false, create: { fn: handleCreate } }}
        columns={columns}
        data={(basket.data?.docs || []) as IBasket[]}
      />

      <DrawerCore
        drawerOpen={drawerOpen}
        methods={methods}
        onValid={handleOnFinish}
        setDrawerOpen={setDrawerOpen}
        size={{ base: '100%', md: 700 }}
        title={isEdit ? 'Cập Nhật Sọt' : 'Thêm Mới Sọt'}
        loading={createLoading || updateLoading}
      >
        <Grid container spacing={4}>
          {inputs.map(input => renderFields({ ...input, errors: methods.formState.errors }))}
        </Grid>
      </DrawerCore>
    </section>
  )
}
