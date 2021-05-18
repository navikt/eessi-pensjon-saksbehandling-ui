import { Normaltekst, Sidetittel } from 'nav-frontend-typografi'
import { HighContrastPanel, HighContrastHovedknapp } from 'nav-hoykontrast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

const Doc = () => {

  let params: any = useParams()
  const { t } = useTranslation()
  return (
    <HighContrastPanel>
      <Sidetittel>
        {params?.id1} {params?.id2}
      </Sidetittel>
      <Normaltekst>
        Dokument 1
      </Normaltekst>
      <Normaltekst>
        Dokument 2
      </Normaltekst>
      <Normaltekst>
        Dokument 3
      </Normaltekst>

      <HighContrastHovedknapp>
        {t('doc:utgår')}
      </HighContrastHovedknapp>
    </HighContrastPanel>

  )

}

export default Doc
