import {Request, Response} from "express";
import {TestUseCase} from "../../../../core/use-case/test-use-case";
import {TYPES} from "../../../../application/config/types";
import {injectable} from "inversify";
import {container} from "../../../../application/config/inversify.config";

let context: TestCtrl;

@injectable()
export class TestCtrl {

    private readonly testUseCase: TestUseCase;

    constructor() {
        this.testUseCase = container.get<TestUseCase>(TYPES.TestUseCase);
        console.info('create testCtrl')
        context = this;
    }

    post(req: Request, res: Response) {
        context.testUseCase.create(req.body)
            .then(test =>
                res.status(200)
                    .json({msg: test, date: new Date()}))
    }

    get(req: Request, res: Response) {
        context.testUseCase.test()
            .then(test =>
                res.status(200)
                    .json({msg: test, date: new Date()}))
        ;
    }

    test() {
        console.log(this.testUseCase)
    }
}
