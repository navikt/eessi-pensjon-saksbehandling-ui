import React, {JSX} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {BodyLong, Box, Heading, Label, VStack} from "@navikt/ds-react";
import classNames from "classnames";
import {Sed} from "src/declarations/buc";
import {AllowedLocaleString} from "src/declarations/app";
import {State} from "src/declarations/reducers";
import SEDStatus from "src/applications/BUC/components/SEDStatus/SEDStatus";
import {getBucTypeLabel} from "src/applications/BUC/components/BUCUtils/BUCUtils";
import styles from "./SEDDetails.module.css";

export interface SEDDetailsProps {
  sed: Sed
}

const SEDDetails: React.FC<SEDDetailsProps> = ({sed}: SEDDetailsProps): JSX.Element => {
  const {t} = useTranslation()
  const locale = useSelector<State, AllowedLocaleString>((state) => state.ui.locale)
  const sedLabel: string = getBucTypeLabel({t, type: sed.type, locale})

  return (
    <Box
      padding="space-16"
      borderWidth="1"
      borderRadius="4"
      borderColor="neutral"
      background="default"
      data-testid='a_c_SEDDetails'
    >
      <VStack gap="space-8">
        <Heading size='medium'>
          {sed.type + (sedLabel ? ' - ' + sedLabel : '')}
        </Heading>
        <dl className={classNames(styles.properties, styles.odd)}>
          <dt className={classNames(styles.odd, styles.Dt)}>
            <Label>
              {t('ui:sed-type')}:
            </Label>
          </dt>
          <dd
            className={classNames(styles.odd, styles.Dd)}
            data-testid='a_c_SEDDetails--type_id'
          >
            <BodyLong>
              {sed.type}
            </BodyLong>
          </dd>
          <dt className={styles.Dt}>
            <Label>
              {t('ui:status')}:
            </Label>
          </dt>
          <dd
            className={styles.Dd}
            data-testid='a_c_SEDDetails--status_id'
          >
            <SEDStatus status={sed.status}/>
          </dd>
        </dl>
      </VStack>
    </Box>
  );
}

export default SEDDetails
