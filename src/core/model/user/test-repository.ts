import {Test} from "./test";


export interface TestRepository {
    getAllTest(): Promise<Array<Test>>;

    create(test: Test): Promise<Test>;
}
