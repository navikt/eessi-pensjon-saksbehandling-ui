import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import classNames from 'classnames'
import Icons from 'components/ui/Icons'
import { EkspanderbartpanelBase, Ingress, Normaltekst, Textarea, Flatknapp } from 'components/ui/Nav'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'
import * as bucActions from 'actions/buc'

const mapStateToProps = (state) => {
  return {
    tagList: state.buc.tagList,
    bucsInfo: state.buc.bucsInfo,
    gettingTagList: state.loading.gettingTagList,
    aktoerId: state.app.params.aktoerId,
    savingBucsInfo: state.loading.savingBucsInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(bucActions, dispatch)
  }
}

const BUCTools = (props) => {

  const { t, aktoerId, buc, bucInfo, bucsInfo, savingBucsInfo, tagList, gettingTagList, actions, locale, className } = props
  const [ tags, setTags ] = useState(bucInfo && bucInfo.tags ? bucInfo.tags.map(tag => {
    return {
      value: tag,
      label: t('buc:tag-' + tag)
    }
  }) : [])
  const [ comment, setComment ] = useState(bucInfo ? bucInfo.comment : undefined)
  const [ allTags, setAllTags ] = useState(undefined)

  useEffect(() => {
    if (tagList === undefined && !gettingTagList) {
      actions.getTagList()
    }
  }, [actions, gettingTagList, tagList])

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
      tags: tags,
      comment: comment,
      buc: buc
    })
  }

  const renderTags = () => {
    return <div className='flex-fill'>
      <div className='a-buc-c-buctools__form-tags-label d-flex mb-2 align-items-center'>
        <Icons kind='tilsette' />
        <span className='ml-2'>{t('buc:form-tagsForBUC')}</span>
      </div>
      <div className='mb-3'>
        <Normaltekst className='mb-2'>{t('buc:form-tagsForBUC-description')}</Normaltekst>
        <MultipleSelect
          className='a-buc-c-buctools__tags flex-fill'
          id='a-buc-c-buctools__tags-select-id'
          placeholder={t('buc:form-tagPlaceholder')}
          aria-describedby='help-tags'
          locale={locale}
          values={tags}
          hideSelectedOptions={false}
          onChange={onTagsChange}
          optionList={allTags} />
      </div>
    </div>
  }

  const renderComments = () => {
    return <div className='flex-fill'>
      <div className='a-buc-c-buctools__form-tags-label d-flex mb-2 align-items-center'>
        <Icons kind='tilsette' />
        <span className='ml-2'>{t('buc:form-commentForBUC')}</span>
      </div>
      <Textarea
        label={''}
        value={comment}
        style={{ minHeight: '150px' }}
        onChange={onCommentChange} />
    </div>
  }

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-buctools', className)}
    id='a-buc-c-buctools__panel-id'
    heading={<Ingress
      className='a-buc-c-buctoold__title'>
      {t('buc:form-BUCtools')}
    </Ingress>
    }>
    {renderTags()}
    {renderComments()}
    <Flatknapp
      id='a-buc-c-buctools__form-comments-button'
      className='a-buc-c-buctools__form-button'
      disabled={savingBucsInfo}
      onClick={onSaveButtonClick}>{savingBucsInfo ? t('ui:saving'): t('ui:change')}</Flatknapp>
  </EkspanderbartpanelBase>
}

BUCTools.propTypes = {
  t: PT.func.isRequired,
  buc: PT.object.isRequired,
  className: PT.string
}

export default connect(mapStateToProps, mapDispatchToProps)(BUCTools)
