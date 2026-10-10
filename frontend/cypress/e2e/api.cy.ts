// cypress/tests/api/api-users.spec.ts
import { authToken } from '../support/commands';
import { apiRequest } from '../support/api-helper';

describe("Tests de l'API", () => {
  it('POST /login - Connexion réussie', () => {
    cy.request('POST', 'http://localhost:8081/login', {
      username: 'test2@test.fr',
      password: 'testtest',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
    });
  });

  describe('Requêtes authentifiées', () => {
    beforeEach(() => {
      const username = 'test2@test.fr';
      const password = 'testtest';
      cy.loginByApi(username, password);
    });

    it('GET /orders - Récupération des commandes et "PUT /orders/add - Ajout d\'un produit à une commande et POST /orders - Création d\'une commande"', () => {
      cy.fixture('add').then((add) => {
        apiRequest('PUT', '/orders/add', add).then((response) => {
          expect(response.status).to.eq(200);
          const orderId = response.body.orderLines[0].id;

          apiRequest('PUT', `/orders/${orderId}/change-quantity`, {
            quantity: 1,
          }).then((response) => {
            expect(response.status).to.eq(200);

            apiRequest('GET', '/orders').then((response) => {
              expect(response.status).to.eq(200);

              cy.fixture('orders').then((orders) => {
                apiRequest('POST', '/orders', orders).then((response) => {
                  expect(response.status).to.eq(200);
                });
              });
            });
          });
        });
      });
    });
    it("DELETE /orders/{id} - Suppression d'une commande", () => {
      cy.fixture('add').then((add) => {
        apiRequest('PUT', '/orders/add', add).then((response) => {
          expect(response.status).to.eq(200);
          const orderId = response.body.orderLines[0].id;

          apiRequest('DELETE', `/orders/${orderId}/delete`).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
      });
    });
  });
});
