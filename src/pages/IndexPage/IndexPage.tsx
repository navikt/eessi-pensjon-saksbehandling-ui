import PersonPanel from 'src/applications/PersonPanel/PersonPanel'
import ContextBanner from 'src/components/ContextBanner/ContextBanner'
import TopContainer from 'src/components/TopContainer/TopContainer'
import { BUCMode } from 'src/declarations/app'
import { State } from 'src/declarations/reducers'
import { timeLogger } from 'src/metrics/loggers'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {Box, VStack} from "@navikt/ds-react";
import {VerticalSeparatorDiv } from '@navikt/hoykontrast'
import BUCIndex from 'src/applications/BUC'
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
      <VStack gap="4">
        <ContextBanner mode={mode} />
        <Box padding="4">
          <PersonPanel />
          <VerticalSeparatorDiv />
          {indexType === PESYS &&
            <BUCIndex/>
          }
          {indexType === GJENNY &&
            <BUCIndexGjenny/>
          }
        </Box>
    </VStack>
    </TopContainer>
  )
}

export default IndexPage
