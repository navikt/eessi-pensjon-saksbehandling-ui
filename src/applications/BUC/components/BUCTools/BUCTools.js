import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Knapp, Normaltekst, Systemtittel, Textarea, Undertittel } from 'components/Nav'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import './BUCTools.css'

const BUCTools = (props) => {
  const { actions, aktoerId, buc, bucInfo, bucsInfo, className, loading, locale, t, tagList } = props
  const [ comment, setComment ] = useState(bucInfo ? bucInfo.comment : undefined)
  const [ allTags, setAllTags ] = useState(undefined)
  const [ tags, setTags ] = useState(bucInfo && bucInfo.tags ? bucInfo.tags.map(tag => {
    return {
      value: tag,
      label: t('buc:tag-' + tag)
    }
  }) : [])

  useEffect(() => {
    if (tagList === undefined && !loading.gettingTagList) {
      actions.getTagList()
    }
  }, [actions, loading, tagList])

  useEffect(() => {
    if (!allTags && tagList) {
      setAllTags(tagList.map(tag => {
        return {
          value: tag,
          label: t('buc:tag-' + tag)
        }
      }))
    }
  }, [t, allTags, tagList])

  const onTagsChange = (tagsList) => {
    setTags(tagsList)
  }

  const onCommentChange = (e) => {
    setComment(e.target.value)
  }

  const onSaveButtonClick = () => {
    actions.saveBucsInfo({
      bucsInfo: bucsInfo,
      aktoerId: aktoerId,
      tags: tags.map(tag => tag.value),
      comment: comment,
      buc: buc
    })
  }

  return <EkspanderbartpanelBase
    id='a-buc-c-buctools__panel-id'
    className={classNames('a-buc-c-buctools', className)}
    heading={<Systemtittel
      className='a-buc-c-buctools__title'>
      {t('buc:form-BUCtools')}
    </Systemtittel>
    }>
    <Undertittel className='mb-2'>{t('buc:form-tagsForBUC')}</Undertittel>
    <div className='mb-3'>
      <Normaltekst className='mb-2'>{t('buc:form-tagsForBUC-description')}</Normaltekst>
      <MultipleSelect
        id='a-buc-c-buctools__tags-select-id'
        className='a-buc-c-buctools__tags-select'
        placeholder={t('buc:form-tagPlaceholder')}
        aria-describedby='help-tags'
        locale={locale}
        values={tags || []}
        hideSelectedOptions={false}
        onChange={onTagsChange}
        optionList={allTags} />
    </div>
    <Undertittel className='mb-2'>{t('buc:form-commentForBUC')}</Undertittel>
    <Textarea
      id='a-buc-c-buctools__comment-textarea-id'
      className='a-buc-c-buctools__comment-textarea'
      label={''}
      value={comment || ''}
      onChange={onCommentChange} />
    <Knapp
      id='a-buc-c-buctools__save-button-id'
      className='a-buc-c-buctools__save-button'
      disabled={loading.savingBucsInfo}
      onClick={onSaveButtonClick}>
      {loading.savingBucsInfo ? t('ui:saving') : t('ui:change')}
    </Knapp>
  </EkspanderbartpanelBase>
}

BUCTools.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string.isRequired,
  buc: PT.object.isRequired,
  bucInfo: PT.object,
  bucsInfo: PT.object,
  className: PT.string,
  loading: PT.object.isRequired,
  locale: PT.string.isRequired,
  t: PT.func.isRequired,
  tagList: PT.array
}

export default BUCTools
