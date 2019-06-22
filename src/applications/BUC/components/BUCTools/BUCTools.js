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
    gettingTagList: state.loading.gettingTagList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(bucActions, dispatch)
  }
}

const BUCTools = (props) => {

  const { t, bucInfo, tagList, gettingTagList, actions, locale, className } = props
  const [ tags, setTags ] = useState(bucInfo ? bucInfo.tags.map(tag => {
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

  const onCommentChange = (comment) => {
    setComment(comment)
  }

  const onTagsSave = () => {
  }

  const onCommentSave = () => {
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
      <Flatknapp
        id='a-buc-c-buctools__form-tags-button'
        className='a-buc-c-buctools__form-button smallerButton'
        onClick={onTagsSave}>{t('ui:change')}</Flatknapp>
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
      <Flatknapp
        id='a-buc-c-buctools__form-comments-button'
        className='a-buc-c-buctools__form-button smallerButton'
        onClick={onCommentSave}>{t('ui:change')}</Flatknapp>
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
  </EkspanderbartpanelBase>
}

BUCTools.propTypes = {
  t: PT.func.isRequired,
  buc: PT.object.isRequired,
  className: PT.string
}

export default connect(mapStateToProps, mapDispatchToProps)(BUCTools)
