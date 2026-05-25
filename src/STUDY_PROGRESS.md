# Progresso de estudos — shorterlink

**Última atualização:** 24/05/2026  
**Stack:** TypeScript, Node.js, Express, Prisma 7, MySQL (`@prisma/adapter-mariadb`)

---

## O que foi aprendido

### Fundamentos
- **Node.js** — executa JavaScript fora do navegador; `npm start` / `node dist/...` rodam o `.js` compilado.
- **TypeScript** — tipos ajudam a achar erros no `npm run build`; o Node não roda `.ts` direto.
- **Compilar vs executar** — `npm run build` (tsc → `dist/`) ≠ executar; `console.log` só aparece com `node dist/arquivo.js`.
- **Inferência de tipos** — `const age = 20` deduz `number`; erro TS2322 só com tipo explícito.

### HTTP
- Cliente faz **request**; servidor devolve **response** (status + corpo).
- Status usados no projeto: **200**, **201**, **302** (redirect), **400**, **404**.
- Testes com **curl** no CMD (e comparação com PowerShell).

### Express
- Anatomia: `import` → `app` → rotas → `app.listen`.
- Servidor precisa **ficar rodando** no terminal.
- Código fonte em **`src/server.ts`**; build gera **`dist/`**.
- **`"type": "module"`** + imports com `.js` no TypeScript (ESM).
- Tipos **`Request`** e **`Response`**.
- **Parâmetros de rota** — `/:code` e `req.params.code`.
- **Uma resposta por request** — não misturar `res.send` e `res.redirect` na mesma rota.
- **`express.json()`** — middleware para ler corpo JSON no POST; `req.body`.
- **POST** — criar links com `code` e `url` no body; status **201**.
- **Validação** — `400` se faltar `code` ou `url`; checagem de código duplicado (em memória, a refinar com Prisma).

### Encurtador em memória (Conceito 6 — concluído)
- Objeto `Record<string, string>`: `código → URL`.
- `GET /:code`: `if (url)` → `res.redirect(url)`; senão **404**.
- Removido `res.send` de teste na rota de redirect.

### Ambiente e DX
- **`process.env`** — variáveis do SO/terminal; `PORT` para o Express.
- **`dotenv`** — carrega `.env` com `import "dotenv/config"`; `process.env` ≠ `dotenv.PORT`.
- Variáveis separadas: `PORT` (app) vs `DB_PORT`, `DB_USER`, etc. (MySQL).
- **`npm run dev`** — `tsc --watch` + `nodemon dist/server.js` (rebuild/restart ao salvar).
- **`tsconfig`**: `"include": ["src/**/*.ts"]` — evita compilar `prisma.config.ts` fora de `src/` (erro TS6059).

### Prisma + MySQL (em uso)
- **`npx prisma init`** — só uma vez; erro “prisma already exists” se rodar de novo.
- **`schema.prisma`** — `model Link` (`id`, `code` @unique, `url`); `provider = "mysql"`.
- **`npx prisma migrate dev --name init`** — cria migration, aplica SQL no MySQL, gera client.
- **`npx prisma generate`** — client em `src/generated/prisma` (não usar `@prisma/client` com `output` customizado).
- **Prisma 7** — `new PrismaClient({ adapter })` obrigatório; adapter MySQL: `@prisma/adapter-mariadb` + pacote `mariadb`.
- **`PrismaMariaDb`** — `port` precisa ser **number** (`Number(process.env.DB_PORT)`).
- **POST** — `await prisma.link.create({ data: { code, url } })`.
- **GET** — `await prisma.link.findUnique({ where: { code } })` → `link.url`.
- Rotas assíncronas: handlers com **`async`/`await`**.

### Em andamento / parcial
- Objeto **`links`** ainda no código: usado só na checagem de duplicado no POST; GET já usa o banco.
- Falta: remover `links`, tratar duplicado com Prisma (erro **P2002** em `@unique`).
- Guard `typeof code !== "string"` no GET recomendado (Express 5 + tipagem estrita).

---

## Etapa atual

**Conceito 10–11 — Persistência com Prisma (quase completo)**  
GET e POST já gravam/leem no MySQL via `prisma.link`. Falta limpar código legado (`links`) e refinar duplicado/validações.

**Estado do código:** `src/server.ts` com Express na porta do `.env` (`PORT=4000`), Prisma Client + adapter MariaDB, `GET /:code` com `findUnique`, `POST /:code` com `create`. Tabela `Link` criada via migration `20260524193547_init`.

---

## Próximos passos

1. Remover objeto **`links`** e checar duplicado com `findUnique` ou `catch` do erro **P2002**.
2. Guard **`typeof code !== "string"`** no GET (e tipar `req.body` no POST se necessário).
3. Alinhar rota POST (ex.: `POST /links`) — path do curl igual ao `app.post`.
4. **`PORT` no listen** — `Number(process.env.PORT) || 3000` (fallback).
5. Refinar: validação de URL, status **409** para duplicado, `.gitignore` com `.env`.
6. Opcional: `npx prisma studio` para ver dados no banco.

---

## Dúvidas e dificuldades do usuário

| Tema | O que aconteceu | Esclarecimento |
|------|-----------------|----------------|
| Redirect não funcionava | `res.send` + `res.redirect` na mesma rota | Só uma resposta; `ERR_HTTP_HEADERS_SENT` |
| `Cannot POST /links` | `app.post("/")` vs curl em `/links` | URL do curl = path do `app.post` |
| Aspas no curl (CMD) | `\"` no `-d` | Escape das aspas do JSON no shell |
| `prisma init` 2× | Pasta `prisma/` já existia | Primeiro init ok; não repetir |
| Import `PrismaClient` | `@prisma/client` com `output` custom | Import de `./generated/prisma/client.js` |
| `new PrismaClient()` | Expected 1 argument (Prisma 7) | Passar `{ adapter: new PrismaMariaDb(...) }` |
| `port` no adapter | string vs number | `Number(process.env.DB_PORT)` |
| Erro TS6059 | `prisma.config.ts` fora de `src/` | `"include": ["src/**/*.ts"]` no tsconfig |
| `code` no `findUnique` | `string \| string[]` em `params` | `typeof code !== "string"` antes da query |
| dotenv “não funciona” | `process.env.PORT` undefined | `.env` salvo na raiz; `import "dotenv/config"` no topo |

**Dúvidas em aberto:** nenhuma crítica registrada após GET/POST com Prisma funcionando (POST `gh` + curl 201).

---

## Comandos usados (referência rápida)

| Comando | Função |
|---------|--------|
| `npm run build` | Compila TypeScript (`src/` → `dist/`) |
| `npm run dev` | `tsc --watch` + nodemon (desenvolvimento) |
| `npm start` | `node dist/server.js` |
| `npx prisma init` | Inicializa Prisma (uma vez) |
| `npx prisma migrate dev --name init` | Migration + tabela no MySQL + generate |
| `npx prisma generate` | Regenera client em `src/generated/prisma` |
| `curl -X POST http://localhost:4000/...` | Criar link (JSON no `-d`) |
| Ctrl+C | Para o servidor no terminal |

---

## Arquivos de estudo no projeto

- `src/server.ts` — servidor Express + Prisma
- `prisma/schema.prisma` — model `Link`
- `prisma/migrations/` — histórico SQL (ex.: `init`)
- `prisma.config.ts` — config do CLI Prisma (não entra no `tsc` de `src/`)
- `.env` — `PORT`, `DATABASE_URL`, credenciais DB
- `src/NOTES.md` — anotações livres
- `src/STUDY_PROGRESS.md` — este arquivo
