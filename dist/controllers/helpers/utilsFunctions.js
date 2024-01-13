"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFunction = exports.initMessageFunction = exports.messageSentFunction = exports.clientTypedFunction = exports.nameSentFunction = exports.disconnectFunction = void 0;
const uuid_1 = require("uuid");
/**
 * function to handle disconnection
 * @param socketIO
 * @param key
 * @param usersState
 * @param socketChannel
 */
const disconnectFunction = (socketIO, key, usersState, socketChannel) => {
    socketIO.on(key, () => {
        console.log(`user disconnected`);
        usersState.delete(socketChannel);
    });
};
exports.disconnectFunction = disconnectFunction;
/**
 * function for sending the name
 * @param socketChannel
 * @param key
 * @param usersState
 */
const nameSentFunction = (socketChannel, key, usersState) => {
    socketChannel.on(key, (name) => {
        console.log(`name user: ${name}`);
        if (typeof name !== 'string') {
            return;
        }
        const user = usersState.get(socketChannel);
        user.name = name;
    });
};
exports.nameSentFunction = nameSentFunction;
/**
 * function for checking the printing user
 * @param socketChannel
 * @param key
 * @param usersState
 */
const clientTypedFunction = (socketChannel, key, usersState) => {
    socketChannel.on(key, () => {
        socketChannel.broadcast.emit('user-typing', usersState.get(socketChannel));
    });
};
exports.clientTypedFunction = clientTypedFunction;
/**
 * function for sending a message
 * @param socketChannel
 * @param key
 * @param usersState
 * @param messages
 * @param socketIO
 * @param key2
 */
const messageSentFunction = (socketChannel, key, usersState, messages, socketIO, key2) => {
    socketChannel.on(key, (message, successFn) => {
        if (typeof message !== 'string' || message.length > 35) {
            successFn('Message should be less than 35 chars');
            return;
        }
        const user = usersState.get(socketChannel);
        let messageItem = {
            message: message,
            id: (0, uuid_1.v1)(),
            user: { id: user.id, name: user.name },
        };
        messages.push(messageItem);
        console.log(`new message to: ${user.name} - ${message}`);
        socketIO.emit(key2, messageItem);
        successFn(null);
    });
};
exports.messageSentFunction = messageSentFunction;
/**
 * function for checking user initialization
 * @param socketChannel
 * @param key
 * @param messages
 */
const initMessageFunction = (socketChannel, key, messages) => {
    socketChannel.emit(key, messages, (data) => {
        console.log(`init message received: ${data}`);
    });
};
exports.initMessageFunction = initMessageFunction;
/**
 * error handling function
 * @param socketChannel
 * @param key
 */
const errorFunction = (socketChannel, key) => {
    socketChannel.on(key, (error) => {
        console.error('Socket error:', error);
    });
};
exports.errorFunction = errorFunction;
//# sourceMappingURL=utilsFunctions.js.map