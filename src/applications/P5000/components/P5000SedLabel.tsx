import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons'
import Flag from '@navikt/flagg-ikoner'
import SEDStatus from 'src/applications/BUC/components/SEDStatus/SEDStatus'
import { getSedSender } from 'src/applications/P5000/utils/conversionUtils'
import {FlexCenterDiv, SeparatorSpan} from 'src/components/StyledComponents'
import { SedSender } from 'src/declarations/p5000'
import { useTranslation } from 'react-i18next'
import { Box } from "@navikt/ds-react";

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
            <Box paddingInline="1 0">
              <span>{sender?.countryLabel}</span>
              <SeparatorSpan>-</SeparatorSpan>
              <span>{sender?.institution}</span>
              <SeparatorSpan>-</SeparatorSpan>
              <SEDStatus
                status={sed.status}
              />
            </Box>
          </FlexCenterDiv>
          )
        : sed.id}
      {warning && (
        <Box paddingInline="2 0">
          <ExclamationmarkTriangleIcon  fontSize="1.5rem" />
        </Box>
      )}
    </FlexCenterDiv>
  )
}

export default P5000SedLabel
