let BASE = '/_'

export const ROOT = BASE + '/'

export const PSELV = BASE + '/pselv'
export const PINFO = BASE + '/pinfo'
export const PDF   = BASE + '/pdf'
export const P4000 = BASE + '/p4000'

export const P4000_ROUTE = P4000 + '/:page?/:mode?'

export const PDF_GENERATE = PDF + '/generate'
export const PDF_EDIT = PDF + '/edit'
export const PDF_SELECT = PDF + '/select'

export const CASE_GET = BASE + '/case/get'
export const CASE_EDIT = BASE + '/case/get/:aktoerid/:sakid/:rinaid?'
export const CASE_CONFIRM = BASE + '/case/confirm'
export const CASE_GENERATE = BASE + '/case/generate'
export const CASE_SAVE = BASE + '/case/save'
export const CASE_SEND = BASE + '/case/send'
