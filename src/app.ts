import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const socked = new Server(httpServer, {
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

const usersState = new Map();

socked.on("connection", (sockedChannel) => {
    console.log('a user connected');

    usersState.set(sockedChannel, {id: new Date().getTime().toString(), name: 'newUser'})

    socked.on('disconnect', () => {
        console.log(`user disconnected`);
        usersState.delete(sockedChannel)
    });

    sockedChannel.on('client-name-sent', (name: string) => {
        console.log(`name user: ${name}`)
        if (typeof name !== 'string') {
            return;
        }

        const user = usersState.get(sockedChannel)
        user.name = name
    })

    sockedChannel.on('client-typed', () => {
     sockedChannel.broadcast.emit('user-typing', usersState.get(sockedChannel))
    })

    sockedChannel.on('click-message-sent', (message: string, successFn: (message: string | null) => void) => {

        if (typeof message !== 'string' || message.length > 35) {
            successFn('Message should be than 35 chars');
            return;
        }

        const user = usersState.get(sockedChannel)

        let messageItem = {
            message: message, id: 'newMessage' + new Date().getTime(),
            user: {id: user.id, name: user.name}
        }
        messages.push(messageItem)

        console.log(`new message to: ${user.name} - ${message}`)

        socked.emit('new-message-sent', messageItem)

        successFn(null);
    })

    sockedChannel.emit('init-messages-published', messages, (data: string) => {
        console.log(`init message received: ${data}`)
    })

    sockedChannel.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

const PORT = process.env.PORT || 3009;

httpServer.listen(PORT, () => {
    console.log('Listening on 3009 port');
});
