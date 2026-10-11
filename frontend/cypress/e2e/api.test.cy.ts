import { apiRequest } from '../support/api-helper';

it('Récupération du panier sans être connecté', () => {
  apiRequest('GET', '/orders').then((response) => {
    expect(response.status).to.oneOf([401, 403]);
  });
});

describe('Test API avec GET', () => {
  beforeEach("Connexion de l'utilisateur", () => {
    const username = 'test2@test.fr';
    const password = 'testtest';
    cy.loginByApi(username, password);
  });
  it('Récupération de la liste des produits dans le panier', () => {
    apiRequest('GET', '/orders').then((response) => {
      expect(response.status).to.eq(200);
    });
  });
  it("Récupération d'une fiche produit spécifique", () => {
    apiRequest('GET', '/products').then((response) => {
      expect(response.status).to.eq(200);
      const productId = response.body[0].id;
      apiRequest('GET', `/products/${productId}`).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});

describe('Test API avec POST', () => {
  it('Connexion avec des mauvais identifiants', () => {
    apiRequest('POST', '/login', {
      username: 'test2@test.fr',
      password: 'test',
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
  it('Connexion avec des bons identifiants', () => {
    apiRequest('POST', '/login', {
      username: 'test2@test.fr',
      password: 'testtest',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
  beforeEach("Connexion de l'utilisateur", () => {
    const username = 'test2@test.fr';
    const password = 'testtest';
    cy.loginByApi(username, password);
  });
  it("Ajout d'un produit disponible au panier", () => {
    cy.fixture('addDispoArticle').then((addDispoArticle) => {
      apiRequest('PUT', '/orders/add', addDispoArticle).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
  it("Ajout d'un produit indisponible au panier", () => {
    cy.fixture('addIndispoArticle').then((addIndispoArticle) => {
      apiRequest(
        'PUT' /* modifier le verbe lorsque l'API sera mise à jour */,
        '/orders/add',
        addIndispoArticle,
      ).then((response) => {
        expect(response.status).to.eq(200); // modifier le code de statut lorsque l'API sera mise à jour pour gérer les produits indisponibles
      });
    });
  });
  it("Ajout d'un commentaire", () => {
    cy.fixture('review').then((review) => {
      apiRequest('POST', '/reviews', review).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
