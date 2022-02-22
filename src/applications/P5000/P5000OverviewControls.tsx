import { BodyLong, Button, HelpText, Loader, Select, Switch } from '@navikt/ds-react'
import {
  AlignEndRow,
  Column,
  FlexCenterDiv,
  FlexEndDiv,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { OneLineSpan } from 'components/StyledComponents'
import { FeatureToggles, Option } from 'declarations/app'
import { P5000ListRows } from 'declarations/p5000'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ReactToPrint from 'react-to-print'

export interface P5000OverviewControlsProps {
  featureToggles: FeatureToggles
  mergePeriods: boolean
  setMergePeriods: (b: boolean) => void
  mergePeriodTypes: Array<string> |undefined
  setMergePeriodTypes: (Array<string> |undefined) => void
  items: P5000ListRows
}

const P5000OverviewControls: React.FC<P5000OverviewControlsProps> = ({
  featureToggles,
  mergePeriods,
  setMergePeriods,
  mergePeriodTypes,
  setMergePeriodTypes,
  items
}: P5000OverviewControlsProps) => {

  const { t } = useTranslation()

  const mergeTypeOptions: Array<Option> = _.uniq(items.map(i => i.type))
    .sort((a, b) => parseInt(a) - parseInt(b)).map(i => ({ label: i, value: i }))

  const onMergeTypesChange = (types: unknown): void => {
    setMergePeriodTypes((types as Array<Option>).map(o => o.value).sort((a, b) => parseInt(a) - parseInt(b)))
  }

  return (
    <>
      <AlignEndRow style={{ width: '100%' }}>
        <Column flex='2'>
          <FlexEndDiv>
            <Switch
              checked={mergePeriods}
              id='a-buc-c-sedstart__p5000-overview-merge-checkbox'
              data-test-id='a-buc-c-sedstart__p5000-overview-merge-checkbox'
              onChange={() => setMergePeriods(!mergePeriods)}
            >
              <FlexCenterDiv>
                <OneLineSpan>
                  {t('p5000:merge-periods')}
                </OneLineSpan>
                <HorizontalSeparatorDiv size='0.5' />
                <HelpText>
                  <div style={{ maxWidth: '300px' }}>
                    <BodyLong>{t('p5000:help-merge-1')}</BodyLong>
                    <BodyLong>{t('p5000:help-merge-2')}</BodyLong>
                  </div>
                </HelpText>
              </FlexCenterDiv>
            </Switch>
            {featureToggles.P5000_UPDATES_VISIBLE && mergePeriods && (
              <>
                <HorizontalSeparatorDiv size='2' />
                <MultipleSelect<Option>
                  ariaLabel={t('p5000:merge-period-type')}
                  aria-describedby='help-tags'
                  data-test-id='a-buc-c-p5000overview__types-select-id'
                  hideSelectedOptions={false}
                  onSelect={onMergeTypesChange}
                  options={mergeTypeOptions}
                  label={(
                    <FlexEndDiv>
                      {t('p5000:merge-period-type')}
                      <HorizontalSeparatorDiv size='0.5' />
                      <HelpText>
                        {t('p5000:help-merge-period-type')}
                      </HelpText>
                    </FlexEndDiv>
                  )}
                  values={_.filter(mergeTypeOptions, (m: unknown) => _mergePeriodTypes ? _mergePeriodTypes.indexOf((m as Option).value) >= 0 : false)}
                />
              </>
            )}
          </FlexEndDiv>
        </Column>
        <Column>
          <FlexEndDiv style={{ flexDirection: 'row-reverse' }}>
            <ReactToPrint
              documentTitle='P5000'
              onAfterPrint={afterPrintOut}
              onBeforePrint={beforePrintOut}
              onBeforeGetContent={prepareContent}
              trigger={() =>
                <Button
                  disabled={_printDialogOpen}
                >
                  {_printDialogOpen && <Loader />}
                  {t('ui:print')}
                </Button>}
              content={() => {
                return componentRef.current
              }}
            />
            <HorizontalSeparatorDiv />
            <Select
              id='itemsPerPage'
              label={t('ui:itemsPerPage')}
              onChange={itemsPerPageChanged}
              value={_itemsPerPage === 9999 ? 'all' : '' + _itemsPerPage}
            >
              <option value='10'>10</option>
              <option value='15'>15</option>
              <option value='20'>20</option>
              <option value='30'>30</option>
              <option value='50'>50</option>
              <option value='all'>{t('ui:all')}</option>
            </Select>

          </FlexEndDiv>
        </Column>
      </AlignEndRow>
      <VerticalSeparatorDiv />
      {hasGermanRows && mergePeriods && (
        <>
          <AlignEndRow style={{ width: '100%' }}>
            <Column>
              <FlexCenterDiv>
                <Switch
                  checked={_useGermanRules}
                  id='a-buc-c-sedstart__p5000-overview-usegerman-switch'
                  data-test-id='a-buc-c-sedstart__p5000-overview-usegerman-switch'
                  onChange={() => _setUseGermanRules(!_useGermanRules)}
                >
                  {t('message:warning-german-alert')}
                </Switch>
                <HorizontalSeparatorDiv size='0.5' />
                <HelpText>
                  <div style={{ maxWidth: '500px' }}>
                    {t('p5000:help-german-alert')}
                  </div>
                </HelpText>
              </FlexCenterDiv>
            </Column>
          </AlignEndRow>
          <VerticalSeparatorDiv />
        </>
      )}
      </>
  )

}

export default P5000OverviewControls
