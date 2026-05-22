import express, {} from "express";
const app = express();
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/:code", (req, res) => {
    const { code } = req.params;
    res.send(`Hello ${code}`);
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=server.js.map