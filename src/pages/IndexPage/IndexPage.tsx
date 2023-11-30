import { readNotification } from 'actions/pagenotification'
import PageNotification from 'applications/PageNotification'
import PersonPanel from 'applications/PersonPanel/PersonPanel'
import ContextBanner from 'components/ContextBanner/ContextBanner'
import Modal from 'components/Modal/Modal'
import TopContainer from 'components/TopContainer/TopContainer'
import { BUCMode, FeatureToggles } from 'declarations/app'
import { State } from 'declarations/reducers'
import { timeLogger } from 'metrics/loggers'
import { BodyLong } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Column, PaddedDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import BUCIndex from 'applications/BUC'
import {GJENNY, PESYS} from "../../constants/constants";
import BUCIndexGjenny from "../../applications/BUC/BUCIndexGjenny";

export interface IndexPageProps {
  username?: string
  indexType?: string
}

export interface IndexPageSelector {
  featureToggles: FeatureToggles
  mode: BUCMode
  username: string | undefined
  message: string | null | undefined
  show: boolean | undefined
  byline: string | null | undefined
}

const mapState = (state: State): IndexPageSelector => ({
  featureToggles: state.app.featureToggles,
  mode: state.buc.mode,
  username: state.app.username,
  message: state.pagenotification.message,
  show: state.pagenotification.show,
  byline: state.pagenotification.byline

})

export const IndexPage: React.FC<IndexPageProps> = ({indexType = "PESYS"}): JSX.Element => {
  const { featureToggles, mode, message, show, byline }: IndexPageSelector = useSelector<State, IndexPageSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [displayedMessage, setDisplayedMessage] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loggedTime] = useState<Date>(new Date())

  useEffect(() => {
    dispatch(readNotification())
  }, [])

  useEffect(() => {
    if (!displayedMessage && message) {
      setShowModal(true)
      setDisplayedMessage(true)
    }
  }, [message, displayedMessage])

  useEffect(() => {
    return () => {
      timeLogger('view', loggedTime)
    }
  }, [loggedTime])

  const showAdminTools: boolean = featureToggles.ADMIN_NOTIFICATION_MESSAGE === true

  return (
    <TopContainer indexType={indexType}>
      <Modal
        open={showModal && !!show}
        modal={{
          modalTitle: t('ui:notification'),
          modalContent: (
            <div style={{ padding: '2rem', minWidth: '400px', textAlign: 'center' }}>
              <BodyLong>
                {message}
              </BodyLong>
              <VerticalSeparatorDiv />
              <BodyLong>
                {byline}
              </BodyLong>
            </div>
          ),
          modalButtons: [{
            main: true,
            text: 'OK',
            onClick: () => setShowModal(false)
          }]
        }}
        onModalClose={() => setShowModal(false)}
      />
      <ContextBanner mode={mode} />
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <PersonPanel />
        <VerticalSeparatorDiv />
        {showAdminTools
          ? (
            <>
              <Row>
                <Column>
                  <PageNotification />
                </Column>
              </Row>
              <VerticalSeparatorDiv />
            </>
            )
          : null}
        {indexType === PESYS &&
          <BUCIndex/>
        }
        {indexType === GJENNY &&
          <BUCIndexGjenny/>
        }
      </PaddedDiv>
    </TopContainer>
  )
}

export default IndexPage
