'use client'

import { useCallback, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'

import Grid from '@mui/material/Grid'

import { toast } from 'react-toastify'

import { isArray } from 'lodash'

import { useSearchQuery } from '@/@menu/hooks/useSearchQuery'
import DialogGetDataExcel from '@/components/dialog/dialogGetDataExcel'
import DrawerCore from '@/components/drawer/core'
import exportExcelProvider from '@/components/excel/export_exel_kq'
import { FormEach } from '@/components/form/function-form'
import type { IFieldType } from '@/components/form/render-input'
import renderFields from '@/components/form/render-input'
import TableCore from '@/components/table/core'
import { IMenuFnKey } from '@/types/table'
import { useTableProvider } from './component/useTable'
import {
  useCreateBulkProviderMutation,
  useCreateProviderMutation,
  useDeletesProviderMutation,
  useListProviderQuery,
  useLockProviderMutation,
  useRemoveProviderMutation,
  useUpdateProviderMutation
} from '@/redux-store/slices/cate-provider'
import type { IProvider } from '@/types/category/typeProvider'

export default function Page() {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const dialogExcel = useRef<any>(null)

  const { params, handleOnPage, handleOnLimit } = useSearchQuery()

  const Provider = useListProviderQuery({ params })
  const [createProvider, { isLoading: createLoading }] = useCreateProviderMutation()
  const [updateProvider, { isLoading: updateLoading }] = useUpdateProviderMutation()
  const [removeProvider] = useRemoveProviderMutation()

  const [lockProvider] = useLockProviderMutation()
  const [deletesProvider] = useDeletesProviderMutation()
  const [createBulkProvider] = useCreateBulkProviderMutation()

  const methods = useForm<IProvider>({
    defaultValues: {
      code: '',
      name: '',
      id: '',
      note: ''
    }
  })

  const { setValue } = methods

  const handleCreate = () => {
    setIsEdit(false)
    setDrawerOpen(true)
  }

  const handleOnEdit = useCallback(
    (data: IProvider) => {
      setIsEdit(true)
      FormEach<IProvider>({ ...data }, setValue)
      setDrawerOpen(true)
    },
    [setValue]
  )

  const handleOnRemove = useCallback(
    (data: IProvider) => {
      removeProvider(data.id)
    },
    [removeProvider]
  )

  const handleLock = (row: IProvider, lock: boolean) => {
    lockProvider({ id: [row.id], lock }).finally(() => {})
  }

  const { columns } = useTableProvider({
    handleEdit: handleOnEdit,
    handleDelete: handleOnRemove,
    handleLock: handleLock
  })

  const handleOnFinish = (value: { [s: string]: unknown } & IProvider) => {
    const result = {
      code: value.code,
      name: value.name,
      note: value.note
    }

    if (isEdit) {
      updateProvider({ ...result, id: value.id }).finally(() => {
        setDrawerOpen(false)
        setIsEdit(false)
      })
    } else {
      createProvider(result).finally(() => {
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
        label: 'Mã nhà cung cấp',
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
      name: 'note',
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

      createBulkProvider({ data: transformedData })
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

      if (idsArray && Provider?.data?.docs && isArray(Provider?.data?.docs)) {
        const idSection = new Set(idsArray)
        const data = [...Provider?.data?.docs]

        for (const item of data) {
          if (idSection.has(item.id)) {
            filtered.push(item)
            idSection.delete(item.id)
          }

          if (idSection.size === 0) break
        }
      }

      exportExcelProvider({ data: filtered }).finally(() => {})
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      console.log('value', value)

      if (Object.keys(value).length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 đối tượng !')

        return
      }

      if (type == IMenuFnKey.HIDDEN || type == IMenuFnKey.DISPLAY) {
        lockProvider({ id: idsArray, lock: type == IMenuFnKey.DISPLAY }).finally(() => {})
      }

      if (type == IMenuFnKey.DELETE) {
        deletesProvider({ id: idsArray }).finally(() => {})
      }
    }
  }

  return (
    <section>
      <DialogGetDataExcel handleUploadProp={handleUpload} ref={dialogExcel} />

      <TableCore<IProvider>
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
        data={(Provider.data?.docs || []) as IProvider[]}
        footer={{
          paginate: {
            page: params.page,
            limit: params.limit,
            total: Provider.data?.meta?.total || 0,
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
        title={isEdit ? 'Cập nhật nhà cung cấp' : 'Thêm mới nhà cung cấp'}
        loading={createLoading || updateLoading}
      >
        <Grid container spacing={4}>
          {inputs.map(input => renderFields({ ...input, errors: methods.formState.errors }))}
        </Grid>
      </DrawerCore>
    </section>
  )
}
