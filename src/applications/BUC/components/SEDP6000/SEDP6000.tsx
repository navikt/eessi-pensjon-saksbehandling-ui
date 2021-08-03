import ExternalLink from 'assets/icons/line-version-logout'
import { AllowedLocaleString } from 'declarations/app'
import { P6000 } from 'declarations/buc'
import Flag from 'flagg-ikoner'
import CountryData, { Country } from 'land-verktoy'
import _ from 'lodash'
import {
  FlexCenterDiv, FlexCenterSpacedDiv, HighContrastCheckbox, HighContrastLink, HighContrastPanel,
  HorizontalSeparatorDiv, PileDiv, theme, Theme, themeHighContrast, themeKeys, VerticalSeparatorDiv
} from 'nav-hoykontrast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SEDP6000Props {
  highContrast: boolean
  locale: AllowedLocaleString
  p6000s: Array<P6000>
  onChanged: (p6000s: Array<P6000>) => void
}

const SEDP6000: React.FC<SEDP6000Props> = ({
  highContrast, locale, onChanged, p6000s
}: SEDP6000Props): JSX.Element => {
  const countryData = CountryData.getCountryInstance(locale)
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
  const _theme: Theme = highContrast ? themeHighContrast : theme
  const linkColor: string = _theme[themeKeys.MAIN_INTERACTIVE_COLOR]
  return (
    <div>
      {p6000s.map(p6000 => {
        const country: Country = countryData.findByValue(p6000.fraLand)
        return (
          <div key={p6000.documentID}>
            <HighContrastPanel border>
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
                  <HighContrastLink
                    href={p6000.pdfUrl}
                    target='rinaWindow'
                  >
                    {t('ui:preview')}
                    <HorizontalSeparatorDiv size='0.5' />
                    <ExternalLink color={linkColor} />
                  </HighContrastLink>
                  <HorizontalSeparatorDiv />
                  <HighContrastCheckbox
                    checked={_.find(chosenP6000s, _p6000 => _p6000.documentID === p6000.documentID) !== undefined}
                    key={p6000.documentID}
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
    </div>
  )
}

export default SEDP6000
