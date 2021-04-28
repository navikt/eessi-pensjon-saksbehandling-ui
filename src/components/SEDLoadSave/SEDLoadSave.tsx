import { ytelsestypeOptions } from 'applications/BUC/components/SEDP5000/SEDP5000Edit'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { Etikett, FlexBaseDiv, PileDiv } from 'components/StyledComponents'
import { LocalStorageEntry, LocalStorageValue, P5000EditLocalStorageContent } from 'declarations/app'
import { Participant, Seds } from 'declarations/buc'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import moment from 'moment'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastFlatknapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OptionTypeBase } from 'react-select'
import styled from 'styled-components'

interface SEDLoadSaveProps {
  caseId: string
  highContrast: boolean
  onLoad: (content: any) => void
  p5000Storage: LocalStorageEntry<P5000EditLocalStorageContent>
  setP5000Storage: (it: LocalStorageEntry<P5000EditLocalStorageContent>) => void
  seds: Seds | null | undefined
}

const FlexDiv = styled.div`
  display: flex;
  align-items: baseline;
`
const SeparatorSpan = styled.span`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
`

interface SedSender {
  date: string
  country: string
  countryLabel: string
  institution: string
  acronym: string
}

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  caseId,
  highContrast,
  onLoad,
  p5000Storage,
  seds,
  setP5000Storage
}: SEDLoadSaveProps) => {
  const [_confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const { t } = useTranslation()

  const onRemove = (caseId: string, sedId: string) => {
    let newP5000Storage = _.cloneDeep(p5000Storage)
    if (!_.isNil(newP5000Storage)) {
      let newValue = _.cloneDeep(p5000Storage[caseId])
      newValue = _.filter(newValue, n => n.id !== sedId)
      if (_.isEmpty(newValue)) {
        delete newP5000Storage[caseId]
      } else {
        newP5000Storage[caseId] = newValue
      }
      setP5000Storage(newP5000Storage)
    }
  }

  const getSedSender = (sedId: string): SedSender | undefined => {
    const sed = _.find(seds, { id: sedId })
    if (!sed) {
      return undefined
    }
    const sender: Participant | undefined = sed.participants?.find((participant: Participant) => participant.role === 'Sender')
    if (sender) {
      return {
        date: moment(sed.lastUpdate).format('DD.MM.YYYY'),
        countryLabel: CountryData.getCountryInstance('nb').findByValue(sender.organisation.countryCode).label,
        country: sender.organisation.countryCode,
        institution: sender.organisation.name,
        acronym: sender.organisation.acronym || '-'
      }
    }
    return undefined
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <PileDiv>
        {!_.isEmpty(p5000Storage[caseId]) && (
          <Normaltekst>
            {t('buc:p5000-saved-entries')}
          </Normaltekst>
        )}
        <VerticalSeparatorDiv />
        {p5000Storage && p5000Storage[caseId] && (
          <>
          <Etikett style={{ padding: '0.5rem' }}>
            {p5000Storage[caseId]?.map((sed: LocalStorageValue<P5000EditLocalStorageContent> ) => {

              const sender: SedSender | undefined = getSedSender(sed.id)
              return (
                <PileDiv key={sed.id}>
                  <PileDiv>
                    <FlexDiv>
                      <UndertekstBold>
                        {t('ui:id') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv data-size='0.5' />
                      <Normaltekst>
                        {sender ? (
                          <>
                            <span>{sender?.date}</span>
                            <SeparatorSpan>-</SeparatorSpan>
                            <span>{sender?.countryLabel}</span>
                            <SeparatorSpan>-</SeparatorSpan>
                            <span>{sender?.acronym}</span>
                          </>
                        ) : (
                          <Normaltekst>
                            {sed.id}
                          </Normaltekst>
                        )}
                      </Normaltekst>
                    </FlexDiv>
                    <FlexDiv>
                      <UndertekstBold>
                        {t('buc:p5000-4-1-title') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv data-size='0.5' />
                      <Normaltekst>
                        {(sed.content as P5000EditLocalStorageContent)
                          .ytelseOption ?
                          _.find(ytelsestypeOptions, (o: OptionTypeBase) => (
                            o?.value === (sed.content as P5000EditLocalStorageContent)?.ytelseOption
                          ))?.label : '-'}
                      </Normaltekst>
                    </FlexDiv>
                    <FlexDiv>
                      <UndertekstBold>
                        {t('ui:date') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv data-size='0.5' />
                      <Normaltekst>
                        {sed.date}
                      </Normaltekst>
                    </FlexDiv>
                  </PileDiv>
                  <VerticalSeparatorDiv data-size='0.5' />
                  <FlexBaseDiv>
                    <HighContrastFlatknapp
                      mini
                      kompakt
                      onClick={() => onLoad(sed)}
                    >
                      {t('ui:load')}
                    </HighContrastFlatknapp>
                    <AddRemovePanel
                      existingItem
                      candidateForDeletion={_confirmDelete}
                      onBeginRemove={() => setConfirmDelete(true)}
                      onConfirmRemove={() => onRemove(caseId, sed.id)}
                      onCancelRemove={() => setConfirmDelete(false)}
                    />
                  </FlexBaseDiv>
                </PileDiv>
              )}
            )}
          </Etikett>
          <VerticalSeparatorDiv />
          </>
        )}
      </PileDiv>
    </NavHighContrast>
  )
}

export default SEDLoadSave
