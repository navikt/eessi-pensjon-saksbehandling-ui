import { IS_TEST } from 'constants/environment'
import * as urls from 'constants/urls'
import _ from 'lodash'
import mockJoarkRaw from 'mocks/joark/joarkRaw'

interface JoarkPayload {
  fileName: string | undefined;
  contentType: string;
  filInnhold: string;
}

export default (journalpostId: string): JoarkPayload | undefined => {
  if (urls.HOST === 'localhost' && !IS_TEST) {
    const item = _.find(mockJoarkRaw.mockdata.data.dokumentoversiktBruker.journalposter, { journalpostId: journalpostId })
    const tittel: /* istanbul ignore next */ string = item ? item.tittel : 'red.pdf'
    return {
      fileName: tittel,
      contentType: 'application/pdf',
      filInnhold: mockJoarkRaw.files[tittel]
    }
  }
  return undefined
}
