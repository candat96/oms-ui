'use client'

import { useCallback, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'

import Grid from '@mui/material/Grid'

import { InputAdornment } from '@mui/material'

import { isArray } from 'lodash'

import { toast } from 'react-toastify'

import DrawerCore from '@/components/drawer/core'
import renderFields from '@/components/form/render-input'
import TableCore from '@/components/table/core'
import { IMenuFnKey } from '@/types/table'

import { useTableSupply } from './component/useTable'

import type { ISupply } from '@/types'

import type { IFieldType } from '@/components/form/render-input'
import { FormEach } from '@/components/form/function-form'
import {
  // useCreateBulkSupplyMutation,
  useCreateSupplyMutation,
  useDeletesSupplyMutation,
  useListSupplyQuery,
  useLockSupplyMutation,
  useRemoveSupplyMutation,
  useUpdateSupplyMutation
} from '@/redux-store/slices/cate-supply'
import { useSearchQuery } from '@/@menu/hooks/useSearchQuery'
import { useListTypeSupplyQuery } from '@/redux-store/slices/cate-type-supply'
import { useListUnitQuery } from '@/redux-store/slices/cate-unit'
import DialogGetDataExcel from '@/components/dialog/dialogGetDataExcel'

export default function Page() {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const { params, handleOnPage, handleOnLimit } = useSearchQuery()

  const Supply = useListSupplyQuery({ params })

  const TypeSupplyData = useListTypeSupplyQuery({
    params: {
      page: 1,
      limit: 100,
      order: 'ASC'
    }
  })

  const Unit = useListUnitQuery({
    params: {
      page: 1,
      limit: 100,
      order: 'ASC'
    }
  })

  const methods = useForm<ISupply>({
    defaultValues: {
      code: '',
      name: '',
      typeId: '',
      unitId: '',
      size: { height: '', width: '', length: '' },
      mass: '',
      description: ''
    }
  })

  const {
    setValue,
    formState: { errors }
  } = methods

  const [createSupply, { isLoading: createLoading }] = useCreateSupplyMutation()
  const [removeSupply] = useRemoveSupplyMutation()
  const [updateSupply, { isLoading: updateLoading }] = useUpdateSupplyMutation()

  const [lockSupply] = useLockSupplyMutation()
  const [deletesSupply] = useDeletesSupplyMutation()

  const dialogExcel = useRef<any>(null)
  // const [createBulkSupply] = useCreateBulkSupplyMutation()

  const handleCreate = () => {
    setIsEdit(false)
    setDrawerOpen(true)
  }

  const handleAction = (type: any, value?: unknown) => {
    if (type == IMenuFnKey.IMPORT) {
      handleClickOpen()

      return
    }

    const idsArray = Object.keys(value as object)

    if (type == IMenuFnKey.EXPORT) {
      const filtered = []

      if (idsArray && Supply?.data?.docs && isArray(Supply?.data?.docs)) {
        const idSection = new Set(idsArray)
        const data = [...Supply?.data?.docs]

        for (const item of data) {
          if (idSection.has(item.id)) {
            filtered.push(item)
            idSection.delete(item.id)
          }

          if (idSection.size === 0) break
        }
      }

      // exportExcelSupply({ data: filtered }).finally(() => {})
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      console.log('value', value)

      if (Object.keys(value).length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 đối tượng !')

        return
      }

      if (type == IMenuFnKey.HIDDEN || type == IMenuFnKey.DISPLAY) {
        lockSupply({ id: idsArray, lock: type == IMenuFnKey.DISPLAY }).finally(() => {})
      }

      if (type == IMenuFnKey.DELETE) {
        deletesSupply({ id: idsArray }).finally(() => {})
      }
    }
  }

  const handleOnEdit = useCallback(
    (value: ISupply) => {
      console.log('value', value)
      setIsEdit(true)
      FormEach<ISupply>({ ...value, id: value.id }, setValue)
      setDrawerOpen(true)
    },
    [setValue]
  )

  const handleOnRemove = useCallback(
    (value: ISupply) => {
      removeSupply(value.id)
    },
    [removeSupply]
  )

  const { columns } = useTableSupply({ handleEdit: handleOnEdit, handleDelete: handleOnRemove })

  const handleOnFinish = (value: { [s: string]: unknown } & ISupply) => {
    const result = {
      code: value.code,
      name: value.name,
      height: value.size.height,
      width: value.size.width,
      length: value.size.length,
      mass: value.mass,
      description: value.description,

      typeId: value.typeId || null,
      unitId: value.unitId || null
    }

    if (isEdit) {
      updateSupply({ ...result, id: value.id }).finally(() => {
        setDrawerOpen(false)
        setIsEdit(false)
      })
    } else {
      createSupply({ ...result, id: value.id }).finally(() => {
        setDrawerOpen(false)
      })
    }
  }

  const options = (Array.isArray(TypeSupplyData?.data?.docs) ? TypeSupplyData.data.docs : []).map(obj => {
    console.log('obj', obj)

    return {
      value: obj.id,
      label: obj.name,
      disabled: obj.lock
    }
  })

  const optionsUnit = (Array.isArray(Unit?.data?.docs) ? Unit.data.docs : []).map(obj => ({
    value: obj.id,
    label: obj.name,
    disabled: obj.lock
  }))

  const handleClickOpen = () => {
    dialogExcel.current.handleOpen()
  }

  const handleUpload = async (value: any) => {
    console.log(value)

    try {
      // const transformedData = value.map((item: any) => ({
      //   code: item['__EMPTY'],
      //   name: item['__EMPTY_1'],
      //   description: item['__EMPTY_2'],
      //   lock:
      //     item['__EMPTY_3'].includes('Khoá') || item['__EMPTY_3'].includes('khoá') || item['__EMPTY_3'].includes('khoa')
      // }))
      // createBulkTypeSupply({ data: transformedData })
      //   .then(() => {
      //     dialogExcel.current.handleClose(true)
      //   })
      //   .finally(() => {})
    } catch (error) {}
  }

  const inputs: IFieldType[] = [
    {
      type: 'input',
      name: 'code',
      colProps: { xs: 6 },
      inputProps: { label: 'Mã vật tư' },
      controlProps: {
        rules: { required: true }
      }
    },
    {
      type: 'input',
      name: 'name',
      colProps: { xs: 6 },
      inputProps: { label: 'Tên vật tư' },
      controlProps: {
        rules: { required: true }
      }
    },
    {
      type: 'select',
      name: 'typeId',
      colProps: { xs: 6 },
      selectProps: {
        label: 'Loại vật tư',
        options: options
      },
      controlProps: {
        rules: { required: true }
      }
    },
    {
      type: 'select',
      name: 'unitId',
      colProps: { xs: 6 },
      selectProps: {
        label: 'Đơn vị',
        // options: [{ value: 'c24349e9-2689-4d48-97b3-d93e6b259fd9', label: 'Alexander Vu' }]
        options: optionsUnit
      },
      controlProps: {
        rules: { required: true }
      }
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
      inputProps: { label: 'Mô tả' }
    }
  ]

  return (
    <section>
      <DialogGetDataExcel handleUploadProp={handleUpload} ref={dialogExcel} />
      <TableCore<ISupply>
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
        data={(Supply.data?.docs || []) as ISupply[]}
        footer={{
          paginate: {
            page: params.page,
            limit: params.limit,
            total: Supply.data?.meta?.total || 0,
            onPage: handleOnPage,
            onRow: handleOnLimit
          }
        }}
      />
      <DrawerCore
        loading={updateLoading || createLoading}
        size={{ base: '100%', md: 1200 }}
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
