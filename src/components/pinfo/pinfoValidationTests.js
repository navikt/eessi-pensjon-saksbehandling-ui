// Validation tests, array index corresponds to step number.
export default [
  [
    {
      key: 'bankName',
      validationTest: (e) => !e ? 'pinfo:validation-noBankName' : false
    },
    {
      key: 'bankAddress',
      validationTest: (e) => !e ? 'pinfo:validation-noBankAddress' : false
    },
    {
      key: 'bankCountry',
      validationTest: (e) => !e ? 'pinfo:validation-noBankCountry' : false
    },
    {
      key: 'bankBicSwift',
      validationTest: (e) => !e ? 'pinfo:validation-noBankBicSwift' : false
    },
    {
      key: 'bankBicSwift',
      validationTest: (e) => !(/[\d\w]+/.test(e)) ? 'pinfo:validation-invalidBankBicSwift' : false
    },
    {
      key: 'bankIban',
      validationTest: (e) => !e ? 'pinfo:validation-noBankIban' : false
    },
    {
      key: 'bankIban',
      validationTest: (e) => !(/[\d\w]+/.test(e)) ? 'pinfo:validation-invalidBankIban' : false
    },
    {
      key: 'bankCode',
      validationTest: (e) => !e ? 'pinfo:validation-noBankCode' : false
    }
  ],
  [
    {
      key: 'userEmail',
      validationTest: (e) => !e ? 'pinfo:validation-noUserEmail' : false
    },
    {
      key: 'userEmail',
      validationTest: (e) => !(/\S+@\S+\.\S+/.test(e)) ? 'pinfo:validation-invalidUserEmail' : false
    },
    {
      key: 'userPhone',
      validationTest: (e) => !e ? 'pinfo:validation-noUserPhone' : false
    }
  ],
  [
    {
      key: 'workType',
      validationTest: (e) => !e || !(/\d\d/.test(e)) ? 'pinfo:validation-noWorkType' : false
    },
    {
      key: 'workStartDate',
      validationTest: (e) => !e ? 'pinfo:validation-noWorkStartDate' : false
    },
    {
      key: 'workEndDate',
      validationTest: (e) => !e ? 'pinfo:validation-noWorkEndDate' : false
    },
    {
      key: 'workEstimatedRetirementDate',
      validationTest: (e) => !e ? 'pinfo:validation-noWorkEstimatedRetirementDate' : false
    },
    {
      key: 'workHourPerWeek',
      validationTest: (e) => !e ? 'pinfo:validation-noWorkHourPerWeek' : false
    },
    {
      key: 'workIncome',
      validationTest: (e) => !e ? 'pinfo:validation-noWorkIncome' : false
    },
    {
      key: 'workIncomeCurrency',
      validationTest: (e) => !e || !e.currency || !(/[A-Z]{3}/.test(e.currency)) ? 'pinfo:validation-noWorkIncomeCurrency' : false
    },
    {
      key: 'workPaymentDate',
      validationTest: (e) => !e ? 'pinfo:validation-noWorkPaymentDate' : false
    },
    {
      key: 'workPaymentFrequency',
      validationTest: (e) => !e || !(/\d\d/.test(e)) ? 'pinfo:validation-noWorkPaymentFrequency' : false
    }
  ],
  [
    {
      key: 'attachmentTypes',
      validationTest: (e) => !e ? 'pinfo:validation-noAttachmentTypes' : false
    }
  ],
  [
    {
      key: 'retirementCountry',
      validationTest: (e) => !e ? 'pinfo:validation-noRetirementCountry' : false
    }
  ]
]
