import { setStatusParam } from 'src/actions/app'
import BUCFooter from 'src/applications/BUC/components/BUCFooter/BUCFooter'
import MonitorPNG from 'src/assets/images/artwork/dataskjerm.png'
import CupPNG from 'src/assets/images/artwork/kop.png'
import MousePNG from 'src/assets/images/artwork/NAVmusematte.png'
import MapPNG from 'src/assets/images/artwork/saksstatus.png'
import { State } from 'src/declarations/reducers'
import { RinaUrl } from 'src/declarations/app.d'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {Box, Button, HStack, TextField, VStack} from '@navikt/ds-react'
import styles from './BUCEmpty.module.css'

export interface BUCEmptySelector {
  rinaUrl: RinaUrl | undefined
}

const mapState = (state: State): BUCEmptySelector => ({
  rinaUrl: state.buc.rinaUrl
})

export interface BUCEmptyProps {
  aktoerId?: string | null
  sakId?: string | null
}

const BUCEmpty: React.FC<BUCEmptyProps> = ({
  aktoerId, sakId
}: BUCEmptyProps): JSX.Element => {
  const [_sakId, setSakId] = useState<string | null | undefined>(sakId)
  const [_aktoerId, setAktoerId] = useState<string | null | undefined>(aktoerId)
  const [validation, setValidation] = useState<string | undefined>(undefined)
  const dispatch = useDispatch()
  const { rinaUrl }: BUCEmptySelector = useSelector<State, BUCEmptySelector>(mapState)
  const { t } = useTranslation()

  const onAktoerIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidation(undefined)
    setAktoerId(e.target.value.trim())
  }

  const onSubmitAktoerId = (): void => {
    if (!_aktoerId || !_aktoerId.match(/^\d+$/)) {
      setValidation(t('message:validation-noAktoerId'))
    } else {
      dispatch(setStatusParam('aktoerId', _aktoerId))
    }
  }

  const onSakIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidation(undefined)
    setSakId(e.target.value.trim())
  }

  const onSubmitSakId = (): void => {
    if (!_sakId || !_sakId.match(/^\d+$/)) {
      setValidation(t('message:validation-noSakId'))
    } else {
      dispatch(setStatusParam('sakId', _sakId))
    }
  }

  return (
    <>
      <Box padding="8" borderWidth="1" borderRadius="medium" background="surface-subtle">
        <VStack align="center" justify="center">
          <VStack gap="4">
            <div className={styles.artwork}>
              <img alt='' className={styles.monitor} src={MonitorPNG} />
              <img alt='' className={styles.cup} src={CupPNG} />
              <img alt='' className={styles.mouse} src={MousePNG} />
              <img alt='' className={styles.map} src={MapPNG} />
            </div>
            {!aktoerId && (
              <HStack align="end">
                <Box paddingInline="0 4">
                  <TextField
                    data-testid='a-buc-p-bucempty--aktoerid-input-id'
                    error={validation || false}
                    id='a-buc-p-bucempty--aktoerid-input-id'
                    label={t('ui:aktoerId')}
                    onChange={onAktoerIdChange}
                    value={_aktoerId || ''}
                  />
                </Box>
                <Button
                  variant='primary'
                  data-testid='a-buc-p-bucempty--aktoerid-button-id'
                  onClick={onSubmitAktoerId}
                >
                  {t('ui:add')}
                </Button>

              </HStack>
            )}
            {!sakId && (
              <HStack align="end">
                <Box paddingInline="0 4">
                  <TextField
                    data-testid='a-buc-p-bucempty--sakid-input-id'
                    error={validation || false}
                    id='a-buc-p-bucempty--sakid-input-id'
                    label={t('buc:form-caseId')}
                    onChange={onSakIdChange}
                    value={_sakId || ''}
                  />
                </Box>
                <Button
                  variant='primary'
                  data-testid='a-buc-p-bucempty--sakid-button-id'
                  onClick={onSubmitSakId}
                >
                  {t('ui:add')}
                </Button>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Box>
      {rinaUrl && (<BUCFooter />)}
    </>
  )
}

export default BUCEmpty
