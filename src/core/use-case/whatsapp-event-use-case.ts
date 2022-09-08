import {inject, injectable} from "inversify";
import {TYPES} from "../../application/config/types";
import {ParamRepository} from "../model/param/param-repository";
import {WhatsappEvent} from "../model/whatsapp/whatsapp-event";
import {WhatsappRepository} from "../model/whatsapp/whatsapp-repository";

@injectable()
export class WhatsappEventUseCase implements WhatsappEvent {

    constructor(@inject(TYPES.ParamRepository) private paramRepository: ParamRepository,
    ) {
    }

    onDisconnected(client: string): void {
        console.log('onDisconnected', client)
        this.paramRepository.get("SESSION-" + client)
            .then(param => {
                    if (param) {
                        let session: Session = JSON.parse(param.value);
                        session.isActive = false;
                        param.value = JSON.stringify(session);
                        this.paramRepository.save(param)
                    } else {
                        console.log('no found session');
                    }
                }
            );
    }

    onMessage(message: any, client: string): void {
        console.log('onMessage', message.body, client)

    }

    onReady(client: string): void {
        console.log('onReady', client)
        let session: Session = {
            clientId: client,
            sesion: (new Date()).toString(),
            isActive: true
        }
        this.paramRepository.get("SESSION-" + client)
            .then(param => {
                    if (param) {
                        param.value = JSON.stringify(session);
                        this.paramRepository.save(param)
                    } else {
                        this.paramRepository.save({key: 'SESSION-' + client, value: JSON.stringify(session)})
                    }
                }
            );
    }

    onAuthFailed(client: string): void {
        console.log('onAuthFaild', client)
    }

    onAuthenticate(session: any, client: string): void {
        console.log('onAuthenticate', client)
    }

    restoreSessions(repository: WhatsappRepository): void {
        this.paramRepository.getAll()
            .then(param => {
                    param.filter(a => a.key.includes("SESSION-"))
                        .map(a => JSON.parse(a.value))
                        .forEach(sesion =>
                            repository.createClient(sesion.clientId)
                                .then(console.log)
                        );

                }
            );
    }


}