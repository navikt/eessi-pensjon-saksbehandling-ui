import { progressBarAnimation } from '@navikt/hoykontrast'
import styled from 'styled-components'

export const TextDiv = styled.div`
  min-width: 50%;
  transition: width .6s ease;
  background-color: whitesmoke;
  animation: ${progressBarAnimation} 1s linear infinite;
  background-image: linear-gradient(45deg, hsla(90, 90%, 90%, .15) 25%, transparent 0, transparent 50%, hsla(90, 90%, 90%, .15) 0, hsla(90, 90%, 90%, .15) 75%, transparent 0, transparent);
`

const LoadingText = (props: any) => (<TextDiv {...props} />)

export default LoadingText
