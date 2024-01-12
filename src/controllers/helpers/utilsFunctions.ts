import {v1} from "uuid";
import {Server, Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {Message, User} from "../../models";

/**
 * function to handle disconnection
 * @param socketIO
 * @param key
 * @param usersState
 * @param socketChannel
 */
export const disconnectFunction = (
    socketIO: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    key: string,
    usersState:  Map<Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, User>,
    socketChannel:  Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
    socketIO.on(key, () => {
        console.log(`user disconnected`);
        usersState.delete(socketChannel);
    });
}

/**
 * function for sending the name
 * @param socketChannel
 * @param key
 * @param usersState
 */
export const nameSentFunction = (
    socketChannel: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    key: string,
    usersState: Map<Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, User>
) => {
    socketChannel.on(key, (name: string) => {
        console.log(`name user: ${name}`);
        if (typeof name !== 'string') {
            return;
        }

        const user = usersState.get(socketChannel);
        user.name = name;
    });
}

/**
 * function for checking the printing user
 * @param socketChannel
 * @param key
 * @param usersState
 */
export const clientTypedFunction = (
    socketChannel: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    key: string,
    usersState: Map<Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, User>
) => {
    socketChannel.on(key, () => {
        socketChannel.broadcast.emit('user-typing', usersState.get(socketChannel));
    });
}

/**
 * function for sending a message
 * @param socketChannel
 * @param key
 * @param usersState
 * @param messages
 * @param socketIO
 * @param key2
 */
export const messageSentFunction = (
    socketChannel: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    key: string,
    usersState: Map<Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, User>,
    messages: Message[],
    socketIO: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    key2: string
) => {
    socketChannel.on(key, (message: string, successFn: (message: string | null) => void) => {
        if (typeof message !== 'string' || message.length > 35) {
            successFn('Message should be less than 35 chars');
            return;
        }

        const user = usersState.get(socketChannel);

        let messageItem = {
            message: message,
            id: v1(),
            user: { id: user.id, name: user.name },
        };
        messages.push(messageItem);

        console.log(`new message to: ${user.name} - ${message}`);

        socketIO.emit(key2, messageItem);

        successFn(null);
    });
};

/**
 * function for checking user initialization
 * @param socketChannel
 * @param key
 * @param messages
 */
export const initMessageFunction = (
    socketChannel: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    key: string,
    messages: Message[]
) => {
    socketChannel.emit(key, messages, (data: string) => {
        console.log(`init message received: ${data}`);
    });
}

/**
 * error handling function
 * @param socketChannel
 * @param key
 */
export const errorFunction = (
    socketChannel: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    key: string
) => {
    socketChannel.on(key, (error) => {
        console.error('Socket error:', error);
    });
}
