import {Server, Socket} from 'socket.io';
import { messages, usersState } from '../models';
import {SOCKET_KEY} from "./helpers/socketKey";

export const handleConnection = (socketIO: Server, socketChannel: Socket) => {
    console.log('a user connected');

    usersState.set(socketChannel, { id: new Date().getTime().toString(), name: 'newUser' });

    socketIO.on(SOCKET_KEY.DISCONNECT, () => {
        console.log(`user disconnected`);
        usersState.delete(socketChannel);
    });

    socketChannel.on(SOCKET_KEY.NAME_SENT, (name: string) => {
        console.log(`name user: ${name}`);
        if (typeof name !== 'string') {
            return;
        }

        const user = usersState.get(socketChannel);
        user.name = name;
    });

    socketChannel.on(SOCKET_KEY.CLIENT_TYPED, () => {
        socketChannel.broadcast.emit('user-typing', usersState.get(socketChannel));
    });

    socketChannel.on(SOCKET_KEY.MESSAGE_SENT, (message: string, successFn: (message: string | null) => void) => {
        if (typeof message !== 'string' || message.length > 35) {
            successFn('Message should be less than 35 chars');
            return;
        }

        const user = usersState.get(socketChannel);

        let messageItem = {
            message: message,
            id: 'newMessage' + new Date().getTime(),
            user: { id: user.id, name: user.name },
        };
        messages.push(messageItem);

        console.log(`new message to: ${user.name} - ${message}`);

        socketIO.emit(SOCKET_KEY.NEW_MESSAGE_SENT, messageItem);

        successFn(null);
    });

    socketChannel.emit(SOCKET_KEY.INIT_MESSAGE_PUBLISHED, messages, (data: string) => {
        console.log(`init message received: ${data}`);
    });

    socketChannel.on(SOCKET_KEY.ERROR, (error) => {
        console.error('Socket error:', error);
    });
};
