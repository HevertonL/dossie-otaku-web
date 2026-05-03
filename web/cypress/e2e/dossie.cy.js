/// <reference types="cypress" />

describe('Fluxo Principal: Busca e Publicação (E2E)', () => {
  
  // Variáveis globais para o bloco de testes
  let emailUnico;
  const senha = 'SenhaForte123!';
  const nomeUsuario = 'Avaliador E2E';

  // O bloco 'before' roda UMA VEZ antes de todos os testes começarem
  // Vamos usar ele para criar a nossa conta de testes no banco
  before(() => {
    emailUnico = `avaliador_${Date.now()}@dossie.com`;

    cy.visit('/cadastro'); 
    cy.get('[data-cy="register-name-input"]').type(nomeUsuario);
    cy.get('[data-cy="register-email-input"]').type(emailUnico);
    cy.get('[data-cy="register-password-input"]').type(senha);
    cy.get('[data-cy="register-confirm-password-input"]').type(senha);
    cy.get('[data-cy="register-terms-checkbox"]').check(); 
    cy.get('[data-cy="register-submit-button"]').click();

    cy.on('window:alert', () => true); // Aceita o alert silenciosamente
    cy.url().should('include', '/login');
  });

  // O bloco 'beforeEach' roda ANTES DE CADA teste 'it'
  // Vamos usar para garantir que começamos o teste já logados e na Home
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="login-email-input"]').type(emailUnico);
    cy.get('[data-cy="login-password-input"]').type(senha);
    cy.get('[data-cy="login-submit-button"]').click();
    
    // Garante que o login terminou e estamos na Home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('Deve buscar um anime, abrir os detalhes e publicar um dossiê com sucesso', () => {
    // Definimos o que vamos buscar e o texto da análise (com timestamp para ser único)
    const termoBusca = 'Hunter x Hunter'; 
    const textoAnalise = `Automação E2E: Obra-prima absoluta! Validado em ${Date.now()}`;

    // ==========================================
    // BUSCA
    // ==========================================
    cy.intercept('GET', '**/animes/search*').as('buscaAnime');
    cy.get('[data-cy="search-input"]').type(termoBusca);
    cy.get('[data-cy="search-submit-button"]').click();

    cy.wait('@buscaAnime');

    // Aguarda o grid carregar e clica no primeiro anime retornado
    cy.get('[data-cy="anime-grid"]').should('be.visible');
    // Usamos o seletor ^= que significa "começa com", para pegar qualquer card
    cy.get('[data-cy^="anime-card-"]').contains(termoBusca).click();

    // ==========================================
    // TELA DE DETALHES E PREENCHIMENTO
    // ==========================================
    // Garante que a página carregou as informações
    cy.url().should('include', '/anime/');
    cy.get('[data-cy="anime-title"]').should('be.visible');

    // Interage com o formulário de publicação
    cy.get('[data-cy="star-rating-5"]').click(); // Dá nota 5
    cy.get('[data-cy="dossier-status-select"]').select('Finalizado');
    cy.get('[data-cy="dossier-review-textarea"]').type(textoAnalise);
    cy.get('[data-cy="dossier-spoiler-checkbox"]').check();

    // Dispara a submissão
    cy.get('[data-cy="dossier-submit-button"]').click();

    // ==========================================
    // VALIDAÇÃO (O GRANDE FINAL)
    // ==========================================
    // Verifica se o texto da nossa análise apareceu renderizado na lista da comunidade
    cy.get('[data-cy="dossier-list"]')
      .should('be.visible')
      .and('contain', textoAnalise)
      .and('contain', nomeUsuario);
  });
});