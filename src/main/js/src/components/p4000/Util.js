/* global Uint8Array, ArrayBuffer */

import _ from 'lodash';

class Util {

    // converting text loaded from file to JSON object
    // can't save file.data on JSON, only base64, therefore reconstruct file.data from file.base64
    readEventsFromString(loadedString) {

        return JSON.parse(loadedString).map(event => {
            if (event.startDate) event.startDate = new Date(event.startDate);
            if (event.birthDate) event.birthDate = new Date(event.birthDate);
            if (event.endDate)   event.endDate   = new Date(event.endDate);
            if (event.files) {
                event.files.map(file => {
                    var raw = window.atob(file.base64);
                    var array = new Uint8Array(new ArrayBuffer(raw.length));
                    for (var i = 0; i < raw.length; i++) {
                        array[i] = raw.charCodeAt(i);
                    }
                    file.data = array;
                    return file;
                });
            }
            return event;
        });
    }

    writeEventsToString(events) {

        events.map(event => {
            if (event.files) {
                events.files.map(file => {
                    if (file.data) {
                        delete file.data;
                    }
                    return file;
                });
            }
            return event;
        });
        return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events));
    }


    handleDate(event) {

        switch(event.dateType) {

        case 'both':
            return {
                lukketPeriode: {
                    fom: event.startDate.toGMTString(),
                    tom: event.endDate.toGMTString()
                }
            }
        case 'onlyStartDate01':
            return {
                openPeriode: {
                    extra: '01',
                    fom: event.startDate.toGMTString()
                }
            }
        case 'onlyStartDate98':
            return {
                openPeriode: {
                    extra: '98',
                    fom: event.startDate.toGMTString()
                }
            }

        default:
            return null;
        }
    }

    handleGenericEvent(event) {

        return {
            annenInformasjon: event.other,
            land : event.country.value,
            periode: this.handleDate(event),
            usikkerDatoIndikator: event.uncertainDate
        }
    }

    handleWorkEvent(event) {

        let newEvent = this.handleGenericEvent(event);
        newEvent.addressFirma = {
            by : event.city,
            bygning: event.buildingName,
            gate: event.street,
            region: event.region,
            land: event.country
        };
        delete newEvent.land;
        newEvent.forsikkringEllerRegistreringNr = event.id;
        newEvent.jobbUnderAnsattEllerSelvstendig = event.activity;
        newEvent.navnFirma = event.name;
        return newEvent;
    }

    handleChildEvent(event) {

        let newEvent = this.handleGenericEvent(event);
        newEvent.informasjonBarn = {
            etternavn: event.firstname,
            foedseldato: event.birthDate.toGMTString(),
            fornavn: event.firstname,
            land: event.country
        };
        delete newEvent.land;
        return newEvent;
    }

    handleLearnEvent(event) {

        let newEvent = this.handleGenericEvent(event);
        newEvent.navnPaaInstitusjon = event.name;
        return newEvent;
    }

    convertEvents(events) {

        let p4000 = {};
        events.map(event => {
            switch (event.type) {
            case 'work':
                !_.has(p4000, 'ansattSelvstendigPerioder') ?
                    p4000['ansattSelvstendigPerioder'] = [this.handleWorkEvent(event)] :
                    p4000['ansattSelvstendigPerioder'].push(this.handleWorkEvent(event));
                break;
            case 'home':
                !_.has(p4000, 'boPerioder') ?
                    p4000['boPerioder'] = [this.handleGenericEvent(event)] :
                    p4000['boPerioder'].push(this.handleGenericEvent(event));
                break;
            case 'child':
                !_.has(p4000, 'barnepassPerioder') ?
                    p4000['barnepassPerioder'] = [this.handleChildEvent(event)] :
                    p4000['barnepassPerioder'].push(this.handleChildEvent(event));
                break;
            case 'voluntary':
                !_.has(p4000, 'frivilligPerioder') ?
                    p4000['frivilligPerioder'] = [this.handleGenericEvent(event)] :
                    p4000['frivilligPerioder'].push(this.handleGenericEvent(event));
                break;
            case 'military':
                !_.has(p4000, 'forsvartjenestePerioder') ?
                    p4000['forsvartjenestePerioder'] = [this.handleGenericEvent(event)] :
                    p4000['forsvartjenestePerioder'].push(this.handleGenericEvent(event));
                break;
            case 'birth':
                !_.has(p4000, 'foedselspermisjonPerioder') ?
                    p4000['foedselspermisjonPerioder'] = [this.handleGenericEvent(event)] :
                    p4000['foedselspermisjonPerioder'].push(this.handleGenericEvent(event));
                break;
            case 'learn':
                !_.has(p4000, 'opplaeringPerioder') ?
                    p4000['opplaeringPerioder'] = [this.handleLearnEvent(event)] :
                    p4000['opplaeringPerioder'].push(this.handleLearnEvent(event));
                break;
            case 'daily':
                !_.has(p4000, 'arbeidsledigPerioder') ?
                    p4000['arbeidsledigPerioder'] = [this.handleGenericEvent(event)] :
                    p4000['arbeidsledigPerioder'].push(this.handleGenericEvent(event));
                break;
            case 'sick':
                !_.has(p4000, 'sykePerioder') ?
                    p4000['sykePerioder'] = [this.handleGenericEvent(event)] :
                    p4000['sykePerioder'].push(this.handleGenericEvent(event));
                break;
            case 'other':
                !_.has(p4000, 'andrePerioder') ?
                    p4000['andrePerioder'] = [this.handleGenericEvent(event)] :
                    p4000['andrePerioder'].push(this.handleGenericEvent(event));
                break;
            default:
                return {}
            }
        });

        return p4000;
    }

    convertEventsToP4000 (events) {

        return {
            sed: '4000',
            actorId: 'actorId',
            payload: this.convertEvents(events)
        };
    }
}

const instance = new Util();
Object.freeze(instance);
export default instance;
