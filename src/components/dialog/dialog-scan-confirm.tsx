import { useCallback, useEffect, useRef, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

import { Html5QrcodeScanner } from 'html5-qrcode'
import { toast } from 'react-toastify'

import CustomIconButton from '@/@core/components/mui/IconButton'

type IProps = {
  baskets: Array<string>
  handleConfirm: (value: string[]) => void
}

const DialogScanConfirm = (props: IProps) => {
  const { handleConfirm, baskets } = props

  const scanRef = useRef(null)
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<Array<string>>([])

  const handleClose = () => {
    // @ts-ignore
    scanRef.current.clear()
    setOpen(false)
  }

  const handleOpen = () => setOpen(true)

  const handleOnFinish = () => {
    handleConfirm(value)
    // @ts-ignore
    scanRef.current.clear()
    setOpen(false)
  }

  const handleConfirmCode = useCallback(
    (code: string) => {
      if (baskets.some(item => item === code)) {
        toast.info(code)
        setValue(v => [...v, code])
      } else {
        toast.error(`Không tồn tại: ${code}`)
      }
    },
    [baskets]
  )

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner('reader', { qrbox: { width: 250, height: 250 }, fps: 5 }, true)

        // @ts-ignore
        scanRef.current = scanner

        scanner.render(
          result => {
            handleConfirmCode(result)
            scanner.pause()

            setTimeout(() => {
              scanner.resume()
            }, 2000)
          },
          error => {
            console.warn({ error })
          }
        )
      }, 100)
    }
  }, [open, handleConfirmCode])

  return (
    <>
      <section className='w-[38px] h-[38px]'>
        <CustomIconButton
          aria-haspopup='true'
          aria-label='capture screenshot'
          variant='contained'
          color='primary'
          onClick={handleOpen}
        >
          <i className='ri-printer-fill'></i>
        </CustomIconButton>
      </section>

      <Dialog open={open} fullWidth maxWidth='md' onClose={handleClose}>
        <DialogTitle>Scan Barcode & QRcode</DialogTitle>

        <DialogContent className='overflow-visible pbs-o sm:pli-16 sm:pbe-16'>
          <section id='reader'></section>
        </DialogContent>

        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='outlined' type='reset' color='secondary' onClick={handleClose}>
            Hủy
          </Button>

          <Button
            variant='contained'
            disabled={value.length === 0}
            color='primary'
            className='capitalize'
            onClick={handleOnFinish}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogScanConfirm
