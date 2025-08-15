import { setStatusParam } from 'src/actions/app'
import BUCFooter from 'src/applications/BUC/components/BUCFooter/BUCFooter'
import MonitorPNG from 'src/assets/images/artwork/dataskjerm.png'
import CupPNG from 'src/assets/images/artwork/kop.png'
import MousePNG from 'src/assets/images/artwork/NAVmusematte.png'
import MapPNG from 'src/assets/images/artwork/saksstatus.png'
import { State } from 'src/declarations/reducers'
import { RinaUrl } from 'src/declarations/app.d'
import PT from 'prop-types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import {Box, Button, TextField, VStack} from '@navikt/ds-react'

export const BUCEmptyDiv = styled.div`
  display: flex;
  border-color: var(--a-border-strong);
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  background-color: var(--a-surface-subtle);
`
export const BUCEmptyArtwork = styled.div`
  position: relative;
  height: 300px;
  width: 250px;
  .monitor {
    width: 250px;
    height: 200px;
  }
  .cup {
    width: 33px;
    height: 30px;
    top: 170px;
    left: 255px;
  }
  .mouse {
    width: 60px;
    height: 80px;
    left: 190px;
    top: 180px;
  }
  .map {
    width: 70px;
    height: 100px;
    top: 20px;
    left: 90px;
  }
  img {
    position: absolute;
  }
`
const BUCEmptyForm = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  .skjemaelement {
    margin-bottom: 0 !important
  }
`

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
      <BUCEmptyDiv>
        <VStack gap="4">
          <BUCEmptyArtwork>
            <img alt='' className='monitor' src={MonitorPNG} />
            <img alt='' className='cup' src={CupPNG} />
            <img alt='' className='mouse' src={MousePNG} />
            <img alt='' className='map' src={MapPNG} />
          </BUCEmptyArtwork>
          {!aktoerId && (
            <BUCEmptyForm>
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

            </BUCEmptyForm>
          )}
          {!sakId && (
            <BUCEmptyForm>
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
            </BUCEmptyForm>
          )}
        </VStack>
      </BUCEmptyDiv>
      {rinaUrl && (<BUCFooter />)}
    </>
  )
}

BUCEmpty.propTypes = {
  aktoerId: PT.string,
  sakId: PT.string
}

export default BUCEmpty
