import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import {createServer} from 'http';

import {handleConnection} from './controllers';

const app = express();
const httpServer = createServer(app);
const socketIO = new Server(httpServer, {
    cors: {
        // origin: 'http://localhost:5173',
        origin: 'https://ilyagoncharovy.github.io',
        methods: ['GET', 'POST']
    },
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('Its ws server!!!444');
});

socketIO.on('connection',
    (socketChannel) =>
        handleConnection(socketIO, socketChannel)
);

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
    console.log(`Listening on ${PORT} port`);
});
