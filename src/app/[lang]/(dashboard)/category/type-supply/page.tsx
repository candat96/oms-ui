'use client'

import { useCallback, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'

import Grid from '@mui/material/Grid'

import { toast } from 'react-toastify'

import { isArray } from 'lodash'

import { useSearchQuery } from '@/@menu/hooks/useSearchQuery'
import DialogGetDataExcel from '@/components/dialog/dialogGetDataExcel'
import DrawerCore from '@/components/drawer/core'
import exportExcelTypeSupply from '@/components/excel/export_exel_kq'
import { FormEach } from '@/components/form/function-form'
import type { IFieldType } from '@/components/form/render-input'
import renderFields from '@/components/form/render-input'
import TableCore from '@/components/table/core'
import {
  useCreateBulkTypeSupplyMutation,
  useCreateTypeSupplyMutation,
  useDeletesTypeSupplyMutation,
  useListTypeSupplyQuery,
  useLockTypeSupplyMutation,
  useRemoveTypeSupplyMutation,
  useUpdateTypeSupplyMutation
} from '@/redux-store/slices/cate-type-supply'
import type { ITypeSupply } from '@/types/category/typeSupply'
import { IMenuFnKey } from '@/types/table'
import { useTableTypeSupply } from './component/useTable'

export default function Page() {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const dialogExcel = useRef<any>(null)

  const { params, handleOnPage, handleOnLimit } = useSearchQuery()

  const TypeSupply = useListTypeSupplyQuery({ params })
  const [createTypeSupply, { isLoading: createLoading }] = useCreateTypeSupplyMutation()
  const [updateTypeSupply, { isLoading: updateLoading }] = useUpdateTypeSupplyMutation()
  const [removeTypeSupply] = useRemoveTypeSupplyMutation()

  const [lockTypeSupply] = useLockTypeSupplyMutation()
  const [deletesTypeSupply] = useDeletesTypeSupplyMutation()
  const [createBulkTypeSupply] = useCreateBulkTypeSupplyMutation()

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

  const handleLock = (row: ITypeSupply, lock: boolean) => {
    lockTypeSupply({ id: [row.id], lock }).finally(() => {
      console.log('row.id', row.id)
    })
  }

  const { columns } = useTableTypeSupply({
    handleEdit: handleOnEdit,
    handleDelete: handleOnRemove,
    handleLock: handleLock
  })

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

  const handleClickOpen = () => {
    dialogExcel.current.handleOpen()
  }

  const handleUpload = async (value: any) => {
    try {
      const transformedData = value.map((item: any) => ({
        code: item['__EMPTY'],
        name: item['__EMPTY_1'],
        description: item['__EMPTY_2'],
        lock:
          item['__EMPTY_3'].includes('Khoá') || item['__EMPTY_3'].includes('khoá') || item['__EMPTY_3'].includes('khoa')
      }))

      createBulkTypeSupply({ data: transformedData })
        .then(() => {
          dialogExcel.current.handleClose(true)
        })
        .finally(() => {})
    } catch (error) {}
  }

  const handleAction = (type: any, value?: unknown) => {
    if (type == IMenuFnKey.IMPORT) {
      handleClickOpen()

      return
    }

    const idsArray = Object.keys(value as object)

    if (type == IMenuFnKey.EXPORT) {
      const filtered = []

      if (idsArray && TypeSupply?.data?.docs && isArray(TypeSupply?.data?.docs)) {
        const idSection = new Set(idsArray)
        const data = [...TypeSupply?.data?.docs]

        for (const item of data) {
          if (idSection.has(item.id)) {
            filtered.push(item)
            idSection.delete(item.id)
          }

          if (idSection.size === 0) break
        }
      }

      exportExcelTypeSupply({ data: filtered }).finally(() => {})
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      console.log('value', value)

      if (Object.keys(value).length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 đối tượng !')

        return
      }

      if (type == IMenuFnKey.HIDDEN || type == IMenuFnKey.DISPLAY) {
        lockTypeSupply({ id: idsArray, lock: type == IMenuFnKey.DISPLAY }).finally(() => {})
      }

      if (type == IMenuFnKey.DELETE) {
        deletesTypeSupply({ id: idsArray }).finally(() => {})
      }
    }
  }

  return (
    <section>
      <DialogGetDataExcel handleUploadProp={handleUpload} ref={dialogExcel} />

      <TableCore<ITypeSupply>
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
        data={(TypeSupply.data?.docs || []) as ITypeSupply[]}
        footer={{
          paginate: {
            page: params.page,
            limit: params.limit,
            total: TypeSupply.data?.meta?.total || 0,
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
