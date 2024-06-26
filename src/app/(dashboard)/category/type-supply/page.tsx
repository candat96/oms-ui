'use client'

import { useCallback, useState } from 'react'

import { useForm } from 'react-hook-form'

import Grid from '@mui/material/Grid'

import TableCore from '@/components/table/core'
import DrawerCore from '@/components/drawer/core'
import type { IFieldType } from '@/components/form/render-input'
import renderFields from '@/components/form/render-input'
import { FormEach } from '@/components/form/function-form'
import {
  useCreateTypeSupplyMutation,
  useListTypeSupplyQuery,
  useRemoveTypeSupplyMutation,
  useUpdateTypeSupplyMutation
} from '@/redux-store/slices/cate-type-supply'
import type { ITypeSupply } from '@/types/category/typeSupply'
import { useTableTypeSupply } from './component/useTable'

export default function Page() {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const TypeSupply = useListTypeSupplyQuery({})
  const [createTypeSupply, { isLoading: createLoading }] = useCreateTypeSupplyMutation()
  const [updateTypeSupply, { isLoading: updateLoading }] = useUpdateTypeSupplyMutation()
  const [removeTypeSupply] = useRemoveTypeSupplyMutation()

  const methods = useForm<ITypeSupply>({
    defaultValues: {
      code: '',
      name: '',
      id: '',
      description: ''
    }
  })

  const { setValue } = methods

  const handleCreate = () => {
    setIsEdit(false)
    setDrawerOpen(true)
  }

  const handleOnEdit = useCallback(
    (data: ITypeSupply) => {
      setIsEdit(true)
      FormEach<ITypeSupply>({ ...data }, setValue)
      setDrawerOpen(true)
    },
    [setValue]
  )

  const handleOnRemove = useCallback(
    (data: ITypeSupply) => {
      removeTypeSupply(data.id)
    },
    [removeTypeSupply]
  )

  const { columns } = useTableTypeSupply({ handleEdit: handleOnEdit, handleDelete: handleOnRemove })

  const handleOnFinish = (value: { [s: string]: unknown } & ITypeSupply) => {
    const result = {
      code: value.code,
      name: value.name,
      description: value.description
    }

    if (isEdit) {
      updateTypeSupply({ ...result, id: value.id }).finally(() => {
        setDrawerOpen(false)
        setIsEdit(false)
      })
    } else {
      createTypeSupply(result).finally(() => {
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
        label: 'Mã loại vật tư',
        autoFocus: true
      },
      controlProps: { rules: { required: true } }
    },
    {
      type: 'input',
      name: 'name',
      colProps: { xs: 6 },
      inputProps: { label: 'Tên loại vật tư' },
      controlProps: { rules: { required: true } }
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
      <TableCore<ITypeSupply>
        header={{ filter: false, select: true, create: { fn: handleCreate } }}
        columns={columns}
        data={(TypeSupply.data?.docs || []) as ITypeSupply[]}
      />

      <DrawerCore
        drawerOpen={drawerOpen}
        methods={methods}
        onValid={handleOnFinish}
        setDrawerOpen={setDrawerOpen}
        size={{ base: '100%', md: 700 }}
        title={isEdit ? 'Cập nhật loại vật tư' : 'Thêm mới loại vật tư'}
        loading={createLoading || updateLoading}
      >
        <Grid container spacing={4}>
          {inputs.map(input => renderFields({ ...input, errors: methods.formState.errors }))}
        </Grid>
      </DrawerCore>
    </section>
  )
}
