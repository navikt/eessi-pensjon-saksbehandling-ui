# language: no

Egenskap: Saksbehandling

Beskrivelse: Som en bruker
    Jeg vil logge inn og bruker nettsiden
    Så jeg kan opprett og sende en ny sak

Bakgrunn: Sett opp nettleser

    Gitt at jeg åpen nettleseren
    Og sett opp saks parametere
    Når jeg besøker test nettsiden

Scenario: Vanlig bruker kan ikke opprett ny sak

      Når jeg logg inn som srvPensjon
      Så jeg ser ikke menyalternativ 'opprett ny sak'
      Så jeg lukker nettleseren

Scenario: Saksbehandler bruker kan opprett ny sak

      Når jeg logg inn som Z990511
      Så jeg ser menyalternativ 'opprett ny sak'
      Og klikk til menyalternativ 'opprett ny sak'
