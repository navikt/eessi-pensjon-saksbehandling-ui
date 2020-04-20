import { Institution } from 'declarations/buc'
import _ from 'lodash'
import mockBucs from 'mocks/buc/bucs'

export const mockBuc = (rinaCaseId: string) => _.find(mockBucs(), buc => buc.caseId === rinaCaseId)

export const mockParticipants = (rinaCaseId: string) => {
  const buc = mockBuc(rinaCaseId)
  return buc && buc.institusjon ? _.map(buc.institusjon, (i: Institution) => ({
    organisation: {
      countryCode: i.country,
      id: i.institution
    }
  })) : []
}
