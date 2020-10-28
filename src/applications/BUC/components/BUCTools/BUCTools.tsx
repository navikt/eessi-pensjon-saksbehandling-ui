import { getSed, getTagList, saveBucsInfo } from 'actions/buc'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDP5000 from 'applications/BUC/components/SEDP5000/SEDP5000'
import Trashcan from 'assets/icons/Trashcan'
import { slideInFromRight } from 'components/keyframes'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import Modal from 'components/Modal/Modal'
import {
  HighContrastKnapp,
  HighContrastPanel,
  HighContrastTabs,
  HighContrastTextArea,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import {
  Buc,
  BucInfo,
  BucsInfo,
  Comment,
  Comments,
  SedContentMap,
  Seds,
  Tag,
  TagRawList,
  Tags,
  ValidBuc
} from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, Loading } from 'declarations/app.d'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeLogger } from 'metrics/loggers'
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ValueType } from 'react-select'
import styled, { ThemeProvider } from 'styled-components'

const BUCToolsPanel = styled(HighContrastPanel)`
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight} 0.3s forwards;
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
const P5000Div = styled.div`
  margin-bottom: 1rem;
`
const PaddedTabContent = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`
const RemoveComment = styled.div`
  cursor: pointer;
`
export const TextArea = styled(HighContrastTextArea)`
  min-height: 150px;
  width: 100%;
`

export interface BUCToolsProps {
  aktoerId: string
  buc: Buc
  bucInfo: BucInfo
  className?: string
  initialTab?: number
  onTagChange?: (tagList: Tags) => void
}

export interface BUCToolsSelector {
  bucsInfo?: BucsInfo | undefined
  featureToggles: FeatureToggles
  highContrast: boolean
  loading: Loading
  locale: AllowedLocaleString
  sedContent: SedContentMap
  tagList?: TagRawList | undefined
}

const mapState = (state: State): BUCToolsSelector => ({
  bucsInfo: state.buc.bucsInfo,
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  loading: state.loading,
  locale: state.ui.locale,
  sedContent: state.buc.sedContent,
  tagList: state.buc.tagList
})

const BUCTools: React.FC<BUCToolsProps> = ({
  aktoerId, buc, bucInfo, className, initialTab = 0, onTagChange
}: BUCToolsProps): JSX.Element => {
  const {
    featureToggles, highContrast, loading, locale, bucsInfo, sedContent, tagList
  }: BUCToolsSelector = useSelector<State, BUCToolsSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_activeTab, setActiveTab] = useState<number>(initialTab)
  const [_allTags, setAllTags] = useState<Tags | undefined>(undefined)
  const [_comment, setComment] = useState< string | null | undefined >('')
  const [_fetchingP5000, setFetchingP5000] = useState<Seds>([])
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_originalComments, setOriginalComments] = useState<Comments | string | null | undefined >(bucInfo ? bucInfo.comment : '')
  const [_timeWithP5000Modal, setTimeWithP5000Modal] = useState<Date | undefined>(undefined)
  const [_tags, setTags] = useState<Tags | undefined>(undefined)
  const _theme = highContrast ? themeHighContrast : theme

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
  }, [getP5000, highContrast, locale, sedContent, setModal, t])

  const onTagsChange = (tagsList: ValueType<Tag>): void => {
    if (tagsList) {
      if (_.isFunction(onTagChange)) {
        onTagChange(tagsList as Tags)
      }
      standardLogger('buc.edit.tools.tags.select', { tags: (tagsList as Tags)?.map(t => t.label) || [] })
      setTags(tagsList as Tags)
      dispatch(saveBucsInfo({
        bucsInfo: bucsInfo!,
        aktoerId: aktoerId,
        tags: _tags ? (_tags as Tags).map(tag => tag.value) : [],
        comment: _originalComments,
        buc: buc as ValidBuc
      }))
    }
  }

  const onCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setComment(e.target.value)
  }

  const onSaveCommentClick = (): void => {
    standardLogger('buc.edit.tools.comment.textarea', { comment: _comment })
    let newOriginalComments: Comments | string = _originalComments ? _.cloneDeep(_originalComments) : []
    if (_.isString(newOriginalComments)) {
      newOriginalComments = [{ value: newOriginalComments }]
    }
    const newComment: Comment = {
      value: _comment!
    }
    if (_comment) {
      newOriginalComments!.push(newComment)
      setOriginalComments(newOriginalComments)
      setComment('')
    }
    dispatch(saveBucsInfo({
      bucsInfo: bucsInfo!,
      aktoerId: aktoerId,
      tags: _tags ? _tags.map(tag => tag.value) : [],
      comment: newOriginalComments,
      buc: buc as ValidBuc
    }))
  }

  const onDeleteComment = (i: number): void => {
    if (window.confirm(t('buc:form-areYouSureDeleteComment'))) {
      const newOriginalComments: Comments = _.cloneDeep(_originalComments) as Comments
      newOriginalComments.splice(i, 1)
      setOriginalComments(newOriginalComments)
      dispatch(saveBucsInfo({
        bucsInfo: bucsInfo!,
        aktoerId: aktoerId,
        tags: _tags ? _tags.map(tag => tag.value) : [],
        comment: newOriginalComments,
        buc: buc as ValidBuc
      }))
    }
  }

  const onModalClose = () => {
    if (_timeWithP5000Modal) {
      timeLogger('buc.edit.tools.P5000', _timeWithP5000Modal)
    }
    setModal(undefined)
  }

  const hasP5000s = (): boolean => {
    return !_.isEmpty(getP5000())
  }

  const onGettingP5000sClick = (e: React.MouseEvent): void => {
    buttonLogger(e)
    const p5000s = getP5000()
    if (p5000s) {
      setFetchingP5000(p5000s)
      p5000s.forEach(sed => {
        dispatch(getSed(buc.caseId!, sed))
      })
    }
  }

  let tabs = featureToggles && featureToggles.P5000_VISIBLE
    ? [{
        label: t('buc:form-labelP5000'),
        key: 'P5000'
      }]
    : []

  tabs = tabs.concat([{
    label: t('ui:tags'),
    key: 'tags'
  }, {
    label: t('buc:form-commentForBUC'),
    key: 'comments'
  }])

  useEffect(() => {
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [dispatch, loading, tagList])

  useEffect(() => {
    if (!_allTags && tagList) {
      setAllTags(tagList.map((tag: string) => ({
        value: tag,
        label: t('buc:' + tag)
      })))
    }
  }, [t, _allTags, tagList])

  useEffect(() => {
    if (bucInfo && bucInfo.tags && _tags === undefined) {
      setTags(bucInfo.tags.map((tag: string) => ({
        value: tag,
        label: t('buc:' + tag)
      })))
    }
  }, [bucInfo, t, _tags])

  useEffect(() => {
    if (!_.isEmpty(_fetchingP5000)) {
      const myDocumentIds = _fetchingP5000.map(sed => sed.id)
      const loadedSeds = Object.keys(sedContent)
      const commonSeds = _.intersection(myDocumentIds, loadedSeds)
      if (!_.isEmpty(commonSeds)) {
        const newFetchingP5000 = _.filter(_fetchingP5000, sed => !_.includes(commonSeds, sed.id))
        setFetchingP5000(newFetchingP5000)
        if (_.isEmpty(newFetchingP5000)) {
          displayP5000table()
        }
      }
    }
  }, [displayP5000table, _fetchingP5000, sedContent, setModal])

  return (
    <ThemeProvider theme={_theme}>
      <BUCToolsPanel
        className={className}
        data-test-id='a-buc-c-buctools__panel-id'
      >
        <>
          <HighContrastTabs
            data-test-id='a-buc-c-buctools__tabs-id'
            onChange={(e: any, i: number) => setActiveTab(i)}
            tabs={tabs}
            defaultAktiv={_activeTab}
          />
          <PaddedTabContent>
            {featureToggles && featureToggles.P5000_VISIBLE && tabs[_activeTab].key === 'P5000' && (
              <P5000Div>
                <Undertittel>
                  {t('buc:form-titleP5000')}
                </Undertittel>
                <VerticalSeparatorDiv data-size='0.5' />
                {_modal && (
                  <Modal
                    highContrast={highContrast}
                    data-test-id='a-buc-c-buctools__modal-id'
                    modal={_modal}
                    onModalClose={onModalClose}
                  />
                )}
                <HighContrastKnapp
                  data-amplitude='buc.edit.tools.P5000.view'
                  data-test-id='a-buc-c-buctools__P5000-button-id'
                  disabled={!hasP5000s() || !_.isEmpty(_fetchingP5000)}
                  spinner={!_.isEmpty(_fetchingP5000)}
                  onClick={onGettingP5000sClick}
                >
                  {!_.isEmpty(_fetchingP5000) ? t('ui:loading') : t('buc:form-seeP5000s')}
                </HighContrastKnapp>
              </P5000Div>
            )}
            {tabs[_activeTab].key === 'tags' && (
              <>
                <VerticalSeparatorDiv data-size='0.5' />
                <Normaltekst>
                  {t('buc:form-tagsForBUC-description')}
                </Normaltekst>
                <VerticalSeparatorDiv data-size='0.5' />
                {_tags && !_.isEmpty(_tags) && (
                  <>
                    <dt>
                      <Element>
                        {t('buc:form-tagsForBUC')}:
                      </Element>
                    </dt>
                    <dd>
                      <Normaltekst>
                        {_tags.map((tag: Tag) => tag.label).join(', ')}
                      </Normaltekst>
                    </dd>
                  </>
                )}
                <VerticalSeparatorDiv data-size='0.5' />
                <MultipleSelect<Tag>
                  ariaLabel={t('buc:form-tagsForBUC')}
                  aria-describedby='help-tags'
                  data-test-id='a-buc-c-buctools__tags-select-id'
                  hideSelectedOptions={false}
                  highContrast={highContrast}
                  label=''
                  onSelect={onTagsChange}
                  options={_allTags}
                  placeholder={t('buc:form-tagPlaceholder')}
                  values={_tags || []}
                />
              </>
            )}
            {tabs[_activeTab].key === 'comments' && (
              <>
                <VerticalSeparatorDiv data-size='0.5' />
                <Element>
                  {t('ui:comment')}
                </Element>
                {_originalComments
                  ? (_originalComments as Comments).map((comment: Comment, i: number) => (
                    <CommentDiv
                      data-test-id='a-buc-c-buctools__comment-div-id'
                      key={i}
                    >
                      <Normaltekst>
                        {comment.value}
                      </Normaltekst>
                      <RemoveComment>
                        <Trashcan
                          data-test-id={'a-buc-c-buctools__comment-delete-' + i + '-id'}
                          width={20}
                          color={_theme[themeKeys.MAIN_INTERACTIVE_COLOR]}
                          onClick={() => onDeleteComment(i)}
                        />
                      </RemoveComment>
                    </CommentDiv>
                    ))
                  : (
                    <Normaltekst>
                      {t('ui:noCommentsYet')}
                    </Normaltekst>
                    )}
                <VerticalSeparatorDiv data-size='0.5' />
                <TextArea
                  data-test-id='a-buc-c-buctools__comment-textarea-id'
                  className='skjemaelement__input'
                  label=''
                  value={_comment || ''}
                  onChange={onCommentChange}
                />
                <HighContrastKnapp
                  data-test-id='a-buc-c-buctools__comment-save-button-id'
                  disabled={loading.savingBucsInfo}
                  spinner={loading.savingBucsInfo}
                  onClick={onSaveCommentClick}
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
  initialTab: PT.number,
  onTagChange: PT.func
}

export default BUCTools
