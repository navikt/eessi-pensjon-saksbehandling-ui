import { Validation } from "src/declarations/app";
import { P2200SED } from "src/declarations/p2200";
import performValidation from "src/utils/performValidation";
import { validateForsikretPerson, ValidationForsikretPersonProps } from "src/components/ForsikretPerson/validation";
import { validateYrkesaktivitet, ValidationYrkesaktivitetProps } from "src/components/Yrkesaktivitet/validation";
import { validateYtelser, ValidationYtelserProps } from "src/components/Ytelser/validation";
import { validateEktefelle, ValidationEktefelleProps } from "src/components/Ektefelle/validation";
import { validateBarnArray, ValidationBarnArrayProps } from "src/components/Barn/validation";
import { validateVerge, ValidationVergeProps } from "src/components/Verge/validation";
import { validateBank, ValidationBankProps } from "src/components/InformasjonOmBetaling/validation";
import { validateDiverse, ValidationDiverseProps } from "src/components/Diverse/validation";

export interface ValidationP2200Props {
  P2200SED: P2200SED
}

export const validateP2200 = (
  v: Validation,
  namespace: string,
  { P2200SED }: ValidationP2200Props
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(performValidation<ValidationForsikretPersonProps>(v, `${namespace}-forsikretperson`, validateForsikretPerson, {
    forsikretPerson: P2200SED.nav?.bruker?.person
  }, true))

  hasErrors.push(performValidation<ValidationYrkesaktivitetProps>(v, `${namespace}-yrkesaktivitet`, validateYrkesaktivitet, {
    arbeidsforholdArray: P2200SED.pensjon?.bruker?.arbeidsforhold
  }, true))

  hasErrors.push(performValidation<ValidationYtelserProps>(v, `${namespace}-ytelser`, validateYtelser, {
    ytelser: P2200SED.pensjon?.ytelser,
    sed: P2200SED.sed
  }, true))

  hasErrors.push(performValidation<ValidationEktefelleProps>(v, `${namespace}-ektefelle`, validateEktefelle, {
    ektefelle: P2200SED.nav?.ektefelle
  }, true))

  hasErrors.push(performValidation<ValidationBarnArrayProps>(v, `${namespace}-barn`, validateBarnArray, {
    barnArray: P2200SED.nav?.barn
  }, true))

  hasErrors.push(performValidation<ValidationVergeProps>(v, `${namespace}-verge`, validateVerge, {
    verge: P2200SED.nav?.verge
  }, true))

  const bank = P2200SED.nav?.bruker?.bank
  let sepaIkkeSepa: string | undefined
  if (bank?.konto?.sepa) {
    sepaIkkeSepa = "sepa"
  } else if (bank?.konto?.kontonr || bank?.konto?.ikkesepa) {
    sepaIkkeSepa = "ikkesepa"
  }
  hasErrors.push(performValidation<ValidationBankProps>(v, `${namespace}-informasjonombetaling`, validateBank, {
    bank,
    sepaIkkeSepa
  }, true))

  hasErrors.push(performValidation<ValidationDiverseProps>(v, `${namespace}-diverse-pensjon`, validateDiverse, {
    pensjon: P2200SED.pensjon,
    krav: P2200SED.nav?.krav,
    sed: P2200SED.sed
  }, true))

  return hasErrors.find(value => value) !== undefined
}
