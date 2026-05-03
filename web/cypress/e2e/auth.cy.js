/// <reference types="cypress" />

describe('Fluxo de Autenticação (E2E)', () => {
  it('Deve realizar o cadastro e em seguida o login com sucesso', () => {
    const emailUnico = `qa_automator_${Date.now()}@dossie.com`;
    const senha = 'SenhaForte123!';
    const nomeUsuario = 'Testador E2E'; // Variável para garantir que o nome cadastrado será o mesmo validado na tela

    // ==========================================
    // FASE 1: CADASTRO
    // ==========================================
    cy.visit('/cadastro'); 

    cy.get('[data-cy="register-name-input"]').type(nomeUsuario);
    cy.get('[data-cy="register-email-input"]').type(emailUnico);
    cy.get('[data-cy="register-password-input"]').type(senha);
    cy.get('[data-cy="register-confirm-password-input"]').type(senha);
    cy.get('[data-cy="register-terms-checkbox"]').check(); 
    
    cy.get('[data-cy="register-submit-button"]').click();

    cy.on('window:alert', (textoDoAlert) => {
      expect(textoDoAlert).to.contains('Conta ninja criada com sucesso!');
    });

    cy.url().should('include', '/login');

    // ==========================================
    // FASE 2: LOGIN
    // ==========================================
    cy.get('[data-cy="login-email-input"]').type(emailUnico);
    cy.get('[data-cy="login-password-input"]').type(senha);
    cy.get('[data-cy="login-submit-button"]').click();

    // ==========================================
    // FASE 3: VALIDAÇÃO BLINDADA (Autenticado)
    // ==========================================
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Valida se a saudação apareceu e contém exatamente o nome que cadastramos
    cy.get('[data-cy="header-user-greeting"]')
      .should('be.visible')
      .and('contain', `Olá, ${nomeUsuario}`);
      
    // Valida se o botão "Sair" foi renderizado, provando que o LocalStorage recebeu o token
    cy.get('[data-cy="header-logout-button"]').should('be.visible');
  });
});