import { LocalStorageEntry, PSED } from 'declarations/app'
import { P5000SED } from 'declarations/p5000'
import _ from 'lodash'

export const getWorkingCopy = <T extends PSED>(entries: Array<LocalStorageEntry<T>>, sedId: string) =>
  _.find(entries, (entry: LocalStorageEntry<T>) => entry.sedId === sedId)

export const updateP5000WorkingCopies = (
  workingCopies: Array<LocalStorageEntry<P5000SED>>,
  newSed: P5000SED | undefined,
  sedId: string
): Array<LocalStorageEntry<P5000SED>> => {
  let newWorkingCopies = _.cloneDeep(workingCopies)

  const existsIndex: number = _.findIndex(newWorkingCopies, e => e.sedId === sedId)
  if (existsIndex >= 0) {
    if (!_.isUndefined(newSed)) {
      newWorkingCopies[existsIndex] = {
        sedId,
        sedType: 'P5000',
        date: new Date().getTime(),
        content: newSed
      }
    } else {
      newWorkingCopies!.splice(existsIndex, 1)
    }
  } else {
    if (!_.isUndefined(newSed)) {
      newWorkingCopies = newWorkingCopies.concat({
        sedId,
        sedType: 'P5000',
        date: new Date().getTime(),
        content: newSed
      })
    }
  }

  return newWorkingCopies
}
