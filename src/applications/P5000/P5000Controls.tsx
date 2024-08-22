import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, Button, Checkbox } from '@navikt/ds-react'
import { Column, PileDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { Sed } from 'src/declarations/buc'
import { EmptyPeriodsReport } from 'src/declarations/p5000'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import P5000SedLabel from 'src/applications/P5000/components/P5000SedLabel'

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
      <Row>
        <Column>
          <PileDiv>
            <BodyLong>
              {t('p5000:active-seds')}:
            </BodyLong>
            <VerticalSeparatorDiv size='0.5' />
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
          </PileDiv>
        </Column>
        <Column>
          {warning && (
            <Alert variant='warning'>
              {t('buc:form-P5000-warning')}
            </Alert>
          )}
        </Column>
      </Row>
      <VerticalSeparatorDiv size='3' />
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
