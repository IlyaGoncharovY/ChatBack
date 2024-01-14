export interface Message {
    message: string;
    id: string;
    user: {
        id: string | undefined;
        name: string | undefined;
    };
}

export const messages: Message[] = [];
