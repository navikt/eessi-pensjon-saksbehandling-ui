import { getSed, getTagList, saveBucsInfo } from 'actions/buc'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDP5000 from 'applications/BUC/components/SEDP5000/SEDP5000'
import Trashcan from 'assets/icons/Trashcan'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import {
  HighContrastKnapp,
  HighContrastModal,
  HighContrastPanel,
  HighContrastTextArea,
  VerticalSeparatorDiv,
  HighContrastTabs
} from 'components/StyledComponents'
import { Buc, BucInfo, BucsInfo, Comment, Comments, SedContentMap, Seds, Tag, Tags, ValidBuc } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, Loading } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeLogger } from 'metrics/loggers'
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
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
const BUCToolsPanel = styled(HighContrastPanel)`
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
const CommentDiv = styled.div`
  border-bottom-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]};
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
`
const RemoveComment = styled.div`
  cursor: pointer;
`

const BUCTools: React.FC<BUCToolsProps> = ({
  aktoerId, buc, bucInfo, className, onTagChange
}: BUCToolsProps): JSX.Element => {

  const { t } = useTranslation()
  const [comment, setComment] = useState< string | null | undefined >('')
  const [originalComments, setOriginalComments] = useState<Comments | string | null | undefined >(bucInfo ? bucInfo.comment : '')
  const [allTags, setAllTags] = useState<Tags | undefined>(undefined)
  const [fetchingP5000, setFetchingP5000] = useState<Seds>([])
  const [modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [timeWithP5000Modal, setTimeWithP5000Modal] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<Tags | undefined>(undefined)


  const [activeTab, setActiveTab] = useState<number>(0)
  const { featureToggles, highContrast, loading, locale, bucsInfo, sedContent, tagList }: BUCToolsSelector = useSelector<State, BUCToolsSelector>(mapState)
  const _theme = highContrast ? themeHighContrast : theme
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

  useEffect(() => {
    console.log(bucInfo, tags)
    if (bucInfo && bucInfo.tags && tags === undefined) {
      console.log('sdfv')
      setTags(bucInfo.tags.map((tag: string) => ({
        value: tag,
        label: t('buc:' + tag)
      })))
    }
  }, [bucInfo, t, tags])

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
    standardLogger('buc.edit.tools.comment.textarea', { comment: comment })

    let newOriginalComments: string | Comments = originalComments ? _.cloneDeep(originalComments) : []
    if (_.isString(newOriginalComments)) {
      newOriginalComments = [{ value: newOriginalComments }]
    }

    const newComment: Comment = {
      value: comment!
    }
    if (comment) {
      newOriginalComments!.push(newComment)
      setOriginalComments(newOriginalComments)
      setComment('')
    }

    dispatch(saveBucsInfo({
      bucsInfo: bucsInfo!,
      aktoerId: aktoerId,
      tags: tags ? tags.map(tag => tag.value) : [],
      comment: newOriginalComments,
      buc: buc as ValidBuc
    }))
  }

  const onDeleteComment = (i: number): void => {
    if (window.confirm(t('buc:form-areYouSureDeleteComment'))) {
      const newOriginalComments: Comments = _.cloneDeep(originalComments) as Comments
      newOriginalComments.splice(i, 1)
      setOriginalComments(newOriginalComments)

      dispatch(saveBucsInfo({
        bucsInfo: bucsInfo!,
        aktoerId: aktoerId,
        tags: tags ? tags.map(tag => tag.value) : [],
        comment: newOriginalComments,
        buc: buc as ValidBuc
      }))
    }
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
    label: t('ui:tags'),
    key: 'tags'
  }, {
    label: t('buc:form-commentForBUC'),
    key: 'comments'
  }])

  return (
    <ThemeProvider theme={_theme}>
      <BUCToolsPanel
        data-testid='a-buc-c-buctools__panel-id'
        className={className}
      >
        <>
          <HighContrastTabs
            tabs={tabs}
            onChange={(e: any, i: number) => { setActiveTab(i) }}
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
                <VerticalSeparatorDiv data-size='0.5' />
                <Normaltekst>
                  {t('buc:form-tagsForBUC-description')}
                </Normaltekst>
                <VerticalSeparatorDiv data-size='0.5' />
                {tags && !_.isEmpty(tags) && (
                  <>
                    <dt>
                      <Element>
                        {t('buc:form-tagsForBUC')}:
                      </Element>
                    </dt>
                    <dd>
                      <Normaltekst>
                        {tags.map((tag: Tag) => tag.label).join(', ')}
                      </Normaltekst>
                    </dd>
                  </>
                )}
                <VerticalSeparatorDiv data-size='0.5' />
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
                <VerticalSeparatorDiv data-size='0.5' />
                <Element>
                  {t('ui:comment')}
                </Element>

                {originalComments ? (originalComments as Comments).map((comment, i) => (
                  <CommentDiv key={i}>
                    <Normaltekst>
                      {comment.value}
                    </Normaltekst>
                    <RemoveComment>
                      <Trashcan
                        width={20}
                        color={_theme[themeKeys.MAIN_INTERACTIVE_COLOR]}
                        onClick={() => onDeleteComment(i)}
                      />
                    </RemoveComment>
                  </CommentDiv>
                )) : (
                  <Normaltekst>
                    {t('ui:noCommentsYet')}
                  </Normaltekst>
                )}
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
                  spinner={loading.savingBucsInfo}
                  onClick={onSaveButtonClick}
                >
                  {loading.savingBucsInfo ? t('ui:saving') : t('ui:add')}
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
