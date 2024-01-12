export interface Message {
    message: string;
    id: string;
    user: {
        id: string;
        name: string;
    };
}

export const messages: Message[] = [];
