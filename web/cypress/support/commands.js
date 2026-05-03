// Comando customizado para realizar o Login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  
  // Preenche as credenciais
  cy.get('[data-cy="login-email-input"]').type(email);
  cy.get('[data-cy="login-password-input"]').type(password);
  
  // Submete o formulário
  cy.get('[data-cy="login-submit-button"]').click();
  
  // Garante que o login deu certo esperando o redirecionamento para a Home
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

Cypress.Commands.add('cadastrar', (nome, email, senha) => {
    cy.visit('/cadastro'); 
    cy.get('[data-cy="register-name-input"]').type(nome);
    cy.get('[data-cy="register-email-input"]').type(email);
    cy.get('[data-cy="register-password-input"]').type(senha);
    cy.get('[data-cy="register-confirm-password-input"]').type(senha);
    cy.get('[data-cy="register-terms-checkbox"]').check(); 
    cy.get('[data-cy="register-submit-button"]').click();

    // ESSENCIAIS: Lida com o pop-up e aguarda o redirecionamento
    cy.on('window:alert', () => true); 
    cy.url().should('include', '/login');
});