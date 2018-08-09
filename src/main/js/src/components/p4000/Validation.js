
class Validation {

    isEmpty(item) {
        return item === undefined || item === null || item === '' || item === [] || item === {};
    }

    validateChildInfo(event) {


        if (this.isEmpty(event.lastname)) {
            return 'p4000:validation-noLastname';
        }
        if (this.isEmpty(event.firstname)) {
            return 'p4000:validation-noFirstname';
        }
        if (this.isEmpty(event.birthDate)) {
            return 'p4000:validation-noBirthDate';
        }
        if (event.birthDate > new Date()) {
            return 'p4000:validation-birthDateInfuture';
        }
        return undefined;
    }

    validateWorkInfo(event) {

        if (this.isEmpty(event.activity)) {
            return 'p4000:validation-noActivity';
        }
        if (this.isEmpty(event.id)) {
            return 'p4000:validation-noIdNumber';
        }
        if (this.isEmpty(event.name)) {
            return 'p4000:validation-noCompanyName';
        }
        if (this.isEmpty(event.address)) {
            return 'p4000:validation-noAddress';
        }
        if (this.isEmpty(event.city)) {
            return 'p4000:validation-noCityName';
        }
        if (this.isEmpty(event.region)) {
            return 'p4000:validation-noRegionName';
        }
        return undefined;
    }

    validateLearnInfo(event) {

        if (this.isEmpty(event.name)) {
            return 'p4000:validation-noSchoolName';
        }

        return undefined;
    }

    validateOther(event) {

        if (this.isEmpty(event.country)) {
            return 'p4000:validation-noCountry';
        }
        return undefined;
    }

    validateDatePicker(dateType, event) {

        if ( (dateType === 'both' && (!event.startDate || !event.endDate)) ||
              (dateType !== 'both' && !event.startDate)
        )  {
            return 'p4000:validation-insufficientDates';
        }

        if ( (dateType === 'both' && (!(event.startDate instanceof Date) || !(event.endDate instanceof Date) )) ||
           (dateType !== 'both' && !(event.startDate instanceof Date))
        ) {
            return 'p4000:validation-invalidDate';
        }

        if (dateType === 'both' && event.endDate < event.startDate) {
            return 'p4000:validation-endDateEarlierThanStartDate';
        }

        if (event.startDate && event.startDate > new Date()) {
            return 'p4000:validation-startDateCantBeInFuture';
        }

        if (event.endDate && event.endDate > new Date()) {
            return 'p4000:validation-endDateCantBeInFuture';
        }

        return undefined;
    }
}

const instance = new Validation();
Object.freeze(instance);
export default instance;
