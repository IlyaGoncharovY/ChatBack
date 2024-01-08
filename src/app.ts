import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('Its ws server!!!444');
});

io.on("connection", (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

const PORT = process.env.PORT || 3009;

httpServer.listen(PORT, () => {
    console.log('Listening on 3009 port');
});
