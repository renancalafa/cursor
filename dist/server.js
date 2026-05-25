import express, {} from "express";
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client.js";
const adapter = new PrismaMariaDb({
    host: "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "shorterlink",
});
const prisma = new PrismaClient({ adapter });
const app = express();
const links = {
    "google": "https://www.google.com",
};
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/:code", (req, res) => {
    const { code } = req.params;
    const url = links[code];
    if (url) {
        res.redirect(url);
        return;
    }
    else {
        res.status(404).send("Link not found");
        return;
    }
});
app.post("/:code", async (req, res) => {
    const { code, url } = req.body;
    if (!code || !url) {
        res.status(400).send("Code and url are required");
        return;
    }
    else if (links[code]) {
        res.status(400).send("Code already exists");
        return;
    }
    else {
        await prisma.link.create({ data: { code, url } });
        res.status(201).send("Link created");
    }
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
//# sourceMappingURL=server.js.map