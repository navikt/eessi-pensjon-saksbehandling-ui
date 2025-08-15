import PersonPanel from 'src/applications/PersonPanel/PersonPanel'
import ContextBanner from 'src/components/ContextBanner/ContextBanner'
import TopContainer from 'src/components/TopContainer/TopContainer'
import {Box, VStack} from "@navikt/ds-react";
import BUCIndex from 'src/applications/BUC'
import {GJENNY, PESYS} from "../../constants/constants";
import BUCIndexGjenny from "../../applications/BUC/BUCIndexGjenny";
import "./CustomGlobalStyles.css";

export interface IndexPageProps {
  username?: string
  indexType?: string
}

export const IndexPage: React.FC<IndexPageProps> = ({indexType = "PESYS"}): JSX.Element => {
  return (
    <TopContainer indexType={indexType}>
      <VStack gap="4">
        <ContextBanner />
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
