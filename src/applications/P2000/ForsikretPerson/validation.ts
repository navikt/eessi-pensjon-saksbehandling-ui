import {Validation} from "src/declarations/app";
import performValidation from "src/utils/performValidation";
import {
  validateUtenlandskePINs,
  ValidationUtenlandskePINsProps
} from "src/components/UtenlandskePin/validation";
import _ from "lodash";
import {
  validateFamilieStatusArray,
  ValidationFamilieStatusArrayProps
} from "src/applications/P2000/FamilieStatus/validation";
import {
  validateTelefonNumre,
  ValidationTelefonNumreProps
} from "src/applications/P2000/Telefon/validation";
import {validateEpostAdresser, ValidationEpostAdresserProps} from "src/applications/P2000/Epost/validation";
import {Person, PIN} from "src/declarations/sed";
import {checkIfEmpty, checkIfTooLong} from "src/utils/validation";

export interface ValidationForsikretPersonProps {
  forsikretPerson: Person | undefined
}

export const validateForsikretPerson = (
  v: Validation,
  namespace: string,
  {
    forsikretPerson
  }: ValidationForsikretPersonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const utenlandskePINs: Array<PIN> = _.filter(forsikretPerson?.pin, p => p.land !== 'NO')

  if(forsikretPerson?.foedested && (!_.isEmpty(forsikretPerson.foedested.land) || !_.isEmpty(forsikretPerson.foedested.by))) {
    const foedested = forsikretPerson?.foedested
    hasErrors.push(checkIfEmpty(v, {
      needle: foedested?.land,
      id: namespace + '-foedested-land',
      message: 'validation:missing-p2000-foedested-land'
    }))

    hasErrors.push(checkIfEmpty(v, {
      needle: foedested?.by,
      id: namespace + '-foedested-by',
      message: 'validation:missing-p2000-foedested-by'
    }))

    hasErrors.push(checkIfTooLong(v, {
      needle: foedested?.by,
      id: namespace + '-by',
      max: 65,
      message: 'validation:textOverX'
    }))
  }

  hasErrors.push(performValidation<ValidationUtenlandskePINsProps>(v, namespace + '-pin', validateUtenlandskePINs, {
    utenlandskePINs: utenlandskePINs
  }, true))

  hasErrors.push(performValidation<ValidationFamilieStatusArrayProps>(v, namespace + '-sivilstand', validateFamilieStatusArray, {
    sivilstandArray: forsikretPerson?.sivilstand
  }, true))

  hasErrors.push(performValidation<ValidationTelefonNumreProps>(v, namespace + '-person-kontakt-telefon', validateTelefonNumre, {
    telefonNumre: forsikretPerson?.kontakt?.telefon
  }, true))

  hasErrors.push(performValidation<ValidationEpostAdresserProps>(v, namespace + '-person-kontakt-email', validateEpostAdresser, {
    epostAdresser: forsikretPerson?.kontakt?.email
  }, true))

  return hasErrors.find(value => value) !== undefined
}
