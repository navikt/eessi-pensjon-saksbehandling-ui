import {JSX} from 'react'
import { getSedP6000PDF, resetSedP6000PDF } from 'src/actions/buc'
import classNames from 'classnames'
import Modal from 'src/components/Modal/Modal'
import { AllowedLocaleString, ErrorElement } from 'src/declarations/app'
import { P6000 } from 'src/declarations/buc'
import { JoarkPreview } from 'src/declarations/joark'
import { State } from 'src/declarations/reducers'
import Flag from '@navikt/flagg-ikoner'
//import File from '@navikt/forhandsvisningsfil'
import CountryData, { Country } from '@navikt/land-verktoy'
import _ from 'lodash'
import {Checkbox, Button, Loader, Box, HStack, Spacer, VStack} from '@navikt/ds-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import PDFViewer from "src/components/PDFViewer/PDFViewer";

export interface SEDP6000Props {
  feil: ErrorElement | undefined
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
  feil, locale, onChanged, p6000s
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
    <div id='a_buc_c_sedstart--p6000s-id'>
      <Modal
        open={!_.isNil(P6000PDF)}
        onModalClose={handleResetP6000}
        modal={{
          modalContent: (
            <div style={{ cursor: 'pointer' }}>
              <PDFViewer
                file={P6000PDF?.filInnhold}
                name={P6000PDF?.fileName ?? ''}
                size={P6000PDF?.filInnhold?.length ?? 0}
                width={1000}
              />
            </div>
          )
        }}
      />
      <VStack gap="4">
        {p6000s.map(p6000 => {
          const country: Country = countryData.findByValue(p6000.fraLand)
          return (
            <div className='a_buc_c_sedstart--p6000' key={p6000.documentID}>
              <Box padding="4" borderWidth="1" borderColor="border-default" className={classNames({ 'skjemaelement--input--harFeil': !!feil })}>
                <HStack gap="4">
                  <Flag animate={false} wave={false} type='circle' country={p6000.fraLand} label={country.label ?? p6000.fraLand} />
                  <VStack>
                    <span>{t('ui:type')}: {p6000.type}</span>
                    <span>{t('ui:version')}: {p6000.sisteVersjon}</span>
                  </VStack>
                  <Spacer/>
                  <Button
                    variant='tertiary'
                    data-testid={'a_buc_c_sedstart--p6000-preview-' + p6000.documentID}
                    onClick={() => handlePreview(p6000.bucid, p6000.documentID)}
                    disabled={gettingP6000PDF}
                  >
                    {gettingP6000PDF && (
                      <>
                        <Loader />
                      </>
                    )}
                    {gettingP6000PDF ? t('ui:loading') : t('ui:preview')}
                  </Button>
                  <Checkbox
                    checked={_.find(chosenP6000s, _p6000 => _p6000.documentID === p6000.documentID) !== undefined}
                    key={p6000.documentID}
                    id={'a_buc_c_sedstart--p6000-checkbox-' + p6000.documentID}
                    data-testid={'a_buc_c_sedstart--p6000-checkbox-' + p6000.documentID}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeChosenP6000(p6000, e.target.checked)}

                  >{t('ui:choose')}
                  </Checkbox>
                </HStack>
              </Box>
            </div>
          )
        }
        )}
      </VStack>

      {feil && (
        <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
          {feil.feilmelding}
        </div>
      )}
    </div>
  )
}

export default SEDP6000
