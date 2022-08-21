import {IParamData} from "./i-param-data";
import {Param} from "../../../../core/model/param/param";

export class ParamFactory {
    static create(param: (IParamData & { _id: IParamData["_id"] }) | null): Param {
        return <Param>param;
    }
}
