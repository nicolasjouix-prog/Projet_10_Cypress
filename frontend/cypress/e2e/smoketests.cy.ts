it('Vérifier la présence des champs et boutons de connexion', () => {
  cy.visit('/#/login');
  cy.get('#username').should('be.visible');
  cy.get('#password').should('be.visible');
  cy.get('[data-cy="login-submit"]').should('be.visible');
});
it('Vérifier la présence des boutons d’ajout au panier quand vous êtes connecté', () => {
  cy.visit('/#/login');
  cy.get('#username').type('test2@test.fr').should('be.visible');
  cy.get('#password').type('testtest').should('be.visible');
  cy.get('[data-cy="login-submit"]').click().should('be.visible');
  cy.url().should('not.include', '/login');
  cy.get('[data-cy="nav-link-products"]').should('be.visible').click();
  cy.get('[ng-reflect-router-link="/products,3"]').should('be.visible').click();
  cy.url().should('include', 'products/3');
  cy.get('[data-cy="detail-product-add"]').should('be.visible');
  cy.url().should('include', '/#/products');
});
