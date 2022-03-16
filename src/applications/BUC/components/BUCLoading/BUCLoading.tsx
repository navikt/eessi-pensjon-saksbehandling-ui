import { IconsDiv } from 'applications/BUC/components/BUCHeader/BUCHeader'
import LoadingImage from 'components/Loading/LoadingImage'
import LoadingText from 'components/Loading/LoadingText'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import styled from 'styled-components/macro'
import { Panel } from '@navikt/ds-react'

const BucPanel = styled(Panel)`
  margin-bottom: 1rem;
`
const TitleText = styled(LoadingText)`
   min-height: 30px;
   margin-bottom: 0.5rem;
   width: ${(props) => ((props.width || 50) + '%')};
   align-self: flex-start;
`
const ContentText = styled(LoadingText)`
  min-height: 15px;
  margin-bottom: 0.5rem;
  width: ${(props) => ((props.width || 50) + '%')};
`
const FlexDiv = styled.div`
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const LabelsDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`
const FlagLoading = styled(LoadingImage)`
  height: 48px;
  width: 48px;
  margin-right: 0.5rem;
`

const BUCLoading = () => {
  return (
    <BucPanel border>
      <div>
        <TitleText width={Math.round(Math.random() * 10 + 60)} />
        <FlexDiv>
          <LabelsDiv>
            <ContentText width={Math.round(Math.random() * 10 + 60)} />
            <ContentText width={Math.round(Math.random() * 10 + 60)} />
            <ContentText width={Math.round(Math.random() * 10 + 60)} />
          </LabelsDiv>
          <HorizontalSeparatorDiv />
          <IconsDiv>
            {Array(Math.ceil(Math.random() * 4))
              .fill(0)
              .map((i, j) => <FlagLoading key={j} />)}
          </IconsDiv>
        </FlexDiv>
      </div>
    </BucPanel>
  )
}

export default BUCLoading
