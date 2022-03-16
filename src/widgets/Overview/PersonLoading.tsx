import LoadingImage from 'components/Loading/LoadingImage'
import LoadingText from 'components/Loading/LoadingText'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import styled from 'styled-components/macro'

const Title = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`
const PlaceholderText = styled(LoadingText)`
   height: 40px;
   min-height: 40px;
   width: 100%;
`
const PersonLoading = () => {
  return (
    <Title>
      <LoadingImage />
      <HorizontalSeparatorDiv />
      <PlaceholderText />
    </Title>
  )
}

export default PersonLoading
