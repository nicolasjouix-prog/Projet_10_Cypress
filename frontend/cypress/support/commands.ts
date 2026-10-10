/// <reference types="cypress" />

export const authToken = () => window.localStorage.getItem('authToken');

Cypress.Commands.add('loginByApi', (username, password) => {
  cy.session(
    ['loginByApi', username],
    () => {
      cy.request('POST', 'http://localhost:8081/login', {
        username,
        password,
      }).then((response) => {
        expect(response.status).to.eq(200);
        window.localStorage.setItem('authToken', response.body.token);
      });
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        cy.request({
          url: 'http://localhost:8081/me',
          headers: { authorization: `Bearer ${authToken()}` },
        })
          .its('status')
          .should('eq', 200);
      },
    },
  );
});
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
