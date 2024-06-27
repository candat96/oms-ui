'use client'

import { useCallback, useState } from 'react'

import { useForm } from 'react-hook-form'

import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'

import { useDropzone } from 'react-dropzone'

import ListItem from '@mui/material/ListItem'

import IconButton from '@mui/material/IconButton'

import { toast } from 'react-toastify'

import * as XLSX from 'xlsx'

import { isArray } from 'lodash'

import AppReactDropzone from '@/@core/styles/app-react-dropzone'

import { useSearchQuery } from '@/@menu/hooks/useSearchQuery'
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

type FileProp = {
  name: string
  type: string
  size: number
}

export default function Page() {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const [files, setFiles] = useState<File[]>([])

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

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const readFile = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onabort = () => reject('file reading was aborted')
      reader.onerror = () => reject('file reading has failed')

      reader.onload = () => {
        const binaryStr = reader.result
        const workbook = XLSX.read(binaryStr, { type: 'binary' })

        // Chỉ đọc sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Chuyển đổi sheet thành JSON
        const data = XLSX.utils.sheet_to_json(worksheet)

        if (data.length > 0) {
          data.shift()
        }

        resolve(data)
      }

      reader.readAsBinaryString(file)
    })
  }

  const handleUpload = async () => {
    try {
      let dataCreate: any = []
      const promises = files.map(file => readFile(file))
      const results = await Promise.all(promises)

      results.forEach(data => {
        dataCreate = dataCreate.concat(data)
      })

      const transformedData = dataCreate.map((item: any) => ({
        code: item['__EMPTY'],
        name: item['__EMPTY_1'],
        description: item['__EMPTY_2'],
        lock:
          item['__EMPTY_3'].includes('Khoá') || item['__EMPTY_3'].includes('khoá') || item['__EMPTY_3'].includes('khoa')
      }))

      createBulkTypeSupply({ data: transformedData })
        .then(() => {
          setFiles([])
          setOpen(false)
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(list => {
        return [...list, ...acceptedFiles]
      })
    },
    onDropRejected: () => {
      toast.error(`Bạn chỉ có thể tải lên file định dạng xlsx, xls.`, {
        autoClose: 3000
      })
    }
  })

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>
          <i className='ri-file-text-line' />
        </div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='ri-close-line text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <section>
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogContent>
          <AppReactDropzone>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div className='flex items-center flex-col'>
                <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                  <i className='ri-upload-2-line' />
                </Avatar>
                <Typography variant='h5' className='mbe-2.5'>
                  Thả tập tin vào đây hoặc bấm vào để tải lên.
                </Typography>
                <Typography color='text.secondary'>Bạn chỉ có thể tải lên file định dạng xlsx, xls.</Typography>
              </div>
            </div>
            {files.length ? (
              <>
                <List>{fileList}</List>
                <div className='buttons'>
                  <Button size='small' color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                    Xóa tất cả
                  </Button>
                </div>
              </>
            ) : null}
          </AppReactDropzone>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} variant='outlined' color='secondary'>
            Huỷ
          </Button>
          <Button onClick={() => handleUpload()} variant='contained'>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
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
