# language: no

@p4000
Egenskap: P4000 som saksbehandler

Beskrivelse: Som en saksbehandler
    Jeg vil logge inn og bruker nettsiden
    Så jeg kan opprett, fyller ut og sende en P4000

Bakgrunn: Sett opp nettleser

    Gitt at jeg åpen nettleseren
    Og sett opp P4000 parametere
    Og jeg besøker test nettsiden
    Og jeg logg inn som 'Z990511'
    Og jeg ser menyalternativ 'Begynner ny P4000'
    Og klikk til menyalternativ 'Begynner ny P4000'

Scenario: Saksbehandler skal opprett en ny P4000

    Gitt at jeg er på nettsiden med elementen '.c-p4000-menu-new'
    Så jeg får nettsiden med uten elementen 'c-p4000-menu-new-events'
    Når jeg trykk på 'newP4000Button' knapp
    Så jeg får nettsiden med elementen 'c-p4000-menu-new-events'
