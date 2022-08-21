import {Request, Response} from "express";
import {TYPES} from "../../../../application/config/types";
import {inject, injectable} from "inversify";
import {WhatsappUseCase} from "../../../../core/use-case/whatsapp-use-case";
import {container} from "../../../../application/config/inversify.config";

let context: WhatsappController;

@injectable()
export class WhatsappController {
    private useCase: WhatsappUseCase

    constructor() {
        this.useCase = container.get<WhatsappUseCase>(TYPES.WhatsappUseCase);
        console.info('create WhatsappController')
        context = this;
    }

    post(req: Request, res: Response) {
        context.useCase.notifier(req.body)
            .then(test =>
                res.status(200)
                    .json({msg: test, date: new Date()}))
    }

    get(req: Request, res: Response) {
        context.useCase.getQr()
            .then(html => {
                res.setHeader("Content-Type", "text/html")
                res.send(html)
            })
    }
}
