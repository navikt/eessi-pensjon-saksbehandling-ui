# language: no

@saks
Egenskap: Saksbehandling som saksbehandler

Beskrivelse: Som en saksbehandler
    Jeg vil logge inn og bruker nettsiden
    Så jeg kan opprett og sende en ny sak

Bakgrunn: Sett opp nettleser

    Gitt at jeg åpen nettleseren
    Og sett opp saks parametere
    Og jeg besøker test nettsiden
    Og jeg logg inn som 'Z990511'
    Og jeg ser menyalternativ 'opprett ny sak'
    Og klikk til menyalternativ 'opprett ny sak'

Scenario: Saksbehandler fyller ut ugyldig informasjon på 'Hent sak'

    Gitt at jeg er på nettsiden med elementen '.p-case-getcase'
    Og nettsiden '.p-case-getcase' er klar
    Når jeg fyller ut ugyldig informasjon
    Og jeg trykk fremover knapp
    Så jeg får nettsiden med advarsel 'invalidCase'
    Og jeg får nettsiden med elementen '.p-case-getcase'
    Og jeg lukker nettleseren

Scenario: Saksbehandler fyller ut gyldig informasjon på 'Hent sak'

    Gitt at jeg er på nettsiden med elementen '.p-case-getcase'
    Og nettsiden '.p-case-getcase' er klar
    Når jeg fyller ut gyldig informasjon
    Og jeg trykk fremover knapp
    Så jeg får nettsiden med elementen '.p-case-editCase'

    Gitt at jeg er på nettsiden med elementen '.p-case-editCase'
    Når jeg velger fagområde 'Pensjon'
    Og jeg velger BUC 'P_BUC_01'
    Og jeg velger SED 'P2000'
    Så forvent at framover knapp er 'slått av'

    Når jeg velger land 'Norge'
    Og jeg velger mottager 'NAVT003'
    Og jeg legg til mottager 'NO/NAVT003'
    Så forvent at framover knapp er 'slått på'

    Når jeg trykk fremover knapp
    Så jeg får nettsiden med elementen '.p-case-confirmCase'

    Gitt at jeg er på nettsiden med elementen '.p-case-confirmCase'
    Og nettsiden 'Registrerer sak' er klar
    Når jeg trykk fremover knapp
    Så jeg får nettsiden med elementen '.p-case-generateCase'

    Gitt at jeg er på nettsiden med elementen '.p-case-generateCase'
    Og nettsiden 'Genererer sak' er klar
    #Når jeg trykk fremover knapp
    #Så jeg får nettsiden med elementen '.p-case-sendCase'

