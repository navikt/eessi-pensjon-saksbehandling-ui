import {Alert, BodyLong, Button, HelpText, HStack, Loader, Select, Spacer, Switch} from '@navikt/ds-react'
import { sendP5000ToS3 } from 'src/actions/p5000'
import { informasjonOmBeregningLabels, typePeriode } from 'src/applications/P5000/P5000.labels'
import { convertFromP5000ListRowsIntoPesysPeriods } from 'src/applications/P5000/utils/pesysUtils'
import MultipleSelect from 'src/components/MultipleSelect/MultipleSelect'
import {FeatureToggles, Option} from 'src/declarations/app'
import { P5000ListRow, P5000ListRows } from 'src/declarations/p5000'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import { useAppDispatch } from 'src/store'
import styles from "src/assets/css/common.module.css";

export interface P5000OverviewControlsProps {
  fnr: string // renamed from aktoerId
  caseId: string
  componentRef: any
  mergePeriods: boolean
  setMergePeriods: (b: boolean) => void
  setRenderPrintTable: (b: boolean) => void
  mergePeriodTypes: Array<string> | undefined
  setMergePeriodTypes: (a: Array<string> | undefined) => void
  mergePeriodBeregnings: Array<string> | undefined
  setMergePeriodBeregnings: (a: Array<string> | undefined) => void
  useGermanRules: boolean
  setUseGermanRules: (b: boolean) => void
  pagination: boolean
  setPagination: (b: boolean) => void
  itemsPerPage: number
  currentTabKey: string
  pesysWarning?: string
  setItemsPerPage: (b: number) => void
  items: P5000ListRows
  itemsForPesys: P5000ListRows
  p5000FromS3: Array<P5000ListRows> | null | undefined
  hideSendToPesysButton?: boolean
}

export interface P5000OverviewControlsSelector {
  sendingToPesys: boolean
  featureToggles: FeatureToggles
}

const mapState = (state: State): P5000OverviewControlsSelector => ({
  sendingToPesys: state.loading.sendingToPesys,
  featureToggles: state.app.featureToggles
})

const P5000OverviewControls: React.FC<P5000OverviewControlsProps> = ({
  fnr,
  caseId,
  componentRef,
  mergePeriods,
  setMergePeriods,
  mergePeriodTypes,
  setMergePeriodTypes,
  mergePeriodBeregnings,
  setMergePeriodBeregnings,
  setRenderPrintTable,
  useGermanRules,
  setUseGermanRules,
  pagination,
  setPagination,
  itemsPerPage,
  setItemsPerPage,
  items,
  itemsForPesys,
  pesysWarning,
  p5000FromS3,
  currentTabKey,
  hideSendToPesysButton = false

}: P5000OverviewControlsProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { sendingToPesys, featureToggles } : P5000OverviewControlsSelector = useSelector<State, P5000OverviewControlsSelector>(mapState)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)

  const hasGermanRows = _.find(items, (it: P5000ListRow) => it.land === 'DE') !== undefined

  const mergeTypeOptions: Array<Option> = _.uniq(_.flatten(items.map(i => i.type.split(', '))))
    .sort((a, b) => parseInt(a) - parseInt(b)).map(i => ({ label: i + ' - ' + _.get(typePeriode, parseInt(i)), value: i }))

  const mergeBeregningOptions: Array<Option> = _.uniq(_.flatten(items.map(i => i.beregning.split(', '))))
    .sort((a, b) => parseInt(a) - parseInt(b)).map(i => ({ label: i + ' - ' + _.get(informasjonOmBeregningLabels, i), value: i }))

  const onMergeTypesChange = (types: unknown): void => {
    setMergePeriodTypes((types as Array<Option>).map(o => o.value).sort((a, b) => parseInt(a) - parseInt(b)))
  }

  const onMergeBeregningsChange = (beregnings: unknown): void => {
    setMergePeriodBeregnings((beregnings as Array<Option>).map(o => o.value).sort((a, b) => parseInt(a) - parseInt(b)))
  }

  const itemsPerPageChanged = (e: any): void => {
    setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const beforePrintOut = (): void => {
    _setPrintDialogOpen(true)
  }

  const prepareContent = (): void => {
    setRenderPrintTable(true)
  }

  const afterPrintOut = (): void => {
    _setPrintDialogOpen(false)
    setRenderPrintTable(false)
  }

  const handleOverforTilPesys = () => {
    if (window.confirm(t('buc:form-areYouSureSendToPesys'))) {
      dispatch(sendP5000ToS3(fnr, caseId, convertFromP5000ListRowsIntoPesysPeriods(itemsForPesys)))
    }
  }

  const hasSelectedRowsWithErrors = (): boolean => {
    return !!_.find(itemsForPesys, (it: P5000ListRow) => it.rowError && it.selected)
  }

  return (
    <>
      {pesysWarning && currentTabKey === 'pesys' && (
        <HStack
          paddingBlock="0 4"
        >
          <Spacer />
          <Alert
            variant='warning'
            style={{ width: '50%' }}
          >
            {pesysWarning}
          </Alert>
          <Spacer />
        </HStack>
      )}
      {!_.isNil(p5000FromS3) && (
        <HStack style={{ width: '100%' }}>
            <BodyLong>{t('message:alert-p5000sFromS3', { x: "" })}</BodyLong>
        </HStack>
      )}
      <HStack
        paddingBlock="0 4"
        gap="4"
        style={{ width: '100%' }}
        align="end"
      >
        {featureToggles.P5000_MERGE_BUTTON &&
          <Switch
            checked={mergePeriods}
            id='a_buc_c_sedstart--p5000-overview-merge-checkbox'
            data-testid='a_buc_c_sedstart--p5000-overview-merge-checkbox'
            onChange={() => {
              setMergePeriods(!mergePeriods)
              setPagination(!pagination)
            }}
          >
            <HStack gap="2">
              <span className={styles.oneLine}>
                {t('p5000:merge-periods')}
              </span>
              <HelpText>
                  {t('p5000:help-merge-1') + t('p5000:help-merge-2')}
              </HelpText>
            </HStack>
          </Switch>
        }
        {mergePeriods && (
          <MultipleSelect<Option>
            ariaLabel={t('p5000:merge-period-type')}
            aria-describedby='help-tags'
            data-testid='a_buc_c_p5000overview--types-select-id'
            id='a_buc_c_p5000overview--types-select-id'
            hideSelectedOptions={false}
            onSelect={onMergeTypesChange}
            options={mergeTypeOptions}
            label={(
              <HStack
                gap="2"
                align="end"
              >
                {t('p5000:merge-period-type')}
                <HelpText>
                  {t('p5000:help-merge-period-type')}
                </HelpText>
              </HStack>
            )}
            values={_.filter(mergeTypeOptions, (m: unknown) => mergePeriodTypes ? mergePeriodTypes.indexOf((m as Option).value) >= 0 : false)}
          />
        )}
        {mergePeriods && (
          <MultipleSelect<Option>
            ariaLabel={t('p5000:merge-period-beregning')}
            aria-describedby='help-tags'
            data-testid='a_buc_c_p5000overview--beregnings-select-id'
            id='a_buc_c_p5000overview--beregnings-select-id'
            hideSelectedOptions={false}
            onSelect={onMergeBeregningsChange}
            options={mergeBeregningOptions}
            label={(
              <HStack
                gap="2"
                align="end"
              >
                {t('p5000:merge-period-beregning')}
                <HelpText>
                  {t('p5000:help-merge-period-beregning')}
                </HelpText>
              </HStack>
            )}
            values={_.filter(mergeBeregningOptions, (m: unknown) => mergePeriodBeregnings ? mergePeriodBeregnings.indexOf((m as Option).value) >= 0 : false)}
          />
        )}
        <Spacer />
          <HStack
            gap="4"
            align="end"
            style={{ flexDirection: 'row-reverse' }}
          >
            <ReactToPrint
              documentTitle='P5000'
              onAfterPrint={afterPrintOut}
              onBeforePrint={beforePrintOut}
              onBeforeGetContent={prepareContent}
              trigger={() =>
                <Button
                  variant='secondary'
                  disabled={_printDialogOpen}
                >
                  {_printDialogOpen && <Loader />}
                  {t('ui:print')}
                </Button>}
              content={() => {
                return componentRef.current
              }}
            />
            {!hideSendToPesysButton &&
              <Button
                variant='primary'
                disabled={sendingToPesys || currentTabKey !== 'pesys' || hasSelectedRowsWithErrors()}
                onClick={handleOverforTilPesys}
              >
                {sendingToPesys && <Loader />}
                {sendingToPesys ? t('ui:sending') : t('buc:form-send-to-PESYS')}
              </Button>
            }
            {pagination && (
              <Select
                id='itemsPerPage'
                label={t('ui:itemsPerPage')}
                onChange={itemsPerPageChanged}
                value={itemsPerPage === 9999 ? 'all' : '' + itemsPerPage}
              >
                <option value='10'>10</option>
                <option value='15'>15</option>
                <option value='20'>20</option>
                <option value='30'>30</option>
                <option value='50'>50</option>
                <option value='all'>{t('ui:all')}</option>
              </Select>
            )}
          </HStack>
      </HStack>
      {hasGermanRows && mergePeriods && (
        <HStack
          paddingBlock="0 4"
          gap="2"
          align="center"
          style={{ width: '100%' }}
        >
          <Switch
            checked={useGermanRules}
            id='a_buc_c_sedstart--p5000-overview-usegerman-switch'
            data-testid='a_buc_c_sedstart--p5000-overview-usegerman-switch'
            onChange={() => setUseGermanRules(!useGermanRules)}
          >
            {t('message:warning-german-alert')}
          </Switch>
          <HelpText>
              {t('p5000:help-german-alert')}
          </HelpText>
        </HStack>
      )}
    </>
  )
}

export default P5000OverviewControls
