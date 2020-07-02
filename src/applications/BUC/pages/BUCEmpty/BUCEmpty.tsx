import { setStatusParam } from 'actions/app'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import MonitorPNG from 'assets/images/artwork/dataskjerm.png'
import CupPNG from 'assets/images/artwork/kop.png'
import MousePNG from 'assets/images/artwork/NAVmusematte.png'
import MapPNG from 'assets/images/artwork/saksstatus.png'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { RinaUrl } from 'declarations/types'
import { standardLogger } from 'metrics/loggers'
import { Hovedknapp } from 'nav-frontend-knapper'
import Lenke from 'nav-frontend-lenker'
import { Input } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

export interface BUCEmptySelector {
  rinaUrl: RinaUrl | undefined
  highContrast: boolean
}

const mapState = (state: State): BUCEmptySelector => ({
  highContrast: state.ui.highContrast,
  rinaUrl: state.buc.rinaUrl
})

export interface BUCEmptyProps {
  aktoerId?: string;
  onBUCNew: () => void;
  sakId?: string;
}

const BUCEmptyDiv = styled.div`
  display: flex;
  border: 1px solid ${({ theme }: any) => theme['main-font-color']};
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  background-color: ${({ theme }: any) => theme['main-background-color']};
`
const BUCEmptyArtwork = styled.div`
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
    margin-bottom: 0px !important
  }
`

const BUCEmpty: React.FC<BUCEmptyProps> = ({
  aktoerId, onBUCNew, sakId
}: BUCEmptyProps): JSX.Element => {
  const [_sakId, setSakId] = useState<string | undefined>(sakId)
  const [_aktoerId, setAktoerId] = useState<string | undefined>(aktoerId)
  const [validation, setValidation] = useState<string | undefined>(undefined)
  const dispatch = useDispatch()
  const { highContrast, rinaUrl }: BUCEmptySelector = useSelector<State, BUCEmptySelector>(mapState)
  const { t } = useTranslation()

  useEffect(() => {
    standardLogger('buc.empty.entrance')
  }, [])

  const onAktoerIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidation(undefined)
    setAktoerId(e.target.value.trim())
  }

  const onSubmitAktoerId = (): void => {
    if (!_aktoerId || !_aktoerId.match(/^\d+$/)) {
      setValidation(t('buc:validation-noAktoerId'))
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
      setValidation(t('buc:validation-noSakId'))
    } else {
      dispatch(setStatusParam('sakId', _sakId))
    }
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <BUCEmptyDiv>
        <BUCEmptyArtwork>
          <img alt='' className='monitor' src={MonitorPNG} />
          <img alt='' className='cup' src={CupPNG} />
          <img alt='' className='mouse' src={MousePNG} />
          <img alt='' className='map' src={MapPNG} />
        </BUCEmptyArtwork>
        <VerticalSeparatorDiv />
        <Undertittel>
          <Lenke
            data-tedtIid='a-buc-p-bucempty__newbuc-link-id'
            href='#'
            onClick={onBUCNew}
          >
            {t('buc:form-empty-startANewCase')}
          </Lenke>
        </Undertittel>
        <VerticalSeparatorDiv />
        {!aktoerId && (
          <BUCEmptyForm>
            <Input
              data-testId='a-buc-p-bucempty__aktoerid-input-id'
              label={t('ui:aktoerId')}
              value={_aktoerId || ''}
              bredde='fullbredde'
              onChange={onAktoerIdChange}
              feil={validation || false}
            />
            <HorizontalSeparatorDiv />
            <Hovedknapp
              data-testId='a-buc-p-bucempty__aktoerid-button-id'
              onClick={onSubmitAktoerId}
            >
              {t('ui:add')}
            </Hovedknapp>
          </BUCEmptyForm>
        )}
        {!sakId && (
          <BUCEmptyForm>
            <Input
              data-testId='a-buc-p-bucempty__sakid-input-id'
              label={t('buc:form-caseId')}
              value={_sakId || ''}
              bredde='fullbredde'
              onChange={onSakIdChange}
              feil={validation || false}
            />
            <HorizontalSeparatorDiv />
            <Hovedknapp
              data-testId='a-buc-p-bucempty__sakid-button-id'
              onClick={onSubmitSakId}
            >
              {t('ui:add')}
            </Hovedknapp>
          </BUCEmptyForm>
        )}
      </BUCEmptyDiv>
      {rinaUrl && (<BUCFooter />)}
    </ThemeProvider>
  )
}

BUCEmpty.propTypes = {
  aktoerId: PT.string,
  onBUCNew: PT.func.isRequired,
  sakId: PT.string
}

export default BUCEmpty
