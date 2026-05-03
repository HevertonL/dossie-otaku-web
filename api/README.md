# ⚙️ API — Dossiê Otaku

Backend responsável pela lógica de negócio, autenticação e gerenciamento de dossiês.


<img width="800" src="https://github.com/user-attachments/assets/a0fb71f2-c03b-4851-b59f-31a0717dd8ab" />


---

## 🛠️ Tecnologias

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Mocha + Supertest
- Swagger

---

## 🚀 Como rodar

```bash
cd api
npm install
npx prisma generate
npx prisma db push
npm run dev
```

---

## 🔐 Variáveis de Ambiente

```env
DATABASE_URL=
JWT_SECRET=
```

---

## 📡 Endpoints principais

- POST /users/register
- POST /auth/login
- GET /users/profile
- GET /animes/search?q=
- GET /animes/{id}
- GET /animes/top
- POST /dossiers
- GET /dossiers/anime/{animeId}

---

## 📘 Swagger

```text
http://localhost:3000/api-docs
```

---

## 🧪 Testes

```bash
npm run test:api
```

---

📌 Backend do Dossiê Otaku
