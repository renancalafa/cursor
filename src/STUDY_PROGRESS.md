# Progresso de estudos — shorterlink

**Última atualização:** 24/05/2026  
**Stack:** TypeScript, Node.js, Express 5, Prisma 7, MySQL (`@prisma/adapter-mariadb`)

---

## O que foi aprendido

### Fundamentos
- **Node.js** — executa JavaScript fora do navegador; `npm start` / `node dist/...` rodam o `.js` compilado.
- **TypeScript** — tipos ajudam a achar erros no `npm run build`; o Node não roda `.ts` direto.
- **Compilar vs executar** — `npm run build` (tsc → `dist/`) ≠ executar.
- **Inferência de tipos** e guards (`typeof code !== "string"`) com Express 5 + `exactOptionalPropertyTypes`.

### HTTP
- Cliente faz **request**; servidor devolve **response** (status + corpo).
- Status usados: **200**, **201**, **302** (redirect), **400**, **404**, **409**, **500**.
- **400** = dados inválidos/incompletos; **409** = conflito (código duplicado); **500** = erro de banco/servidor.
- Testes com **curl** no **CMD**; `-X` define o método (GET, POST, DELETE); `-w "%{http_code}"` mostra o status.
- PowerShell: `curl` é alias de `Invoke-WebRequest` — usar **`curl.exe`** no CMD ou sintaxe nativa do PS.

### Express
- Anatomia: `import` → `app` → middleware → rotas → `app.listen`.
- **`express.json()`** — lê corpo JSON; `req.body`.
- **Uma resposta por request** — não misturar `res.send` e `res.redirect`.
- **`res.json()`** — resposta JSON com `Content-Type` correto (lista em `GET /`).
- **`try/catch`** em rotas `async` — erros do Prisma viram **500** em vez de stack trace no browser.
- **Ordem das rotas** — rotas fixas (`/`, `/links`) antes de `GET /:code` (catch-all do redirect).

### Encurtador (evolução)
1. Objeto em memória `Record<string, string>` + redirect/404 (**Conceito 6** — concluído).
2. POST com JSON + validação (**Conceito 7** — concluído).
3. Persistência Prisma + MySQL (**Conceitos 10–11** — concluído).
4. CRUD completo + API REST refinada (**Conceitos 12–15** — concluído).

### Ambiente e DX
- **`dotenv`** — `import "dotenv/config"`; ler com `process.env`.
- Variáveis: `PORT` (Express), `DB_*` (MySQL), `DATABASE_URL` (CLI Prisma).
- **`npm run dev`** — `tsc --watch` + `nodemon dist/server.js`.
- **`tsconfig`**: `"include": ["src/**/*.ts"]` — evita TS6059 com `prisma.config.ts`.
- **`PORT` fallback** — `const PORT = process.env.PORT || 3000`.

### Prisma + MySQL
- **`npx prisma init`** — uma vez; `prisma/` + `prisma.config.ts`.
- **`schema.prisma`** — `model Link` (`id`, `code` @unique, `url`); `provider = "mysql"`.
- **`npx prisma migrate dev --name init`** — migration + tabela + generate.
- **`npx prisma generate`** — client em `src/generated/prisma`.
- **Prisma 7** — `new PrismaClient({ adapter })` com `@prisma/adapter-mariadb` + `mariadb`.
- Import: `./generated/prisma/client.js` (não `@prisma/client` com output custom).
- Queries: `findMany`, `findUnique`, `create`, `delete`.
- **`npx prisma studio`** — UI para ver/editar dados (porta 5555).

---

## Etapa atual

**MVP backend concluído — encurtador com banco**

API funcional com MySQL persistente. Pronto para refinamentos (validação de URL, frontend, auth, etc.).

### Rotas atuais (`src/server.ts`)

| Método | Rota | Função |
|--------|------|--------|
| GET | `/` | Lista todos os links (`res.json`) |
| POST | `/links` | Cria link (`code` + `url` no body) → **201** |
| DELETE | `/links/:code` | Remove link → **200** ou **404** |
| GET | `/:code` | Redirect → **302** ou **404** |

### Estado do código
- Prisma Client + adapter MariaDB configurados via `.env`.
- Duplicado no POST: **409** (`findUnique` antes do `create`).
- Guards de tipo em rotas com `:code`.
- Servidor na porta do `.env` (`PORT=4000`) com fallback **3000**.

---

## Próximos passos (fase 2)

1. Validar **URL** no POST (ex.: deve começar com `http://` ou `https://`).
2. **`res.status(201).json({ code, url })`** em vez de texto plano no POST.
3. **`Number(process.env.PORT)`** no fallback (consistência com `DB_PORT`).
4. Tratar erro **P2002** no `catch` como alternativa ao `findUnique` prévio.
5. **Frontend** simples ou página HTML para criar links.
6. **`.env.example`** commitado (sem senhas) para documentar variáveis.
7. Opcional: remover `node_modules` do Git e usar só `package-lock.json`.

---

## Dúvidas e dificuldades do usuário

| Tema | O que aconteceu | Esclarecimento |
|------|-----------------|----------------|
| Redirect não funcionava | `res.send` + `res.redirect` juntos | Uma resposta; `ERR_HTTP_HEADERS_SENT` |
| `Cannot POST /links` | Path do curl ≠ `app.post` | Alinhar URL com a rota |
| Aspas no curl (CMD) | `\"` no `-d` | Escape do JSON no shell |
| `prisma init` 2× | Pasta já existia | Primeiro init ok |
| Import `PrismaClient` | `@prisma/client` com output custom | `./generated/prisma/client.js` |
| `new PrismaClient()` | Expected 1 argument (Prisma 7) | `{ adapter: new PrismaMariaDb(...) }` |
| `port` no adapter | string vs number | `Number(process.env.DB_PORT)` |
| Erro TS6059 | `prisma.config.ts` fora de `src/` | `"include": ["src/**/*.ts"]` |
| `code` no `findUnique` | `string \| string[]` em params | `typeof code !== "string"` |
| dotenv | `process.env.PORT` undefined | `.env` na raiz + `import "dotenv/config"` |
| pool timeout | MySQL off ou credenciais erradas | Ligar MySQL; conferir `.env` |
| curl no PowerShell | Erro em `-H` | Usar `curl.exe` ou CMD |
| `Cannot DELETE /` | DELETE na raiz | Usar `DELETE /links/:code` |
| Status HTTP no curl | Só aparece o body | `curl -w "\nHTTP %{http_code}\n"` |

**Dúvidas em aberto:** nenhuma.

---

## Comandos usados (referência rápida)

| Comando | Função |
|---------|--------|
| `npm run dev` | Watch + nodemon (desenvolvimento) |
| `npm run build` | Compila `src/` → `dist/` |
| `npx prisma migrate dev --name <nome>` | Nova migration |
| `npx prisma generate` | Regenera client |
| `npx prisma studio` | UI do banco (localhost:5555) |
| `curl http://localhost:4000/` | Listar links |
| `curl -X POST http://localhost:4000/links -H "Content-Type: application/json" -d "{\"code\":\"x\",\"url\":\"https://...\"}"` | Criar link |
| `curl -X DELETE http://localhost:4000/links/x` | Apagar link |
| `curl -w "\nHTTP %{http_code}\n" ...` | Ver status HTTP |

---

## Arquivos do projeto

- `src/server.ts` — API Express + Prisma
- `prisma/schema.prisma` — model `Link`
- `prisma/migrations/` — SQL versionado
- `prisma.config.ts` — config CLI Prisma
- `.env` — secrets locais (não commitado)
- `src/NOTES.md` — anotações
- `src/STUDY_PROGRESS.md` — este arquivo
