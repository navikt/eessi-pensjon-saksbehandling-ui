import { ChevronLeftIcon } from '@navikt/aksel-icons';
import {Alert, BodyLong, Box, Button, Checkbox, HStack, VStack} from '@navikt/ds-react'
import { Sed } from 'src/declarations/buc'
import { EmptyPeriodsReport } from 'src/declarations/p5000'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import P5000SedLabel from 'src/applications/P5000/components/P5000SedLabel'
import {MarginLeftDiv, MarginRightDiv} from "src/components/StyledComponents";

const P5000Controls = ({
  onBackClick,
  activeSeds,
  seds,
  changeActiveSeds,
  emptyPeriodReport
}: any) => {
  const { t } = useTranslation()

  const hasEmptyPeriods = (emptyPeriodsReport: EmptyPeriodsReport): boolean => {
    return Object.values(emptyPeriodsReport).indexOf(true) >= 0
  }

  const warning = hasEmptyPeriods(emptyPeriodReport)

  return (
    <>
      <Box paddingBlock="0 12">
        <HStack
          gap="8"
          width="100%"
        >
          <MarginRightDiv>
            <VStack>
              <BodyLong>
                {t('p5000:active-seds')}:
              </BodyLong>
              <Box paddingBlock="2 0">
                {seds?.map((sed: Sed) => (
                  <Checkbox
                    data-testid={'a_buc_c_P5000overview--checkbox-' + sed.id}
                    checked={_.find(activeSeds, s => s.id === sed.id) !== undefined}
                    key={'a_buc_c_P5000overview--checkbox-' + sed.id}
                    id={'a_buc_c_P5000overview--checkbox-' + sed.id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeActiveSeds(sed, e.target.checked)}
                  >
                    <P5000SedLabel sed={sed} warning={emptyPeriodReport[sed.id]} />
                  </Checkbox>
                ))}
              </Box>
            </VStack>
          </MarginRightDiv>
          <MarginLeftDiv>
            {warning && (
              <Alert variant='warning'>
                {t('buc:form-P5000-warning')}
              </Alert>
            )}
          </MarginLeftDiv>
        </HStack>
      </Box>
      <div style={{ display: 'inline-block' }}>
        <Button
          variant='secondary'
          onClick={onBackClick}
          iconPosition="left" icon={<ChevronLeftIcon aria-hidden />}
        >
          <span>
            {t('ui:back')}
          </span>
        </Button>
      </div>
    </>
  )
}

export default P5000Controls
