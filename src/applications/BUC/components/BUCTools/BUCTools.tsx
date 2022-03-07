import { getTagList, saveBucsInfo } from 'actions/buc'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import P5000 from 'applications/P5000/P5000'
import { Delete, NextFilled } from '@navikt/ds-icons'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { AllowedLocaleString, BUCMode, FeatureToggles, Loading } from 'declarations/app.d'
import {
  Buc,
  BucInfo,
  BucsInfo,
  Comment,
  Comments,
  Tag,
  TagRawList,
  Tags,
  ValidBuc
} from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Detail, BodyLong, Heading, Loader, Button, Panel, Textarea } from '@navikt/ds-react'
import {
  HorizontalSeparatorDiv,
  slideInFromRight,
  VerticalSeparatorDiv,
  HighContrastTabs
} from '@navikt/hoykontrast'

import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { P5000sFromRinaMap } from 'declarations/p5000'

const BUCToolsPanel = styled(Panel)`
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight(20)} 0.3s forwards;
  &.loading {
    background-color: rgba(128,128,128,0.2);
  }
`
const CommentDiv = styled.div`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: var(--navds-semantic-color-border);
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
export const TextArea = styled(Textarea)`
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
  loading: Loading
  locale: AllowedLocaleString
  p5000sFromRinaMap: P5000sFromRinaMap
  tagList?: TagRawList | undefined
}

const mapState = (state: State): BUCToolsSelector => ({
  bucsInfo: state.buc.bucsInfo,
  featureToggles: state.app.featureToggles,
  loading: state.loading,
  locale: state.ui.locale,
  p5000sFromRinaMap: state.buc.p5000sFromRinaMap,
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
    bucsInfo, featureToggles, loading, tagList
  }: BUCToolsSelector = useSelector<State, BUCToolsSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_activeTab, setActiveTab] = useState<number>(initialTab)
  const [_allTags, setAllTags] = useState<Tags | undefined>(undefined)
  const [_comment, setComment] = useState< string | null | undefined >('')

  const [_originalComments, setOriginalComments] = useState<Comments>(() => {
    return bucInfo
      ? _.isString(bucInfo.comment)
          ? [{ value: bucInfo.comment }]
          : bucInfo.comment!
      : []
  })

  const [_tags, setTags] = useState<Tags | undefined>(undefined)

  const onTagsChange = (tagsList: unknown): void => {
    if (tagsList) {
      if (_.isFunction(onTagChange)) {
        onTagChange(tagsList as Tags)
      }
      standardLogger('buc.edit.tools.tags.select', { tags: (tagsList as Tags)?.map(t => t.label) || [] })
      setTags(tagsList as Tags)
      dispatch(saveBucsInfo({
        bucsInfo: bucsInfo!,
        aktoerId,
        tags: (tagsList as Tags)?.map((tag: Tag) => tag.value) ?? [],
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
    const newOriginalComments: Comments = _.cloneDeep(_originalComments)

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
      aktoerId,
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
        aktoerId,
        tags: _tags ? _tags.map(tag => tag.value) : [],
        comment: newOriginalComments,
        buc: buc as ValidBuc
      }))
    }
  }

  const onGettingP5000Click = (e: React.MouseEvent): void => {
    buttonLogger(e)
    setMode('p5000', 'forward', undefined, (
      <P5000
        buc={buc}
        setMode={setMode}
        context='overview'
      />
    ))
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
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

    <BUCToolsPanel
      border
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
              <Heading size='small'>
                {t('buc:form-titleP5000')}
              </Heading>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <Button
                  variant='secondary'
                  data-amplitude='buc.edit.tools.P5000.view'
                  data-test-id='a-buc-c-buctools__P5000-button-id'
                  disabled={!hasP5000s()}
                  onClick={onGettingP5000Click}
                >
                  {featureToggles.P5000_SUMMER_VISIBLE ? t('buc:form-seeP5000s') : t('buc:form-viewP5000s')}

                  <HorizontalSeparatorDiv size='0.3' />
                  <NextFilled />
                </Button>
              </FlexDiv>
            </P5000Div>
          )}
          {tabs[_activeTab].key === 'tags' && (
            <>
              <VerticalSeparatorDiv size='0.5' />
              <BodyLong>
                {t('buc:form-tagsForBUC-description')}
              </BodyLong>
              <VerticalSeparatorDiv size='0.5' />
              {_tags && !_.isEmpty(_tags) && (
                <>
                  <dt>
                    <Detail>
                      {t('buc:form-tagsForBUC')}:
                    </Detail>
                  </dt>
                  <dd>
                    <BodyLong>
                      {_tags.map((tag: Tag) => tag.label).join(', ')}
                    </BodyLong>
                  </dd>
                </>
              )}
              <VerticalSeparatorDiv size='0.5' />
              <MultipleSelect<Tag>
                ariaLabel={t('buc:form-tagsForBUC')}
                aria-describedby='help-tags'
                data-test-id='a-buc-c-buctools__tags-select-id'
                hideSelectedOptions={false}
                onSelect={onTagsChange}
                options={_allTags}
                label={t('buc:form-tagsForBUC')}
                values={_tags || []}
              />
            </>
          )}
          {tabs[_activeTab].key === 'comments' && (
            <>
              <VerticalSeparatorDiv size='0.5' />
              <Detail>
                {t('ui:comment')}
              </Detail>
              {_originalComments
                ? (_originalComments as Comments)?.map((comment: Comment, i: number) => (
                  <CommentDiv
                    data-test-id='a-buc-c-buctools__comment-div-id'
                    key={i}
                  >
                    <BodyLong>
                      {comment.value}
                    </BodyLong>
                    <RemoveComment>
                      <Delete
                        data-test-id={'a-buc-c-buctools__comment-delete-' + i + '-id'}
                        width={20}
                        onClick={() => onDeleteComment(i)}
                      />
                    </RemoveComment>
                  </CommentDiv>
                  ))
                : (
                  <BodyLong>
                    {t('ui:noCommentsYet')}
                  </BodyLong>
                  )}
              <VerticalSeparatorDiv size='0.5' />
              <TextArea
                data-test-id='a-buc-c-buctools__comment-textarea-id'
                className='skjemaelement__input'
                label=''
                value={_comment || ''}
                onChange={onCommentChange}
              />
              <Button
                variant='secondary'
                data-test-id='a-buc-c-buctools__comment-save-button-id'
                disabled={loading.savingBucsInfo}
                onClick={onSaveCommentClick}
              >
                {loading.savingBucsInfo && <Loader />}
                {loading.savingBucsInfo ? t('ui:saving') : t('ui:add')}
              </Button>
            </>
          )}

        </PaddedTabContent>
      </>
    </BUCToolsPanel>
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
