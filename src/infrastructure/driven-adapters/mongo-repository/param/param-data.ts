import {model, Model, Schema} from 'mongoose';
import {IParamData} from "./i-param-data";

const ParamSchema: Schema = new Schema<IParamData>({
    key: {type: String, required: true, unique: true},
    value: {type: String, required: true}
});

export const ParamData: Model<any> = model('Param', ParamSchema);

