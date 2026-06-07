# Anotações — shorterlink

## API atual (fase 3)

| Método | Rota | Body | Resposta |
|--------|------|------|----------|
| GET | `/` | — | JSON array de links |
| POST | `/links` | `{ "url" }` | 201 / 400 / 500 |
| DELETE | `/links/:code` | — | 200 / 404 |
| GET | `/:code` | — | 302 redirect / 404 |

O **código curto é gerado pela API** — o cliente não envia `code`.

Redirect: `http://localhost:4000/<code>`

---

## curl (CMD)

```cmd
curl http://localhost:4000/

curl -X POST http://localhost:4000/links -H "Content-Type: application/json" -d "{\"url\":\"https://github.com\"}"

curl -w "\nHTTP %{http_code}\n" -X POST http://localhost:4000/links -H "Content-Type: application/json" -d "{\"url\":\"google.com\"}"

curl -X DELETE http://localhost:4000/links/abc12
```

- POST inválido (sem http): **400**
- **`-w "%{http_code}"`** mostra o status HTTP

---

## generateCode (crypto)

```ts
import { randomBytes } from "node:crypto";

const CODE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

const generateCode = (): string => {
    const bytes = randomBytes(5);
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += CODE_CHARS[bytes[i]! % CODE_CHARS.length];
    }
    return code;
};
```

### generateUniqueCode (a implementar)

```ts
for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateCode();
    const existing = await prisma.link.findUnique({ where: { code } });
    if (!existing) return code;
}
return null;
```

---

## HTTP — status

| Código | Quando |
|--------|--------|
| 201 | Link criado |
| 400 | URL faltando ou inválida |
| 404 | Código não existe |
| 500 | Banco / não gerou código único |

---

## Pendências

- [ ] `generateUniqueCode` no POST
- [ ] `201` com `res.json({ code, url })`
- [ ] `.env.example`
