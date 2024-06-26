'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import { Html5QrcodeScanner } from 'html5-qrcode'

type BillingCardProps = {
  open: boolean
  setOpen: (open: boolean) => void
  setValue: (value: string) => void
}

const ScannerQrCode = ({ open, setOpen, setValue }: BillingCardProps) => {
  // States
  const [data, setData] = useState('')

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner('reader', { qrbox: { width: 250, height: 250 }, fps: 5 }, true)

        scanner.render(
          result => {
            scanner.clear()
            setData(result)
          },
          error => {
            console.warn({ error })
          }
        )
      }, 100)
    }
  }, [open])

  const handleClose = () => {
    setOpen(false)
    setData('')
  }

  return (
    <Dialog open={open} fullWidth maxWidth='md' onClose={handleClose}>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Quét Mã QR
        <Typography component='span' className='flex flex-col text-center'>
          {data}
        </Typography>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16 sm:pbe-6'>
        <section id='reader'></section>

        <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='outlined' type='reset' color='secondary' onClick={handleClose}>
          Hủy
        </Button>

        <Button
          disabled={data.length === 0}
          variant='contained'
          type='submit'
          onClick={() => {
            setValue(data)
            handleClose()
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ScannerQrCode
