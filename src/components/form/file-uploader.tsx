// React Imports
import { useState } from 'react'

// MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { toast } from 'react-toastify'

// Icon Imports
// @ts-ignore
import { useDropzone } from 'react-dropzone'

import AppReactDropzone from '@/@core/styles/app-react-dropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

type IProps = {
  maxFile?: number
  maxSize?: number
}

const FileUploaderRestrictions = (props: IProps) => {
  const { maxFile = 2, maxSize = 2 } = props
  // States
  const [files, setFiles] = useState<File[]>([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: maxFile,
    maxSize: 2000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error(`Bạn chỉ có thể tải lên ${maxFile} tệp và kích thước tối đa ${maxSize} MB.`, {
        autoClose: 3000
      })
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <i className='ri-file-text-line' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
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
          <Typography color='text.secondary'>Cho phép *.jpeg, *.jpg, *.png, *.gif</Typography>
          <Typography color='text.secondary'>
            Tối đa {maxFile} tệp và kích thước tối đa {maxSize} MB
          </Typography>
        </div>
      </div>
      {files.length ? (
        <>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button size='small' color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Xóa tất cả
            </Button>
            <Button size='small' variant='contained'>
              Upload Files
            </Button>
          </div>
        </>
      ) : null}
    </AppReactDropzone>
  )
}

export default FileUploaderRestrictions
