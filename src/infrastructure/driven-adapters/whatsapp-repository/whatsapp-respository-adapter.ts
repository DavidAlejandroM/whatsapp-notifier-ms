import {WhatsappRepository} from "../../../core/model/whatsapp/whatsapp-repository";
import {Message} from "../../../core/model/whatsapp/message";
import {injectable} from "inversify";
import {Client, LocalAuth} from "whatsapp-web.js";
import {generate} from "qrcode-terminal";
import {image as imageQr} from "qr-image";

@injectable()
export class WhatsappRespositoryAdapter implements WhatsappRepository {
    private status = false;
    private client: Client;

    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {headless: true},
        })

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

            //generate(qr, {small: true});
            this.generateImage(qr);
            console.log(qr);
        });

        this.client.on('message', message => {
            console.log(message);
        });

    }


    notifier(message: Message): Promise<Message> {
        try {
            if (!this.status){
                message. error= "WAIT_LOGIN";
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
        const path = `${process.cwd()}/tmp`;
        console.log(path)
        if (!require("fs").existsSync(path)){
            require("fs").mkdirSync(path, { recursive: true });
        }
        let qr_svg = imageQr(base64, {type: "svg", margin: 4});
        qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
        console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
        console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
    };

}