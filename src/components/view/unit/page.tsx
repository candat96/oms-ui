'use client'

import { useCallback, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'

import Grid from '@mui/material/Grid'

import { toast } from 'react-toastify'

import { isArray } from 'lodash'

import DrawerCore from '@/components/drawer/core'
import { FormEach } from '@/components/form/function-form'
import type { IFieldType } from '@/components/form/render-input'
import renderFields from '@/components/form/render-input'
import TableCore from '@/components/table/core'
import { useDictionary } from '@/hooks/DictionaryContext'
import {
  useCreateUnitMutation,
  useDeletesUnitMutation,
  useListUnitQuery,
  useLockUnitMutation,
  useRemoveUnitMutation,
  useUpdateUnitMutation
} from '@/redux-store/slices/cate-unit'
import type { IUnit } from '@/types/category/unit'
import { useTableUnit } from './component/useTable'
import { useSearchQuery } from '@/@menu/hooks/useSearchQuery'
import { IMenuFnKey } from '@/types/table'
import DialogGetDataExcel from '@/components/dialog/dialogGetDataExcel'

// export default function PageUnit({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) {
export default function PageUnit() {
  const dictionary = useDictionary()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const { params, handleOnPage, handleOnLimit } = useSearchQuery()
  const dialogExcel = useRef<any>(null)

  const Unit = useListUnitQuery({ params })
  const [createUnit, { isLoading: createLoading }] = useCreateUnitMutation()
  const [updateUnit, { isLoading: updateLoading }] = useUpdateUnitMutation()
  const [removeUnit] = useRemoveUnitMutation()

  const [lockUnit] = useLockUnitMutation()
  const [deletesUnit] = useDeletesUnitMutation()

  const methods = useForm<IUnit>({
    defaultValues: {
      code: '',
      name: '0',
      id: ''
    }
  })

  const { setValue } = methods

  const handleCreate = () => {
    setIsEdit(false)
    setDrawerOpen(true)
  }

  const handleOnEdit = useCallback(
    (data: IUnit) => {
      setIsEdit(true)
      FormEach<IUnit>({ ...data }, setValue)
      setDrawerOpen(true)
    },
    [setValue]
  )

  const handleOnRemove = useCallback(
    (data: IUnit) => {
      removeUnit(data.id)
    },
    [removeUnit]
  )

  const handleLock = (row: IUnit, lock: boolean) => {
    lockUnit({ id: [row.id], lock }).finally(() => {
      console.log('row.id', row.id)
    })
  }

  const { columns } = useTableUnit({ handleEdit: handleOnEdit, handleDelete: handleOnRemove, handleLock })

  const handleOnFinish = (value: { [s: string]: unknown } & IUnit) => {
    const result = {
      code: value.code,
      name: value.name
    }

    if (isEdit) {
      updateUnit({ ...result, id: value.id }).finally(() => {
        setDrawerOpen(false)
        setIsEdit(false)
      })
    } else {
      createUnit(result).finally(() => {
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
        label: dictionary['unit'].code,
        autoFocus: true
      },
      controlProps: { rules: { required: true } }
    },
    {
      type: 'input',
      name: 'name',
      colProps: { xs: 6 },
      inputProps: { label: dictionary['unit'].name },
      controlProps: { rules: { required: true } }
    }
  ]

  const handleUpload = async (value: any) => {
    return

    try {
      const transformedData = value.map((item: any) => ({
        code: item['__EMPTY'],
        name: item['__EMPTY_1'],
        description: item['__EMPTY_2'],
        lock:
          item['__EMPTY_3'].includes('Khoá') || item['__EMPTY_3'].includes('khoá') || item['__EMPTY_3'].includes('khoa')
      }))

      console.log(transformedData)

      // createBulkUnit({ data: transformedData })
      //   .then(() => {
      //     dialogExcel.current.handleClose(true)
      //   })
      //   .finally(() => {})
    } catch (error) {}
  }

  const handleClickOpen = () => {
    dialogExcel.current.handleOpen()
  }

  const handleAction = (type: any, value?: unknown) => {
    if (type == IMenuFnKey.IMPORT) {
      handleClickOpen()

      return
    }

    const idsArray = Object.keys(value as object)

    if (type == IMenuFnKey.EXPORT) {
      const filtered = []

      if (idsArray && Unit?.data?.docs && isArray(Unit?.data?.docs)) {
        const idSection = new Set(idsArray)
        const data = [...Unit?.data?.docs]

        for (const item of data) {
          if (idSection.has(item.id)) {
            filtered.push(item)
            idSection.delete(item.id)
          }

          if (idSection.size === 0) break
        }
      }

      // exportExcelUnit({ data: filtered }).finally(() => {})
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      console.log('value', value)

      if (Object.keys(value).length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 đối tượng !')

        return
      }

      if (type == IMenuFnKey.HIDDEN || type == IMenuFnKey.DISPLAY) {
        lockUnit({ id: idsArray, lock: type == IMenuFnKey.DISPLAY }).finally(() => {})
      }

      if (type == IMenuFnKey.DELETE) {
        deletesUnit({ id: idsArray }).finally(() => {})
      }
    }
  }

  return (
    <section>
      <DialogGetDataExcel handleUploadProp={handleUpload} ref={dialogExcel} />
      <TableCore<IUnit>
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
        data={(Unit.data?.docs || []) as IUnit[]}
        footer={{
          paginate: {
            page: params.page,
            limit: params.limit,
            total: Unit.data?.meta?.total || 0,
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
        title={isEdit ? dictionary['unit'].updateUnit : dictionary['unit'].createUnit}
        loading={createLoading || updateLoading}
        // dictionary={dictionary}
      >
        <Grid container spacing={4}>
          {inputs.map(input => renderFields({ ...input, errors: methods.formState.errors }))}
        </Grid>
      </DrawerCore>
    </section>
  )
}
