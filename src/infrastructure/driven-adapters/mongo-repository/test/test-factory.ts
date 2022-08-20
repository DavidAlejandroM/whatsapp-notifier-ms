import {ITestData} from "./i-test-data";
import {Test} from "../../../../core/model/user/test";

export class TestFactory {
    static create(userData: (ITestData & { _id: ITestData["_id"] }) | null): Test {
        return <Test> userData;
    }
}
