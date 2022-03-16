import { progressBarAnimation } from '@navikt/hoykontrast'
import styled from 'styled-components/macro'

export const ImageDiv = styled.div`
  min-width: 40px;
  min-height: 40px;
  background-color: whitesmoke;
  border-radius: 100px;
  transition: width .6s ease;
  animation: ${progressBarAnimation} 1s linear infinite;
  background-image: linear-gradient(45deg, hsla(90, 90%, 90%, .15) 25%, transparent 0, transparent 50%, hsla(90, 90%, 90%, .15) 0, hsla(90, 90%, 90%, .15) 75%, transparent 0, transparent);
`
const LoadingImage = (props: any) => (<ImageDiv {...props} />)

export default LoadingImage
