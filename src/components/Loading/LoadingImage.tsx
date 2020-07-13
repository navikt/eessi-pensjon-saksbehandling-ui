import React from 'react'
import styled, { keyframes } from 'styled-components'

const progressBarAnimation = keyframes`
  0% {background-position: 1rem 0;} to {background-position: 0 0;}
`

const PlaceholderImage = styled.div`
  min-width: 40px;
  min-height: 40px;
  background-color: whitesmoke;
  border-radius: 100px;
  transition: width .6s ease;
  animation: ${progressBarAnimation} 1s linear infinite;
  background-image: linear-gradient(45deg, hsla(90, 90%, 90%, .15) 25%, transparent 0, transparent 50%, hsla(90, 90%, 90%, .15) 0, hsla(90, 90%, 90%, .15) 75%, transparent 0, transparent);
`

export default (props: any) => (<PlaceholderImage {...props}/>)

