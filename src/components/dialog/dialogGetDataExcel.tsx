import React, { useImperativeHandle, useState } from 'react'

import { Avatar, List, ListItem } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'

import AppReactDropzone from '@/@core/styles/app-react-dropzone'

type BillingCardProps = {
  handleUploadProp: (value: any) => void
}

type FileProp = {
  name: string
  type: string
  size: number
}

type DialogGetDataExcelRef = {
  clearFiles: () => void
  handleClose: (resetFiles?: boolean) => void
  handleOpen: () => void
}

const DialogGetDataExcel = ({ handleUploadProp }: BillingCardProps, ref: React.Ref<DialogGetDataExcelRef>) => {
  useImperativeHandle(ref, () => ({
    clearFiles: clearFiles,
    handleClose: handleClose,
    handleOpen: handleOpen
  }))

  const [files, setFiles] = useState<File[]>([])
  const [open, setOpen] = useState<boolean>(false)

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

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

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

      handleUploadProp(dataCreate)
    } catch (error) {}
  }

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

  const clearFiles = () => {
    setFiles([])
  }

  const handleClose = (resetFiles?: boolean) => {
    if (resetFiles) setFiles([])
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
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
  )
}

export default React.forwardRef(DialogGetDataExcel)
