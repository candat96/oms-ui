'use client'

import { useCallback, useState } from 'react'

import { useForm } from 'react-hook-form'

import InputAdornment from '@mui/material/InputAdornment'

import Grid from '@mui/material/Grid'

import { toast } from 'react-toastify'

import { isArray } from 'lodash'

import DrawerCore from '@/components/drawer/core'
import { FormEach } from '@/components/form/function-form'
import type { IFieldType } from '@/components/form/render-input'
import renderFields from '@/components/form/render-input'
import TableCore from '@/components/table/core'
import {
  // useCreateBulkProductMutation,
  useCreateProductMutation,
  useDeletesProductMutation,
  useListProductQuery,
  useLockProductMutation,
  useRemoveProductMutation,
  useUpdateProductMutation
} from '@/redux-store/slices/cate-product'
import type { IProduct } from '@/types'
import { useTableProduct } from './component/useTable'
import { IMenuFnKey } from '@/types/table'
import { useSearchQuery } from '@/@menu/hooks/useSearchQuery'

export default function Page() {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const { params, handleOnPage, handleOnLimit } = useSearchQuery()

  const product = useListProductQuery({})

  const [createProduct, { isLoading: createLoading }] = useCreateProductMutation()
  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation()
  const [removeProduct] = useRemoveProductMutation()

  const [lockProduct] = useLockProductMutation()
  const [deletesProduct] = useDeletesProductMutation()
  // const [createBulkProduct] = useCreateBulkProductMutation()

  const methods = useForm<IProduct>({
    defaultValues: {
      code: '',
      name: '',
      size: { height: '', width: '', length: '' },
      id: '',
      mass: '',
      description: ''
    }
  })

  const { setValue } = methods

  const handleAction = (type: any, value?: unknown) => {
    if (type == IMenuFnKey.IMPORT) {
      // handleClickOpen()

      return
    }

    const idsArray = Object.keys(value as object)

    if (type == IMenuFnKey.EXPORT) {
      const filtered = []

      if (idsArray && product?.data?.docs && isArray(product?.data?.docs)) {
        const idSection = new Set(idsArray)
        const data = [...product?.data?.docs]

        for (const item of data) {
          if (idSection.has(item.id)) {
            filtered.push(item)
            idSection.delete(item.id)
          }

          if (idSection.size === 0) break
        }
      }

      // exportExcelProduct({ data: filtered }).finally(() => {})
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      console.log('value', value)

      if (Object.keys(value).length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 đối tượng !')

        return
      }

      if (type == IMenuFnKey.HIDDEN || type == IMenuFnKey.DISPLAY) {
        lockProduct({ id: idsArray, lock: type == IMenuFnKey.DISPLAY }).finally(() => {})
      }

      if (type == IMenuFnKey.DELETE) {
        deletesProduct({ id: idsArray }).finally(() => {})
      }
    }
  }

  const handleCreate = () => {
    setIsEdit(false)
    setDrawerOpen(true)
  }

  const handleOnEdit = useCallback(
    (data: IProduct) => {
      setIsEdit(true)
      FormEach<IProduct>({ ...data }, setValue)
      setDrawerOpen(true)
    },
    [setValue]
  )

  const handleOnRemove = useCallback(
    (data: IProduct) => {
      removeProduct(data.id)
    },
    [removeProduct]
  )

  const { columns } = useTableProduct({ handleEdit: handleOnEdit, handleDelete: handleOnRemove })

  const handleOnFinish = (value: { [s: string]: unknown } & IProduct) => {
    const result = {
      code: value.code,
      name: value.name,
      height: value.size.height,
      width: value.size.width,
      length: value.size.length,
      mass: value.mass,
      description: value.description
    }

    if (isEdit) {
      updateProduct({ ...result, id: value.id }).finally(() => {
        setDrawerOpen(false)
        setIsEdit(false)
      })
    } else {
      createProduct(result).finally(() => {
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
        label: 'Mã sản phẩm',
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
      inputProps: { label: 'Tên sản phẩm' },
      controlProps: { rules: { required: true } }
    },
    {
      type: 'input',
      name: 'size.length',
      colProps: { xs: 2 },
      inputProps: {
        label: 'Chiều dài',
        type: 'number',
        InputProps: {
          endAdornment: <InputAdornment position='end'>cm</InputAdornment>
        }
      }
    },
    {
      type: 'input',
      name: 'size.width',
      colProps: { xs: 2 },
      inputProps: {
        label: 'Chiều rộng',
        type: 'number',
        InputProps: {
          endAdornment: <InputAdornment position='end'>cm</InputAdornment>
        }
      }
    },
    {
      type: 'input',
      name: 'size.height',
      colProps: { xs: 2 },
      inputProps: {
        label: 'Chiều cao',
        type: 'number',
        InputProps: {
          endAdornment: <InputAdornment position='end'>cm</InputAdornment>
        }
      }
    },
    {
      type: 'input',
      name: 'mass',
      colProps: { xs: 6 },
      inputProps: {
        label: 'Khối lượng',
        type: 'number',
        InputProps: {
          endAdornment: <InputAdornment position='end'>Gram</InputAdornment>
        }
      }
    },
    {
      type: 'input',
      name: 'description',
      colProps: { xs: 12 },
      inputProps: {
        label: 'Đặc tả',
        InputProps: {
          endAdornment: <InputAdornment position='end'></InputAdornment>
        }
      }
    }
  ]

  return (
    <section>
      <TableCore<IProduct>
        header={{
          filter: false,
          select: true,
          create: { fn: handleCreate },
          menus: {
            [IMenuFnKey.EXPORT]: { fn: handleAction },
            [IMenuFnKey.IMPORT]: { fn: handleAction },
            [IMenuFnKey.HIDDEN]: { fn: handleAction },
            [IMenuFnKey.DISPLAY]: { fn: handleAction },
            [IMenuFnKey.DELETE]: { fn: handleAction }
          }
        }}
        columns={columns}
        data={(product.data?.docs || []) as IProduct[]}
        footer={{
          paginate: {
            page: params.page,
            limit: params.limit,
            total: product.data?.meta?.total || 0,
            onPage: handleOnPage,
            onRow: handleOnLimit
          }
        }}
      />

      <DrawerCore
        drawerOpen={drawerOpen}
        methods={methods}
        onValid={handleOnFinish}
        setDrawerOpen={setDrawerOpen}
        size={{ base: '100%', md: 1200 }}
        title={isEdit ? 'Cập sản phẩm' : 'Thêm mới sản phẩm'}
        loading={createLoading || updateLoading}
      >
        <Grid container spacing={4}>
          {inputs.map(input => renderFields({ ...input, errors: methods.formState.errors }))}
        </Grid>
      </DrawerCore>
    </section>
  )
}
