import React, { useState } from 'react'
import PT from 'prop-types'
import Veilederpanel from 'nav-frontend-veilederpanel'
import Icons from '../Icons/Icons'
import EESSIPensjonVeileder, { Mood } from './EESSIPensjonVeileder'
import classNames from 'classnames'
import './EESSIPensjonVeileder.css'

export interface EESSIPensjonVeilederPanelProps {
  children?: JSX.Element | JSX.Element[];
  className ?: string;
  closeButton?: boolean;
  mood?: Mood;
}

const EESSIPensjonVeilederPanel: React.FC<EESSIPensjonVeilederPanelProps> = ({
  children, className, closeButton = false, mood
}: EESSIPensjonVeilederPanelProps): JSX.Element | null => {
  const [hidden, setHidden] = useState(false)

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setHidden(true)
  }

  if (hidden) {
    return null
  }

  return (
    <div className={classNames('c-EESSIPensjonVeilederPanel', className)}>
      <Veilederpanel type='normal' svg={<EESSIPensjonVeileder mood={mood} />} kompakt>
        {children}
        {closeButton ? (
          <div className='closeButton'>
            <a
              href='#close' onClick={handleClose}
              style={{ position: 'absolute', top: '5px', right: '5px' }}
            >
              <Icons kind='nav-close' />
            </a>
          </div>
        ) : null}
      </Veilederpanel>
    </div>
  )
}

EESSIPensjonVeilederPanel.propTypes = {
  children: PT.element.isRequired,
  className: PT.string,
  closeButton: PT.bool,
  mood: PT.oneOf(['smilende', 'trist'])
}

export default EESSIPensjonVeilederPanel
