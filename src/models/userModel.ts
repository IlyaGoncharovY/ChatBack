import {Socket} from "socket.io";

export interface User {
    id: string;
    name: string;
}

export const usersState = new Map<Socket, User>();
