import { useParams } from 'react-router'

const Doc = () => {

  let params: any = useParams()
  return <div>yo {params?.id1} {params?.id2}</div>
}

export default Doc
