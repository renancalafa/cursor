# Progresso de estudos — shorterlink

**Última atualização:** 17/05/2026  
**Stack:** TypeScript, Node.js, Express, Prisma e MySQL (Prisma/MySQL ainda não iniciados)

---

## O que foi aprendido

### Fundamentos
- **Node.js** — executa JavaScript fora do navegador; `npm start` / `node dist/...` rodam o `.js` compilado.
- **TypeScript** — tipos ajudam a achar erros no `npm run build`; o Node não roda `.ts` direto.
- **Compilar vs executar** — `npm run build` (tsc → `dist/`) ≠ executar; `console.log` só aparece com `node dist/arquivo.js`.
- **Inferência de tipos** — `const age = 20` deduz `number`; erro TS2322 só com tipo explícito (`let idade: number = "texto"`).

### HTTP
- Cliente faz **request**; servidor devolve **response** (status + corpo).
- **200 OK** = sucesso; testado com PowerShell (`Invoke-WebRequest` / `curl` em httpbin.org).

### Express
- Anatomia: `import` → `app` → `app.get` → `app.listen`.
- Servidor precisa **ficar rodando** no terminal; se o prompt volta na hora, nada escuta na porta → **connection refused**.
- Código fonte em **`src/server.ts`**; o build ignora `.js` solto na `src/`.
- Após mudar código: **salvar → build → Ctrl+C → `node dist/server.js` de novo**.
- **`"type": "module"`** no `package.json` para usar `import` com o tsconfig atual.
- Tipos **`Request`** e **`Response`** em `req` / `res` (evita TS7006 / `any` implícito).
- **Parâmetros de rota** — `/:code` e `req.params.code` (testado com sucesso no navegador).

### Em andamento / parcial
- **`res.redirect`** — introduzido; há `res.redirect` no `server.ts`, mas ainda sem mapa de links nem lógica “existe / não existe”.
- Observação: hoje há `res.send` e `res.redirect` na mesma rota; na prática só o primeiro costuma valer — revisar na próxima prática.

---

## Etapa atual

**Conceito 6 — Redirecionamento (`res.redirect`)**  
Montar encurtador em memória: objeto `código → URL longa`, redirect se existir, 404 se não existir.

**Estado do código:** `src/server.ts` com `GET /`, `GET /:code` (eco do código + redirect fixo para Google). Express instalado; servidor na porta **3000**.

---

## Próximos passos

1. Completar redirect com **objeto em memória** e `if` (sem banco ainda).
2. Remover `res.send` duplicado na rota que só deve redirecionar.
3. Rota **POST** para criar links curtos (corpo JSON).
4. Variável de ambiente **`PORT`** (opcional).
5. **Prisma + MySQL** — schema, migrate, persistir links.
6. Refinar fluxo do shorterlink (validação de URL, códigos duplicados, etc.).

---

## Dúvidas e dificuldades do usuário

| Tema | O que aconteceu | Esclarecimento |
|------|-----------------|----------------|
| TypeScript “não reclamou” | `const age = 20` sem `: number` | Tipos inferidos; usar tipo explícito na tarefa |
| `console.log` não apareceu | Só rodou `npm run build` | Build compila; `node dist/...` executa |
| Connection refused | `dist/server.js` antigo ou processo encerrado | Usar `server.ts`, rebuild, servidor deve ficar aberto |
| Tarefa sem ensino anterior | Pedido para montar Express sem anatomia linha a linha | Reforço: ensinar antes, tarefa depois |
| Erro TS1295 | `import` com `"type": "commonjs"` | Alinhar com `"type": "module"` |
| TS7006 em `req` / `res` | Parâmetros sem tipo | `Request` e `Response` do Express |
| Cannot GET | `dist/` desatualizado | Salvar → build → conferir `dist/server.js` → reiniciar Node |
| PowerShell vs curl | Saída formatada do `Invoke-WebRequest` | Mesmo HTTP; exibição diferente no terminal |

**Dúvidas em aberto:** nenhuma registrada após as rotas com `/:code` funcionarem. Registrar aqui novas perguntas conforme surgirem.

---

## Comandos usados (referência rápida)

| Comando | Função |
|---------|--------|
| `npm run build` | Compila TypeScript (`src/` → `dist/`) |
| `node dist/server.js` | Sobe o servidor Express |
| `npm start` | Atalho para `node dist/server.js` (quando `dist/` estiver atualizado) |
| Ctrl+C | Para o servidor no terminal |

---

## Arquivos de estudo no projeto

- `src/lesson1.ts` — prática de tipos (se ainda existir)
- `src/server.ts` — servidor Express principal
- `src/NOTES.md` — anotações livres
- `src/STUDY_PROGRESS.md` — este arquivo
