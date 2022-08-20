import {Request, Response} from "express";
import {TestUseCase} from "../../../../core/use-case/test-use-case";
import {TYPES} from "../../../../application/config/types";
import {injectable} from "inversify";
import {container} from "../../../../application/config/inversify.config";
import {WhatsappRepository} from "../../../../core/model/whatsapp/whatsapp-repository";

let context: WhatsappController;

@injectable()
export class WhatsappController {

    private readonly whatsapp: WhatsappRepository;

    constructor() {
        this.whatsapp = container.get<WhatsappRepository>(TYPES.WhatsappRepository);
        console.info('create testCtrl')
        context = this;
    }

    post(req: Request, res: Response) {
        context.whatsapp.notifier(req.body)
            .then(test =>
                res.status(200)
                    .json({msg: test, date: new Date()}))
    }

    get(req: Request, res: Response) {
        context.whatsapp.notifier(req.body)
            .then(test =>
                res.status(200)
                    .json({msg: test, date: new Date()}))
    }
}
