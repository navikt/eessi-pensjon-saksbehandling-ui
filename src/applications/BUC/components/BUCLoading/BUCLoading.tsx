
import LoadingImage from 'components/Loading/LoadingImage'
import LoadingText from 'components/Loading/LoadingText'
import { HorizontalSeparatorDiv } from 'components/StyledComponents'
import Panel from 'nav-frontend-paneler'
import React from 'react'
import styled from 'styled-components'

const BucPanel = styled(Panel)`
  margin-bottom: 1rem;
  border-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
  border-style: solid;
  border-width: ${({ theme }: any) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  background-color: ${({ theme }: any) => theme['main-background-color']};
  color: ${({ theme }: any) => theme['main-font-color']};
`
const TitleText = styled(LoadingText)`
   min-height: 30px;
   margin-bottom: 0.5rem;
   width: ${(props: any) => ((props.width || 50) + '%')};
   align-self: flex-start;
`
export const ContentText = styled(LoadingText)`
  min-height: 15px;
  margin-bottom: 0.5rem;
  width: ${(props: any) => ((props.width || 50) + '%')};
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
const IconsDiv = styled.div`
  flex: 2;
  display: flex;
  flex-direction: row;
`
export const BUCHeaderDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0rem;
  width: 100%;
`

export const FlagLoading = styled(LoadingImage)`
  height: 48px;
  width: 48px;
  margin-right: 0.5rem;
`

const flagLoader = () => {
  return Array(Math.ceil(Math.random() * 4))
    .fill(0)
    .map((i) => <FlagLoading key={i} />)
}

const BUCLoading = () => {
  return (
    <BucPanel>
      <BUCHeaderDiv>
        <TitleText width={Math.round(Math.random() * 10 + 60)} />
        <FlexDiv>
          <LabelsDiv>
            <ContentText width={Math.round(Math.random() * 10 + 60)} />
            <ContentText width={Math.round(Math.random() * 10 + 60)} />
            <ContentText width={Math.round(Math.random() * 10 + 60)} />
          </LabelsDiv>
          <HorizontalSeparatorDiv />
          <IconsDiv>
            {flagLoader()}
          </IconsDiv>
        </FlexDiv>
      </BUCHeaderDiv>
    </BucPanel>
  )
}

export default BUCLoading
