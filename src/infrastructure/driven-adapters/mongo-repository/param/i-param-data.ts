import {Document} from "mongoose";

export interface IParamData extends Document {
    key: string;
    value: string;
}
