import {Document} from "mongoose";

export interface ITestData extends Document {
    test: string;
}
