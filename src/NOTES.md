# Anotações — shorterlink

## HTTP / Express

- **Uma resposta por request** — não usar `res.send` e `res.redirect` juntos; o primeiro “ganha”, o segundo dá `ERR_HTTP_HEADERS_SENT`.
- **`res.redirect(url)`** — status 302; navegador segue para a URL longa.
- **`express.json()`** — antes das rotas; sem isso `req.body` fica `undefined` no POST.
- Status no projeto: **400** (dados inválidos), **404** (código não existe), **201** (link criado).

## Objeto em memória (antes do banco)

```ts
const links: Record<string, string> = {
  google: "https://www.google.com",
};
```

- `Record<string, string>` = chave string → valor string.
- Lookup: `links[code]` → redirect ou 404.

## POST + curl (CMD)

```cmd
curl -X POST http://localhost:4000/qualquercoisa -H "Content-Type: application/json" -d "{\"code\":\"gh\",\"url\":\"https://github.com\"}"
```

- Path do curl = path do `app.post(...)` (ex.: `POST /:code` → URL com um segmento, não `/links` se a rota for outra).
- `\"` = escape de aspas do JSON dentro das aspas do CMD.

## dotenv

- `import "dotenv/config"` no topo do `server.ts`.
- Ler variáveis com **`process.env.PORT`** — não existe `dotenv.PORT`.
- `PORT` = porta do Express; `DB_PORT` = porta do MySQL (3306).
- `process.env` sempre **string** → `Number(process.env.DB_PORT)` para números.

## Dev workflow

```json
"dev": "concurrently \"npm run watch\" \"nodemon dist/server.js\""
```

- Salvar `.ts` → recompila → nodemon reinicia.

## tsconfig

- `"include": ["src/**/*.ts"]` — não compilar `prisma.config.ts` na raiz (erro TS6059 com `rootDir: ./src`).

## Prisma 7 + MySQL

### Comandos

| Comando | O que faz |
|---------|-----------|
| `npx prisma migrate dev --name init` | Lê schema → cria migration → aplica no MySQL → gera client |
| `npx prisma generate` | Só regenera o client |

### Import do client

```ts
import { PrismaClient } from "./generated/prisma/client.js";
```

Não usar `@prisma/client` quando o schema tem `output = "../src/generated/prisma"`.

### Adapter (obrigatório no Prisma 7)

```ts
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "shorterlink",
});

const prisma = new PrismaClient({ adapter });
```

### Queries usadas

```ts
// Criar
await prisma.link.create({ data: { code, url } });

// Buscar por código (@unique)
const link = await prisma.link.findUnique({ where: { code } });
if (link) res.redirect(link.url);
```

- Handlers com banco: **`async`** + **`await`**.
- Model `Link` no schema → `prisma.link` no código (minúsculo).

### Tipagem Express 5 + Prisma

`req.params.code` pode ser `string | string[] | undefined` → antes do `findUnique`:

```ts
if (typeof code !== "string") {
  res.status(404).send("Link not found");
  return;
}
```

## Pendências no código

- Remover `const links` e checar duplicado no banco (ou tratar erro **P2002**).
- `app.listen(Number(process.env.PORT) || 3000)` como fallback.
