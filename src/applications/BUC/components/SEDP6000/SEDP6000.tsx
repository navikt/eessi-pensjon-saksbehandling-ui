import { getSedP6000PDF, resetSedP6000PDF } from 'actions/buc'
import classNames from 'classnames'
import Modal from 'components/Modal/Modal'
import { AllowedLocaleString } from 'declarations/app'
import { P6000 } from 'declarations/buc'
import { JoarkPreview } from 'declarations/joark'
import { State } from 'declarations/reducers'
import Flag from 'flagg-ikoner'
import File from 'forhandsvisningsfil'
import CountryData, { Country } from 'land-verktoy'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Feilmelding } from 'nav-frontend-typografi'
import {
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  HighContrastCheckbox,
  HighContrastFlatknapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface SEDP6000Props {
  feil: FeiloppsummeringFeil | undefined
  highContrast: boolean
  locale: AllowedLocaleString
  p6000s: Array<P6000>
  onChanged: (p6000s: Array<P6000>) => void
}

export interface SEDP6000Selector {
  gettingP6000PDF: boolean
  P6000PDF: JoarkPreview | null | undefined
}

const mapState = (state: State): SEDP6000Selector => ({
  gettingP6000PDF: state.loading.gettingP6000PDF,
  P6000PDF: state.buc.p6000PDF
})

const SEDP6000: React.FC<SEDP6000Props> = ({
  feil, highContrast, locale, onChanged, p6000s
}: SEDP6000Props): JSX.Element => {
  const dispatch = useDispatch()
  const countryData = CountryData.getCountryInstance(locale)
  const { gettingP6000PDF, P6000PDF }: SEDP6000Selector = useSelector<State, SEDP6000Selector>(mapState)
  const { t } = useTranslation()
  const [chosenP6000s, setChosenP6000s] = useState<Array<P6000>>([])

  const changeChosenP6000 = (p6000: P6000, checked: boolean) => {
    let newChosenP6000s = _.cloneDeep(chosenP6000s)
    if (checked) {
      newChosenP6000s = newChosenP6000s.concat(p6000)
    } else {
      newChosenP6000s = _.filter(newChosenP6000s, _p6000 => _p6000.documentID !== p6000.documentID)
    }
    setChosenP6000s(newChosenP6000s)
    onChanged(newChosenP6000s)
  }

  const handlePreview = (bucId: string, docId: string) => {
    dispatch(getSedP6000PDF(bucId, docId))
  }

  const handleResetP6000 = () => {
    dispatch(resetSedP6000PDF())
  }

  return (
    <div id='a-buc-c-sedstart__p6000s-id'>
      <Modal
        open={!_.isNil(P6000PDF)}
        onModalClose={handleResetP6000}
        highContrast={highContrast}
        modal={{
          closeButton: true,
          modalContent: (
            <div style={{ cursor: 'pointer' }}>
              <File
                scale={2}
                file={{
                  size: P6000PDF?.filInnhold?.length ?? 0,
                  name: P6000PDF?.fileName ?? '',
                  mimetype: 'application/pdf',
                  content: {
                    base64: P6000PDF?.filInnhold
                  }
                }}
                width={1000}
                tema='simple'
                viewOnePage={false}
                onContentClick={handleResetP6000}
              />
            </div>
          )
        }}
      />
      {p6000s.map(p6000 => {
        const country: Country = countryData.findByValue(p6000.fraLand)
        return (
          <div className='a-buc-c-sedstart__p6000' key={p6000.documentID}>
            <HighContrastPanel border className={classNames({ 'skjemaelement__input--harFeil': !!feil })}>
              <FlexCenterSpacedDiv>
                <FlexCenterDiv>
                  <Flag animate={false} wave={false} type='circle' country={p6000.fraLand} label={country.label ?? p6000.fraLand} />
                  <HorizontalSeparatorDiv />
                  <PileDiv>
                    <span>{t('ui:type')}: {p6000.type}</span>
                    <span>{t('ui:version')}: {p6000.sisteVersjon}</span>
                  </PileDiv>
                </FlexCenterDiv>
                <FlexCenterDiv>
                  <HighContrastFlatknapp
                    data-test-id={'a-buc-c-sedstart__p6000-preview-' + p6000.documentID}
                    onClick={() => handlePreview(p6000.bucid, p6000.documentID)}
                    spinner={gettingP6000PDF}
                    disabled={gettingP6000PDF}
                  >
                    {gettingP6000PDF ? t('ui:loading') : t('ui:preview')}
                  </HighContrastFlatknapp>
                  <HorizontalSeparatorDiv />
                  <HighContrastCheckbox
                    checked={_.find(chosenP6000s, _p6000 => _p6000.documentID === p6000.documentID) !== undefined}
                    key={p6000.documentID}
                    id={'a-buc-c-sedstart__p6000-checkbox-' + p6000.documentID}
                    data-test-id={'a-buc-c-sedstart__p6000-checkbox-' + p6000.documentID}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeChosenP6000(p6000, e.target.checked)}
                    label={t('ui:choose')}
                  />
                </FlexCenterDiv>
              </FlexCenterSpacedDiv>
            </HighContrastPanel>
            <VerticalSeparatorDiv />
          </div>
        )
      }
      )}
      {feil && (
        <div role='alert' aria-live='assertive' className='feilmelding skjemaelement__feilmelding'>
          <Feilmelding>{feil.feilmelding}</Feilmelding>
        </div>
      )}
    </div>
  )
}

export default SEDP6000
