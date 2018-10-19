Feature: Login and go into case
  As a user
  I want to login
  So i can start a case

 Scenario: Normal user can not create a user case

      Given I open a browser
      When I navigate to the test url
      And I login as srvPensjon
      Then I don't see the case menu option
      Then I quit the browser

 Scenario: Saksbehandler user can create a user case

      Given I open a browser
      When I navigate to the test url
      And I login as Z990511
      Then I do see the case menu option
      Then I quit the browser

