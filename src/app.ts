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

const messages = [
    {message: 'hello Vasya', id: 'e1q1q1q', user: {id: '22w2w2ww', name: 'Ilya'}},
    {message: 'hello Ilya', id: '1a1a1a', user: {id: '2s2s2s', name: 'Vasya'}},
    {message: 'hello Friends', id: '3a3a3a', user: {id: '3s3s3s', name: 'Vova'}},
]

io.on("connection", (socket) => {
    console.log('a user connected');

    socket.on('click-message-emit', (message: string) => {
        console.log(message)
    })

    socket.emit('init-messages-published', messages)

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
