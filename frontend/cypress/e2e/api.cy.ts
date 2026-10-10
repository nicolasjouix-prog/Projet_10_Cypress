// cypress/tests/api/api-users.spec.ts
import { authToken } from '../support/commands';
import { apiRequest } from '../support/api-helper';
import { apiRequestDeco } from '../support/api-helper';

it("GET /orders - Doit rejeter la requête si l'utilisateur n'est pas authentifié", () => {
  apiRequestDeco('GET', '/orders').then((response) => {
    expect(response.status).to.oneOf([401, 403]);
  });
});

describe("Tests d'API pour les commandes", () => {
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
  it("GET /products - Récupération des produits et GET /products/random - Récupération de 3 produits aléatoires et GET /products/{id} - Récupération du détail d'un produit", () => {
    apiRequest('GET', '/products').then((response) => {
      expect(response.status).to.eq(200);
      const productsId = response.body[0].id;
      apiRequest('GET', '/products/random').then((response) => {
        expect(response.status).to.eq(200);
        apiRequest('GET', `/products/${productsId}`).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });
  it("POST /reviews - Création d'un avis", () => {
    cy.fixture('review').then((review) => {
      apiRequest('POST', '/reviews', review).then((response) => {
        expect(response.status).to.eq(200);
        apiRequest('GET', '/reviews').then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });
  it("POST /register - Création d'un utilisateur", () => {
    cy.fixture('register').then((register) => {
      const uniqueEmail = Date.now();
      const uniqueRegister = { ...register, email: `${uniqueEmail}@test.fr` };
      apiRequest('POST', '/register', uniqueRegister).then((response) => {
        expect(response.status).to.eq(200);
        apiRequest('GET', '/me').then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });
});
