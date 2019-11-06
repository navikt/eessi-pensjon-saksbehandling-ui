import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { MultipleSelect, Nav } from 'eessi-pensjon-ui'
import './BUCTools.css'

const BUCTools = ({ actions, aktoerId, buc, bucInfo, bucsInfo, className, loading, onTagChange, t, tagList }) => {
  const [comment, setComment] = useState(bucInfo ? bucInfo.comment : undefined)
  const [allTags, setAllTags] = useState(undefined)
  const [tags, setTags] = useState(bucInfo && bucInfo.tags ? bucInfo.tags.map(tag => ({
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
      setAllTags(tagList.map(tag => ({
        value: tag,
        label: t('buc:' + tag)
      })))
    }
  }, [t, allTags, tagList])

  const onTagsChange = (tagsList) => {
    if (typeof onTagChange === 'function') {
      onTagChange(tagList)
    }
    setTags(tagsList)
  }

  const onCommentChange = (e) => {
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
    <Nav.EkspanderbartpanelBase
      id='a-buc-c-buctools__panel-id'
      className={classNames('a-buc-c-buctools', 's-border', className)}
      heading={
        <Nav.Systemtittel className='a-buc-c-buctools__title'>
          {t('buc:form-BUCtools')}
        </Nav.Systemtittel>
      }
    >
      <Nav.Undertittel className='mb-2'>{t('buc:form-tagsForBUC')}</Nav.Undertittel>
      <div className='mb-3'>
        <Nav.Normaltekst className='mb-2'>{t('buc:form-tagsForBUC-description')}</Nav.Normaltekst>
        <MultipleSelect
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
      <Nav.Undertittel className='mb-2'>{t('buc:form-commentForBUC')}</Nav.Undertittel>
      <Nav.Textarea
        id='a-buc-c-buctools__comment-textarea-id'
        className='a-buc-c-buctools__comment-textarea skjemaelement__input'
        label=''
        value={comment || ''}
        onChange={onCommentChange}
      />
      <Nav.Knapp
        id='a-buc-c-buctools__save-button-id'
        className='a-buc-c-buctools__save-button'
        disabled={loading.savingBucsInfo}
        onClick={onSaveButtonClick}
      >
        {loading.savingBucsInfo ? t('ui:saving') : t('ui:change')}
      </Nav.Knapp>
    </Nav.EkspanderbartpanelBase>
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
