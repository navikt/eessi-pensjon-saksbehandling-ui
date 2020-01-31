import { getTagList, saveBucsInfo } from 'actions/buc'
import classNames from 'classnames'
import { Buc, BucInfo, BucsInfo, Tags, ValidBuc } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { Loading } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import './BUCTools.css'

export interface BUCToolsProps {
  aktoerId: string;
  buc: Buc;
  bucInfo: BucInfo;
  className?: string;
  onTagChange ?: (tagList: Tags) => void;
}

export interface BUCToolsSelector {
  loading: Loading;
  bucsInfo?: BucsInfo | undefined;
  tagList?: Array<string> | undefined;
}

const mapState = (state: State): BUCToolsSelector => ({
  loading: state.loading,
  bucsInfo: state.buc.bucsInfo,
  tagList: state.buc.tagList
})

const BUCTools: React.FC<BUCToolsProps> = ({
  aktoerId, buc, bucInfo, className, onTagChange
}: BUCToolsProps): JSX.Element => {
  const { t } = useTranslation()
  const [comment, setComment] = useState<string | undefined >(bucInfo ? bucInfo.comment : '')
  const [allTags, setAllTags] = useState<Tags | undefined>(undefined)
  const [tags, setTags] = useState<Tags>(bucInfo && bucInfo.tags ? bucInfo.tags.map((tag: string) => ({
    value: tag,
    label: t('buc:' + tag)
  })) : [])
  const { loading, bucsInfo, tagList }: BUCToolsSelector = useSelector<State, BUCToolsSelector>(mapState)
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

  const onTagsChange = (tagsList: Tags): void => {
    if (_.isFunction(onTagChange)) {
      onTagChange(tagsList)
    }
    setTags(tagsList)
  }

  const onCommentChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setComment(e.target.value)
  }

  const onSaveButtonClick = (): void => {
    dispatch(saveBucsInfo({
      bucsInfo: bucsInfo!,
      aktoerId: aktoerId,
      tags: tags.map(tag => tag.value),
      comment: comment,
      buc: buc as ValidBuc
    }))
  }

  return (
    <Ui.Nav.EkspanderbartpanelBase
      collapseProps={{ id: 'a-buc-c-buctools__panel-id' }}
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

// @ts-ignore
BUCTools.propTypes = {
  aktoerId: PT.string.isRequired,
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType.isRequired,
  className: PT.string,
  onTagChange: PT.func
}

export default BUCTools
