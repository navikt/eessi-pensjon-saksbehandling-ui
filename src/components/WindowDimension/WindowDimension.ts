import { useState, useEffect } from 'react'
import { debounce } from 'lodash'

const useWindowDimensions = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = debounce(() => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }, 100)

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  return {
    width: width,
    height: height
  }
}

export default useWindowDimensions
