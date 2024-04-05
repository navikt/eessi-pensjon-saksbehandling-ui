import PersonPanel from 'applications/PersonPanel/PersonPanel'
import ContextBanner from 'components/ContextBanner/ContextBanner'
import TopContainer from 'components/TopContainer/TopContainer'
import { BUCMode } from 'declarations/app'
import { State } from 'declarations/reducers'
import { timeLogger } from 'metrics/loggers'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import BUCIndex from 'applications/BUC'
import {GJENNY, PESYS} from "../../constants/constants";
import BUCIndexGjenny from "../../applications/BUC/BUCIndexGjenny";
import "./CustomGlobalStyles.css";

export interface IndexPageProps {
  username?: string
  indexType?: string
}

export interface IndexPageSelector {
  mode: BUCMode
  username: string | undefined
}

const mapState = (state: State): IndexPageSelector => ({
  mode: state.buc.mode,
  username: state.app.username
})

export const IndexPage: React.FC<IndexPageProps> = ({indexType = "PESYS"}): JSX.Element => {
  const { mode }: IndexPageSelector = useSelector<State, IndexPageSelector>(mapState)
  const [loggedTime] = useState<Date>(new Date())

  useEffect(() => {
    return () => {
      timeLogger('view', loggedTime)
    }
  }, [loggedTime])

  return (
    <TopContainer indexType={indexType}>
      <ContextBanner mode={mode} />
      <VerticalSeparatorDiv />
      <PaddedDiv>
        <PersonPanel />
        <VerticalSeparatorDiv />
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
