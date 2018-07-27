class Util {

    validateP4000 (p4000) {
    }

    // converting text loaded from file to JSON object still needs us to parse
    // date and convert them
    getEventsFromLoadedJson(loadedString) {

        let events = JSON.parse(loadedString);
        events.map(event => {
            if (event.startDate) event.startDate = new Date(event.startDate);
            if (event.birthDate) event.birthDate = new Date(event.birthDate);
            if (event.endDate)   event.endDate   = new Date(event.endDate)
            return;
        })
        return events;
    }

    convertEventsToP4000 (events) {
        return events;
    }
}

const instance = new Util();
Object.freeze(instance);
export default instance;
