
const validReferrers = ['pinfo', 'pselv', 'p4000'];

export function validateReferrer (referrer) {
    return validReferrers.indexOf(referrer) !== -1
}
