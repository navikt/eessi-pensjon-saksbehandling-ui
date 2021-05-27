import Alert from 'components/Alert/Alert'
import Modal from 'components/Modal/Modal'
import _ from 'lodash'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const MyAlert = styled(Alert)`
  position: relative !important;
`
const P5000SendModal = ({
  caseId, highContrast, onClose, sentP5000info
}: any) => {
  const {t} = useTranslation()
  return (
    <Modal
      highContrast={highContrast}
      modal={{
        closeButton: true,
        modalContent: (
          <div style={{maxWidth: '500px'}}>
            <VerticalSeparatorDiv size='2'/>
            {sentP5000info === null &&
            <MyAlert type='client' status='WARNING' message={t('buc:warning-failedP5000Sending')}/>}
            {!_.isNil(sentP5000info) && (
              <MyAlert type='client' status='OK' message={t('buc:warning-okP5000Sending', {caseId: caseId})}/>
              )}
            <VerticalSeparatorDiv/>
          </div>
        ),
        modalButtons: [{
          main: true,
          text: 'OK',
          onClick: onClose
        }]
      }}
    />
  )
}

export default P5000SendModal
