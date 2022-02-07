import personAvdodPdl1 from './personAvdodPdl1'
import personAvdodPdl2 from './personAvdodPdl2'

export default (fnr: string) => {
  const avdods: any = {
    personFarFnr: personAvdodPdl1,
    personMorFnr: personAvdodPdl2
  }

  return avdods[fnr]
}
