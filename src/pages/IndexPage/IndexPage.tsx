import React, {JSX} from 'react'
import PersonPanel from 'src/applications/PersonPanel/PersonPanel'
import ContextBanner from 'src/components/ContextBanner/ContextBanner'
import TopContainer from 'src/components/TopContainer/TopContainer'
import {Alert, Box, VStack} from "@navikt/ds-react";
import BUCIndex from 'src/applications/BUC'
import {GJENNY, PESYS} from "src/constants/constants";
import BUCIndexGjenny from "../../applications/BUC/BUCIndexGjenny";
import "./CustomGlobalStyles.css";
import featureToggles from "src/mocks/app/featureToggles";

export interface IndexPageProps {
  username?: string
  indexType?: string
}

const RELEASE_CDM_4_4_WARNING =
  <Alert variant='warning'>
    Det vil ikke være mulig å opprette ny buc fredag 20.12.26
  </Alert>

const IndexPage: React.FC<IndexPageProps> = ({indexType = "PESYS"}): JSX.Element => {
  return (
    <TopContainer indexType={indexType}>
      <VStack gap="4">
        <ContextBanner />
        {featureToggles.RELEASE_CDM_4_4 &&
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
