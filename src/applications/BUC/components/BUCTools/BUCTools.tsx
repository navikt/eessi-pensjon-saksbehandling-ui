import { getSed, getTagList, saveBucsInfo } from 'actions/buc'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDP5000 from 'applications/BUC/components/SEDP5000/SEDP5000'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import Modal from 'components/Modal/Modal'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { VerticalSeparatorDiv } from 'components/StyledComponents'
import { Buc, BucInfo, BucsInfo, SedContentMap, Seds, Tags, ValidBuc } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, Features, Loading } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeLogger } from 'metrics/loggers'
import Knapp from 'nav-frontend-knapper'
import { Textarea } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes, ThemeProvider } from 'styled-components'

export interface BUCToolsProps {
  aktoerId: string;
  buc: Buc;
  bucInfo: BucInfo;
  className?: string;
  onTagChange ?: (tagList: Tags) => void;
}

export interface BUCToolsSelector {
  features: Features
  highContrast: boolean
  loading: Loading
  locale: AllowedLocaleString
  bucsInfo?: BucsInfo | undefined
  sedContent: SedContentMap
  tagList?: Array<string> | undefined
}

const mapState = (state: State): BUCToolsSelector => ({
  features: state.app.features,
  highContrast: state.ui.highContrast,
  loading: state.loading,
  locale: state.ui.locale,
  bucsInfo: state.buc.bucsInfo,
  tagList: state.buc.tagList,
  sedContent: state.buc.sedContent
})

const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
const BUCToolsPanel = styled(ExpandingPanel)`
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight} 0.3s forwards;
  background ${({theme}): any => theme['main-background-color']};
  border: 1px solid ${({theme}): any => theme['main-disabled-color']};
  border-radius: 4px;
  .ekspanderbartPanel__hode {
    background ${({theme}): any => theme['main-background-color']};
  }
`
const P5000Div = styled.div`
  margin-bottom: 1rem;
`
const TextArea = styled(Textarea)`
  min-height: 150px;
  width: 100%;
`
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
  const { features, highContrast, loading, locale, bucsInfo, sedContent, tagList }: BUCToolsSelector = useSelector<State, BUCToolsSelector>(mapState)
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

  const onCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
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
    <ThemeProvider theme={highContrast ? themeHighContrast: theme}>
      <BUCToolsPanel
        collapseProps={{ id: 'a-buc-c-buctools__panel-id' }}
        data-testId='a-buc-c-buctools__panel-id'
        open
        className={className}
        heading={
          <Systemtittel data-testId='a-buc-c-buctools__title'>
            {t('buc:form-BUCtools')}
          </Systemtittel>
        }
      >
        <>
          {features && features.P5000_VISIBLE && (
            <P5000Div>
              <Undertittel className='mb-2'>{t('buc:form-titleP5000')}</Undertittel>
              {modal ? <Modal modal={modal} onModalClose={onModalClose} /> : null}
              <Knapp
                data-amplitude='buc.edit.tools.P5000.view'
                id='a-buc-c-buctools__p5000-button-id'
                className='a-buc-c-buctools__p5000-button mb-2'
                disabled={!hasP5000s() || !_.isEmpty(fetchingP5000)}
                spinner={!_.isEmpty(fetchingP5000)}
                onClick={onGettingP5000sClick}
              >
                {!_.isEmpty(fetchingP5000) ? t('ui:loading') : t('buc:form-seeP5000s')}
              </Knapp>
            </P5000Div>
          )}
          <Undertittel>
            {t('buc:form-tagsForBUC')}
          </Undertittel>
          <VerticalSeparatorDiv data-size='0.5'/>
          <Normaltekst>
            {t('buc:form-tagsForBUC-description')}
          </Normaltekst>
          <MultipleSelect
            ariaLabel={t('buc:form-tagsForBUC')}
            label=''
            data-testId='a-buc-c-buctools__tags-select-id'
            placeholder={t('buc:form-tagPlaceholder')}
            aria-describedby='help-tags'
            values={tags || []}
            hideSelectedOptions={false}
            onSelect={onTagsChange}
            options={allTags}
          />
          <VerticalSeparatorDiv data-size='1'/>
          <Undertittel>
            {t('buc:form-commentForBUC')}
          </Undertittel>
          <VerticalSeparatorDiv data-size='0.5'/>
          <TextArea
            id='a-buc-c-buctools__comment-textarea-id'
            className='skjemaelement__input'
            label=''
            value={comment || ''}
            onChange={onCommentChange}
          />
          <Knapp
            data-id='a-buc-c-buctools__save-button-id'
            disabled={loading.savingBucsInfo}
            onClick={onSaveButtonClick}
          >
            {loading.savingBucsInfo ? t('ui:saving') : t('ui:change')}
          </Knapp>
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
  onTagChange: PT.func
}

export default BUCTools
