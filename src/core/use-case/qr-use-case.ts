import {inject, injectable} from "inversify";
import {TYPES} from "../../application/config/types";
import {QrListener} from "../model/whatsapp/qr-listener";
import {ParamRepository} from "../model/param/param-repository";

@injectable()
export class QrUseCase implements QrListener {

    constructor(@inject(TYPES.ParamRepository) private paramRepository: ParamRepository) {
    }

    onQr(qr: string, client: string): void {
        console.log('se genero el qr para: ', client)
        this.paramRepository.get("QR_LOGIN" + client)
            .then(param => {
                    //console.log(param)
                    if (param) {
                        param.value = qr;
                        this.paramRepository.save(param)
                    } else {
                        this.paramRepository.save({key: 'QR_LOGIN' + client, value: qr})
                    }
                }
            );
    }

}