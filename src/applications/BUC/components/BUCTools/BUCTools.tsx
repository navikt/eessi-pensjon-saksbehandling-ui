import { getTagList, saveBucsInfo } from 'actions/buc'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDP5000 from 'applications/SEDP5000/SEDP5000'
import { BUCMode } from 'applications/BUC/index'
import Trashcan from 'assets/icons/Trashcan'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { AllowedLocaleString, FeatureToggles, Loading } from 'declarations/app.d'

import {
  Buc,
  BucInfo,
  BucsInfo,
  Comment,
  Comments,
  SedContentMap,
  Tag,
  TagRawList,
  Tags,
  ValidBuc
} from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { HoyreChevron } from 'nav-frontend-chevron'
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi'
import NavHighContrast, {
  HighContrastKnapp,
  HighContrastPanel,
  HighContrastTabs,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  slideInFromRight,
  theme,
  themeHighContrast,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'

import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ValueType } from 'react-select'
import styled from 'styled-components'

const BUCToolsPanel = styled(HighContrastPanel)`
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight(20)} 0.3s forwards;
  &.loading {
    background-color: rgba(128,128,128,0.2);
  }
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
const FlexDiv = styled.div`
  display: flex;

`
const P5000Div = styled.div`
  position: relative;
  margin-bottom: 1rem;
`
const PaddedTabContent = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
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
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
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
  aktoerId,
  buc,
  bucInfo,
  initialTab = 0,
  onTagChange,
  setMode
}: BUCToolsProps): JSX.Element => {
  const {
    bucsInfo, featureToggles, highContrast, loading, tagList
  }: BUCToolsSelector = useSelector<State, BUCToolsSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_activeTab, setActiveTab] = useState<number>(initialTab)
  const [_allTags, setAllTags] = useState<Tags | undefined>(undefined)
  const [_comment, setComment] = useState< string | null | undefined >('')

  const [_originalComments, setOriginalComments] = useState<Comments | string | null | undefined >(bucInfo ? bucInfo.comment : '')

  const [_tags, setTags] = useState<Tags | undefined>(undefined)
  const _theme = highContrast ? themeHighContrast : theme

  const onTagsChange = (tagsList: ValueType<Tag, true>): void => {
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

  const onGettingP5000Click = (e: React.MouseEvent): void => {
    buttonLogger(e)
    setMode('p5000', 'forward', undefined, (
      <SEDP5000
        buc={buc}
        setMode={setMode}
        context='overview'
      />
    ))
  }

  const tabs = [{
    label: t('buc:form-labelP5000'),
    key: 'P5000'
  }, {
    label: t('ui:tags'),
    key: 'tags'
  }, {
    label: t('buc:form-commentForBUC'),
    key: 'comments'
  }]

  const hasP5000s = (): boolean => (!_.isEmpty(buc?.seds?.filter(sedFilter).filter(sed => sed.type === 'P5000' && sed.status !== 'cancelled')))

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

  return (
    <NavHighContrast highContrast={highContrast}>
      <BUCToolsPanel
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
            {tabs[_activeTab].key === 'P5000' && (
              <P5000Div>
                <Undertittel>
                  {t('buc:form-titleP5000')}
                </Undertittel>
                <VerticalSeparatorDiv />
                <FlexDiv>
                  <HighContrastKnapp
                    data-amplitude='buc.edit.tools.P5000.view'
                    data-test-id='a-buc-c-buctools__P5000-button-id'
                    disabled={!hasP5000s()}
                    onClick={onGettingP5000Click}
                  >
                    {featureToggles.P5000_SUMMER_VISIBLE ? t('buc:form-seeP5000s') : t('buc:form-viewP5000s')}

                    <HorizontalSeparatorDiv size='0.3' />
                    <HoyreChevron />
                  </HighContrastKnapp>
                </FlexDiv>
              </P5000Div>
            )}
            {tabs[_activeTab].key === 'tags' && (
              <>
                <VerticalSeparatorDiv size='0.5' />
                <Normaltekst>
                  {t('buc:form-tagsForBUC-description')}
                </Normaltekst>
                <VerticalSeparatorDiv size='0.5' />
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
                <VerticalSeparatorDiv size='0.5' />
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
                <VerticalSeparatorDiv size='0.5' />
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
                <VerticalSeparatorDiv size='0.5' />
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
    </NavHighContrast>
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
