import { Popover } from '@navikt/ds-react'
import React, { useState } from 'react'
import { v4 } from 'uuid'
import styles from './PopoverCustomized.module.css'

export interface PopoverCustomizedProps {
  disabled ?: boolean
  label: JSX.Element | string
  children?: React.ReactNode
  placement ?:
    | "top"
    | "bottom"
    | "right"
    | "left"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "right-start"
    | "right-end"
    | "left-start"
    | "left-end";
}

const PopoverCustomized: React.FC<PopoverCustomizedProps> = ({
 disabled = false,
 label,
 /**
  * Orientation for popover
  * @note Try to keep general usage to "top", "bottom", "left", "right"
  * @default "right"
  */
 placement = 'right',
 children
}: PopoverCustomizedProps) => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const [id] = useState<string>(() => v4())

  return (
    <>
      {!disabled && (
        <Popover
          placement={placement}
          anchorEl={document.getElementById(id)}
          onClose={() => setPopoverOpen(false)}
          open={popoverOpen}
        >
          <div className={styles.popoverLabel}>
            {label}
          </div>
        </Popover>
      )}
      <div
        className={styles.contentDiv}
        id={id}
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

export default PopoverCustomized
