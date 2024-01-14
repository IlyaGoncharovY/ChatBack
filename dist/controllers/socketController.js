"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = void 0;
const uuid_1 = require("uuid");
const models_1 = require("../models");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const handleConnection = (socketIO, socketChannel) => {
    console.log('a user connected');
    models_1.usersState.set(socketChannel, { id: (0, uuid_1.v1)(), name: 'newUser' });
    (0, helpers_2.disconnectFunction)(socketIO, helpers_1.SOCKET_KEY.DISCONNECT, models_1.usersState, socketChannel);
    (0, helpers_2.nameSentFunction)(socketChannel, helpers_1.SOCKET_KEY.NAME_SENT, models_1.usersState);
    (0, helpers_2.clientTypedFunction)(socketChannel, helpers_1.SOCKET_KEY.CLIENT_TYPED, models_1.usersState);
    (0, helpers_2.messageSentFunction)(socketChannel, helpers_1.SOCKET_KEY.MESSAGE_SENT, models_1.usersState, models_1.messages, socketIO, helpers_1.SOCKET_KEY.NEW_MESSAGE_SENT);
    (0, helpers_2.initMessageFunction)(socketChannel, helpers_1.SOCKET_KEY.INIT_MESSAGE_PUBLISHED, models_1.messages);
    (0, helpers_2.errorFunction)(socketChannel, helpers_1.SOCKET_KEY.ERROR);
};
exports.handleConnection = handleConnection;
//# sourceMappingURL=socketController.js.map