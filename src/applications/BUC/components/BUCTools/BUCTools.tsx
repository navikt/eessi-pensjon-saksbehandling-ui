import { getSed, getTagList, saveBucsInfo } from 'actions/buc'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDP5000 from 'applications/BUC/components/SEDP5000/SEDP5000'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import {
  HighContrastExpandingPanel,
  HighContrastKnapp,
  HighContrastModal,
  HighContrastTextArea,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import { Buc, BucInfo, BucsInfo, SedContentMap, Seds, Tags, ValidBuc } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, Loading } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeLogger } from 'metrics/loggers'
import Tabs from 'nav-frontend-tabs'
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes, ThemeProvider } from 'styled-components'

export interface BUCToolsProps {
  aktoerId: string
  buc: Buc
  bucInfo: BucInfo
  className?: string
  onTagChange ?: (tagList: Tags) => void
}

export interface BUCToolsSelector {
  featureToggles: FeatureToggles
  highContrast: boolean
  loading: Loading
  locale: AllowedLocaleString
  bucsInfo?: BucsInfo | undefined
  sedContent: SedContentMap
  tagList?: Array<string> | undefined
}

const mapState = (state: State): BUCToolsSelector => ({
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  loading: state.loading,
  locale: state.ui.locale,
  bucsInfo: state.buc.bucsInfo,
  tagList: state.buc.tagList,
  sedContent: state.buc.sedContent
})

const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
const BUCToolsPanel = styled(HighContrastExpandingPanel)`
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight} 0.3s forwards;
`
const P5000Div = styled.div`
  margin-bottom: 1rem;
`
const TextArea = styled(HighContrastTextArea)`
  min-height: 150px;
  width: 100%;
`
const PaddedTabContent = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`
const HighContrastTabs = styled(Tabs)`
  .nav-frontend-tabs__tab-inner--aktiv {
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    background: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
    border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-style: solid;
    border-color: ${({ theme }) => theme[themeKeys.MAIN_BBORDER_COLOR]};
    border-bottom-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-bottom-style: solid;
    border-bottom-color: white;
  }
  .nav-frontend-tabs__tab-inner {
    color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    background: none;
  }
`
const BUCTools: React.FC<BUCToolsProps> = ({
  aktoerId, buc, bucInfo, className, onTagChange
}: BUCToolsProps): JSX.Element => {
  const { t } = useTranslation()
  const [comment, setComment] = useState<string | null | undefined >(bucInfo ? bucInfo.comment : '')
  const [originalComment, setOriginalComment] = useState<string | null | undefined >(bucInfo ? bucInfo.comment : '')
  const [allTags, setAllTags] = useState<Tags | undefined>(undefined)
  const [fetchingP5000, setFetchingP5000] = useState<Seds>([])
  const [modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [timeWithP5000Modal, setTimeWithP5000Modal] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<Tags>(bucInfo && bucInfo.tags ? bucInfo.tags.map((tag: string) => ({
    value: tag,
    label: t('buc:' + tag)
  })) : [])
  const [activeTab, setActiveTab] = useState<number>(0)
  const { featureToggles, highContrast, loading, locale, bucsInfo, sedContent, tagList }: BUCToolsSelector = useSelector<State, BUCToolsSelector>(mapState)
  const dispatch = useDispatch()

  useEffect(() => {
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [dispatch, loading, tagList])

  useEffect(() => {
    if (!allTags && tagList) {
      setAllTags(tagList.map((tag: string) => ({
        value: tag,
        label: t('buc:' + tag)
      })))
    }
  }, [t, allTags, tagList])

  const getP5000 = useCallback(() => {
    if (!buc.seds) {
      return undefined
    }
    return buc.seds.filter(sedFilter).filter(sed => sed.type === 'P5000' && sed.status !== 'cancelled')
  }, [buc])

  const displayP5000table = useCallback(() => {
    setTimeWithP5000Modal(new Date())
    setModal({
      modalTitle: t('buc:P5000-title'),
      modalContent: (
        <SEDP5000
          highContrast={highContrast}
          seds={getP5000()!}
          sedContent={sedContent}
          locale={locale}
        />
      )
    })
  }, [highContrast, setModal, getP5000, locale, sedContent, t])

  useEffect(() => {
    if (!_.isEmpty(fetchingP5000)) {
      const myDocumentIds = fetchingP5000.map(sed => sed.id)
      const loadedSeds = Object.keys(sedContent)
      const commonSeds = _.intersection(myDocumentIds, loadedSeds)
      if (!_.isEmpty(commonSeds)) {
        const newFetchingP5000 = _.filter(fetchingP5000, sed => !_.includes(commonSeds, sed.id))
        setFetchingP5000(newFetchingP5000)
        if (_.isEmpty(newFetchingP5000)) {
          displayP5000table()
        }
      }
    }
  }, [displayP5000table, fetchingP5000, sedContent, setModal])

  const onTagsChange = (tagsList: Tags): void => {
    if (_.isFunction(onTagChange)) {
      onTagChange(tagsList)
    }
    standardLogger('buc.edit.tools.tags.select', { tags: tagsList?.map(t => t.label) || [] })
    setTags(tagsList)
  }

  const onCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setComment(e.target.value)
  }

  const onSaveButtonClick = (): void => {
    if (originalComment !== comment) {
      standardLogger('buc.edit.tools.comment.textarea', { comment: comment })
      setOriginalComment(comment)
    }
    dispatch(saveBucsInfo({
      bucsInfo: bucsInfo!,
      aktoerId: aktoerId,
      tags: tags.map(tag => tag.value),
      comment: comment,
      buc: buc as ValidBuc
    }))
  }

  const onModalClose = () => {
    if (timeWithP5000Modal) {
      timeLogger('buc.edit.tools.P5000', timeWithP5000Modal)
    }
    setModal(undefined)
  }

  const hasP5000s = (): boolean => {
    return !_.isEmpty(getP5000())
  }

  const onGettingP5000sClick = (e: React.MouseEvent) : void => {
    buttonLogger(e)
    const p5000s = getP5000()
    if (p5000s) {
      setFetchingP5000(p5000s)
      p5000s.forEach(sed => {
        dispatch(getSed(buc.caseId!, sed))
      })
    }
  }

  let tabs = featureToggles && featureToggles.P5000_VISIBLE ? [{
    label: t('buc:form-labelP5000'),
    key: 'P5000'
  }] : []
  tabs = tabs.concat([{
    label: t('buc:form-tagsForBUC'),
    key: 'tags'
  }, {
    label: t('buc:form-commentForBUC'),
    key: 'comments'
  }])
  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <BUCToolsPanel
        highContrast={highContrast}
        collapseProps={{ id: 'a-buc-c-buctools__panel-id' }}
        data-testid='a-buc-c-buctools__panel-id'
        open
        className={className}
        heading={
          <Systemtittel data-testid='a-buc-c-buctools__title'>
            {t('buc:form-BUCtools')}
          </Systemtittel>
        }
      >
        <>
          <HighContrastTabs
            tabs={tabs}
            onChange={(e, i) => { setActiveTab(i) }}
          />
          <PaddedTabContent>
            {featureToggles && featureToggles.P5000_VISIBLE && tabs[activeTab].key === 'P5000' && (
              <P5000Div>
                <Undertittel>
                  {t('buc:form-titleP5000')}
                </Undertittel>
                <VerticalSeparatorDiv data-size='0.5' />
                {modal && <HighContrastModal modal={modal} onModalClose={onModalClose} />}
                <HighContrastKnapp
                  data-amplitude='buc.edit.tools.P5000.view'
                  id='a-buc-c-buctools__p5000-button-id'
                  className='a-buc-c-buctools__p5000-button mb-2'
                  disabled={!hasP5000s() || !_.isEmpty(fetchingP5000)}
                  spinner={!_.isEmpty(fetchingP5000)}
                  onClick={onGettingP5000sClick}
                >
                  {!_.isEmpty(fetchingP5000) ? t('ui:loading') : t('buc:form-seeP5000s')}
                </HighContrastKnapp>
              </P5000Div>
            )}
            {tabs[activeTab].key === 'tags' && (
              <>
                <Undertittel>
                  {t('buc:form-tagsForBUC')}
                </Undertittel>
                <VerticalSeparatorDiv data-size='0.5' />
                <Normaltekst>
                  {t('buc:form-tagsForBUC-description')}
                </Normaltekst>
                <MultipleSelect
                  highContrast={highContrast}
                  ariaLabel={t('buc:form-tagsForBUC')}
                  label=''
                  data-testid='a-buc-c-buctools__tags-select-id'
                  placeholder={t('buc:form-tagPlaceholder')}
                  aria-describedby='help-tags'
                  values={tags || []}
                  hideSelectedOptions={false}
                  onSelect={onTagsChange}
                  options={allTags}
                />
              </>
            )}
            {tabs[activeTab].key === 'comments' && (
              <>
                <Undertittel>
                  {t('buc:form-commentForBUC')}
                </Undertittel>
                <VerticalSeparatorDiv data-size='0.5' />
                <TextArea
                  id='a-buc-c-buctools__comment-textarea-id'
                  className='skjemaelement__input'
                  label=''
                  value={comment || ''}
                  onChange={onCommentChange}
                />
                <HighContrastKnapp
                  data-id='a-buc-c-buctools__save-button-id'
                  disabled={loading.savingBucsInfo}
                  onClick={onSaveButtonClick}
                >
                  {loading.savingBucsInfo ? t('ui:saving') : t('ui:change')}
                </HighContrastKnapp>
              </>
            )}
          </PaddedTabContent>
        </>
      </BUCToolsPanel>
    </ThemeProvider>
  )
}

BUCTools.propTypes = {
  aktoerId: PT.string.isRequired,
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType.isRequired,
  className: PT.string,
  onTagChange: PT.func
}

export default BUCTools
