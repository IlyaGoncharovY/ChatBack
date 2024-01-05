import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.get('/', (req, res) => {
    res.send('Its ws server');
})

io.on("connection", (socket) => {
    // ...
    console.log('a user connected')
});

httpServer.listen(3009, () => {
    console.log('Listening on 3009 port')
});
