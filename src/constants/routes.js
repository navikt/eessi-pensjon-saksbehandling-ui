let BASE = '/_'

export const ROOT = BASE + '/'

export const PSELV = BASE + '/pselv'
export const PINFO = BASE + '/pinfo'
export const PDF = BASE + '/pdf'
export const P4000 = BASE + '/p4000'
export const P6000 = BASE + '/p6000'
export const CASE = BASE + '/case'

export const P4000_ROUTE = P4000 + '/:page?/:mode?'
export const P6000_ROUTE = P6000 + '/:page?/:mode?'

export const PDF_GENERATE = PDF + '/generate'
export const PDF_EDIT = PDF + '/edit'
export const PDF_SELECT = PDF + '/select'

export const CASE_GET = CASE + '/get'
export const CASE_EDIT = CASE + '/get/:aktoerid/:sakid/:rinaid?'
export const CASE_CONFIRM = CASE + '/confirm'
export const CASE_GENERATE = CASE + '/generate'
export const CASE_SAVE = CASE + '/save'
export const CASE_SEND = CASE + '/send'
