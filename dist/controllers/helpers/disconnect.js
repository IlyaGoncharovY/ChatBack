"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = void 0;
const socketKey_1 = require("./socketKey");
const models_1 = require("../../models");
const disconnect = (socketIO, key, socketChannel) => {
    socketIO.on(socketKey_1.SOCKET_KEY.DISCONNECT, () => {
        console.log(`user disconnected`);
        models_1.usersState.delete(socketChannel);
    });
};
exports.disconnect = disconnect;
//# sourceMappingURL=disconnect.js.map