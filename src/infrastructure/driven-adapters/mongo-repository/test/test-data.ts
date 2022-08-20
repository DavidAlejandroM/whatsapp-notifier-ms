import {model, Model, Schema} from 'mongoose';
import {ITestData} from "./i-test-data";

const TestSchema: Schema = new Schema<ITestData>({
    test: {type: String, required: true}
});

export const TestData: Model<any> = model('Test', TestSchema);

