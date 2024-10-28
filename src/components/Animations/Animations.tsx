import { keyframes } from 'styled-components'

export const animationOpen = (howmuch: string | number = 10) => {
  return keyframes`
  0% {
    height: 0%;
    max-height: 0;
  }
  100% {
    max-height: ${howmuch}rem;
    height: 100%;
  }
`
}
export const animationClose = (howmuch: string | number = 10) => {
  return keyframes`
  0% {
    max-height: ${howmuch}rem;
    height: 100%;
  }
  100% {
    max-height: 0;
    height: 0%;
  }
`
}
export const animationLeft = (howmuch: string | number = 21.5) => {
  return keyframes`
  0% {
    margin-left: ${howmuch}rem;
  }
  100% {
    margin-left: 0px;
  }
`
}
export const animationRight = (howmuch: string | number = 21.5) => {
  return keyframes`
    0% {
    margin-left: 0px;
  }
  100% {
    margin-left: ${howmuch}rem;
  }
`
}
export const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`
export const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`
export const progressBarAnimation = keyframes`
  0% {background-position: 1rem 0;} to {background-position: 0 0;}
`
export const rotating = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
export const slideInFromRight = (howmuch: string | number = 20) => {
  return keyframes`
  0% {
    opacity: 0;
    transform: translateX(${howmuch}px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
}
export const slideInFromLeft = (howmuch: string | number = 20) => {
  return keyframes`
  0% {
    opacity: 0;
    transform: translateX(-${howmuch}px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
}
export const slideInFromTop = (howmuch: string | number = 20) => {
  return keyframes`
  0% {
    opacity: 0;
    transform: translateY(-${howmuch}px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`
}
export const slideInFromBottom = (howmuch: string | number = 20) => {
  return keyframes`
  0% {
    opacity: 0;
    transform: translateY(${howmuch}px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`
}
