//BANK
export function bankName (bank, t) {
  return (
    !bank.bankName ?
      t('pinfo:validation-noBankName'):
      false
  )
}
export function bankAddress (bank, t){
    return (
      !bank.bankAddress ?
      t('pinfo:validation-noBankAddress'):
      false
    )
  }
export function bankCountry (bank, t){
    return (
      !bank.bankCountry || (Array.isArray(bank.bankCountry)&&bank.bankCountry.length === 0) ?
      t('pinfo:validation-noBankCountry'):
      false
    )
  }
export function bankBicSwift (bank, t){
    return (
      !bank.bankBicSwift ? t('pinfo:validation-noBankBicSwift')
        : !(/[\d\w]+/.test(bank.bankBicSwift))? t('pinfo:validation-invalidBankBicSwift')
          : false
    )
  }
export function bankIban (bank, t) {
    return (
      !bank.bankIban ? t('pinfo:validation-noBankIban')
        : !(/[\d\w]+/.test(bank.bankIban)) ? t('pinfo:validation-invalidBankIban')
          : false
    )
  }
export function bankCode (bank, t) {
    return (
      !bank.bankCode ? t('pinfo:validation-noBankCode')
        : false
    )
  }

export const bankValidation = {
  bankName,
  bankAddress,
  bankCountry,
  bankBicSwift,
  bankIban,
  bankCode,
}