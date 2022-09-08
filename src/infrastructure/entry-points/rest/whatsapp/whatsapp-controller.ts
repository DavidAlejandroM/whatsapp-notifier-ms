import {Request, Response} from "express";
import {TYPES} from "../../../../application/config/types";
import {injectable} from "inversify";
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
        Promise.all(context.useCase.notifier(req.body))
            .then(test =>
                res.status(200)
                    .json({msg: test, date: new Date()}))

    }

    get(req: Request, res: Response) {
        const number: string = req.query.number?.toString() || "";

        number && number !== "" ?
            context.useCase.getQr(number)
                .then(html => {
                    res.status(200).json(html)
                }) :
            res.status(400).json({msg: "number is required", date: new Date()})
    }

    getQrHtml(req: Request, res: Response) {
        const number: string = req.query.number?.toString() || "";

        number && number !== "" ?
            context.useCase.getQrHtml(number)
                .then(html => {
                    res.setHeader("Content-Type", "text/html")
                    res.send(html)
                }) :
            res.status(400).json({msg: "number is required", date: new Date()})
    }

    getCreateClient(req: Request, res: Response) {
        const number: string = req.query.number?.toString() || "";

        number && number !== "" ?
            context.useCase.createClient(number)
                .then(test =>
                    res.status(200)
                        .json({msg: test, date: new Date()})) :
            res.status(400).json({msg: "number is required", date: new Date()})
    }
}
