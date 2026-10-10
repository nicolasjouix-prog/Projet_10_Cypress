import './support/commands';

declare global {
  namespace Cypress {
    interface Chainable {
      loginByApi(username: string, password: string): Chainable;
    }
  }
}
