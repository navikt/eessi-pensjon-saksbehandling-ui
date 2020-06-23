import { getSed, getTagList, saveBucsInfo } from 'actions/buc'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDP5000 from 'applications/BUC/components/SEDP5000/SEDP5000'
import classNames from 'classnames'
import { Buc, BucInfo, BucsInfo, SedContentMap, Seds, Tags, ValidBuc } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { AllowedLocaleString, Features, Loading } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
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
  features: Features;
  loading: Loading;
  locale: AllowedLocaleString;
  bucsInfo?: BucsInfo | undefined;
  sedContent: SedContentMap;
  tagList?: Array<string> | undefined;
}

const mapState = (state: State): BUCToolsSelector => ({
  features: state.app.features,
  loading: state.loading,
  locale: state.ui.locale,
  bucsInfo: state.buc.bucsInfo,
  tagList: state.buc.tagList,
  sedContent: state.buc.sedContent
})

const BUCTools: React.FC<BUCToolsProps> = ({
  aktoerId, buc, bucInfo, className, onTagChange
}: BUCToolsProps): JSX.Element => {
  const { t } = useTranslation()
  const [comment, setComment] = useState<string | null | undefined >(bucInfo ? bucInfo.comment : '')
  const [originalComment, setOriginalComment] = useState<string | null | undefined >(bucInfo ? bucInfo.comment : '')
  const [allTags, setAllTags] = useState<Tags | undefined>(undefined)
  const [fetchingP5000, setFetchingP5000] = useState<Seds>([])
  const [modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [timeWithP5000Modal, setTimeWithP5000Modal] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<Tags>(bucInfo && bucInfo.tags ? bucInfo.tags.map((tag: string) => ({
    value: tag,
    label: t('buc:' + tag)
  })) : [])
  const { features, loading, locale, bucsInfo, sedContent, tagList }: BUCToolsSelector = useSelector<State, BUCToolsSelector>(mapState)
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
      modalContent: <SEDP5000 seds={getP5000()!} sedContent={sedContent} locale={locale} />
    })
  }, [setModal, getP5000, locale, sedContent, t])

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
    standardLogger('buc.edit.tools.tags.select', { tags: tagsList.map(t => t.label) })
    setTags(tagsList)
  }

  const onCommentChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setComment(e.target.value)
  }

  const onSaveButtonClick = (): void => {
    if (originalComment !== comment) {
      standardLogger('buc.edit.tools.comment.textarea', { comment: comment })
      setOriginalComment(comment)
    }
    dispatch(saveBucsInfo({
      bucsInfo: bucsInfo!,
      aktoerId: aktoerId,
      tags: tags.map(tag => tag.value),
      comment: comment,
      buc: buc as ValidBuc
    }))
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

  return (
    <Ui.ExpandingPanel
      collapseProps={{ id: 'a-buc-c-buctools__panel-id' }}
      id='a-buc-c-buctools__panel-id'
      open
      className={classNames('a-buc-c-buctools', 's-border', className)}
      heading={
        <Ui.Nav.Systemtittel className='a-buc-c-buctools__title'>
          {t('buc:form-BUCtools')}
        </Ui.Nav.Systemtittel>
      }
    >
      {features && features.P5000_VISIBLE ? (
        <div className='mb-3'>
          <Ui.Nav.Undertittel className='mb-2'>{t('buc:form-titleP5000')}</Ui.Nav.Undertittel>
          {modal ? <Ui.Modal modal={modal} onModalClose={onModalClose} /> : null}
          <Ui.Nav.Knapp
            data-amplitude='buc.edit.tools.P5000.view'
            id='a-buc-c-buctools__p5000-button-id'
            className='a-buc-c-buctools__p5000-button mb-2'
            disabled={!hasP5000s() || !_.isEmpty(fetchingP5000)}
            spinner={!_.isEmpty(fetchingP5000)}
            onClick={onGettingP5000sClick}
          >
            {!_.isEmpty(fetchingP5000) ? t('ui:loading') : t('buc:form-seeP5000s')}
          </Ui.Nav.Knapp>
        </div>
      ) : null}
      <div>
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
      </div>
      <div className='mb-3'>
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
          className='a-buc-c-buctools__save-button mb-2'
          disabled={loading.savingBucsInfo}
          onClick={onSaveButtonClick}
        >
          {loading.savingBucsInfo ? t('ui:saving') : t('ui:change')}
        </Ui.Nav.Knapp>
      </div>
    </Ui.ExpandingPanel>
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
