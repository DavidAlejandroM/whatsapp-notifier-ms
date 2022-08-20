import {TestRepository} from "../../../../core/model/user/test-repository";
import {Test} from "../../../../core/model/user/test";
import { injectable } from "inversify";
import {TestData} from "./test-data";

@injectable()
export class TestRepositoryAdapter implements TestRepository {
    getAllTest(): Promise<Array<Test>> {
        return TestData.find({}).exec();
    }

    create(test: Test): Promise<Test> {
        return TestData.create(test);
    }



}
