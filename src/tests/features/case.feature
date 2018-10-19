Feature: Login and go into case

Description:  As a user
  I want to login
  So i can start a case

Background: Staging the browser

    Given I open a browser
    And set up case params
    When I navigate to the test url

Scenario: Normal user can not create a user case

      When I login as srvPensjon
      Then I don't see the case menu option
      Then I quit the browser

Scenario: Saksbehandler user can create a user case

      When I login as Z990511
      Then I do see the case menu option
      Then I quit the browser
