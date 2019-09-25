import React, { useEffect, useState, useCallback } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { AlertStripe, Hovedknapp, NavFrontendSpinner, Row, Undertittel, Veileder } from 'components/Nav'
import Icons from 'components/Icons'
import RefreshButton from 'components/RefreshButton/RefreshButton'
import { ReactComponent as VeilederSVG } from 'resources/images/NavPensjonVeileder.svg'
const VarslerPanel = (props) => {
  const { actions, aktoerId, file, fileList, isInvitingPinfo, invite, sakId, sakType, t } = props

  const [isReady, setIsReady] = useState(false)
  const [_fileList, setFileList] = useState(undefined)
  const [_files, setFiles] = useState({})
  const [mounted, setMounted] = useState(false)

  const onInviteButtonClick = () => {
    actions.sendInvite({
      aktoerId: aktoerId,
      sakId: sakId
    })
  }

  useEffect(() => {
    if (!mounted) {
      if (aktoerId && sakId && fileList === undefined) {
        actions.listStorageFiles(aktoerId, 'varsler___' + sakId)
      }
      setMounted(true)
    }
  }, [actions, aktoerId, sakId, fileList, mounted])

  useEffect(() => {
    if (fileList !== undefined && _fileList === undefined) {
      fileList.map(file => {
        actions.getStorageFile({
          userId: aktoerId,
          namespace: 'varsler',
          file: sakId + '___' + file
        }, {
          notification: false
        })
        return file
      })

      setIsReady(_.isEmpty(fileList))
      setFileList(fileList)
    }

    if (file !== undefined && !isReady) {
      const files = _.cloneDeep(_files)
      const key = file.timestamp + '.json'
      if (!Object.prototype.hasOwnProperty.call(files, key)) {
        files[key] = file
        const allFilesDone = Object.keys(files).length === fileList.length
        setFiles(files)
        setIsReady(allFilesDone)
      }
    }
  }, [actions, aktoerId, fileList, _fileList, _files, file, isReady, sakId])

  const onRefreshHandle = useCallback(() => {
    if (aktoerId && sakId) {
      setFileList(undefined)
      setFiles({})
      setIsReady(false)
      actions.listStorageFiles(aktoerId, 'varsler___' + sakId)
    }
  }, [actions, aktoerId, sakId])

  return (
    <div className='w-overview-varslerPanel'>
      <Row>
        <div className='col-md-4'>
          {/* <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakId')}</label>: {sakId}</div>
          <div><label className='skjemaelement__label d-inline-block'>{t('ui:aktoerId')}</label>: {aktoerId}</div>
          <div><label className='skjemaelement__label d-inline-block'>{t('pinfo:sb-sakType')}</label>: {sakType}</div> */}
          <Veileder
            tekst={(
              <div dangerouslySetInnerHTML={{ __html: t('ui:widget-overview-sendNotification-description', { user: aktoerId }) }} />
            )}
            posisjon='høyre'
          >
            <VeilederSVG />
          </Veileder>
          <div className='text-center'>
            <Hovedknapp
              id='pinfo-forward-button'
              className='forwardButton mt-3'
              disabled={isInvitingPinfo}
              spinner={isInvitingPinfo}
              onClick={onInviteButtonClick}
            >
              {isInvitingPinfo ? t('sending') : t('ui:widget-overview-sendNotification-button')}
            </Hovedknapp>
          </div>
          {!_.isEmpty(invite) ? (
            <AlertStripe
              className='mt-4 mb-4' type={invite.status === 'ERROR' ? 'advarsel' : 'suksess'}
            >
              {t(invite.message)}
            </AlertStripe>
          ) : null}
        </div>
        <div className='col-md-8'>
          <div className='w-overview-varslerPanel__title'>
            {/* <Undertittel>{t('ui:widget-overview-sendNotification-title')}</Undertittel> */}
            <div />
            <RefreshButton t={t} rotating={!isReady} onRefreshClick={onRefreshHandle} />
          </div>
          {!isReady ? (
            <div className='text-center' style={{ paddingTop: '3rem' }}>
              <NavFrontendSpinner />
              <p className='typo-normal'>{t('ui:loading')}</p>
            </div>
          ) : (
            <table className='w-100 mt-2'>
              <thead>
                <tr style={{ borderBottom: '1px solid lightgrey' }}>
                  <th />
                  <th>{t('ui:sentDocuments')}</th>
                  <th>{t('ui:sender')}</th>
                  <th>{t('ui:dateandtime')}</th>
                </tr>
              </thead>
              <tbody>
                {_files && !_.isEmpty(_files)
                  ? (
                    Object.keys(_files)
                      .sort((a, b) => _files[b].timestamp.localeCompare(_files[a].timestamp))
                      .map((file, index) => {
                        const content = _files[file]
                        return (
                          <tr className='slideAnimate' style={{ animationDelay: index * 0.03 + 's' }} key={file}>
                            <td><Icons kind='nav-message-sent' /></td>
                            <td>{content.tittel || file}</td>
                            <td>{content.fulltnavn || t('unknown')}</td>
                            <td>{content.timestamp ? new Date(content.timestamp).toDateString() : t('unknown')}</td>
                          </tr>
                        )
                      })
                  ) : (
                    <tr>
                      <td colSpan={4} align='center' className='p-2 font-italic'>{t('ui:widget-overview-sendNotification-noMessages')}</td>
                    </tr>
                  )}
              </tbody>
            </table>
          )}

        </div>
      </Row>
    </div>
  )
}

VarslerPanel.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  file: PT.object,
  fileList: PT.array,
  isInvitingPinfo: PT.bool,
  invite: PT.object,
  sakId: PT.string,
  sakType: PT.string,
  t: PT.func.isRequired
}

export default VarslerPanel
