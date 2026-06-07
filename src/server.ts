import express, { type Request, type Response } from "express";
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client.js";
import { randomBytes } from "node:crypto";

const adapter = new PrismaMariaDb({
    host: "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "shorterlink",
});

const prisma = new PrismaClient({ adapter });

const app = express();

const PORT = process.env.PORT || 3000;

const CODE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

const generateCode = (): string => {
    const bytes = randomBytes(5);
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += CODE_CHARS[bytes[i]! % CODE_CHARS.length];
    }
    return code as string;
};

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
    try {
        const list = await prisma.link.findMany();
        res.json(list);
    } catch (error) {
        res.status(500).send("Database error");
        console.error(error);
    }
});


app.post("/links", async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
        res.status(400).send("Url are required");
        return;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        res.status(400).send("URL must start with http://");
        return;
    }

    try {
        const code = generateCode();
        await prisma.link.create({ data: { code, url } });
        res.status(201).send("Link created");
    } catch (error) {
        res.status(500).send("Database error");

    }

});

app.delete("/links/:code", async (req: Request, res: Response) => {
    const { code } = req.params;
    if (typeof code !== "string") {
        res.status(400).send("Code is not a string");
        return;
    }
    try {
        const link = await prisma.link.findUnique({ where: { code } });
        if (!link) {
            res.status(404).send("Link not found");
            return;
        }
        await prisma.link.delete({ where: { code } });
        res.status(200).send("Link deleted");
    } catch (error) {
        res.status(500).send("Database error");
    }
});

app.get("/:code", async (req: Request, res: Response) => {
    const { code } = req.params;

    if (typeof code !== "string") {
        res.status(400).send("Code is not a string");
        return;
    }
    try {
        const link = await prisma.link.findUnique({ where: { code } });
        if (link) {
            res.redirect(link.url);
            return;
        }
        res.status(404).send("Link not found");
    } catch (error) {
        res.status(500).send("Database error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});