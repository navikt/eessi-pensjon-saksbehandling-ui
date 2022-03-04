import { BackFilled } from '@navikt/ds-icons'
import { Alert, BodyLong, Button, Checkbox } from '@navikt/ds-react'
import { Column, HorizontalSeparatorDiv, PileDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { Sed } from 'declarations/buc'
import { EmptyPeriodsReport } from 'declarations/p5000'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import P5000SedLabel from './P5000SedLabel'

const P5000Controls = ({
  onBackClick,
  activeSeds,
  seds,
  changeActiveSeds,
  emptyPeriodReport
}: any) => {
  const {t} = useTranslation()

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
                data-test-id={'a-buc-c-P5000overview__checkbox-' + sed.id}
                checked={_.find(activeSeds, s => s.id === sed.id) !== undefined}
                key={'a-buc-c-P5000overview__checkbox-' + sed.id}
                id={'a-buc-c-P5000overview__checkbox-' + sed.id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeActiveSeds(sed, e.target.checked)}
              >
                <P5000SedLabel sed={sed} warning={emptyPeriodReport[sed.id]}/>
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
      <div style={{display: 'inline-block'}}>
        <Button
          variant='secondary'
          onClick={onBackClick}
        >
          <BackFilled/>
          <HorizontalSeparatorDiv size='0.25'/>
          <span>
          {t('ui:back')}
        </span>
        </Button>
      </div>
      </>
  )
}

export default P5000Controls
