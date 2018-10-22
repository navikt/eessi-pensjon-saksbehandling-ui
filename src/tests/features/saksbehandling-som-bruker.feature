# language: no

@saks
Egenskap: Saksbehandling som bruker

Beskrivelse: Som en bruker
    Jeg kan logge inn og bruker nettsiden
    men jeg kan ikke opprett og sende en ny sak

Bakgrunn: Sett opp nettleser

    Gitt at jeg åpen nettleseren
    Og sett opp saks parametere
    Når jeg besøker test nettsiden

Scenario: Vanlig bruker kan ikke opprett ny sak

    Når jeg logg inn som 'srvPensjon'
    Så jeg ser ikke menyalternativ 'opprett ny sak'
    Så jeg lukker nettleseren
