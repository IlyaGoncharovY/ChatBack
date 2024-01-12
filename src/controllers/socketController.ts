import {Server, Socket} from 'socket.io';
import { v1 } from 'uuid';
import { messages, usersState } from '../models';
import {SOCKET_KEY} from "./helpers";
import {
    clientTypedFunction,
    disconnectFunction, errorFunction,
    initMessageFunction,
    messageSentFunction,
    nameSentFunction
} from "./helpers";

export const handleConnection = (socketIO: Server, socketChannel: Socket) => {
    console.log('a user connected');

    usersState.set(socketChannel, { id: v1(), name: 'newUser' });

    disconnectFunction(socketIO, SOCKET_KEY.DISCONNECT, usersState, socketChannel)

    nameSentFunction(socketChannel, SOCKET_KEY.NAME_SENT, usersState)

    clientTypedFunction(socketChannel, SOCKET_KEY.CLIENT_TYPED, usersState)

    messageSentFunction(socketChannel, SOCKET_KEY.MESSAGE_SENT, usersState, messages, socketIO, SOCKET_KEY.NEW_MESSAGE_SENT)

    initMessageFunction(socketChannel, SOCKET_KEY.INIT_MESSAGE_PUBLISHED, messages)

    errorFunction(socketChannel, SOCKET_KEY.ERROR)

};
