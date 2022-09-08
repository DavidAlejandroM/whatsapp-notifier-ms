import {injectable} from "inversify";
import {ParamData} from "./param-data";
import {ParamRepository} from "../../../../core/model/param/param-repository";
import {Param} from "../../../../core/model/param/param";

@injectable()
export class ParamRepositoryAdapter implements ParamRepository {
    get(key: string): Promise<Param> {
        return ParamData.findOne({key: key}).exec();
    }

    getAll(): Promise<Array<Param>> {
        return ParamData.find({}).exec();
    }

    save(param: Param): Promise<Param> {
        return ParamData.create(param);
    }

    getAllByLikeKey(key: string): Promise<Array<Param>> {
        return ParamData.find({key: "/"+key+"/"}).exec();
    }
}
