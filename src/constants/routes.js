let BASE = '/_';

export const ROOT  = BASE + '/';

export const PSELV = BASE + '/pselv';
export const PINFO = BASE + '/pinfo';
export const P4000 = BASE + '/P4000';

export const PDF_GENERATE = BASE + '/pdf/generate';
export const PDF_EDIT     = BASE + '/pdf/edit';
export const PDF_SELECT   = BASE + '/pdf/select';

export const CASE_GET               = BASE + '/case/get';
export const CASE_EDIT_WITHOUT_RINA = BASE + '/case/get/:aktoerid/:sakid';
export const CASE_EDIT_WITH_RINA    = BASE + '/case/get/:aktoerid/:sakid/:rinaid';
export const CASE_CONFIRM           = BASE + '/case/confirm';
export const CASE_GENERATE          = BASE + '/case/generate';
export const CASE_SAVE              = BASE + '/case/save';
export const CASE_SEND              = BASE + '/case/send';
