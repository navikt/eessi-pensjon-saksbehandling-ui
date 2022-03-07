import { Warning } from '@navikt/ds-icons'
import Flag from '@navikt/flagg-ikoner'
import { FlexCenterDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import { getSedSender } from 'applications/P5000/utils/conversionUtils'
import { SeparatorSpan } from 'components/StyledComponents'
import { SedSender } from 'declarations/p5000'
import { useTranslation } from 'react-i18next'

const P5000SedLabel = ({
  sed,
  warning
}: any) => {
  const { t } = useTranslation()
  const sender: SedSender | undefined = getSedSender(sed)
  return (
    <FlexCenterDiv style={{ flexWrap: 'wrap' }}>
      <span>
        {t('buc:form-dateP5000', { date: sender?.date })}
      </span>
      <SeparatorSpan>-</SeparatorSpan>
      {sender
        ? (
          <FlexCenterDiv>
            <Flag
              animate
              country={sender?.country}
              label={sender?.countryLabel}
              size='XS'
              type='circle'
              wave={false}
            />
            <HorizontalSeparatorDiv size='0.2' />
            <span>{sender?.countryLabel}</span>
            <SeparatorSpan>-</SeparatorSpan>
            <span>{sender?.institution}</span>
            <SeparatorSpan>-</SeparatorSpan>
            <SEDStatus
              status={sed.status}
            />
          </FlexCenterDiv>
          )
        : sed.id}
      {warning && (
        <>
          <HorizontalSeparatorDiv size='0.5' />
          <Warning />
        </>
      )}
    </FlexCenterDiv>
  )
}

export default P5000SedLabel
