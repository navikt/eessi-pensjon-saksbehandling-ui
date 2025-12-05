import _ from 'lodash'
import mockBucs from 'src/mocks/buc/bucs'

export const mockBuc = (rinaCaseId: string) => _.find(mockBucs(), buc => buc.caseId === rinaCaseId)

