import classNames from 'classnames'
import _ from 'lodash'
import { guid } from 'nav-frontend-js-utils'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Collapse, UnmountClosed } from 'react-collapse'
import './ExpandingPanel.css'

export interface ExpandingPanelProps {
  ariaTittel?: string
  border?: boolean
  children : JSX.Element
  className ?: string
  collapseProps?: any
  heading?: JSX.Element | string
  id?: string
  onClick?: (e: React.MouseEvent) => void
  open?: boolean
  renderContentWhenClosed?: boolean
  style?: React.CSSProperties
}

const ExpandingPanel: React.FC<ExpandingPanelProps> = ({
  ariaTittel, border = false, children, className, collapseProps, heading, id,
  onClick, open = false, renderContentWhenClosed, style = {}
}: ExpandingPanelProps): JSX.Element => {
  const [_open, setOpen] = useState<boolean>(open)
  const [isCloseAnimation, setIsCloseAnimation] = useState<boolean>(false)
  const contentId: string = (collapseProps && collapseProps.id) || guid()

  useEffect(() => {
    if (!open && _open) {
      setIsCloseAnimation(true)
    }
  }, [open, _open])

  const handleOnClick = (e: React.MouseEvent): void => {
    setOpen(!_open)
    if (_.isFunction(onClick)) {
      onClick(e)
    }
  }

  const onRestProxy = (): void => {
    setIsCloseAnimation(false)
    if (collapseProps && collapseProps.onRest) {
      collapseProps.onRest()
    }
  }

  const tabHandler = (e: React.KeyboardEvent) => {
    const { keyCode } = e
    const isTab = keyCode === 9

    if (isTab && isCloseAnimation) {
      e.preventDefault()
    }
  }

  const showContentId: boolean = !(!renderContentWhenClosed && !_open)
  const ariaControls: {[k: string]: string} | undefined = showContentId ? { 'aria-controls': contentId } : undefined
  const CollapseComponent: any = renderContentWhenClosed ? Collapse : UnmountClosed

  return (
    <div
      id={id}
      style={style} className={classNames('c-expandingpanel', 'ekspanderbartPanel', className, {
        'ekspanderbartPanel--lukket': !_open,
        'ekspanderbartPanel--apen': _open,
        'ekspanderbartPanel--border': border
      })}
    >
      <div
        className='ekspanderbartPanel__hode'
        onClick={handleOnClick}
        aria-expanded={_open}
        {...ariaControls}
      >
        <div className='ekspanderbartPanel__flex-wrapper'>
          {heading}
          <button
            className='ekspanderbartPanel__knapp'
            onKeyDown={tabHandler}
            onClick={onClick}
            aria-expanded={_open}
            type='button'
            aria-label='open'
          >
            <span className='ekspanderbartPanel__indikator' />
          </button>
        </div>
      </div>
      <CollapseComponent
        id={contentId}
        isOpened={_open}
        onRest={onRestProxy}
        {...collapseProps}
      >
        <article aria-label={ariaTittel} className='ekspanderbartPanel__innhold'>
          {children}
        </article>
      </CollapseComponent>
    </div>
  )
}

ExpandingPanel.propTypes = {
  ariaTittel: PT.string,
  border: PT.bool,
  className: PT.string,
  collapseProps: PT.object,
  heading: PT.oneOfType([PT.string, PT.element]),
  onClick: PT.func,
  open: PT.bool,
  renderContentWhenClosed: PT.bool,
  style: PT.object
}

export default ExpandingPanel
