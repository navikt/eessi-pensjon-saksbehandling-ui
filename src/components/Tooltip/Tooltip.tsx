import { Popover } from "@navikt/ds-react"
import { useState } from 'react'
import { v4 } from 'uuid'

export interface TooltipProps {
  label: any
  children: any
}

const Tooltip: React.FC<TooltipProps> = ({
  label,
  children
}: TooltipProps) => {

  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const [id,] = useState<string>(() => v4())

  return (
    <>
      <Popover
        anchorEl={document.getElementById(id)}
        onClose={() => setPopoverOpen(false)}
        open={popoverOpen}
      >
        <div style={{margin: '0.3rem'}}>
          {label}
        </div>
      </Popover>
      <div
        id={id}
        style={{display: 'inline-block'}}
        onFocus={() => setPopoverOpen(true)}
        onBlur={() => setPopoverOpen(false)}
        onMouseOver={() => setPopoverOpen(true)}
        onMouseOut={() => setPopoverOpen(false)}
      >
        {children}
      </div>
    </>
  )
}

export default Tooltip
