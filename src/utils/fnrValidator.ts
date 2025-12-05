import { idnr } from "@navikt/fnrvalidator";

type NPID_LENGTH_ERROR = 'npid must consist of 11 digits';
type NPIDErrorReason = NPID_LENGTH_ERROR;
type NPIDOkResult = { status: 'valid'; type: 'npid' };
type NPIDErrorResult = { status: 'invalid'; reasons: NPIDErrorReason[]};
type NPIDValidationResult = NPIDOkResult | NPIDErrorResult;

type LENGTH_ERROR = 'fnr, dnr or hnr must consist of 11 digits';
type CHECKSUM_ERROR = "checksums don't match";
type DATE_ERROR = 'invalid date';
type ErrorReason = LENGTH_ERROR | CHECKSUM_ERROR | DATE_ERROR;
type OkResult = { status: 'valid'; type: NrType };
type NrType = 'dnr' | 'fnr' | 'hnr' | 'tnr' | 'dnr-and-hnr' | 'dnr-and-tnr';
type ErrorResult = { status: 'invalid'; reasons: ErrorReason[] };
type ValidationResult = OkResult | ErrorResult;

const elevenDigits = new RegExp('^\\d{11}$')

const isNPID = (digits: string) => {
  return (parseInt(digits.substring(0, 2)) <= 31 && parseInt(digits.substring(2, 4)) >= 21 && parseInt(digits.substring(2, 4)) <= 32)
}

export const validateFnrDnrNpid = (value: string):ValidationResult | NPIDValidationResult => {
  let result: ValidationResult | NPIDValidationResult;
  if (!elevenDigits.test(value)) {
    return {
      status: "invalid",
      reasons: ["npid must consist of 11 digits"]
    }
  }

  if(isNPID(value)){
    result = {
      status: 'valid',
      type: 'npid'
    }
  } else {
    result = idnr(value)
  }

  return result
}
