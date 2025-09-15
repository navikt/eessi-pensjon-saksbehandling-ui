import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons'
import Flag from '@navikt/flagg-ikoner'
import SEDStatus from 'src/applications/BUC/components/SEDStatus/SEDStatus'
import { getSedSender } from 'src/applications/P5000/utils/conversionUtils'
import { SedSender } from 'src/declarations/p5000'
import { useTranslation } from 'react-i18next'
import {Box, HStack} from "@navikt/ds-react";
import styles from "./P5000SedLabel.module.css";

const P5000SedLabel = ({
  sed,
  warning
}: any) => {
  const { t } = useTranslation()
  const sender: SedSender | undefined = getSedSender(sed)
  return (
    <HStack
      align="center"
      style={{ flexWrap: 'wrap' }}
    >
      <span>
        {t('buc:form-dateP5000', { date: sender?.date })}
      </span>
      <span className={styles.separator}>-</span>
      {sender
        ? (
          <HStack
            align="center"
          >
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
              <span className={styles.separator}>-</span>
              <span>{sender?.institution}</span>
              <span className={styles.separator}>-</span>
              <SEDStatus
                status={sed.status}
              />
            </Box>
          </HStack>
          )
        : sed.id}
      {warning && (
        <Box paddingInline="2 0">
          <ExclamationmarkTriangleIcon  fontSize="1.5rem" />
        </Box>
      )}
    </HStack>
  )
}

export default P5000SedLabel
