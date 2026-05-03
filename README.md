# Dossiê Otaku Web

Uma aplicação web para fãs de anime compartilharem experiências, análises e opiniões através de dossiês (reviews).


## 🎬 Demonstração

<img width="1902" height="947" alt="image" src="https://github.com/user-attachments/assets/51fc0387-66af-4f05-afd8-759aeebe5e4e" />


---

## 🎯 Visão do Projeto

O **Dossiê Otaku** permite que usuários:

- Busquem animes
- Visualizem detalhes
- Leiam dossiês de outros usuários
- Publiquem suas próprias análises

📌 Evolução futura:
- Timeline social
- Perfis de usuário
- Interações (likes, comentários)

---

## 🧱 Arquitetura

```text
Frontend (React + Vite)
        ↓
Backend (Node.js + Express)
        ↓
Banco (PostgreSQL + Prisma)
        ↓
API Externa (Jikan)
```

---

## 🛠️ Tecnologias

### Frontend
- React
- Vite
- Axios
- Cypress

### Backend
- Node.js
- Express
- Prisma
- PostgreSQL
- JWT
- Mocha + Supertest

### Outros
- Swagger (OpenAPI)
- k6 (Performance)
- GitHub Actions (CI/CD)

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/HevertonL/dossie-otaku-web.git
cd dossie-otaku-web
```

---

### 2. Rodar Backend

```bash
cd api
npm install
npx prisma generate
npx prisma db push
npm run dev
```

---

### 3. Rodar Frontend

```bash
cd web
npm install
npm run dev
```

---

## 🔐 Variáveis de Ambiente

Exemplo:

```env
DATABASE_URL=
JWT_SECRET=
VITE_API_URL=http://localhost:3000
```

---

## 📘 Documentação

A documentação completa está disponível na Wiki:

👉 https://github.com/HevertonL/dossie-otaku-web/wiki

Inclui:

- Documentação da aplicação
- Estratégia de testes
- Plano de testes
- Cenários de teste (Gherkin)
- Matriz de rastreabilidade
- Definition of Ready / Done

---

## 🧪 Testes

### Backend
```bash
cd api
npm run test:api
```

### Frontend (E2E)
```bash
cd web
npm run cypress:open
```

---

## ⚡ Performance

Testes com k6 para endpoints críticos:

```http
GET /dossiers/anime/{animeId}
```

---

## 📡 API

Documentação interativa via Swagger:

```text
http://localhost:3000/api-docs
```

---

## 🔄 CI/CD

Pipeline com GitHub Actions:

- Instala dependências
- Executa testes
- Build do frontend
- Valida integração


<img width="1902" height="956" alt="image" src="https://github.com/user-attachments/assets/0b18e063-bcb9-4db2-9eeb-51df7e82725b" />


---

## 📂 Estrutura do Projeto

```text
dossie-otaku-web/
  api/
  web/
  README.md
```

---

## 📌 Status

Projeto em desenvolvimento — MVP 1 com cobertura de testes e documentação completa.

---

📌 **Dossiê Otaku — Explore. Analise. Compartilhe.**
