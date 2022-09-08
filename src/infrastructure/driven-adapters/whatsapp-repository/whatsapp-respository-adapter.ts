import {WhatsappRepository} from "../../../core/model/whatsapp/whatsapp-repository";
import {Message} from "../../../core/model/whatsapp/message";
import {injectable} from "inversify";
import {Buttons, Client, Contact, List, LocalAuth, Location, MessageMedia, MessageSendOptions} from "whatsapp-web.js";
import {TYPES} from "../../../application/config/types";
import {container} from "../../../application/config/inversify.config";
import {QrListener} from "../../../core/model/whatsapp/qr-listener";
import {imageSync as imageQr} from "qr-image";
import {WhatsappEvent} from "../../../core/model/whatsapp/whatsapp-event";

@injectable()
export class WhatsappRespositoryAdapter implements WhatsappRepository {
    private status = false;
    //private client: Client;
    private qrListener: QrListener;
    private whatsaapEvents: WhatsappEvent;
    private clients: Map<string, Client>;

    constructor() {
        this.clients = new Map<string, Client>();
        this.qrListener = container.get<QrListener>(TYPES.QrListener);
        this.whatsaapEvents = container.get<WhatsappEvent>(TYPES.WhatsappEvent);
        this.whatsaapEvents.restoreSessions(this);
    }

    getInstance(client: string) {
        if (!this.clients.get(client)) {
            this.clients.set(client, new Client({
                authStrategy: new LocalAuth(
                    {
                        clientId: client,
                        dataPath: "tmp/sesion-" + client
                    }),
                puppeteer: {
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                },
            }));
            this.events(this.getClient(client), client)
        }
        return Promise.resolve(this.clients.get(client))
    }

    events(client: Client | undefined, clientPhone: string) {
        console.log('init events to ', clientPhone);
        if (!client) {
            console.log("error to client");
            return;
        }

        client.initialize();
        client.on('authenticated', (session) => this.whatsaapEvents.onAuthenticate(session, clientPhone));

        client.on("ready", () => this.whatsaapEvents.onReady(clientPhone));

        client.on("auth_failure", () => this.whatsaapEvents.onAuthFailed(clientPhone));

        client.on("qr", (qr) => this.generateImage(qr, clientPhone));

        client.on('message', message => {
            if (message.from !== 'status@broadcast')
                this.whatsaapEvents.onMessage(message, clientPhone);
            else
                console.log('BROADCAST IGNORED', clientPhone);
        });

        client.on('disconnected', () => {
            this.clients.delete(clientPhone);
            this.whatsaapEvents.onDisconnected(clientPhone);
        });
    }

    getClient(client: string): Client | undefined {
        return this.clients.get(client);
    }


    notifier(message: Message, client: string): Promise<Message> {
        try {
            let [messageConst, options] = this.createRequest(message);
            const clientWp = this.getClient(client);

            console.log(messageConst)
            console.log(options)
            console.log(message)

            return clientWp ?
                clientWp.sendMessage(`${message.phone}@c.us`, messageConst, options)
                    .then(response => {
                        message.id = response.id.id;
                        return Promise.resolve(message);
                    }) :
                Promise.reject();
        } catch (e: any) {
            message.error = e.message
            return Promise.resolve(message);
        }
    }

    private createRequest(message: Message): [string | MessageMedia | Location | Contact | Contact[] | List | Buttons, MessageSendOptions] {
        let messageConst: string | MessageMedia | Location | Contact | Contact[] | List | Buttons = message.message;
        let options: MessageSendOptions = {}
        if (message.options && message.options.media) {
            messageConst = new MessageMedia(message.options.media.mimetype, message.options.media.data, message.options.media.filename)
            options = <MessageSendOptions>message.options
            options.caption = message.message;
        }
        return [messageConst, options];
    }

    private generateImage = (base64: string, client: string) => {
        let qr_svg = imageQr(base64, {type: "png", margin: 4});
        this.qrListener.onQr(qr_svg.toString("base64"), client);
    };

    createClient(client: string): Promise<string> {
        return this.getInstance(client).then(a => Promise.resolve('client generate' + client))
    }

}