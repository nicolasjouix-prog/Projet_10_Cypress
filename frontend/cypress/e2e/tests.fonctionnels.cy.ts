describe('Tests fonctionnels', () => {
  it('Test du parcours de connexion utilisateur', () => {
    cy.visit('/');
    cy.contains('Connexion').click();
    cy.get('#username').should('be.visible').type('test2@test.fr');
    cy.get('#password').should('be.visible').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('Mon panier').should('be.visible');
    cy.url().should('not.include', '/login');
  });
});
