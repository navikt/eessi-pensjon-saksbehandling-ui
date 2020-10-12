import { keyframes } from 'styled-components'

export const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
export const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
export const animationOpen = keyframes`
  0% {
    height: 0%;
    max-height: 0;
  }
  100% {
    max-height: 150em;
    height: 100%;
  }
`
export const animationClose = keyframes`
  0% {
    max-height: 150em;
    height: 100%;
  }
  100% {
    max-height: 0;
    height: 0%;
  }
`
export const rotating = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
export const fadeIn = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 1; }
`
export const fadeOut = keyframes`
  0% { opacity: 1; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`
export const progressBarAnimation = keyframes`
  0% {background-position: 1rem 0;} to {background-position: 0 0;}
`
