"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const controllers_1 = require("./controllers");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const socketIO = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
    },
});
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Its ws server!!!444');
});
socketIO.on('connection', (socketChannel) => (0, controllers_1.handleConnection)(socketIO, socketChannel));
const PORT = process.env.PORT || 3009;
httpServer.listen(PORT, () => {
    console.log(`Listening on ${PORT} port`);
});
//# sourceMappingURL=app.js.map