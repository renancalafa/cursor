# Anotações — shorterlink

## API atual

| Método | Rota | Body | Resposta |
|--------|------|------|----------|
| GET | `/` | — | JSON array de links |
| POST | `/links` | `{ "code", "url" }` | 201 / 400 / 409 |
| DELETE | `/links/:code` | — | 200 / 404 |
| GET | `/:code` | — | 302 redirect / 404 |

Redirect público: `http://localhost:4000/<code>`

---

## curl (CMD)

```cmd
curl http://localhost:4000/

curl -X POST http://localhost:4000/links -H "Content-Type: application/json" -d "{\"code\":\"gh\",\"url\":\"https://github.com\"}"

curl -w "\nHTTP %{http_code}\n" -X POST http://localhost:4000/links -H "Content-Type: application/json" -d "{\"code\":\"gh\",\"url\":\"https://github.com\"}"

curl -X DELETE http://localhost:4000/links/gh
```

- **`-X`** = método HTTP (POST, DELETE)
- **`-w "%{http_code}"`** = mostra status (409, 201, etc.)
- **`\"`** = escape de aspas do JSON no CMD
- No **PowerShell**, usar **`curl.exe`** (não o alias `Invoke-WebRequest`)

---

## HTTP — status usados

| Código | Quando |
|--------|--------|
| 200 | DELETE ok |
| 201 | Link criado |
| 302 | Redirect (`res.redirect`) |
| 400 | Falta code/url ou params inválidos |
| 404 | Link não existe |
| 409 | Código duplicado no POST |
| 500 | Erro de banco (`try/catch`) |

---

## Express

- **`express.json()`** antes das rotas
- **`res.json(data)`** — JSON com header correto
- **Uma resposta por request** — não `send` + `redirect` juntos
- Rotas **fixas antes** de `GET /:code`

---

## dotenv / env

```ts
import "dotenv/config";
```

- `PORT` → Express
- `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` → adapter
- `process.env` = string → `Number()` para portas

---

## Prisma 7 + MySQL

```ts
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client.js";

const adapter = new PrismaMariaDb({ host, port: Number(...), user, password, database });
const prisma = new PrismaClient({ adapter });
```

```ts
await prisma.link.findMany();
await prisma.link.findUnique({ where: { code } });
await prisma.link.create({ data: { code, url } });
await prisma.link.delete({ where: { code } });
```

- Handlers: **`async`** + **`await`**
- **`typeof code !== "string"`** antes de queries com `req.params`

---

## Comandos úteis

```cmd
npm run dev
npx prisma studio
npx prisma migrate dev --name <nome>
```

---

## Pendências (fase 2)

- Validar formato da URL no POST
- `201` com `res.json({ code, url })`
- `.env.example` no repo
