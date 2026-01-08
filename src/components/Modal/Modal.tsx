// @ts-nocheck
import classNames from 'classnames'
import {Button, Modal, Heading, HStack} from '@navikt/ds-react'
import { ModalContent } from 'src/declarations/components'
import _ from 'lodash'
import React, {JSX} from 'react'

import styles from './Modal.module.css'

export interface ModalProps {
  appElementId?: string
  className?: string
  icon?: JSX.Element | undefined
  onModalClose?: () => void
  onBeforeClose?: () => boolean
  open: boolean,
  header?: string
  modal: ModalContent | undefined
  width?: string | undefined
}

const ModalFC: React.FC<ModalProps> = ({
  className,
  icon = undefined,
  onModalClose = () => {},
  onBeforeClose = () => true,
  open,
  header,
  modal,
  width
}: ModalProps): JSX.Element => {

  return (
    <Modal
      className={className}
      open={open}
      onClose={onModalClose}
      onBeforeClose={onBeforeClose}
      header={{ heading: header ? header : "" }}
      portal={true}
      width={width}
    >
      <Modal.Body>
        {icon && (
          <div className={styles.iconDiv}>{icon}</div>
        )}
        <div className={classNames(styles.contentDiv, { icon: !!icon })}>
          {modal?.modalTitle && (
            <Heading size='medium' data-testid='modal--title-id'>
              {modal?.modalTitle}
            </Heading>
          )}
          {modal?.modalContent || (
            <div
              className={styles.modalText}
              data-testid='modal--text-id'
            >
              {modal?.modalText}
            </div>
          )}
        </div>
        {modal?.modalButtons && (
          <HStack
            justify="center"
            className={classNames('buttons')}
          >
            {modal?.modalButtons.map((button, i) => {
              let variant: 'tertiary' | 'primary' | 'secondary' | 'danger' | undefined = 'secondary'
              if (button.main) {
                variant = 'primary'
              }
              if (button.flat) {
                variant = 'tertiary'
              }
              const handleClick = _.isFunction(button.onClick)
                ? () => {
                  button.onClick!()
                  // onModalClose()
                  }
                : onModalClose

              return (
                <div
                  key={i}
                  className={styles.buttonMargin}
                >
                  <Button
                    variant={variant}
                    data-testid={'modal--button-id-' + i}
                    disabled={button.disabled || false}
                    id={'modal--button-id-' + i}
                    onClick={handleClick}
                  >
                    {button.text}
                  </Button>
                </div>
              )
            })}
          </HStack>
        )}
      </Modal.Body>
    </Modal>

  )
}

export default ModalFC
