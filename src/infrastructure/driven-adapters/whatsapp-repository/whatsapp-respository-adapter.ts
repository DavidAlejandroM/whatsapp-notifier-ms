import {WhatsappRepository} from "../../../core/model/whatsapp/whatsapp-repository";
import {Message} from "../../../core/model/whatsapp/message";
import {injectable} from "inversify";
import {Client, LocalAuth} from "whatsapp-web.js";
import {TYPES} from "../../../application/config/types";
import {container} from "../../../application/config/inversify.config";
import {QrListener} from "../../../core/model/whatsapp/qr-listener";
import {imageSync as imageQr} from "qr-image";

let context: WhatsappRespositoryAdapter;

@injectable()
export class WhatsappRespositoryAdapter implements WhatsappRepository {
    private status = false;
    private client: Client;
    private qrListener: QrListener

    constructor() {
        this.qrListener = container.get<QrListener>(TYPES.QrListener);
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
        })
        context = this;

        console.log("Iniciando....");

        this.client.initialize();

        this.client.on("ready", () => {
            this.status = true;
            console.log("LOGIN_SUCCESS");
        });

        this.client.on("auth_failure", () => {
            this.status = false;
            console.log("LOGIN_FAIL");
        });

        this.client.on("qr", (qr) => {
            console.log('Escanea el codigo QR que esta en la carepta tmp')
            this.generateImage(qr)
            //
        });

        this.client.on('message', message => {
            if (message.from !== 'status@broadcast')
                console.log(message);
            else
                console.log('BROADCAST IGNORED')
        });

        this.client.on('disconnected', message => {
            console.log("DISCONNECTED");
            container.rebind(TYPES.WhatsappRepository).to(WhatsappRespositoryAdapter).inSingletonScope();
        });

    }


    notifier(message: Message): Promise<Message> {
        try {
            if (!this.status) {
                message.error = "WAIT_LOGIN";
                return Promise.resolve(message);
            }

            console.log(message)

            return this.client.sendMessage(`${message.phone}@c.us`, message.message)
                .then(response => {
                    message.id = response.id.id;
                    return Promise.resolve(message);
                });
        } catch (e: any) {
            message.error = e.message
            return Promise.resolve(message);
        }
    }

    private generateImage = (base64: string) => {
        let qr_svg = imageQr(base64, {type: "png", margin: 4});
        this.qrListener.onQr(qr_svg.toString("base64"));
    };

}