import type { ReactNode } from 'react'

import Typography from '@mui/material/Typography'

export function ColumnTextLine({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        lineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}
    >
      {children}
    </Typography>
  )
}
