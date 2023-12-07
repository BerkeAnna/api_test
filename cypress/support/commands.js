// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

//A login functionality to simplify login for all tests
const loginAs = (username, password) => {
  cy.visit('/login');
  cy.get(`[type="email"]`).type(username);
  cy.get(`[type="password"]`).type(password);
  cy.get(`[type="submit"]`).click();
};

Cypress.Commands.add('loginAs', loginAs);
