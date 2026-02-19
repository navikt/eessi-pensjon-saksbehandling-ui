import React, {JSX} from 'react'
import PersonPanel from 'src/applications/PersonPanel/PersonPanel'
import ContextBanner from 'src/components/ContextBanner/ContextBanner'
import TopContainer from 'src/components/TopContainer/TopContainer'
import {Alert, Box, VStack} from "@navikt/ds-react";
import BUCIndex from 'src/applications/BUC'
import {GJENNY, PESYS} from "src/constants/constants";
import BUCIndexGjenny from "../../applications/BUC/BUCIndexGjenny";
import "./CustomGlobalStyles.css";
import {FeatureToggles} from "src/declarations/app";
import {State} from "src/declarations/reducers";
import {useSelector} from "react-redux";

export interface IndexPageProps {
  username?: string
  indexType?: string
}

export interface IndexPageSelector {
  featureToggles: FeatureToggles
}

const mapState = (state: State): IndexPageSelector => ({
  featureToggles: state.app.featureToggles,
})

const RELEASE_CDM_4_4_WARNING =
  <Alert variant='warning'>
    På grunn av oppgradering til ny datamodell i JINA kan det ikke opprettes nye BUC-er fra fredag 20. februar kl 00:01 til mandag 23. februar kl 06:00.
  </Alert>

const IndexPage: React.FC<IndexPageProps> = ({indexType = "PESYS"}): JSX.Element => {

  const { featureToggles }: IndexPageSelector = useSelector<State, IndexPageSelector>(mapState)

  return (
    <TopContainer indexType={indexType}>
      <VStack gap="4">
        <ContextBanner />
        {featureToggles.RELEASE_CDM_4_4_BANNER &&
           RELEASE_CDM_4_4_WARNING
        }
          <Box padding="4">
            <VStack>
              <PersonPanel />
              {indexType === PESYS &&
                <BUCIndex/>
              }
              {indexType === GJENNY &&
                <BUCIndexGjenny/>
              }
            </VStack>
          </Box>
    </VStack>
    </TopContainer>
  )
}

export default IndexPage
