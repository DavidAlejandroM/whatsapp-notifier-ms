import {TestRepository} from "../model/user/test-repository";
import {Test} from "../model/user/test";
import {TYPES} from "../../application/config/types";
import {container} from "../../application/config/inversify.config";
import {injectable} from "inversify";

@injectable()
export class TestUseCase {

    private testRepository: TestRepository;

    constructor() {
        this.testRepository = container.get<TestRepository>(TYPES.TestRepository)
    }

    test(): Promise<Array<Test>> {
        return this.testRepository.getAllTest();
    }

    create(test:Test): Promise<Test>{
        return this.testRepository.create(test);
    }

}
