import {WhatsappRepository} from "./whatsapp-repository";

export interface WhatsappEvent {
    onMessage(message: any, client: string): void;

    onReady(client: string): void;

    onDisconnected(client: string): void;

    onAuthFailed(client: string): void;

    onAuthenticate(sesion: any, client: string): void;

    restoreSessions(repository: WhatsappRepository): void;
}