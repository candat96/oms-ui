'use client'

import { useCallback, useState } from 'react'

import { useForm } from 'react-hook-form'

import Grid from '@mui/material/Grid'

import DrawerCore from '@/components/drawer/core'
import renderFields from '@/components/form/render-input'
import TableCore from '@/components/table/core'
import {
  useCreateWarehouseMutation,
  useListWarehouseQuery,
  useRemoveWarehouseMutation,
  useUpdateWarehouseMutation
} from '@/redux-store/slices/cate-warehouse'
import { IMenuFnKey } from '@/types/table'
import { genCode } from '@/utils/generation'

import { useTableWarehouse } from './component/useTable'

import type { IWarehouse } from '@/types'

import type { IFieldType } from '@/components/form/render-input'
import { FormEach } from '@/components/form/function-form'

export default function Page() {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const methods = useForm<IWarehouse>({
    defaultValues: { code: genCode(10).toUpperCase(), name: '', description: '', zone: '', managerId: '', id: '' }
  })

  const {
    setValue,
    formState: { errors }
  } = methods

  const warehouse = useListWarehouseQuery({
    // params: {
    //   page:
    // }
  })

  const [createWarehouse, { isLoading: createLoading }] = useCreateWarehouseMutation()
  const [removeWarehouse] = useRemoveWarehouseMutation()
  const [updateWarehouse, { isLoading: updateLoading }] = useUpdateWarehouseMutation()

  const handleCreate = () => {
    setIsEdit(false)
    setDrawerOpen(true)
  }

  const handleAction = (target: IMenuFnKey) => {
    console.log('click action:', target)
  }

  const handleOnEdit = useCallback(
    (data: IWarehouse) => {
      setIsEdit(true)
      FormEach<IWarehouse>({ ...data, managerId: data.manager.id }, setValue)
      setDrawerOpen(true)
    },
    [setValue]
  )

  const handleOnRemove = useCallback(
    (data: IWarehouse) => {
      removeWarehouse(data.id)
    },
    [removeWarehouse]
  )

  const { columns } = useTableWarehouse({ handleEdit: handleOnEdit, handleDelete: handleOnRemove })

  const handleOnFinish = (value: { [s: string]: unknown }) => {
    const result = { ...value, manager: undefined }

    if (isEdit) {
      updateWarehouse(result).finally(() => {
        setDrawerOpen(false)
        setIsEdit(false)
      })
    } else {
      createWarehouse(result).finally(() => {
        setDrawerOpen(false)
      })
    }
  }

  const inputs: IFieldType[] = [
    {
      type: 'input',
      name: 'code',
      colProps: { xs: 4 },
      inputProps: { label: 'Mã kho', InputProps: { readOnly: true } }
    },
    {
      type: 'input',
      name: 'name',
      colProps: { xs: 8 },
      inputProps: { label: 'Tên kho' },
      controlProps: {
        rules: { required: true }
      }
    },
    {
      type: 'input',
      name: 'zone',
      colProps: { xs: 4 },
      inputProps: { label: 'Số Zone' },
      controlProps: {
        rules: { required: true }
      }
    },
    {
      type: 'select',
      name: 'managerId',
      colProps: { xs: 8 },
      selectProps: {
        label: 'Nhân viên quản lý',
        options: [{ value: 'c24349e9-2689-4d48-97b3-d93e6b259fd9', label: 'Alexander Vu' }]
      },
      controlProps: {
        rules: { required: true }
      }
    },
    {
      type: 'input',
      name: 'description',
      colProps: { xs: 12 },
      inputProps: { label: 'Mô tả' }
    }
  ]

  return (
    <section>
      <TableCore<IWarehouse>
        header={{
          filter: false,
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
        data={warehouse.data?.docs || []}
      />
      <DrawerCore
        loading={updateLoading || createLoading}
        size={{ base: '100%', md: 700 }}
        title={isEdit ? 'Cập nhật kho' : 'Thêm mới kho'}
        methods={methods}
        onValid={handleOnFinish}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      >
        <Grid container spacing={4}>
          {inputs.map(input => renderFields({ ...input, errors }))}
        </Grid>
      </DrawerCore>
    </section>
  )
}
