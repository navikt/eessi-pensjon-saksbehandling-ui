import { Buc, BucInfo, BucsInfo, Tags } from 'applications/BUC/declarations/buc'
import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { ActionCreators, Loading, T } from 'types'
import './BUCTools.css'

export interface BUCToolsProps {
  actions: ActionCreators;
  aktoerId: string;
  buc: Buc;
  bucInfo: BucInfo;
  bucsInfo: BucsInfo;
  className?: string;
  loading: Loading;
  onTagChange ?: (tagList: Tags) => void;
  t: T;
  tagList: Array<string> | undefined;
}

const BUCTools = (
  { actions, aktoerId, buc, bucInfo, bucsInfo, className, loading, onTagChange, t, tagList }: BUCToolsProps
) => {
  const [comment, setComment] = useState<string | undefined>(bucInfo ? bucInfo.comment : undefined)
  const [allTags, setAllTags] = useState<Tags>([])
  const [tags, setTags] = useState(bucInfo && bucInfo.tags ? bucInfo.tags.map((tag: string) => ({
    value: tag,
    label: t('buc:' + tag)
  })) : [])

  useEffect(() => {
    if (tagList === undefined && !loading.gettingTagList) {
      actions.getTagList()
    }
  }, [actions, loading, tagList])

  useEffect(() => {
    if (!allTags && tagList) {
      setAllTags(tagList.map((tag: string) => ({
        value: tag,
        label: t('buc:' + tag)
      })))
    }
  }, [t, allTags, tagList])

  const onTagsChange = (tagsList: Tags) => {
    if (_.isFunction(onTagChange)) {
      onTagChange(tagsList)
    }
    setTags(tagsList)
  }

  const onCommentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setComment(e.target.value)
  }

  const onSaveButtonClick = () => {
    actions.saveBucsInfo({
      bucsInfo: bucsInfo,
      aktoerId: aktoerId,
      tags: tags,
      comment: comment,
      buc: buc
    })
  }

  return (
    <Ui.Nav.EkspanderbartpanelBase
      id='a-buc-c-buctools__panel-id'
      className={classNames('a-buc-c-buctools', 's-border', className)}
      heading={
        <Ui.Nav.Systemtittel className='a-buc-c-buctools__title'>
          {t('buc:form-BUCtools')}
        </Ui.Nav.Systemtittel>
      }
    >
      <Ui.Nav.Undertittel className='mb-2'>{t('buc:form-tagsForBUC')}</Ui.Nav.Undertittel>
      <div className='mb-3'>
        <Ui.Nav.Normaltekst className='mb-2'>{t('buc:form-tagsForBUC-description')}</Ui.Nav.Normaltekst>
        <Ui.MultipleSelect
          ariaLabel={t('buc:form-tagsForBUC')}
          label={t('buc:form-tagsForBUC')}
          id='a-buc-c-buctools__tags-select-id'
          className='a-buc-c-buctools__tags-select'
          placeholder={t('buc:form-tagPlaceholder')}
          aria-describedby='help-tags'
          values={tags || []}
          hideSelectedOptions={false}
          onSelect={onTagsChange}
          options={allTags}
        />
      </div>
      <Ui.Nav.Undertittel className='mb-2'>{t('buc:form-commentForBUC')}</Ui.Nav.Undertittel>
      <Ui.Nav.Textarea
        id='a-buc-c-buctools__comment-textarea-id'
        className='a-buc-c-buctools__comment-textarea skjemaelement__input'
        label=''
        value={comment || ''}
        onChange={onCommentChange}
      />
      <Ui.Nav.Knapp
        id='a-buc-c-buctools__save-button-id'
        className='a-buc-c-buctools__save-button'
        disabled={loading.savingBucsInfo}
        onClick={onSaveButtonClick}
      >
        {loading.savingBucsInfo ? t('ui:saving') : t('ui:change')}
      </Ui.Nav.Knapp>
    </Ui.Nav.EkspanderbartpanelBase>
  )
}

BUCTools.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string.isRequired,
  buc: PT.object.isRequired,
  bucInfo: PT.object,
  bucsInfo: PT.object,
  className: PT.string,
  loading: PT.object.isRequired,
  onTagChange: PT.func,
  t: PT.func.isRequired,
  tagList: PT.array
}

export default BUCTools
