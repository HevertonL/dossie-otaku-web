# Evidências de Engenharia de Qualidade

Este documento relaciona riscos do produto aos testes implementados e às limitações conhecidas. A presença de um cenário no código não significa que sua execução esteja aprovada.

## Riscos e testes implementados

| Risco | Evidência no código |
|---|---|
| Acesso indevido ao perfil | Testes de API com token válido, token inválido e ausência de token em `api/tests/users.test.js`. |
| Exposição de senha | Asserções verificam a ausência do campo `password` nas respostas de cadastro e perfil. |
| Publicação sem autenticação | Teste espera resposta 401 ao criar um dossiê sem token em `api/tests/dossiers.test.js`. |
| Notas fora do intervalo permitido | Testes esperam resposta 400 para notas 0 e 6. |
| Duplicidade de publicação | Teste espera resposta 409 ao repetir a publicação para o mesmo usuário e anime. |
| Falha na jornada principal | Cenário Cypress busca um anime, abre detalhes, publica um dossiê e verifica o texto e o autor na interface. |

## Integração contínua

O workflow `.github/workflows/ci.yml` executa testes de API e E2E em jobs separados, com PostgreSQL temporário. O job Web também realiza o build do frontend.

A execução nº 20, de 17/10/2026, terminou com falhas:

- API: os logs mostram respostas 500 em cenários do catálogo de animes.
- E2E: um teste aprovado e um reprovado; a jornada de busca e publicação falhou.

Esses resultados precisam de investigação antes de uma conclusão sobre a qualidade da versão.

[Consultar execução nº 20](https://github.com/HevertonL/dossie-otaku-web/actions/runs/39065373806).

## Performance

O script `api/performance/carga-dossiers.js` configura:

- 50 usuários virtuais durante 30 segundos.
- Consulta a `/dossiers/anime/20`.
- Critério de p95 abaixo de 500 ms.
- Critério de taxa de falhas HTTP igual a zero.

Esses valores são critérios configurados, não resultados medidos. O workflow atual não executa esse script de carga.

## Melhorias priorizadas

1. Investigar as falhas do catálogo e da jornada E2E, verificando a participação da integração externa.
2. Revisar o teste de e-mail inválido atualmente desativado com `it.skip`.
3. Tornar independentes os cenários que dependem de dados criados por testes anteriores.
4. Publicar os relatórios e capturas como artefatos do CI; os logs atuais indicam geração local, mas o workflow não possui etapa de upload.
5. Registrar resultados de performance com ambiente, volume de dados, carga, métricas e conclusão.

O objetivo dessas melhorias é aumentar a confiabilidade dos testes e tornar as decisões de qualidade verificáveis.
