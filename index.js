const express = require("express");

const PostRouter = require("./routes/post-router.js");

const server = express();

server.use(express.json());

server.use("/api/posts", PostRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Deployed API</h2>`)
})

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`Server Running on ${port}`);
})
