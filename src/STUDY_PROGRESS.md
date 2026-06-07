# Progresso de estudos — shorterlink

**Última atualização:** 24/05/2026  
**Stack:** TypeScript, Node.js, Express 5, Prisma 7, MySQL (`@prisma/adapter-mariadb`)

---

## O que foi aprendido

### Fundamentos
- **Node.js** — executa JavaScript fora do navegador; `npm start` / `node dist/...` rodam o `.js` compilado.
- **TypeScript** — tipos ajudam a achar erros no `npm run build`; guards (`typeof code !== "string"`).
- **Compilar vs executar** — `npm run build` (tsc → `dist/`) ≠ executar.

### HTTP
- Status usados: **200**, **201**, **302**, **400**, **404**, **409**, **500**.
- **400** = dados inválidos; **409** = conflito; **500** = erro de servidor/banco.
- **curl** no CMD: `-X` (método), `-d` (body JSON), `-w "%{http_code}"` (ver status).
- PowerShell: usar **`curl.exe`** (alias `curl` ≠ curl real).

### Express
- **`express.json()`**, **`res.json()`**, **`try/catch`** em rotas async.
- Ordem das rotas: fixas (`/`, `/links`) antes de `GET /:code`.
- Uma resposta por request — não misturar `send` e `redirect`.

### Encurtador (evolução)
1. Objeto em memória + redirect (**Conceito 6**).
2. POST + validação (**Conceito 7**).
3. Prisma + MySQL + CRUD (**Conceitos 10–15**).
4. API REST: `POST/DELETE /links`, `res.json`, **409**, Prisma Studio.
5. **Código aleatório** (**Fase 3 — em andamento**): usuário envia só `url`; API gera `code` com `crypto.randomBytes`.

### Geração de código (`node:crypto`)
- **`randomBytes(n)`** — bytes aleatórios seguros.
- Mapear bytes → caracteres com `CODE_CHARS[byte % CODE_CHARS.length]`.
- Loop `for` para montar string de N caracteres (`a-z`, `0-9`).
- **`generateUniqueCode`** (próximo): `for` até 10 tentativas + `findUnique` para evitar colisão.

### Ambiente e DX
- **dotenv**, **`npm run dev`** (watch + nodemon), **`tsconfig` include** só `src/`.
- **Prisma 7** + adapter MariaDB; import `./generated/prisma/client.js`.

---

## Etapa atual

**Fase 3 — Encurtador “real” (código gerado pela API)**

O POST aceita **apenas `url`**. A API gera o código curto com `generateCode()`. Redirect e CRUD no MySQL funcionam.

### Rotas atuais (`src/server.ts`)

| Método | Rota | Função |
|--------|------|--------|
| GET | `/` | Lista links (JSON) |
| POST | `/links` | Body: `{ "url" }` → gera `code` → **201** |
| DELETE | `/links/:code` | Remove link |
| GET | `/:code` | Redirect público |

### Estado do código
- `generateCode()` — 5 chars aleatórios via `randomBytes`.
- Validação: URL deve começar com `http://` ou `https://`.
- POST **não** recebe mais `code` do cliente.

### Em andamento / falta fechar
- **`generateUniqueCode()`** — loop (máx. 10×) + `findUnique` antes do `create`.
- **`res.status(201).json({ code, url })`** — devolver o código gerado ao cliente.
- Opcional: `shortUrl` na resposta; `typeof url === "string"`.

---

## Próximos passos

1. Implementar **`generateUniqueCode`** e usar no POST.
2. Responder **201** com JSON `{ code, url }` (e opcionalmente `shortUrl`).
3. **Frontend** ou página HTML para colar URL e mostrar link curto.
4. **`.env.example`** no repo.
5. Opcional: remover `node_modules` do Git.

---

## Dúvidas e dificuldades do usuário

| Tema | Esclarecimento |
|------|----------------|
| Redirect + send juntos | `ERR_HTTP_HEADERS_SENT` — uma resposta só |
| curl PowerShell vs CMD | `curl.exe` ou CMD nativo |
| pool timeout | MySQL desligado ou credenciais erradas |
| 409 no mesmo `code` | Código já existe no banco — comportamento esperado |
| `for` 10 tentativas | `for (let i = 0; i < 10; i++)` + `return` ao achar código livre |

**Dúvidas em aberto:** nenhuma.

---

## Comandos (referência)

| Comando | Função |
|---------|--------|
| `npm run dev` | Desenvolvimento com watch |
| `npx prisma studio` | Ver tabela `Link` |
| `curl http://localhost:4000/` | Listar |
| `curl -X POST http://localhost:4000/links -H "Content-Type: application/json" -d "{\"url\":\"https://example.com\"}"` | Criar (só url) |
| `curl -X DELETE http://localhost:4000/links/<code>` | Apagar |
| `curl -w "\nHTTP %{http_code}\n" ...` | Ver status |

---

## Arquivos do projeto

- `src/server.ts` — API + `generateCode`
- `prisma/schema.prisma` — model `Link`
- `src/NOTES.md` — anotações
- `src/STUDY_PROGRESS.md` — este arquivo
