import express, { type Request, type Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.get("/:code", (req: Request, res: Response) => {
    const { code } = req.params;
    res.send(`Hello ${code}`);
    res.redirect(`https://www.google.com`);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});